import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import admin from "firebase-admin";

// Load local environment variables
dotenv.config();

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(process.cwd(), "consultas-data.json");

app.use(express.json());

// Load Firebase applet configuration to dynamically resolve the Cloud Project ID
const configPath = path.join(process.cwd(), "firebase-applet-config.json");
let firebaseConfig: any = {};
if (fs.existsSync(configPath)) {
  try {
    firebaseConfig = JSON.parse(fs.readFileSync(configPath, "utf8"));
  } catch (err) {
    console.error("Error reading firebase-applet-config.json", err);
  }
}

const firebaseProjectId = process.env.VITE_FIREBASE_PROJECT_ID || firebaseConfig.projectId;
const databaseId = firebaseConfig.firestoreDatabaseId;
let firestoreDb: admin.firestore.Firestore | null = null;

if (firebaseProjectId) {
  try {
    const app = admin.initializeApp({
      projectId: firebaseProjectId
    });
    
    // Import here or just use admin.firestore structure. But admin.firestore takes an app.
    // Wait, let's use the explicit require to be safe if types are weird.
    const { getFirestore } = require("firebase-admin/firestore");
    firestoreDb = databaseId ? getFirestore(app, databaseId) : getFirestore(app);
    console.log(`🤖 Firebase Admin successfully initialized for project: ${firebaseProjectId}, database: ${databaseId || "(default)"}`);
  } catch (adminErr) {
    console.error("❌ Failed to initialize Firebase Admin", adminErr);
  }
} else {
  console.warn("⚠️ Warning: Firebase Project ID is not defined. Falling back to local JSON database.");
}

// Initialize Gemini SDK with telemetry header according to guidelines
const geminiApiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (geminiApiKey) {
  ai = new GoogleGenAI({
    apiKey: geminiApiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
} else {
  console.warn("⚠️ Warning: GEMINI_API_KEY is not defined in the environment. Case analysis will run in fallback simulation mode.");
}

// Ensure the JSON database file exists
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), "utf8");
}

// Helper to read database
function readConsultations(): any[] {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    console.error("Error reading database file", error);
    return [];
  }
}

// Helper to write database
function writeConsultations(data: any[]) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf8");
  } catch (error) {
    console.error("Error writing database file", error);
  }
}

// --- API ROUTES ---

// Endpoint: Analyze Case with Gemini AI
app.post("/api/analyze-case", async (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== "string" || message.trim().length === 0) {
    return res.status(400).json({ error: "El mensaje es obligatorio y debe ser una cadena válida." });
  }

  // Fallback simulation if Gemini is not yet set up
  if (!ai) {
    const lowerMessage = message.toLowerCase();
    let category: 'Sucesión' | 'Divorcio' | 'Consulta General' = "Consulta General";
    if (lowerMessage.includes("sucesion") || lowerMessage.includes("fallecio") || lowerMessage.includes("morir") || lowerMessage.includes("herencia") || lowerMessage.includes("testamento") || lowerMessage.includes("bienes heredar")) {
      category = "Sucesión";
    } else if (lowerMessage.includes("divorcio") || lowerMessage.includes("casamiento") || lowerMessage.includes("separar") || lowerMessage.includes("hijos") || lowerMessage.includes("alimento") || lowerMessage.includes("tenencia")) {
      category = "Divorcio";
    }

    return res.json({
      category,
      urgency: "Media",
      summary: "Análisis preliminar automático (Modo de simulación sin clave de API): Su situación describe aspectos que se relacionan con " + (category === "Sucesión" ? "el trámite herencial y sucesorios." : category === "Divorcio" ? "derecho familiar y desvinculación conyugal." : "consultas de asesoría general."),
      keyPoints: ["Identificación de bienes/vínculos.", "Evaluación de la situación fáctica planteada."],
      recommendedSteps: ["Agendar una cita formal para revisar documentos relevantes.", "Reunir la documentación necesaria (Actas de defunción, matrimonio, nacimiento, según corresponda)."],
      suggestedQuestions: ["¿Cuáles son los plazos estimados para este trámite?", "¿Qué costos impositivos aproximados aplican a mi caso?"]
    });
  }

  try {
    const prompt = `Analiza detalladamente la siguiente consulta legal presentada por un cliente. 
Determina con precisión científica y empatía legal la categoría del caso (Sucesión, Divorcio o Consulta General), el nivel de urgencia sugerido (Alta, Media, Baja), haz un resumen ejecutivo cálido y profesional orientado a acompañar al cliente, extrae puntos clave que precisan atención, recomienda pasos concretos a seguir de inmediato, y formula preguntas preliminares que la abogada María José Lizaso podría sugerirle preparar para la primera consulta.

Consulta del cliente: "${message}"`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "Eres un asesor legal de admisión virtual sumamente idóneo, preciso y empático que trabaja para el prestigioso estudio jurídico de de la abogada María José Lizaso en Argentina (Sucesiones y Divorcios). Debes devolver un análisis estructurado y sumamente confiable en formato JSON. Tu análisis no reemplaza el consejo legal, pero guía al cliente y prepara el terreno con profesionalismo.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["category", "urgency", "summary", "keyPoints", "recommendedSteps", "suggestedQuestions"],
          properties: {
            category: {
              type: Type.STRING,
              description: "Categoría clasificada: debe ser 'Sucesión', 'Divorcio' o 'Consulta General'."
            },
            urgency: {
              type: Type.STRING,
              description: "Grado de urgencia estimada: 'Alta', 'Media' o 'Baja'."
            },
            summary: {
              type: Type.STRING,
              description: "Resumen comprensible, empático y profesional de la consulta legal."
            },
            keyPoints: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Puntos clave o elementos legales críticos identificados en el relato."
            },
            recommendedSteps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Pasos prácticos sugeridos de inmediato (ej. recopilar actas, tasar bienes, evitar conflictos intermedios)."
            },
            suggestedQuestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Preguntas clave que el cliente debería pensar o responder en su primera reunión presencial/virtual."
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No se obtuvo respuesta de texto por parte de Gemini.");
    }

    const parsedResult = JSON.parse(text.trim());
    return res.json(parsedResult);

  } catch (error: any) {
    console.error("Gemini analysis error:", error);
    return res.status(500).json({ error: "Ocurrió un error al procesar el análisis de la consulta: " + error.message });
  }
});

// Endpoint: Get all consultations (Admin dashboard)
app.get("/api/consultas", async (req, res) => {
  const localData = readConsultations() || [];
  let mergeData = [...localData];

  if (firestoreDb) {
    try {
      const snapshot = await firestoreDb.collection("consultas").orderBy("createdAt", "desc").get();
      const firestoreData: any[] = [];
      snapshot.forEach((doc) => {
        firestoreData.push({ id: doc.id, ...doc.data() });
      });

      // Override local data with Firestore data if IDs match, and append new ones
      const mergedMap = new Map();
      mergeData.forEach((r) => {
        if (r && r.id) mergedMap.set(r.id, r);
      });
      firestoreData.forEach((r) => {
        if (r && r.id) mergedMap.set(r.id, r);
      });

      mergeData = Array.from(mergedMap.values()).sort((a: any, b: any) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });

      return res.json(mergeData);
    } catch (firestoreErr: any) {
      if (firestoreErr && firestoreErr.code === 5) {
        console.warn("⚠️ Firestore database not found (5 NOT_FOUND), reverting to local backup file.");
      } else {
        console.error("Firestore Admin query failed, reverting to local backup file.", firestoreErr);
      }
    }
  }

  res.json(mergeData);
});

// Endpoint: Add new consultation request
app.post("/api/consultas", async (req, res) => {
  const { id, fullName, email, phone, caseType, message, aiAnalysisSummary, aiCaseCategory } = req.body;

  if (!fullName || !email || !message) {
    return res.status(400).json({ error: "Los campos Nombre completo, Correo electrónico y Mensaje son obligatorios." });
  }

  const newId = id || ("req_" + Date.now().toString(36) + Math.random().toString(36).substring(2, 7));

  // Determine Gemini analysis
  let aiAnalysisString = aiAnalysisSummary || null;
  let aiClassification = aiCaseCategory || null;

  if (!aiAnalysisString && ai) {
    try {
      const prompt = `Analiza detalladamente la siguiente consulta legal presentada por un cliente. 
Determina con precisión científica y empatía legal la categoría del caso (Sucesión, Divorcio o Consulta General), el nivel de urgencia sugerido (Alta, Media, Baja), haz un resumen ejecutivo cálido y profesional orientado a acompañar al cliente, extrae puntos clave que precisan atención, recomienda pasos concretos a seguir de inmediato, y formula preguntas preliminares que la abogada María José Lizaso podría sugerirle preparar para la primera consulta.

Consulta del cliente: "${message}"`;

      const aiResponse = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "Eres un asesor legal de admisión virtual sumamente idóneo, preciso y empático que trabaja para el prestigioso estudio jurídico de de la abogada María José Lizaso en Argentina (Sucesiones y Divorcios). Debes devolver un análisis estructurado y sumamente confiable en formato JSON. Tu análisis no reemplaza el consejo legal, pero guía al cliente y prepara el terreno con profesionalismo.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            required: ["category", "urgency", "summary", "keyPoints", "recommendedSteps", "suggestedQuestions"],
            properties: {
              category: {
                type: Type.STRING,
                description: "Categoría clasificada: debe ser 'Sucesión', 'Divorcio' o 'Consulta General'."
              },
              urgency: {
                type: Type.STRING,
                description: "Grado de urgencia estimada: 'Alta', 'Media' o 'Baja'."
              },
              summary: {
                type: Type.STRING,
                description: "Resumen comprensible, empático y profesional de la consulta legal."
              },
              keyPoints: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Puntos clave o elementos legales críticos identificados en el relato."
              },
              recommendedSteps: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Pasos prácticos sugeridos de inmediato (ej. recopilar actas, tasar bienes, evitar conflictos intermedios)."
              },
              suggestedQuestions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Preguntas clave que el cliente debería pensar o responder en su primera reunión presencial/virtual."
              }
            }
          }
        }
      });

      if (aiResponse.text) {
        aiAnalysisString = aiResponse.text.trim();
        const parsed = JSON.parse(aiAnalysisString);
        aiClassification = parsed.category || null;
      }
    } catch (aiErr) {
      console.error("Gemini automatic analysis during ingestion failed", aiErr);
    }
  }

  // Fallback simulation if Gemini is not set up
  if (!aiAnalysisString) {
    const lowerMessage = message.toLowerCase();
    let category = "Consulta General";
    if (lowerMessage.includes("sucesion") || lowerMessage.includes("fallecio") || lowerMessage.includes("morir") || lowerMessage.includes("herencia") || lowerMessage.includes("testamento")) {
      category = "Sucesión";
    } else if (lowerMessage.includes("divorcio") || lowerMessage.includes("casamiento") || lowerMessage.includes("separar") || lowerMessage.includes("hijos") || lowerMessage.includes("alimento")) {
      category = "Divorcio";
    }

    const fallbackAnalysis = {
      category,
      urgency: "Media",
      summary: `Análisis preliminar automático para ${fullName}.`,
      keyPoints: ["Identificación de bienes/vínculos.", "Evaluación de la situación fáctica planteada."],
      recommendedSteps: ["Agendar una cita formal para revisar documentos.", "Reunir la documentación necesaria según corresponda."],
      suggestedQuestions: ["¿Cuáles son los plazos estimados para este trámite?", "¿Qué costos aplican?"]
    };
    aiAnalysisString = JSON.stringify(fallbackAnalysis);
    aiClassification = category;
  }

  const newRequest = {
    id: newId,
    fullName,
    email,
    phone: phone || "",
    caseType: caseType || "Consulta General",
    message,
    createdAt: new Date().toISOString(),
    status: "pendiente",
    aiAnalysis: aiAnalysisString,
    aiClassification: aiClassification,
    lawyerNotes: ""
  };

  // 1. Write to Firestore via Admin SDK (durable cloud storage)
  if (firestoreDb) {
    try {
      await firestoreDb.collection("consultas").doc(newId).set(newRequest);
      console.log(`✅ Consultation successfully saved to cloud Firestore: ${newId}`);
    } catch (firestoreErr: any) {
      if (firestoreErr && firestoreErr.code === 5) {
        console.warn("⚠️ Firestore not found (NOT_FOUND). Could not save to cloud, falling back to local.");
      } else {
        console.error("❌ Failed to save consultation to cloud Firestore via Admin.", firestoreErr);
      }
    }
  }

  // 2. Also write to local backup JSON file
  try {
    const consultations = readConsultations();
    consultations.push(newRequest);
    writeConsultations(consultations);
  } catch (err) {
    console.error("Failed to write back local backup database file", err);
  }

  res.status(201).json(newRequest);
});

// Endpoint: Delete a consultation
app.delete("/api/consultas/:id", async (req, res) => {
  const { id } = req.params;

  // 1. Delete from cloud Firestore using Admin SDK
  if (firestoreDb) {
    try {
      await firestoreDb.collection("consultas").doc(id).delete();
      console.log(`✅ Consultation ${id} successfully deleted from cloud Firestore`);
    } catch (firestoreErr: any) {
      if (firestoreErr && firestoreErr.code === 5) {
        console.warn("⚠️ Firestore not found (NOT_FOUND). Could not delete from cloud.");
      } else {
        console.error("❌ Failed to delete consultation from cloud Firestore via Admin.", firestoreErr);
      }
    }
  }

  // 2. Delete from local backup
  let consultations = readConsultations();
  const exists = consultations.some(c => c.id === id);

  if (exists) {
    consultations = consultations.filter(c => c.id !== id);
    writeConsultations(consultations);
    res.json({ success: true, message: "Solicitud eliminada con éxito." });
  } else {
    // If deleted from Firestore but not in local file, return success anyway
    res.json({ success: true, message: "Solicitud eliminada con éxito del servidor en la nube." });
  }
});

// Endpoint: Edit consultation (status, notes)
app.put("/api/consultas/:id", async (req, res) => {
  const { id } = req.params;
  const { status, lawyerNotes } = req.body;

  const updateFields: any = {};
  if (status) updateFields.status = status;
  if (lawyerNotes !== undefined) updateFields.lawyerNotes = lawyerNotes;

  // 1. Save to cloud Firestore using Admin SDK
  if (firestoreDb) {
    try {
      await firestoreDb.collection("consultas").doc(id).update(updateFields);
      console.log(`✅ Consultation ${id} successfully updated in cloud Firestore`);
    } catch (firestoreErr: any) {
      if (firestoreErr && firestoreErr.code === 5) {
        console.warn("⚠️ Firestore not found (NOT_FOUND). Could not update cloud.");
      } else {
        console.error("❌ Failed to update consultation in cloud Firestore via Admin.", firestoreErr);
      }
    }
  }

  // 2. Also update local file backup
  const consultations = readConsultations();
  const itemIndex = consultations.findIndex(c => c.id === id);

  if (itemIndex !== -1) {
    if (status) consultations[itemIndex].status = status;
    if (lawyerNotes !== undefined) consultations[itemIndex].lawyerNotes = lawyerNotes;
    writeConsultations(consultations);
    return res.json(consultations[itemIndex]);
  } else {
    if (firestoreDb) {
      try {
        const docSnap = await firestoreDb.collection("consultas").doc(id).get();
        if (docSnap.exists) {
          return res.json({ id, ...docSnap.data() });
        }
      } catch (err) {}
    }
    return res.status(404).json({ error: "Solicitud no encontrada." });
  }
});

// Endpoint: AI generated email response proposal
app.post("/api/consultas/:id/suggest-reply", async (req, res) => {
  const { id } = req.params;
  let consultation: any = null;

  if (firestoreDb) {
    try {
      const docSnap = await firestoreDb.collection("consultas").doc(id).get();
      if (docSnap.exists) {
        consultation = { id: docSnap.id, ...docSnap.data() };
      }
    } catch (err) {}
  }

  if (!consultation) {
    const consultations = readConsultations();
    consultation = consultations.find(c => c.id === id);
  }

  if (!consultation) {
    return res.status(404).json({ error: "Consulta no encontrada." });
  }

  if (!ai) {
    return res.json({
      text: `Estimado/a ${consultation.fullName},

Agradecemos sinceramente su contacto con el estudio de la Dra. María José Lizaso. Hemos recibido su consulta con respecto a: "${consultation.caseType}".

Para profundizar en los detalles de su situación y brindarle un asesoramiento idóneo con la celeridad que amerita el caso, le proponemos coordinar una entrevista (vía Zoom o presencial en nuestras oficinas).

Quedamos a su entera disposición.

Atentamente,
Estudio María José Lizaso - Especialista en Sucesiones y Divorcios`
    });
  }

  try {
    const prompt = `Como asistente virtual del estudio jurídico de la abogada María José Lizaso, escribe una respuesta oficial, seria, humana, elegante y profesional por correo dirigida a un cliente que ha enviado una consulta a la web.

Datos de la consulta:
- Nombre: ${consultation.fullName}
- Tipo de Trámite: ${consultation.caseType}
- Consulta original: "${consultation.message}"
- Análisis previo de IA: "${consultation.aiAnalysis || "No disponible"}"

Instrucciones:
- Salúdalo formalmente, exprésale un acompañamiento empático adecuado a una situación de sucesión o divorcio (según corresponda).
- Invítalo formalmente a una entrevista presencial o virtual (Zoom o videollamada) para detallar la estrategia jurídica.
- Agrega un tono de extrema confidencialidad, ética e idoneidad profesional.
- No inventes leyes específicas, concéntrate en transmitir tranquilidad y solicitar documentos básicos relevantes del caso.
- El mail debe ser redactado en español formal de Argentina (de manera sobria pero cordial).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "Eres un redactor y asistente de comunicaciones sénior en el prestigioso bufete de la Dra. María José Lizaso.",
      }
    });

    return res.json({ text: response.text });
  } catch (error: any) {
    console.error("Error generating reply:", error);
    return res.status(500).json({ error: "Error al generar propuesta de correo: " + error.message });
  }
});

// --- VITE MIDDLEWARE OR STATIC FILES SERVING ---

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development Mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production Mode
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Law Firm Server running at http://localhost:${PORT}`);
  });
}

startServer();

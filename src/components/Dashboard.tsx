import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, Mail, Phone, Calendar, Clipboard, Trash2, 
  Save, CheckCircle, Clock, Sparkles, AlertTriangle, 
  ChevronRight, RefreshCw, MessageSquare, FileText, CheckCircle2, Loader2, ArrowLeft
} from 'lucide-react';
import { ConsultationRequest, CaseAnalysis } from '../types';
import { db, auth } from '../firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';

interface DashboardProps {
  onBackToPublic: () => void;
}

export default function Dashboard({ onBackToPublic }: DashboardProps) {
  const [requests, setRequests] = useState<ConsultationRequest[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeRequest, setActiveRequest] = useState<ConsultationRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const [firebaseUser, setFirebaseUser] = useState<any>(null);
  const [cloudSyncError, setCloudSyncError] = useState<string | null>(null);

  // States for active actions inside detailed view
  const [lawyerNotes, setLawyerNotes] = useState('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [notesSavedFeedback, setNotesSavedFeedback] = useState<string | null>(null);
  const [isGeneratingEmail, setIsGeneratingEmail] = useState(false);
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [copiedText, setCopiedText] = useState(false);

  // Filters
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Monitor Firebase Authentication asynchronously
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setFirebaseUser(user);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Load consultations from both Cloud Firestore and local Express API, merge and deduplicate
  const fetchRequests = async () => {
    setIsLoading(true);
    let firestoreRequests: ConsultationRequest[] = [];
    let serverRequests: ConsultationRequest[] = [];

    // 1. Try to fetch from Cloud Firestore (primary)
    try {
      const q = query(collection(db, 'consultas'), orderBy('createdAt', 'desc'));
      const fetchPromise = getDocs(q);
      const timeoutPromise = new Promise<any>((_, reject) => 
        setTimeout(() => reject(new Error('Firestore fetch timeout')), 15000)
      );

      const querySnapshot = await Promise.race([fetchPromise, timeoutPromise]);
      querySnapshot.forEach((docSnap) => {
        firestoreRequests.push(docSnap.data() as ConsultationRequest);
      });
      setCloudSyncError(null);
    } catch (firestoreErr: any) {
      console.warn('Firestore fetch failed or timed out. Bypassing cloud dataset.', firestoreErr);
      if (firestoreErr?.code === 'permission-denied' || firestoreErr?.message?.toLowerCase().includes('permission')) {
        setCloudSyncError('Acceso denegado a Firestore. Inicie sesión con Google (Cuenta Oficial) para guardados en la nube.');
      } else {
        setCloudSyncError('No se pudo conectar a Firestore (La base de datos en la nube está en modo respaldo).');
      }
    }

    // 2. Try to fetch from local Express server API fallback
    try {
      const res = await fetch('/api/consultas');
      if (res.ok) {
        serverRequests = await res.json();
      }
    } catch (err) {
      console.error('Error fetching consultations from local server backup', err);
    }

    // 3. Robust dataset merging and sorting
    const mergedMap = new Map<string, ConsultationRequest>();
    
    // Insert server requests first
    serverRequests.forEach((req) => {
      if (req && req.id) {
        mergedMap.set(req.id, req);
      }
    });

    // Override/supplement with Firestore entries (contains latest status and notes updates)
    firestoreRequests.forEach((req) => {
      if (req && req.id) {
        mergedMap.set(req.id, req);
      }
    });

    const mergedList = Array.from(mergedMap.values()).sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });

    setRequests(mergedList);
    if (mergedList.length > 0 && !selectedId) {
      setSelectedId(mergedList[0].id);
    }
    
    setIsLoading(false);
  };

  useEffect(() => {
    if (!authLoading) {
      fetchRequests();
    }
  }, [authLoading, firebaseUser]);

  // Sync selected item detail view
  useEffect(() => {
    if (selectedId) {
      const item = requests.find(r => r.id === selectedId);
      if (item) {
        setActiveRequest(item);
        setLawyerNotes(item.lawyerNotes || '');
        setGeneratedEmail('');
      } else {
        setActiveRequest(null);
      }
    } else {
      setActiveRequest(null);
    }
  }, [selectedId, requests]);

  // Update status
  const handleUpdateStatus = async (status: 'pendiente' | 'revisado' | 'respondido') => {
    if (!selectedId) return;
    try {
      // Try Cloud Firestore first with a rapid timeout
      const docRef = doc(db, 'consultas', selectedId);
      const updatePromise = updateDoc(docRef, { status });
      const timeoutPromise = new Promise<void>((_, reject) => 
        setTimeout(() => reject(new Error('Firestore update timeout')), 15000)
      );

      await Promise.race([updatePromise, timeoutPromise]);
      setRequests(prev => prev.map(r => r.id === selectedId ? { ...r, status } : r));
    } catch (firestoreErr) {
      console.warn('Firestore update status failed or timed out, trying static server fallback...', firestoreErr);
      try {
        const res = await fetch(`/api/consultas/${selectedId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status })
        });
        if (res.ok) {
          const updatedItem = await res.json();
          setRequests(prev => prev.map(r => r.id === selectedId ? updatedItem : r));
        }
      } catch (err) {
        console.error('Error updating status on server', err);
      }
    }
  };

  // Save notes
  const handleSaveNotes = async () => {
    if (!selectedId) return;
    setIsSavingNotes(true);
    setNotesSavedFeedback(null);
    try {
      // Try Cloud Firestore first with rapid timeout
      const docRef = doc(db, 'consultas', selectedId);
      const updatePromise = updateDoc(docRef, { lawyerNotes });
      const timeoutPromise = new Promise<void>((_, reject) => 
        setTimeout(() => reject(new Error('Firestore update timeout')), 15000)
      );

      await Promise.race([updatePromise, timeoutPromise]);
      setRequests(prev => prev.map(r => r.id === selectedId ? { ...r, lawyerNotes } : r));
      setNotesSavedFeedback('Notas guardadas de forma segura en Firestore Cloud.');
      setTimeout(() => setNotesSavedFeedback(null), 4000);
    } catch (firestoreErr) {
      console.warn('Firestore save notes failed or timed out, trying static server fallback...', firestoreErr);
      try {
        const res = await fetch(`/api/consultas/${selectedId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lawyerNotes })
        });
        if (res.ok) {
          const updatedItem = await res.json();
          setRequests(prev => prev.map(r => r.id === selectedId ? updatedItem : r));
          setNotesSavedFeedback('Notas guardadas de forma segura en el servidor de expedientes.');
          setTimeout(() => setNotesSavedFeedback(null), 4000);
        }
      } catch (err) {
        console.error('Error saving notes on server', err);
        setNotesSavedFeedback('Error al guardar las notas.');
        setTimeout(() => setNotesSavedFeedback(null), 4000);
      }
    } finally {
      setIsSavingNotes(false);
    }
  };

  // Generate suggested draft reply email using Gemini based on original context
  const handleGenerateReplyEmail = async () => {
    if (!selectedId || !activeRequest) return;
    setIsGeneratingEmail(true);
    setGeneratedEmail('');

    try {
      const res = await fetch(`/api/consultas/${selectedId}/suggest-reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        const data = await res.json();
        setGeneratedEmail(data.text);
      } else {
        throw new Error('API server unavailable');
      }
    } catch (err) {
      console.warn('Backend draft generator unavailable (expected on flat static Vercel host). Generating fallback template in-browser.', err);
      
      const clientName = activeRequest.fullName;
      const caseTopic = activeRequest.caseType;
      
      const fallbackTemplate = `Estimado/a ${clientName},

Agradecemos sinceramente su contacto con el estudio de la Dra. María José Lizaso. Hemos recibido su consulta con respecto a su trámite de: "${caseTopic}".

Dado el carácter sensible y la rigurosidad ética y profesional con la que abordamos cada expediente, consideramos de suma importancia coordinar una entrevista de admisión preliminar (vía Zoom o presencial en nuestras oficinas) para analizar detalladamente los pormenores jurídicos de su situación.

Como especialista, quedo enteramente a su disposición para acompañarle en este proceso y resguardar sus derechos de manera idónea.

Cordialmente,

Dra. María José Lizaso
Abogada Especialista en Sucesiones y Divorcios
Estudio Jurídico Lizaso CABA / Prov. Bs. As.`;

      setGeneratedEmail(fallbackTemplate);
    } finally {
      setIsGeneratingEmail(false);
    }
  };

  // Delete Request
  const handleDeleteRequest = async (id: string) => {
    if (!confirm('¿Confirma que desea eliminar este expediente de consulta del registro permanente?')) {
      return;
    }
    try {
      // Try Cloud Firestore first
      const docRef = doc(db, 'consultas', id);
      await deleteDoc(docRef);
      setRequests(prev => prev.filter(r => r.id !== id));
      if (selectedId === id) {
        setSelectedId(null);
      }
    } catch (firestoreErr) {
      console.warn('Firestore delete failed, trying static server fallback...', firestoreErr);
      try {
        const res = await fetch(`/api/consultas/${id}`, {
          method: 'DELETE'
        });
        if (res.ok) {
          setRequests(prev => prev.filter(r => r.id !== id));
          if (selectedId === id) {
            setSelectedId(null);
          }
        }
      } catch (err) {
        console.error('Error deleting request on server', err);
      }
    }
  };

  // Copy to clipboard
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(generatedEmail);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  // Helper parser for stored string intelligence
  const parseAiAnalysis = (jsonString?: string): CaseAnalysis | null => {
    if (!jsonString) return null;
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      return null;
    }
  };

  // Filter requests based on selection
  const filteredRequests = requests.filter(req => {
    const matchType = filterType === 'all' || req.caseType === filterType;
    const matchStatus = filterStatus === 'all' || req.status === filterStatus;
    return matchType && matchStatus;
  });

  return (
    <div className="pt-24 min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      <div className="flex-1 w-full max-w-[1400px] mx-auto px-6 md:px-12 py-8 flex flex-col gap-6">
        
        {/* Superior panel header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-white/5">
          <div className="flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left gap-3">
            <div className="p-3 bg-brand-gold/10 text-brand-gold rounded border border-brand-gold/20 mx-auto sm:mx-0">
              <Shield className="w-6 h-6" />
            </div>
            <div className="flex flex-col items-center sm:items-start">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1 sm:mb-0">
                <h1 className="font-display text-2xl font-bold tracking-wider text-white">ESTUDIO LIZASO</h1>
                <span className="bg-red-500/20 text-red-300 border border-red-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Área Protegida
                </span>
                {cloudSyncError ? (
                  <span className="bg-amber-500/15 text-amber-300 border border-amber-500/20 text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider" title={cloudSyncError}>
                    ⚠️ Respaldo Local (Sin Nube)
                  </span>
                ) : (
                  <span className="bg-emerald-500/15 text-emerald-300 border border-emerald-500/20 text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Sincronizado Nube
                  </span>
                )}
              </div>
              <p className="font-sans text-xs text-slate-400">
                Panel Administrativo para Gestión Judicial de Consultas Entrantes.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={fetchRequests}
              className="px-4 py-2 text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white transition-all flex items-center gap-2 cursor-pointer rounded-xs"
              title="Sincronizar novedades de la base de datos"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Actualizar</span>
            </button>
            <button
              onClick={onBackToPublic}
              className="px-4 py-2 text-xs font-semibold bg-brand-gold text-brand-primary font-bold uppercase hover:bg-brand-gold-light transition-all flex items-center gap-2 cursor-pointer rounded-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver a la Web</span>
            </button>
          </div>
        </div>

        {/* Filters bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-800/50 p-4 border border-white/5 rounded">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Especialidad</label>
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full bg-slate-800 outline-none border border-slate-700 rounded p-2 text-xs text-white"
            >
              <option value="all">Sucesiones, Divorcios y General (Todas)</option>
              <option value="Sucesión">Sucesiones</option>
              <option value="Divorcio">Divorcios</option>
              <option value="Consulta General">Cons. General</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Estado del Trámite</label>
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full bg-slate-800 outline-none border border-slate-700 rounded p-2 text-xs text-white"
            >
              <option value="all">Todos los Estados</option>
              <option value="pendiente">Pendiente</option>
              <option value="revisado">Revisado / En Estudio</option>
              <option value="respondido">Respondido / Agendado</option>
            </select>
          </div>
          <div className="md:col-span-2 flex items-end justify-end text-right text-xs text-slate-400 p-2">
            Mostrando <strong>{filteredRequests.length}</strong> solicitudes de un total de <strong>{requests.length}</strong> registradas.
          </div>
        </div>

        {/* Dashboard workspace */}
        {authLoading ? (
          <div className="flex-1 flex flex-col justify-center items-center py-24 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-brand-gold" />
            <p className="text-slate-400 text-sm">Validando credenciales de seguridad...</p>
          </div>
        ) : isLoading ? (
          <div className="flex-1 flex flex-col justify-center items-center py-24 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-brand-gold" />
            <p className="text-slate-400 text-sm">Cargando base de consultas del tribunal virtual...</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="flex-1 border border-dashed border-white/10 rounded-lg p-16 text-center text-slate-400 flex flex-col items-center justify-center gap-4">
            <div className="text-slate-600 font-display text-4xl">🗃️</div>
            <h3 className="font-sans text-lg font-bold text-white">No hay consultas registradas</h3>
            <p className="max-w-md text-xs leading-relaxed">
              No se han encontrado solicitudes de consulta que coincidan con los filtros activos. Envíe una solicitud desde el formulario público de la web para verla reflejada aquí de inmediato.
            </p>
          </div>
        ) : (
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* LEFT COLUMN PANEL: Requests stack */}
            <div className="lg:col-span-5 xl:col-span-4 border border-white/5 rounded bg-slate-800/20 max-h-[640px] overflow-y-auto flex flex-col">
              <div className="p-3 border-b border-white/5 bg-white/2 flex justify-between items-center">
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-gold-light">Bandeja de Entrada</span>
                <span className="bg-brand-gold/20 text-brand-gold-light text-[9px] font-bold px-2 rounded-full py-0.5">ESTUDIO</span>
              </div>
              <div className="divide-y divide-white/5 flex-grow">
                {filteredRequests.map((req) => {
                  const reqAnalysis = parseAiAnalysis(req.aiAnalysis);
                  return (
                    <div
                      key={req.id}
                      onClick={() => setSelectedId(req.id)}
                      className={`p-4 transition-all hover:bg-white/4 cursor-pointer relative flex flex-col gap-2 ${
                        selectedId === req.id ? 'bg-white/5 border-l-4 border-brand-gold' : 'border-l-4 border-transparent'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-xs font-bold text-white break-words max-w-[200px]">{req.fullName}</span>
                        <span className="text-[10px] text-slate-500 whitespace-nowrap">
                          {new Date(req.createdAt).toLocaleDateString('es-AR')}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center gap-2">
                        <div className="flex gap-1.5 flex-wrap">
                          <span className="text-[9px] font-bold bg-slate-800 text-slate-300 border border-slate-700 rounded px-1.5 py-0.5 uppercase">
                            {req.caseType}
                          </span>
                          
                          {/* Display Urgency level if analyzed */}
                          {reqAnalysis && (
                            <span className={`text-[9px] font-bold rounded px-1.5 py-0.5 uppercase flex items-center gap-0.5 ${
                              reqAnalysis.urgency === 'Alta' 
                                ? 'bg-red-950/80 text-red-300 border border-red-500/20' 
                                : reqAnalysis.urgency === 'Media' 
                                  ? 'bg-amber-950/80 text-amber-300 border border-amber-500/20' 
                                  : 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/20'
                            }`}>
                              <AlertTriangle className="w-2.5 h-2.5" />
                              {reqAnalysis.urgency}
                            </span>
                          )}
                        </div>
                        
                        {/* Status indicators */}
                        <span className={`text-[9px] font-semibold tracking-wider font-sans uppercase rounded px-1.5 py-0.5 ${
                          req.status === 'pendiente' 
                            ? 'bg-slate-700/80 text-slate-200' 
                            : req.status === 'revisado' 
                              ? 'bg-amber-800/40 text-amber-300 border border-amber-800/20' 
                              : 'bg-emerald-800/40 text-emerald-300 border border-emerald-800/20'
                        }`}>
                          {req.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT COLUMN PANEL: Request Detailed view */}
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col">
              <AnimatePresence mode="wait">
                {activeRequest ? (
                  <motion.div 
                    key={activeRequest.id}
                    className="flex-1 bg-slate-800/30 border border-white/5 rounded p-6 md:p-8 flex flex-col gap-6"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    
                    {/* Detail block Top Header */}
                    <div className="flex justify-between items-start flex-wrap gap-4 pb-6 border-b border-white/5">
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase tracking-widest text-[#44474c] block">Expediente ID: {activeRequest.id}</span>
                        <h2 className="font-display text-2xl font-bold text-white leading-tight">{activeRequest.fullName}</h2>
                        <div className="flex gap-4 flex-wrap text-xs text-slate-400 pt-1">
                          <a href={`mailto:${activeRequest.email}`} className="flex items-center gap-1.5 hover:text-brand-gold transition-colors">
                            <Mail className="w-3.5 h-3.5" />
                            <span>{activeRequest.email}</span>
                          </a>
                          
                          {activeRequest.phone && (
                            <a href={`tel:${activeRequest.phone}`} className="flex items-center gap-1.5 hover:text-brand-gold transition-colors">
                              <Phone className="w-3.5 h-3.5" />
                              <span>{activeRequest.phone}</span>
                            </a>
                          )}
                          
                          <span className="flex items-center gap-1.5 text-slate-500">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{new Date(activeRequest.createdAt).toLocaleString('es-AR')}</span>
                          </span>
                        </div>
                      </div>

                      {/* Expediente state action buttons */}
                      <div className="flex flex-col gap-2">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest text-right">Estado del Expediente</span>
                        <div className="flex bg-slate-900 p-1.5 rounded border border-white/5 gap-1">
                          {(['pendiente', 'revisado', 'respondido'] as const).map((st) => (
                            <button
                              key={st}
                              onClick={() => handleUpdateStatus(st)}
                              className={`text-[10px] font-bold uppercase tracking-wider py-1 px-3 rounded-xs cursor-pointer transition-all ${
                                activeRequest.status === st
                                  ? 'bg-brand-gold text-brand-primary'
                                  : 'text-slate-400 hover:text-white hover:bg-white/4'
                              }`}
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Original case narrative */}
                    <div className="space-y-2">
                      <span className="font-sans text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-brand-gold" />
                        Relato Original del Cliente:
                      </span>
                      <div className="p-5 bg-slate-950/40 rounded border border-white/5 font-sans text-sm text-slate-350 leading-relaxed max-h-[160px] overflow-y-auto whitespace-pre-wrap">
                        {activeRequest.message}
                      </div>
                    </div>

                    {/* Gemini AI structured analysis display */}
                    {(() => {
                      const analysisData = parseAiAnalysis(activeRequest.aiAnalysis);
                      if (!analysisData) return null;
                      return (
                        <div className="bg-brand-primary/45 border border-brand-gold/25 p-5 rounded space-y-4">
                          <div className="flex justify-between items-center flex-wrap gap-2 pb-3 border-b border-brand-gold/15">
                            <span className="text-xs font-bold text-brand-gold-light uppercase tracking-wider flex items-center gap-1.5">
                              <Sparkles className="w-4 h-4" />
                              Análisis de Admisión Automático Gemini 3.5-Flash
                            </span>
                            <div className="flex gap-2">
                              <span className="bg-slate-900 border border-slate-700 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest text-slate-300">
                                Clasificación: {analysisData.category}
                              </span>
                              <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest text-white ${
                                analysisData.urgency === 'Alta' ? 'bg-red-950/70 text-red-200 border border-red-800/30' : analysisData.urgency === 'Media' ? 'bg-amber-950/70 text-amber-200 border border-amber-800/20' : 'bg-emerald-950/70 text-emerald-200 border border-emerald-800/20'
                              }`}>
                                Urgencia: {analysisData.urgency}
                              </span>
                            </div>
                          </div>

                          <p className="font-sans text-xs text-slate-300 leading-relaxed italic">
                            "{analysisData.summary}"
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                            <div className="space-y-1">
                              <span className="text-[10px] font-bold text-brand-gold-light uppercase tracking-wider block">Puntos Críticos Detectados:</span>
                              <ul className="list-disc pl-4 text-xs text-slate-400 space-y-1">
                                {analysisData.keyPoints.map((pt, k) => (
                                  <li key={k}>{pt}</li>
                                ))}
                              </ul>
                            </div>
                            
                            <div className="space-y-1">
                              <span className="text-[10px] font-bold text-brand-gold-light uppercase tracking-wider block">Documentos & Pasos Sugeridos:</span>
                              <ul className="list-disc pl-4 text-xs text-slate-400 space-y-1">
                                {analysisData.recommendedSteps.map((st, k) => (
                                  <li key={k}>{st}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Notes & Actions bar */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                      
                      {/* private lawyer comments */}
                      <div className="space-y-3">
                        <span className="font-sans text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                          Comentarios / Notas Privadas de la Abogada:
                        </span>
                        <textarea
                          rows={4}
                          value={lawyerNotes}
                          onChange={(e) => setLawyerNotes(e.target.value)}
                          placeholder="Anote impresiones, juzgado de radicación, plazos críticos, o recordatorios de esta causa..."
                          className="w-full bg-slate-900 border border-white/5 focus:border-brand-gold outline-none p-4 text-xs text-slate-200 leading-relaxed rounded resize-none"
                        />
                        <div className="flex items-center justify-between gap-2 mt-1">
                          {notesSavedFeedback ? (
                            <span className="text-[10px] font-medium text-emerald-400 block animate-pulse">
                              {notesSavedFeedback}
                            </span>
                          ) : <div />}
                          <button
                            onClick={handleSaveNotes}
                            disabled={isSavingNotes}
                            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold uppercase text-[10px] tracking-widest flex items-center gap-1.5 cursor-pointer transition-all"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>{isSavingNotes ? 'Guardando...' : 'Guardar Notas'}</span>
                          </button>
                        </div>
                      </div>

                      {/* automated drafts */}
                      <div className="space-y-3">
                        <span className="font-sans text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                          Generador de Propuestas (Drafts):
                        </span>
                        
                        <div className="bg-slate-900/60 border border-white/5 rounded p-4 flex flex-col gap-3 min-h-[140px] justify-between">
                          <p className="text-slate-400 text-xs leading-relaxed">
                            Ahorre tiempo redactando. El software redacta una respuesta por mail adaptada a la causa de forma empática usando IA.
                          </p>
                          
                          {generatedEmail ? (
                            <div className="space-y-2">
                              <textarea
                                readOnly
                                rows={4}
                                value={generatedEmail}
                                className="w-full bg-slate-950 p-2.5 font-sans text-[11px] text-slate-300 leading-relaxed rounded border border-white/5 outline-none resize-none"
                              />
                              <div className="flex justify-between items-center">
                                <button
                                  onClick={handleGenerateReplyEmail}
                                  className="text-[10px] text-brand-gold hover:underline font-bold flex items-center gap-1"
                                >
                                  <RefreshCw className="w-3 h-3" />
                                  Re-generar
                                </button>
                                <button
                                  onClick={handleCopyToClipboard}
                                  className="px-3 py-1 bg-brand-gold hover:bg-brand-gold-light text-brand-primary text-[10px] font-bold uppercase rounded flex items-center gap-1 cursor-pointer"
                                >
                                  <Clipboard className="w-3 h-3" />
                                  <span>{copiedText ? 'Copiado' : 'Copiar Borrador'}</span>
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={handleGenerateReplyEmail}
                              disabled={isGeneratingEmail}
                              className="px-4 py-3 bg-brand-primary border border-brand-gold/30 hover:border-brand-gold/60 text-brand-gold-light font-bold uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-all w-full select-none"
                            >
                              {isGeneratingEmail ? (
                                <>
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  <span>Generando propuestá...</span>
                                </>
                              ) : (
                                <>
                                  <Sparkles className="w-3.5 h-3.5" />
                                  <span>Generar Mail de Bienvenida</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Dangerous section */}
                    <div className="pt-4 border-t border-white/5 flex justify-between items-center flex-wrap gap-2">
                      <p className="text-[11px] text-slate-500">
                        Administración permanente del expediente de admisión. Asegúrese de guardar notas antes de salir.
                      </p>
                      
                      <button
                        onClick={() => handleDeleteRequest(activeRequest.id)}
                        className="px-3 py-1.5 bg-red-950/40 hover:bg-red-900 border border-red-950 text-red-200 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer rounded-xs"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Eliminar Consulta</span>
                      </button>
                    </div>

                  </motion.div>
                ) : (
                  <div className="flex-grow border border-dashed border-white/5 rounded-lg p-16 text-center text-slate-500 flex flex-col justify-center items-center gap-3">
                    <CheckCircle2 className="w-12 h-12 text-slate-700" />
                    <h3 className="text-white font-semibold">Ningún Expediente Seleccionado</h3>
                    <p className="text-xs max-w-sm">
                      Por favor, seleccione una solicitud de consulta de la bandeja izquierda para ver detalles completos, notas de seguimiento y redactor de drafts asistidos.
                    </p>
                  </div>
                )}
              </AnimatePresence>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

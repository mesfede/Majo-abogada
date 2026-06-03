import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Sparkles, CheckCircle, AlertCircle, FileCheck, HelpCircle, Loader2 } from 'lucide-react';
import { CaseAnalysis } from '../types';

export default function ConsultForm() {
  // Form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [caseType, setCaseType] = useState<'Sucesión' | 'Divorcio' | 'Consulta General'>('Sucesión');
  const [message, setMessage] = useState('');

  // AI & Submission States
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<CaseAnalysis | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Invoke Gemini AI to analyze the described case text
  const handleAnalyzeCase = async () => {
    if (!message || message.trim().length < 15) {
      setAnalysisError('Por favor, describa su caso con un poco más de detalle (mínimo 15 caracteres) para poder ofrecerle un análisis virtual certero.');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError(null);
    setAnalysis(null);

    try {
      const response = await fetch('/api/analyze-case', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error('No se pudo completar el análisis del caso en el servidor.');
      }

      const result: CaseAnalysis = await response.json();
      setAnalysis(result);
      
      // Auto-set the case type if classified confidently by Gemini
      if (result.category === 'Sucesión' || result.category === 'Divorcio' || result.category === 'Consulta General') {
        setCaseType(result.category);
      }
    } catch (err: any) {
      setAnalysisError(err.message || 'Error de red al establecer comunicación con el módulo de análisis jurídico.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Submit final consultation and analysis history
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !message) {
      setSubmitError('Por favor complete los campos obligatorios: Nombre completo, Correo electrónico y su Consulta.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const payload = {
        fullName,
        email,
        phone,
        caseType,
        message,
        aiAnalysisSummary: analysis ? JSON.stringify(analysis) : null,
        aiCaseCategory: analysis ? analysis.category : null,
      };

      const response = await fetch('/api/consultas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Error al enviar la consulta legal.');
      }

      setSubmitted(true);
      // Reset form
      setFullName('');
      setEmail('');
      setPhone('');
      setMessage('');
      setAnalysis(null);
    } catch (err: any) {
      setSubmitError(err.message || 'Error de conexión al enviar la consulta legal.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-24 bg-neutral-100/50 relative overflow-hidden" id="consulta">
      
      {/* Absolute decorative backgrounds pattern */}
      <div className="absolute right-0 bottom-0 top-0 left-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/natural-paper.png')" }}></div>

      <div className="max-w-[800px] mx-auto px-6 relative z-10">
        
        <div className="text-center mb-16">
          <span className="font-sans text-xs uppercase tracking-[0.25em] text-brand-gold font-bold block mb-3">
            Atención Profesional
          </span>
          <h2 className="font-display text-3xl md:text-4xl text-brand-primary font-bold uppercase tracking-wider mb-4">
            Agendar una Consulta Profesional
          </h2>
          <p className="font-sans text-sm md:text-base text-[#44474c] max-w-xl mx-auto leading-relaxed">
            Complete el formulario brindando los detalles esenciales y nos pondremos en contacto a la brevedad para realizar una evaluación jurídica rigurosa de su situación.
          </p>
        </div>

        <div className="bg-white p-8 md:p-12 shadow-xl border border-brand-primary/5">
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.form 
                onSubmit={handleSubmit} 
                className="space-y-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                
                {/* Personal Information row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2 group">
                    <label className="font-sans text-[11px] font-bold text-brand-primary uppercase tracking-wider block">
                      Nombre Completo <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="Ej: Juan Pérez"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-transparent border-b border-brand-primary/20 focus:border-brand-gold focus:ring-0 transition-colors py-3 px-1 text-sm text-brand-primary placeholder:text-neutral-400 outline-none"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="font-sans text-[11px] font-bold text-brand-primary uppercase tracking-wider block">
                      Correo Electrónico <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="email" 
                      required
                      placeholder="ejemplo@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-transparent border-b border-brand-primary/20 focus:border-brand-gold focus:ring-0 transition-colors py-3 px-1 text-sm text-brand-primary placeholder:text-neutral-400 outline-none"
                    />
                  </div>
                </div>

                {/* contact row & case select */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="font-sans text-[11px] font-bold text-brand-primary uppercase tracking-wider block">
                      Teléfono de Contacto
                    </label>
                    <input 
                      type="tel" 
                      placeholder="+54 11 ..."
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-transparent border-b border-brand-primary/20 focus:border-brand-gold focus:ring-0 transition-colors py-3 px-1 text-sm text-brand-primary placeholder:text-neutral-400 outline-none"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="font-sans text-[11px] font-bold text-brand-primary uppercase tracking-wider block">
                      Tipo de Trámite <span className="text-xs text-brand-gold/80 italic">(Autodetectado por IA al analizar)</span>
                    </label>
                    <select 
                      value={caseType}
                      onChange={(e: any) => setCaseType(e.target.value)}
                      className="w-full bg-transparent border-b border-brand-primary/20 focus:border-brand-gold focus:ring-0 transition-colors py-3 px-1 text-sm text-brand-primary outline-none cursor-pointer"
                    >
                      <option value="Sucesión">Sucesión</option>
                      <option value="Divorcio">Divorcio</option>
                      <option value="Consulta General">Consulta General</option>
                    </select>
                  </div>
                </div>

                {/* Case description with Gemini button */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <label className="font-sans text-[11px] font-bold text-brand-primary uppercase tracking-wider block">
                      Mensaje / Descripción Detallada del Caso <span className="text-red-500">*</span>
                    </label>
                    
                    <button
                      type="button"
                      disabled={isAnalyzing || message.trim().length < 15}
                      onClick={handleAnalyzeCase}
                      className={`text-xs flex items-center gap-1 px-3 py-1 rounded bg-brand-gold/15 text-brand-gold font-semibold transition-all ease-in hover:bg-brand-gold/22 cursor-pointer ${
                        message.trim().length < 15 ? 'opacity-50 cursor-not-allowed bg-neutral-200 text-neutral-500' : ''
                      }`}
                      title="Analiza tu caso en tiempo real con inteligencia artificial para conocer su urgencia de inmediato"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Analizando...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Pre-evaluar con IA</span>
                        </>
                      )}
                    </button>
                  </div>

                  <textarea 
                    rows={5}
                    required
                    placeholder="Describa brevemente los hechos (ej: fallecimiento de familiar, bienes involucrados, testamentos, intenciones de divorcio, acuerdos intermedios, etc.)"
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      if (analysisError) setAnalysisError(null);
                    }}
                    className="w-full bg-transparent border border-brand-primary/10 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/20 transition-all py-3 px-4 text-sm text-brand-primary placeholder:text-neutral-400 outline-none resize-none leading-relaxed"
                  />
                  
                  {analysisError && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{analysisError}</span>
                    </div>
                  )}
                </div>

                {/* Interactive AI Evaluation Display */}
                <AnimatePresence>
                  {analysis && (
                    <motion.div 
                      className="p-6 bg-brand-primary text-white border-l-4 border-brand-gold shadow-lg"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                        <div className="flex items-center gap-1.5 text-brand-gold-light">
                          <Sparkles className="w-4 h-4" />
                          <span className="font-sans text-xs uppercase tracking-wider font-bold">Análisis Virtual de Admisión (Gemini 3.5)</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="bg-white/10 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest text-[#eddfb6]">
                            Tipo: {analysis.category}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest text-white ${
                            analysis.urgency === 'Alta' ? 'bg-red-900/60 text-red-100' : analysis.urgency === 'Media' ? 'bg-amber-800/60 text-amber-100' : 'bg-emerald-950/60 text-emerald-100'
                          }`}>
                            Urgencia: {analysis.urgency}
                          </span>
                        </div>
                      </div>

                      <p className="font-sans text-xs text-slate-200 leading-relaxed italic mb-4 pb-3 border-b border-white/10">
                        "{analysis.summary}"
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold-light flex items-center gap-1">
                            <FileCheck className="w-3.5 h-3.5" /> Pasos preliminares recomendados:
                          </span>
                          <ul className="list-disc pl-4 text-xs text-slate-300 space-y-1">
                            {analysis.recommendedSteps.slice(0, 3).map((step, k) => (
                              <li key={k}>{step}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="space-y-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold-light flex items-center gap-1">
                            <HelpCircle className="w-3.5 h-3.5" /> Preguntas para su reunión:
                          </span>
                          <ul className="list-disc pl-4 text-xs text-slate-300 space-y-1">
                            {analysis.suggestedQuestions.slice(0, 3).map((q, k) => (
                              <li key={k}>{q}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {submitError && (
                  <div className="p-4 bg-red-50 text-red-700 text-xs rounded border border-red-150 font-medium">
                    {submitError}
                  </div>
                )}

                {/* Form Buttons */}
                <div className="pt-4 flex justify-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-brand-primary text-white hover:bg-black/90 active:scale-98 border border-brand-primary px-16 py-4.5 text-xs font-bold uppercase tracking-widest cursor-pointer shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 min-w-[280px]"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Enviando Solicitud...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Enviar Solicitud de Consulta</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.form>
            ) : (
              <motion.div 
                className="text-center py-12 px-6"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-flex items-center justify-center p-4 bg-emerald-50 text-emerald-600 rounded-full mb-6">
                  <CheckCircle className="w-12 h-12" />
                </div>
                <h3 className="font-display text-2xl md:text-3xl text-brand-primary font-bold mb-4">
                  ¡Solicitud Enviada con Éxito!
                </h3>
                <p className="font-sans text-sm md:text-base text-neutral-600 max-w-lg mx-auto leading-relaxed mb-8">
                  Agradecemos su confianza. La Dra. María José Lizaso y su equipo de admisión analizarán minuciosamente los detalles brindados para coordinar su primera entrevista formal. Recibirá un correo a la brevedad.
                </p>
                
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-8 py-3 bg-brand-primary text-white text-xs font-bold uppercase tracking-widest border border-brand-primary hover:bg-black transition-all cursor-pointer"
                >
                  Enviar otra consulta
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

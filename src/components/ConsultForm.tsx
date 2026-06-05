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

  // Submission States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Submit final consultation
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
      };

      const response = await fetch('/api/consultas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Error al enviar la consulta legal.');
      }

      try {
        await fetch("https://formsubmit.co/ajax/mesfede@gmail.com", {
          method: "POST",
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            Nombre: fullName,
            Correo: email,
            Telefono: phone,
            Tramite: caseType,
            Consulta: message
          })
        });
      } catch (e) { console.error("FormSubmit error", e); }

      setSubmitted(true);
      // Reset form
      setFullName('');
      setEmail('');
      setPhone('');
      setMessage('');
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
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -100px 0px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <span className="font-sans text-xs uppercase tracking-[0.25em] text-brand-gold font-bold block mb-3">
            Atención Profesional
          </span>
          <h2 className="font-display text-3xl md:text-4xl text-brand-primary font-bold uppercase tracking-wider mb-4">
            Agendar una Consulta Profesional
          </h2>
          <p className="font-sans text-sm md:text-base text-[#44474c] max-w-xl mx-auto leading-relaxed">
            Complete el formulario brindando los detalles esenciales y nos pondremos en contacto a la brevedad para realizar una evaluación jurídica rigurosa de su situación.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -100px 0px" }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="bg-white p-8 md:p-12 shadow-xl border border-brand-primary/5"
        >
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
                      Tipo de Trámite
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

                {/* Case description */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <label className="font-sans text-[11px] font-bold text-brand-primary uppercase tracking-wider block">
                      Mensaje / Descripción Detallada del Caso <span className="text-red-500">*</span>
                    </label>
                  </div>

                  <textarea 
                    rows={5}
                    required
                    placeholder="Describa brevemente los hechos (ej: fallecimiento de allegado, bienes involucrados, testamentos, intenciones de divorcio, acuerdos intermedios, etc.)"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-transparent border border-brand-primary/10 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/20 transition-all py-3 px-4 text-sm text-brand-primary placeholder:text-neutral-400 outline-none resize-none leading-relaxed"
                  />
                </div>

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
        </motion.div>
      </div>
    </section>
  );
}

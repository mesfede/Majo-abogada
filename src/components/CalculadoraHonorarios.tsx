import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calculator, AlertCircle, Info, ChevronRight, Scale, CheckCircle2 } from 'lucide-react';

export default function CalculadoraHonorarios() {
  const [selectedTopic, setSelectedTopic] = useState('');
  const [result, setResult] = useState<{ text: string, detail: string } | null>(null);

  const calculate = (topic: string) => {
    setSelectedTopic(topic);
    switch (topic) {
      case 'sucesion':
        setResult({
          text: 'Entre 8% y 15% del valor real o fiscal del acervo hereditario.',
          detail: 'Los honorarios en sucesiones están regulados por la Ley de Honorarios Profesionales. Trabajamos con planes de pago personalizados adaptados a las etapas del proceso.'
        });
        break;
      case 'divorcio-comun':
        setResult({
          text: 'Regulado por IUS u Honorario Fijo Pre-acordado.',
          detail: 'En divorcios de presentación conjunta el costo suele ser menor y más predecible. Ofrecemos financiación en cuotas fijas durante el transcurso del proceso.'
        });
        break;
      case 'divorcio-unilateral':
        setResult({
          text: 'Honorario base + regulación judicial según bienes.',
          detail: 'Estos procesos requieren mayor tiempo de negociación y mediaciones adicionales si existen bienes o menores involucrados.'
        });
        break;
      case 'consulta':
        setResult({
          text: 'Valor de IUS vigente.',
          detail: 'La consulta preliminar de diagnóstico legal tiene un costo referencial, que luego se descuenta del honorario total si decide iniciar el trámite con nosotros.'
        });
        break;
      default:
        setResult(null);
    }
  };

  const guarantees = [
    {
      text: 'Los valores se fijan conforme la Ley de Honorarios de la Provincia de Buenos Aires y CABA.',
      icon: Scale
    },
    {
      text: 'Posibilidad de formalizar convenios de honorarios fijados al inicio del proceso.',
      icon: AlertCircle
    },
    {
      text: 'Opciones de financiación y planes de pago adaptados a su situación familiar.',
      icon: Info
    }
  ];

  return (
    <section className="py-24 bg-neutral-100 relative overflow-hidden" id="calculadora">
      {/* Giant Graphic Typography Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden opacity-[0.015]">
        <span className="font-display font-black text-[30rem] lg:text-[45rem] leading-none tracking-[0.05em] text-[#0a2240] whitespace-nowrap">
          HONORARIOS
        </span>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 md:px-16 relative z-10">
        
        {/* Superior part layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Header Column */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -100px 0px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <div>
              <span className="font-sans text-xs uppercase tracking-[0.25em] text-brand-gold font-bold block mb-4">
                Transparencia Total
              </span>
              <div className="flex items-center gap-4 mb-6">
                <Calculator className="w-8 h-8 md:w-10 md:h-10 text-brand-gold stroke-[1.5]" />
                <div className="h-10 w-[1px] bg-brand-gold/30"></div>
                <h2 className="font-display text-3xl md:text-3xl lg:text-4xl text-brand-primary m-0 p-0 leading-none">
                  <span className="font-light">Previsibilidad</span> <span className="font-medium">Legal</span>
                </h2>
              </div>
              <p className="font-sans text-sm md:text-base text-[#44474c] leading-relaxed">
                Sabemos que dar el primer paso legal genera incertidumbre. Por eso, nos regimos estrictamente por las normativas vigentes, priorizando la claridad y la previsibilidad económica desde el primer día.
              </p>
            </div>

            <div className="flex flex-col space-y-3.5">
              {guarantees.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div 
                    key={idx} 
                    className="group bg-white/80 backdrop-blur-sm border border-brand-primary/5 p-4 md:p-5 shadow-sm hover:shadow-lg flex items-center gap-4 rounded-xl hover:bg-brand-gold-light/20 hover:border-brand-gold/30 hover:-translate-y-1.5 transition-all duration-300 cursor-default"
                  >
                    <div className="text-brand-gold flex-shrink-0 group-hover:text-[#0a2240] transition-all duration-300 group-hover:scale-110">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-sans text-[13px] text-brand-primary font-medium group-hover:text-[#0a2240] leading-snug transition-colors">{item.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Calculator Column */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -100px 0px" }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="bg-white p-8 md:p-10 border border-brand-primary/5 shadow-lg space-y-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 blur-3xl rounded-full" />
            
            <div>
              <span className="font-sans text-[10px] uppercase tracking-widest text-[#44474c] font-bold block mb-2">Simulación de Inversión</span>
              <h3 className="font-display text-2xl font-bold text-brand-primary">Referencia de Costos</h3>
            </div>
            
            <div className="space-y-3 relative z-10">
              {[
                { id: 'sucesion', label: 'Procesos Sucesorios' },
                { id: 'divorcio-comun', label: 'Divorcio de Común Acuerdo' },
                { id: 'divorcio-unilateral', label: 'Divorcio Unilateral / Controvertido' },
                { id: 'consulta', label: 'Consulta Diagnóstico' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => calculate(item.id)}
                  className={`w-full text-left flex items-center justify-between p-4 border transition-all cursor-pointer ${
                    selectedTopic === item.id 
                    ? 'border-brand-gold bg-brand-gold/5 text-brand-primary' 
                    : 'border-neutral-200 text-[#44474c] hover:border-brand-gold/40 hover:text-brand-primary hover:bg-neutral-50'
                  }`}
                >
                  <span className="font-sans text-[13px] font-bold tracking-wide uppercase">{item.label}</span>
                  <ChevronRight className={`w-4 h-4 transition-transform ${selectedTopic === item.id ? 'text-brand-gold rotate-90' : 'text-slate-400'}`} />
                </button>
              ))}
            </div>

            <div className="relative z-10 pt-4">
              {result ? (
                <div className="bg-[#0a2240] text-white p-6 rounded shadow-md animate-fade-in relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <CheckCircle2 className="w-16 h-16" />
                  </div>
                  <p className="text-brand-gold-light font-sans text-[10px] font-bold uppercase tracking-widest mb-2">Estimador Orientativo</p>
                  <p className="font-serif text-lg mb-3 relative z-10">{result.text}</p>
                  <p className="text-slate-300 font-sans text-xs leading-relaxed relative z-10">{result.detail}</p>
                </div>
              ) : (
                <div className="bg-neutral-50 border border-neutral-200 border-dashed p-6 rounded text-center">
                  <p className="text-[#44474c] text-xs font-sans tracking-wide">Seleccione una materia para visualizar las pautas orientativas.</p>
                </div>
              )}
            </div>
            
          </motion.div>

        </div>
      </div>
    </section>
  );
}

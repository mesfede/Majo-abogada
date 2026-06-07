import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Handshake, ShieldAlert, CheckCircle2, ChevronDown, Briefcase } from 'lucide-react';

export default function Especialidades() {
  const secondarySpecialties = [
    {
      title: 'Derecho Civil & Obligaciones',
      desc: 'Redacción, negociación y litigio de contratos civiles complejos, reclamos por daños y perjuicios, y disputas domaniales.',
      icon: BookOpen
    },
    {
      title: 'Mediaciones Prejudiciales',
      desc: 'Asesoramiento riguroso y representación legal en audiencias de mediación obligatoria, priorizando resolver conflictos con celeridad legal.',
      icon: Handshake
    },
    {
      title: 'Defensa de Derechos Conyugales',
      desc: 'Medidas cautelares de exclusión del hogar, protección integral alimentaria provisoria y acuerdos preventivos post-nupciales.',
      icon: ShieldAlert
    }
  ];

  const faqs = [
    {
      q: '¿Qué documentación inicial se requiere para abrir una sucesión?',
      a: 'Deberá contar con la partida de defunción original del causante, las partidas de nacimiento de los hijos que acrediten el vínculo y la de matrimonio en caso de ser casado/a. También es de suma utilidad contar con las escrituras de las propiedades o títulos de los bienes que integran la herencia.'
    },
    {
      q: '¿Cuánto demora un juicio sucesorio en la provincia o CABA?',
      a: 'Una sucesión estándar ab-intestato (sin testamento) suele demorar de 3 a 6 meses para obtener la Declaratoria de Herederos confirmada por el juzgado, dependiendo de la celeridad judicial del juzgado interviniente. Luego, el plazo de inscripción final varía según los bienes registrables involucrados.'
    },
    {
      q: '¿Es posible iniciar un divorcio si una sola de las partes está de acuerdo?',
      a: 'Sí, desde la reforma del Código Civil y Comercial de la Nación, rige el "divorcio unilateral". No se requiere la conformidad de ambos cónyuges ni alegar una causa de separación para disolver el vínculo matrimonial de forma judicial.'
    }
  ];

  return (
    <section className="py-24 bg-neutral-100 relative overflow-hidden" id="especialidades">
      {/* Giant Graphic Typography Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden opacity-[0.03]">
        <span className="font-display font-black text-[25rem] lg:text-[38rem] leading-none tracking-[0.05em] text-[#041627] whitespace-nowrap">
          ESPECIALIDADES
        </span>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 md:px-16 relative z-10">
        
        {/* Superior part layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Secondary specialties cards Column */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -100px 0px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <div>
              <span className="font-sans text-xs uppercase tracking-[0.25em] text-brand-gold font-bold block mb-4">
                Otras Prácticas
              </span>
              <div className="flex items-center gap-4 mb-6">
                <Briefcase className="w-8 h-8 md:w-10 md:h-10 text-brand-gold stroke-[1.5]" />
                <div className="h-10 w-[1px] bg-brand-gold/30"></div>
                <h2 className="font-display text-3xl md:text-3xl lg:text-4xl text-brand-primary m-0 p-0 leading-none">
                  <span className="font-light">Especialidades</span> <span className="font-medium">Complementarias</span>
                </h2>
              </div>
              <p className="font-sans text-sm md:text-base text-[#44474c] leading-relaxed">
                Brindamos un asesoramiento global en materia de derecho civil y patrimonial, coordinando soluciones estratégicas para preservar la paz y consolidar la estabilidad de su patrimonio.
              </p>
            </div>

            <div className="flex flex-col space-y-3.5">
              {secondarySpecialties.map((specialty, idx) => {
                const Icon = specialty.icon;
                return (
                  <div 
                    key={idx} 
                    className="group bg-white/80 backdrop-blur-sm border border-brand-primary/5 p-4 md:p-5 shadow-sm hover:shadow-lg flex items-start gap-4 rounded-xl hover:bg-brand-gold-light/20 hover:border-brand-gold/30 hover:-translate-y-1.5 transition-all duration-300 cursor-default"
                  >
                    <div className="text-brand-gold flex-shrink-0 pt-0.5 group-hover:text-[#041627] transition-all duration-300 group-hover:scale-110">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-sans text-[13px] font-bold text-brand-primary group-hover:text-[#041627] uppercase tracking-wide mb-1 transition-colors">{specialty.title}</h4>
                      <p className="font-sans text-[13px] text-neutral-500 group-hover:text-[#041627]/80 leading-snug transition-colors">{specialty.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* FAQ Column layout */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -100px 0px" }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="bg-white p-8 md:p-10 border border-brand-primary/5 shadow-lg space-y-8"
          >
            <div>
              <span className="font-sans text-[10px] uppercase tracking-widest text-[#44474c] font-bold block mb-2">Preguntas Frecuentes</span>
              <h3 className="font-display text-2xl font-bold text-brand-primary">Dudas Procesales Comunes</h3>
            </div>

            <div className="divide-y divide-brand-primary/10">
              {faqs.map((faq, i) => (
                <div key={i} className="py-5 first:pt-0 last:pb-0">
                  <h4 className="font-sans text-xs font-bold text-brand-primary flex items-start gap-2 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-gold flex-shrink-0 mt-0.5" />
                    <span>{faq.q}</span>
                  </h4>
                  <p className="font-sans text-xs text-[#44474c] pl-6 leading-relaxed text-justify">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}

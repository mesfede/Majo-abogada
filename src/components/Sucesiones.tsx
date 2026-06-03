import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Scale, FileText, Landmark, Award } from 'lucide-react';

function AnimatedNumber({ value, suffix = "" }: { value: number, suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      let startTime: number | null = null;
      const duration = 2000; // 2 seconds

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = timestamp - startTime;
        const percentage = Math.min(progress / duration, 1);
        
        // easeOutExpo for smooth deceleration
        const easeOut = percentage === 1 ? 1 : 1 - Math.pow(2, -10 * percentage);
        setCount(Math.floor(value * easeOut));

        if (progress < duration) {
          requestAnimationFrame(animate);
        } else {
          setCount(value);
        }
      };
      requestAnimationFrame(animate);
    }
  }, [value, isInView]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function Sucesiones() {
  return (
    <section className="py-24 bg-neutral-100 relative overflow-hidden" id="sucesiones">
      {/* Giant Graphic Typography Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden opacity-[0.03]">
        <span className="font-display font-black text-[25rem] lg:text-[38rem] leading-none tracking-[0.05em] text-[#041627] whitespace-nowrap">
          SUCESORIOS
        </span>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 md:px-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12 lg:items-end">
          
          {/* Left Column Description and elements */}
          <div className="lg:col-span-7 space-y-8 pb-1">
            <div>
              <span className="font-sans text-xs uppercase tracking-[0.25em] text-brand-gold font-bold block mb-3">
                Especialidad Principal
              </span>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-brand-primary font-bold mb-6 inline-block relative">
                Derecho Sucesorio
                <div className="h-1 bg-brand-gold-light mt-1.5 w-full rounded-xs"></div>
              </h2>
            </div>
            
            <p className="font-sans text-lg md:text-xl font-light text-neutral-600 leading-[1.8] text-left max-w-2xl border-l-4 border-[#041627]/10 pl-5">
              Gestionamos la transmisión de bienes con la máxima celeridad y rigor técnico. Entendemos que una sucesión es más que un trámite legal; es la preservación de un legado y la seguridad de sus herederos. Nos enfocamos en aliviar la carga administrativa de las familias durante estos momentos.
            </p>
            
            {/* Elements list matching original structure */}
            <div className="flex flex-col space-y-3.5 pt-2 h-full justify-center">
              <div className="group flex items-center gap-4 p-3 md:p-4 rounded-xl bg-white/70 backdrop-blur-sm border border-brand-primary/5 shadow-sm hover:shadow-md hover:bg-[#eddfb6] hover:border-[#ebd59a] transition-all duration-300 cursor-default">
                <div className="p-2.5 bg-neutral-100/80 group-hover:bg-white/60 rounded-lg text-brand-gold group-hover:text-[#041627] border border-brand-primary/5 transition-colors">
                  <Landmark className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-sans text-[13px] font-bold text-brand-primary group-hover:text-[#041627] mb-0.5 uppercase tracking-wider transition-colors">
                    Sucesiones Testamentarias
                  </h4>
                  <p className="font-sans text-[13px] text-neutral-500 group-hover:text-[#041627]/80 leading-snug transition-colors">
                    Ejecución precisa de la voluntad del causante según los marcos legales.
                  </p>
                </div>
              </div>
              
              <div className="group flex items-center gap-4 p-3 md:p-4 rounded-xl bg-white/70 backdrop-blur-sm border border-brand-primary/5 shadow-sm hover:shadow-md hover:bg-[#eddfb6] hover:border-[#ebd59a] transition-all duration-300 cursor-default">
                <div className="p-2.5 bg-neutral-100/80 group-hover:bg-white/60 rounded-lg text-brand-gold group-hover:text-[#041627] border border-brand-primary/5 transition-colors">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-sans text-[13px] font-bold text-brand-primary group-hover:text-[#041627] mb-0.5 uppercase tracking-wider transition-colors">
                    Declaratoria de Herederos
                  </h4>
                  <p className="font-sans text-[13px] text-neutral-500 group-hover:text-[#041627]/80 leading-snug transition-colors">
                    Tramitación ágil, eficaz y sin demoras para el reconocimiento de herederos.
                  </p>
                </div>
              </div>
              
              <div className="group flex items-center gap-4 p-3 md:p-4 rounded-xl bg-white/70 backdrop-blur-sm border border-brand-primary/5 shadow-sm hover:shadow-md hover:bg-[#eddfb6] hover:border-[#ebd59a] transition-all duration-300 cursor-default">
                <div className="p-2.5 bg-neutral-100/80 group-hover:bg-white/60 rounded-lg text-brand-gold group-hover:text-[#041627] border border-brand-primary/5 transition-colors">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-sans text-[13px] font-bold text-brand-primary group-hover:text-[#041627] mb-0.5 uppercase tracking-wider transition-colors">
                    Planificación Sucesoria
                  </h4>
                  <p className="font-sans text-[13px] text-neutral-500 group-hover:text-[#041627]/80 leading-snug transition-colors">
                    Asesoramiento preventivo para minimizar conflictos futuros e impuestos.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column Highlights block with metrics */}
          <div className="lg:col-span-5 bg-brand-primary text-white p-10 md:p-12 shadow-2xl relative rounded-sm">
            <div className="absolute right-6 top-6 opacity-5">
              <Award className="w-24 h-24 text-white" />
            </div>
            
            <h3 className="font-display text-2xl md:text-3xl font-semibold mb-6 tracking-wide text-left">
              Excelencia en el Proceso
            </h3>
            
            <p className="font-display text-base md:text-lg font-light text-slate-200 leading-loose text-left mb-12 max-w-md">
              Nuestro estudio se destaca por una gestión transparente y una comunicación constante.
              <br /><br />
              No solo resolvemos expedientes técnicos con maestría, sino que brindamos la contención y tranquilidad que se requiere en procesos sensibles.
            </p>
            
            <div className="grid grid-cols-2 gap-8 border-t border-white/15 pt-8">
              <div>
                <span className="block font-display text-4xl lg:text-5xl font-bold text-brand-gold-light mb-2">
                  <AnimatedNumber value={20} suffix="+" />
                </span>
                <span className="font-sans text-[10px] uppercase tracking-widest text-slate-400 font-bold block">
                  Años de Trayectoria
                </span>
              </div>
              
              <div>
                <span className="block font-display text-4xl lg:text-5xl font-bold text-brand-gold-light mb-2">
                  <AnimatedNumber value={500} suffix="+" />
                </span>
                <span className="font-sans text-[10px] uppercase tracking-widest text-slate-400 font-bold block">
                  Casos Resueltos
                </span>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}

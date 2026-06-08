import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, HeartHandshake, Eye, Award, User } from 'lucide-react';
import profileImg from '../assets/images/majo_foto_CV.png';

export default function Nosotros() {
  const pillars = [
    {
      title: 'Confidencialidad Absoluta',
      desc: 'Protegemos la intimidad y la información sensitiva de su causa bajo riguroso secreto profesional y resguardo digital de primer nivel.',
      icon: ShieldCheck
    },
    {
      title: 'Empatía & Contención',
      desc: 'Comprendemos la profundidad humana de una separación o duelo, brindando acompañamiento humano y calidez en cada paso institucional.',
      icon: HeartHandshake
    },
    {
      title: 'Trasparencia Procesal',
      desc: 'Mantenemos informado al cliente del estado exacto del expediente mediante copias judiciales y notificaciones regulares para que tenga tranquilidad real.',
      icon: Eye
    }
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden" id="nosotros">
      {/* Giant Graphic Typography Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden opacity-[0.015]">
        <span className="font-display font-black text-[35rem] lg:text-[55rem] leading-none tracking-[0.05em] text-[#0a2240] whitespace-nowrap">
          TRAYECTORIA
        </span>
      </div>
      <div className="max-w-[1280px] mx-auto px-6 md:px-16 relative z-10">
        
        {/* About section profile split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Lawyer Photo Profile */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -100px 0px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-4 flex flex-col items-center justify-center text-center space-y-4 pt-4"
          >
            <div className="relative w-56 h-72 md:w-64 md:h-[22rem] rounded-[2rem] overflow-hidden shadow-xl border-4 border-brand-gold-light bg-neutral-100 group">
              <img 
                src={profileImg} 
                alt="Dra. María José Lizaso" 
                className="w-full h-full object-cover object-[center_15%] grayscale opacity-90 contrast-[1.1] transition-transform duration-700 group-hover:scale-105"
              />
              {/* Duotone subtle gold overlay to match the brand */}
              <div className="absolute inset-0 bg-brand-gold/15 mix-blend-color pointer-events-none" />
            </div>
            
            {/* Epigraph / Caption under the photo */}
            <div className="max-w-[240px]">
              <p className="font-display text-[13px] font-bold text-brand-primary uppercase tracking-wider">
                Dra. María José <span className="text-brand-gold">Lizaso</span>
              </p>
              <p className="font-sans text-[11px] text-neutral-500 mt-1 leading-relaxed">
                Fundadora y Directora Especialista en Divorcios y Sucesiones.
              </p>
            </div>
          </motion.div>
          
          {/* Information & Details Column */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -100px 0px" }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="lg:col-span-8 space-y-12 lg:pt-4"
          >
            
            {/* Bio Header */}
            <div className="space-y-6">
              <div className="border-l-0 pl-0">
                <span className="font-sans text-xs uppercase tracking-[0.25em] text-brand-gold font-bold block mb-4">Quién Soy</span>
                <div className="flex items-center gap-4 mb-2">
                  <User className="w-8 h-8 md:w-10 md:h-10 text-brand-gold stroke-[1.5]" />
                  <div className="h-10 w-[1px] bg-brand-gold/30"></div>
                  <h2 className="font-display text-3xl md:text-4xl text-brand-primary leading-none m-0 p-0">
                    <span className="font-light">Dra. María José</span> <span className="font-medium text-brand-gold">Lizaso</span>
                  </h2>
                </div>
                <span className="font-display text-sm text-[#44474c] italic block mt-4">Abogada Titular - Matrícula Abogacía CABA / Prov. Bs. As.</span>
              </div>

              <p className="font-sans text-sm md:text-base text-[#44474c] leading-relaxed text-justify">
                Con más de dos décadas enfocándose de manera exclusiva en litigación civil y mediación, la Dra. María José Lizaso ha consolidado un estudio de vanguardia jurídica. Su labor combina excelencia académica de grado con una profunda convicción ética que prioriza siempre disolver conflictos de manera constructiva, resguardando el acervo sucesorio y el futuro emocional del menor.
              </p>

              <div className="flex gap-4 p-4 bg-neutral-50 rounded border border-brand-primary/5 shadow-sm">
                <div className="p-2 bg-brand-gold-light text-[#0a2240] rounded font-bold h-fit">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="font-sans text-xs font-bold text-brand-primary uppercase tracking-wide">Criterio Académico & Técnico</h5>
                  <p className="font-sans text-[13px] text-neutral-500 leading-relaxed mt-1">Egreso distinguido y formación permanente en posgrados en divorcios y derecho sucesorio notarial.</p>
                </div>
              </div>
            </div>

            {/* Core values block cards */}
            <div>
              <div className="mb-6">
                <h3 className="font-display text-2xl font-bold text-brand-primary">¿Por qué confiar en mi estudio?</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-5">
                {pillars.map((pillar, index) => {
                  const Icon = pillar.icon;
                  return (
                    <div key={index} className="group flex gap-4 items-start p-4 rounded-lg hover:bg-neutral-50 border border-transparent hover:border-brand-primary/5 transition-colors duration-300">
                      <div className="p-3 bg-brand-primary/5 group-hover:bg-brand-gold-light/30 text-brand-gold group-hover:text-brand-primary transition-colors rounded-lg flex-shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-sans text-[13px] font-bold text-brand-primary uppercase tracking-wider mb-1.5">{pillar.title}</h4>
                        <p className="font-sans text-[13px] text-neutral-500 leading-relaxed">{pillar.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}

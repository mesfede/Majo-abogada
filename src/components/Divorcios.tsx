import React from 'react';
import { motion } from 'motion/react';
import { Users, ShieldAlert, Award, Footprints, Handshake, Landmark } from 'lucide-react';

export default function Divorcios() {
  const cards = [
    {
      title: 'Divorcios de Común Acuerdo',
      desc: 'Resolución ágil, pactada y pacífica para transiciones conyugales ordenadas.',
      icon: Handshake
    },
    {
      title: 'Divorcios Contenciosos',
      desc: 'Defensa férrea y comprometida de sus derechos en situaciones difíciles o de conflicto.',
      icon: Landmark
    },
    {
      title: 'Cuidado y Alimentos',
      desc: 'Protección prioritaria e integral del interés superior del menor y régimen de visitas.',
      icon: Footprints
    },
    {
      title: 'División de Bienes',
      desc: 'Liquidación justa, equitativa y transparente del patrimonio de la sociedad conyugal.',
      icon: Users
    }
  ];

  return (
    <section className="relative py-24 bg-neutral-100 overflow-hidden" id="divorcios">
      {/* Background Image with Solid/Pleno Treatment */}
      <div className="absolute inset-0 z-0 bg-neutral-100 select-none">
        <img 
            alt="Family law consultation background" 
            className="w-full h-full object-cover grayscale opacity-10 mix-blend-multiply"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6UiVL-AS6auoT289HfIT3t4twQP9KiepmUJImm_uSQmBDl7aZ7LXZ4B4Ji3NZOTiIe6GkUpcIL-3m8mGMph-20A70FYrXqvVVWDIVl65ZRkae77xfNG1hk0uodTyDN-4vMYyn8bhhIw5HBOTJGgoQEadTXJp2k1iDpga8bpl77Q8ZIdZ-CYCCACWfczyBiuB-NANu5Pc4DJTysxzq65Yut_ecoHeSaLKKDFxwoAqfNU_uzJWIcK8sl_eNvper25KxEW3R9s6AsEw"
            referrerPolicy="no-referrer"
        />
        {/* Uniform solid golden overlay (no gradients) */}
        <div className="absolute inset-0 bg-[#ebd59a] opacity-10 mix-blend-color pointer-events-none" />
      </div>

      <div className="max-w-[1280px] mx-auto px-6 md:px-16 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-12 items-start justify-center">
          
          {/* Detailed text column on the left */}
          <div className="w-full lg:w-5/12 space-y-6 pt-6">
            <div>
              <span className="font-sans text-xs uppercase tracking-[0.25em] text-brand-gold font-bold block mb-3">
                Especialidad de Familia
              </span>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-brand-primary font-bold mb-6">
                Derecho de Familia &amp; Divorcios
              </h2>
              <p className="font-sans text-lg md:text-xl font-light text-neutral-600 leading-[1.8] text-left">
                Abordamos las crisis familiares con una combinación única de empatía humana y firmeza jurídica. Nuestra meta absoluta es lograr acuerdos sostenibles en el tiempo que protejan con esmero el bienestar de los hijos y la integridad de su patrimonio.
              </p>
            </div>
          </div>
          
          {/* 2x2 grid representing categories with interactive highlights */}
          <div className="w-full lg:w-7/12">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
              {cards.map((card, idx) => {
                const Icon = card.icon;
                return (
                  <div 
                    key={idx} 
                    className="group flex flex-col items-start gap-4 p-5 md:p-6 rounded-xl bg-white/80 backdrop-blur-md border border-brand-primary/5 shadow-md hover:shadow-xl hover:bg-[#eddfb6] hover:border-[#ebd59a] hover:-translate-y-1.5 transition-all duration-300 cursor-default"
                  >
                    <div className="p-3 bg-neutral-100/90 group-hover:bg-white/60 rounded-lg text-brand-gold group-hover:text-[#041627] border border-brand-primary/5 transition-all duration-300 shadow-sm group-hover:scale-110 group-hover:shadow-md">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-sans text-[14px] font-bold text-brand-primary group-hover:text-[#041627] uppercase tracking-wider mb-2 transition-colors">
                        {card.title}
                      </h4>
                      <p className="font-sans text-[14px] text-neutral-600 group-hover:text-[#041627]/80 leading-relaxed transition-colors">
                        {card.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}

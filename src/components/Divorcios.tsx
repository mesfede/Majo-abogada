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
    <section className="relative py-24 bg-[#041627] overflow-hidden" id="divorcios">
      {/* Background Image with Ambient Parallax Depth Treatment */}
      <div className="absolute inset-0 z-0 bg-[#041627] select-none overflow-hidden">
        <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat bg-fixed grayscale contrast-[1.08] brightness-[0.80] opacity-90"
            style={{
              backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC6UiVL-AS6auoT289HfIT3t4twQP9KiepmUJImm_uSQmBDl7aZ7LXZ4B4Ji3NZOTiIe6GkUpcIL-3m8mGMph-20A70FYrXqvVVWDIVl65ZRkae77xfNG1hk0uodTyDN-4vMYyn8bhhIw5HBOTJGgoQEadTXJp2k1iDpga8bpl77Q8ZIdZ-CYCCACWfczyBiuB-NANu5Pc4DJTysxzq65Yut_ecoHeSaLKKDFxwoAqfNU_uzJWIcK8sl_eNvper25KxEW3R9s6AsEw')"
            }}
        />
        {/* Softened protection overlays to allow the slide images to shine with high detail */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#041627] via-[#041627]/20 to-[#020e1a]/60 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#041627]/50 via-transparent to-[#041627]/70 pointer-events-none" />
        
        {/* Subtle warm glow highlights matching the gold accent */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-gold/15 rounded-full blur-[120px] mix-blend-overlay pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-brand-gold/20 rounded-full blur-[140px] mix-blend-overlay pointer-events-none" />
      </div>

      <div className="max-w-[1280px] mx-auto px-6 md:px-16 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-12 items-start justify-center">
          
          {/* Detailed text column on the left */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -100px 0px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full lg:w-5/12 space-y-6 pt-6"
          >
            <div>
              <span className="font-sans text-xs uppercase tracking-[0.25em] text-brand-gold-light/90 font-bold block mb-4">
                Especialidad en Divorcios
              </span>
              <div className="flex items-center gap-4 mb-6">
                <Users className="w-8 h-8 md:w-10 md:h-10 text-brand-gold-light stroke-[1.5]" />
                <div className="h-10 w-[1px] bg-brand-gold-light/30"></div>
                <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-white m-0 p-0">
                  <span className="font-medium">Divorcios</span>
                </h2>
              </div>
              <p className="font-sans text-lg md:text-xl font-light text-slate-100 leading-[1.8] text-left">
                Abordamos las crisis conyugales con una combinación única de empatía humana y firmeza jurídica. Nuestra meta absoluta es lograr acuerdos sostenibles en el tiempo que protejan con esmero el bienestar de los hijos y la integridad de su patrimonio.
              </p>
            </div>
          </motion.div>
          
          {/* 2x2 grid representing categories with interactive highlights */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -100px 0px" }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="w-full lg:w-7/12"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
              {cards.map((card, idx) => {
                const Icon = card.icon;
                return (
                  <div 
                    key={idx} 
                    className="group flex flex-col items-start gap-4 p-5 md:p-6 rounded-xl bg-white/[0.03] backdrop-blur-md border border-white/10 shadow-lg hover:bg-brand-gold-light hover:border-brand-gold hover:-translate-y-1.5 transition-all duration-300 cursor-default"
                  >
                    <div className="p-3 bg-white/5 border border-white/10 group-hover:bg-white/95 text-brand-gold-light group-hover:text-[#041627] rounded-lg transition-all duration-300 shadow-sm group-hover:scale-110 group-hover:shadow-md">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-sans text-[14px] font-bold text-brand-gold-light group-hover:text-[#041627] uppercase tracking-wider mb-2 transition-colors">
                        {card.title}
                      </h4>
                      <p className="font-sans text-[14px] text-slate-300 group-hover:text-[#041627]/80 leading-relaxed transition-colors">
                        {card.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}

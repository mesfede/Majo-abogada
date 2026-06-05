import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Calendar, Landmark, Users, Briefcase, User, MessageSquare } from 'lucide-react';

// Require the images statically so Vite correctly bundles them and injects the proper asset URL
import bg1 from '../assets/images/female_desk_signing_1780504974026.png';
import bg2 from '../assets/images/female_consultation_1780504985589.png';
import bg3 from '../assets/images/female_handshake_1780504998812.png';
import logoImg1 from '../assets/images/Majo_logo_01.png';

interface HeroProps {
  onScrollTo: (id: string) => void;
}

const MENU_ITEMS = [
  {
    index: 0,
    tag: "01",
    label: "Sucesiones",
    titleLight: "Derecho",
    titleBold: "Sucesorio",
    desc: "Ofrecemos una gestión jurídica rigurosa de testamentos, declaratorias de herederos y transmisión ordenada de patrimonios familiares con la mayor celeridad técnica. Aseguramos y preservamos con esmero el legado de su familia mediante un acompañamiento humano, cercano y sumamente especializado.",
    image: bg1,
    target: "sucesiones",
    icon: Landmark,
    tagline: "SUCESIONES",
    buttonText: "Conocé más"
  },
  {
    index: 1,
    tag: "02",
    label: "Divorcios",
    titleLight: "Especialista en",
    titleBold: "Divorcios",
    desc: "Acompañamos procesos de mutuo acuerdo y desvinculaciones litigiosas, coordinando convenios reguladores equitativos y un reparto de bienes matrimoniales con estricto amparo legal. Priorizamos mitigar el impacto emocional garantizando siempre la máxima solidez en la defensa estratégica de sus derechos.",
    image: bg2,
    target: "divorcios",
    icon: Users,
    tagline: "DIVORCIOS",
    buttonText: "Ver detalles"
  },
  {
    index: 2,
    tag: "03",
    label: "Especialidades",
    titleLight: "Derecho Civil &",
    titleBold: "Patrimonial",
    desc: "Brindamos asesoramiento integral y redacción estratégica de contratos y convenios para asegurar la máxima solidez de su patrimonio. Trazamos esquemas preventivos de primer nivel que blindan su estabilidad financiera y garantizan su plena paz mental en el largo plazo.",
    image: bg3,
    target: "especialidades",
    icon: Briefcase,
    tagline: "CIVIL & PATRIMONIAL",
    buttonText: "Descubrir áreas"
  },
  {
    index: 3,
    tag: "04",
    label: "Quién Soy",
    titleLight: "Dra. María José",
    titleBold: "Lizaso",
    desc: "Más de dos décadas de impecable excelencia académica, litigación civil activa y mediación de conflictos en el ámbito privado, priorizando siempre soluciones armoniosas y constructivas. Una vocación inquebrantable orientada a brindar respuestas ágiles, seguras y de absoluta confiabilidad.",
    image: bg1,
    target: "nosotros",
    icon: User,
    tagline: "QUIÉN SOY",
    buttonText: "Mi trayectoria"
  },
  {
    index: 4,
    tag: "05",
    label: "Contacto",
    titleLight: "Agendar",
    titleBold: "Consulta",
    desc: "Coordine una sesión presencial en nuestras oficinas o de forma virtual de manera inmediata para recibir un asesoramiento legal del más alto nivel adaptado a su situación. Analizamos cada escenario en detalle para trazar un plan estratégico claro, transparente, altamente protector y eficiente.",
    image: bg3,
    target: "consulta",
    icon: MessageSquare,
    tagline: "CONTACTO",
    buttonText: "Solicitar turno"
  }
];

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1521791136368-1a46827d52bc?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=1200"
];

// Fallback images the slider uses if something goes wrong

export default function Hero({ onScrollTo }: HeroProps) {
  // Active index represents slide visualization synced with user hover, or auto-loop
  const [index, setIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<boolean[]>([false, false, false, false, false]);
  const [isHovered, setIsHovered] = useState(false);
  const autoPlayTimer = useRef<NodeJS.Timeout | null>(null);

  // Auto-play background transition cycle when user is not hovering options
  useEffect(() => {
    if (!isHovered) {
      autoPlayTimer.current = setInterval(() => {
        setIndex((prevIndex) => (prevIndex + 1) % MENU_ITEMS.length);
      }, 17000);
    }
    return () => {
      if (autoPlayTimer.current) clearInterval(autoPlayTimer.current);
    };
  }, [isHovered]);

  const handleMenuHover = (hoveredIndex: number) => {
    setIsHovered(true);
    setIndex(hoveredIndex);
  };

  const handleMenuLeave = () => {
    setIsHovered(false);
  };

  const handleImageError = (imgIdx: number) => {
    setImageErrors((prev) => {
      const updated = [...prev];
      updated[imgIdx] = true;
      return updated;
    });
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-between bg-[#041627] overflow-hidden pt-4 pb-2">
      
      {/* ================= BACKGROUND IMMERSIVE LAYER (FULL SCREEN / ALL HEIGHT & WIDTH) ================= */}
      <div className="absolute inset-0 z-0 bg-[#020e1a] select-none">
        <AnimatePresence>
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 0.80, scale: 1 }} // Increased opacity to 0.80 to give the image much more presence!
            exit={{ opacity: 0, scale: 0.99 }}
            transition={{ duration: 1.4, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
          >
            <img
              src={imageErrors[index] ? FALLBACK_IMAGES[index] : MENU_ITEMS[index].image}
              alt={`Imagen ilustrativa`}
              className="w-full h-full object-cover grayscale contrast-[1.08] brightness-[0.80]"
              onError={() => handleImageError(index)}
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </AnimatePresence>
        
        {/* Softened protection overlays to allow the slide images to shine with high detail */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#041627] via-[#041627]/20 to-[#020e1a]/60 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#041627]/50 via-transparent to-[#041627]/70 pointer-events-none" />
      </div>

      {/* ================= TOP AREA: BRAND BAR HOUSING LOGO (PISANDO EL SLIDE) ================= */}
      <div className="w-full pt-8 pb-3 px-4 md:px-8 container mx-auto max-w-[1240px] relative z-25 flex justify-center sm:justify-between items-start select-none">
        
        {/* Brand logo positioned at the top left, aligned with the main container */}
        <div className="flex items-center justify-center sm:justify-start select-none pt-2 w-full sm:w-auto">
          {/* Applied an advanced CSS filter pipeline + mix-blend-screen to perfectly isolate the logo 
              and hide any fake white/grey checkerboard transparency grids in the image file, 
              rendering it as a solid, crisp white logo embedded directly into the header. */}
          <img 
            src={logoImg1} 
            alt="Dra. María José Lizaso" 
            className="h-[65px] sm:h-[80px] md:h-[95px] w-auto object-contain drop-shadow-md"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Right matriculate registry detail for absolute architectural distinction */}
        <div className="hidden sm:flex items-center gap-2.5 text-right opacity-60">
          <span className="font-mono text-[9px] text-brand-gold-light font-bold tracking-[0.2em] uppercase">REG. MAT. T° VI F° 89</span>
          <span className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
        </div>

      </div>

      {/* ================= MIDDLE WORKSPACE CORE: BALANCED SLIDE-AND-MENU UNIFIED BLOCK ================= */}
      <div className="flex-grow flex items-center justify-center py-4 w-full relative z-20">
        <div className="w-full px-4 md:px-8 container mx-auto max-w-[1240px]">
          
          {/* THE UNIFIED BLOCK: Completely borderless and integrated into the full layout width */}
          <div className="w-full flex flex-col lg:flex-row overflow-hidden relative">

            {/* LEFT AREA: CONCISE ACTIVE SECTION CARD (~75% width on desktop) */}
            <div className="hidden lg:flex w-full lg:w-8/12 lg:pr-12 xl:pr-16 relative flex-col items-start justify-center py-6 pl-0 pr-4 md:pr-8 bg-transparent text-left">

              {/* Little tag indicator */}
              <div className="mb-4 inline-flex items-center gap-2 px-2.5 py-1 bg-brand-gold/10 border border-brand-gold/20 rounded-md">
                <div className="w-1.5 h-1.5 bg-brand-gold rounded-full animate-pulse" />
                <span className="font-sans text-[9px] uppercase tracking-[0.25em] text-brand-gold-light font-bold">
                  {MENU_ITEMS[index].tagline}
                </span>
              </div>

              {/* Title with translate-up entrance motion - smaller, subtle and refined */}
              <div className="min-h-[40px] sm:min-h-[50px] md:min-h-[70px] mb-4 flex items-center justify-start">
                <AnimatePresence mode="wait">
                   <motion.h2
                    key={`title-${index}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4 }}
                    className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-[38px] leading-snug text-white tracking-wide select-none text-left"
                  >
                    <span className="font-light">{MENU_ITEMS[index].titleLight}</span>{' '}
                    <span className="font-semibold text-brand-gold">{MENU_ITEMS[index].titleBold}</span>
                  </motion.h2>
                </AnimatePresence>
              </div>

              {/* Responsive descriptive summary of current section - light, smaller and tasteful */}
              <div className="min-h-[80px] sm:min-h-[64px] md:min-h-[56px] mb-8 w-full max-w-[640px] lg:max-w-[680px]">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={`desc-${index}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, delay: 0.05 }}
                    className="font-sans font-light text-[15px] sm:text-[16px] md:text-[17.5px] lg:text-[18px] text-white/80 leading-relaxed text-left line-clamp-3"
                  >
                    {MENU_ITEMS[index].desc}
                  </motion.p>
                </AnimatePresence>
              </div>

              {/* Interactive prompt trigger button */}
              <motion.div
                key={`btn-${index}`}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="w-fit"
              >
                <button
                  onClick={() => onScrollTo(MENU_ITEMS[index].target)}
                  className="bg-[#f0ece1] text-[#041627] hover:bg-white px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 group transition-all duration-300 cursor-pointer shadow-lg hover:shadow-brand-gold/10 hover:scale-[1.02] active:scale-98 rounded-xl w-auto inline-flex"
                >
                  <span className="font-sans">{MENU_ITEMS[index].buttonText}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-300" />
                </button>
              </motion.div>

              {/* Slider miniature pagination timeline indicators */}
              <div className="flex gap-2 items-center justify-start mt-10 pt-4 border-t border-white/5 select-none w-full max-w-[460px] mr-auto ml-0">
                {MENU_ITEMS.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setIndex(idx)}
                    className={`h-0.5 cursor-pointer transition-all duration-300 ${
                      index === idx ? 'w-8 bg-brand-gold' : 'w-2 bg-white/15'
                    }`}
                    title={`Ver slide ${idx + 1}`}
                  />
                ))}
                
                <span className="text-[9px] text-brand-gold-light/40 font-mono tracking-widest ml-4">
                  0{index + 1} / 0{MENU_ITEMS.length}
                </span>
              </div>

            </div>

            {/* RIGHT AREA: CLEAN MENU SYSTEM WITH SLIGHTLY DIFFERENT TRANSPARENCY (~25% width) */}
            <div className="w-full lg:w-4/12 lg:max-w-[300px] xl:max-w-[320px] lg:ml-auto flex flex-col justify-start bg-[#020d17]/15 relative z-10 py-5 px-3 lg:px-4 rounded-2xl border border-white/[0.04]">
              
              {/* Stack of vertical responsive navigation buttons directly in card flow */}
              <div className="flex flex-col flex-grow justify-center pb-4">
                {MENU_ITEMS.map((item, idx) => {
                  const isActive = index === idx;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.index}
                      onMouseEnter={() => handleMenuHover(item.index)}
                      onMouseLeave={handleMenuLeave}
                      onClick={() => onScrollTo(item.target)}
                      className={`w-full text-left py-4 px-4 transition-all duration-500 flex items-center justify-start border-b border-brand-gold/10 relative group cursor-pointer overflow-hidden rounded-xl ${
                        isActive 
                          ? 'bg-[#041627]/80 text-brand-gold pl-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] border-transparent' 
                          : 'text-slate-300 hover:bg-brand-gold/10 hover:border-transparent hover:text-white hover:pl-5'
                      }`}
                    >
                      {/* Interactive visual subtle glow backdrop */}
                      {isActive && (
                        <div className="absolute inset-0 bg-brand-gold/[0.02] pointer-events-none" />
                      )}

                      <div className="flex items-center gap-3.5">
                        {/* More prominent left icon representing the section instead of numbers */}
                        <div className={`p-1 transition-all duration-300 flex-shrink-0 ${isActive ? 'text-brand-gold-light scale-110' : 'text-slate-500 group-hover:text-brand-gold-light'}`}>
                          <Icon className="w-5 h-5 stroke-[1.5]" />
                        </div>

                        <div className="flex flex-col min-w-0 flex-1">
                          <span className={`font-display text-[15.5px] sm:text-[16px] font-semibold uppercase tracking-[0.12em] ${isActive ? 'text-white' : 'text-slate-200 group-hover:text-white'}`}>
                            {item.label}
                          </span>
                          <span className="font-sans text-[12px] sm:text-[12.5px] text-slate-400 mt-0.5 truncate group-hover:text-slate-300">
                            {item.titleLight} {item.titleBold}
                          </span>
                        </div>
                      </div>

                    </button>
                  );
                })}
              </div>

              {/* Prominent booking action button */}
              <div className="pt-2 pb-2 px-2 flex justify-center bg-transparent mt-auto relative z-30">
                <button
                  onClick={() => onScrollTo('consulta')}
                  className="w-full max-w-[220px] px-4 py-3 bg-brand-gold-light hover:bg-white text-[#041627] text-[12px] md:text-[13px] font-bold uppercase flex items-center justify-center gap-2 transition-all duration-300 font-sans rounded-2xl shadow-xl hover:shadow-brand-gold-light/20 hover:scale-[1.03] active:scale-98 cursor-pointer group"
                >
                  <div className="transition-transform duration-300 ease-out group-hover:scale-110 group-hover:-translate-y-0.5">
                    <Calendar className="w-4 h-4 text-[#041627] stroke-[2.5]" />
                  </div>
                  <span className="whitespace-nowrap">Agendar Consulta</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* ================= BOTTOM AREA: EXPEDIENT SCROLL INDICATOR ================= */}
      <div className="w-full pb-6 pt-2 flex flex-col items-center justify-center select-none relative z-10 opacity-70">
        <span className="font-sans text-[8px] uppercase tracking-[0.3em] text-brand-gold-light/50 mb-1">
          Desplazar Para Explorar
        </span>
        <div className="w-[1px] h-7 bg-gradient-to-b from-brand-gold/50 to-transparent animate-pulse" />
      </div>

    </section>
  );
}

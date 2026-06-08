import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Calendar, Landmark, Users, Briefcase, User, MessageSquare } from 'lucide-react';

// Require the video and logo statically so Vite correctly bundles them and injects the proper asset URLs
import bgVideo from '../assets/images/Abstract_details_architectural_t…_202606071428.mp4';
import bgVideo2 from '../assets/images/Cinematic_black_white_video_scenes_202606071713.mp4';
import logoImg1 from '../assets/images/Majo_logo_pink.png';

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
    target: "consulta",
    icon: MessageSquare,
    tagline: "CONTACTO",
    buttonText: "Solicitar turno"
  }
];

export default function Hero({ onScrollTo }: HeroProps) {
  // Active index represents slide visualization synced with user hover, or auto-loop
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const autoPlayTimer = useRef<NodeJS.Timeout | null>(null);

  const [activeVideo, setActiveVideo] = useState(0);
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);

  // Smooth play/pause management to prevent decoding two high-res video streams simultaneously
  useEffect(() => {
    if (activeVideo === 0) {
      if (video1Ref.current) {
        video1Ref.current.play().catch(() => {});
      }
      const timer = setTimeout(() => {
        if (video2Ref.current) {
          video2Ref.current.pause();
        }
      }, 2000); // Wait for transition fade to complete before pausing the source element
      return () => clearTimeout(timer);
    } else {
      if (video2Ref.current) {
        video2Ref.current.play().catch(() => {});
      }
      const timer = setTimeout(() => {
        if (video1Ref.current) {
          video1Ref.current.pause();
        }
      }, 2000); // Wait for transition fade to complete before pausing the source element
      return () => clearTimeout(timer);
    }
  }, [activeVideo]);

  // Smooth continuous looping of background videos with safe automatic interval cross-fading
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveVideo((prev) => (prev === 0 ? 1 : 0));
    }, 12000); // Seamlessly change slides every 12 seconds
    return () => clearInterval(interval);
  }, []);

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

  return (
    <section className="relative min-h-screen flex flex-col justify-between bg-[#0a2240] overflow-hidden pt-0 pb-2">
      
      {/* ================= BACKGROUND IMMERSIVE LAYER (FULL SCREEN / ALL HEIGHT & WIDTH) ================= */}
      <div className="absolute inset-0 z-0 bg-[#041529] select-none overflow-hidden">
        {/* Immersive background video replacing multiple image slides with custom LUT grading & blur */}
        <video
          ref={video1Ref}
          src={bgVideo}
          muted
          loop
          playsInline
          preload="auto"
          className={`absolute inset-0 w-full h-full object-cover object-center scale-100 grayscale contrast-[1.12] brightness-[0.65] transition-opacity duration-[1800ms] ${activeVideo === 0 ? 'opacity-73' : 'opacity-0'}`}
        />
        <video
          ref={video2Ref}
          src={bgVideo2}
          muted
          loop
          playsInline
          preload="auto"
          className={`absolute inset-0 w-full h-full object-cover object-center scale-100 grayscale contrast-[1.12] brightness-[0.65] transition-opacity duration-[1800ms] ${activeVideo === 1 ? 'opacity-73' : 'opacity-0'}`}
        />
        
        {/* Single hardware-accelerated static backdrop blur filter instead of blurring dynamic video streams frame-by-frame */}
        <div className="absolute inset-0 backdrop-blur-[1.5px] pointer-events-none z-1" />

        {/* Softened protection overlays to allow the slide images to shine with high detail */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a2240] via-[#0a2240]/20 to-[#041529]/50 pointer-events-none z-2" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a2240]/45 via-transparent to-[#0a2240]/65 pointer-events-none z-2" />
        
        {/* Organic white light gradient from the top that integrates with the photo to light up the logo naturally */}
        <div className="absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-white/[0.22] via-white/[0.06] to-transparent pointer-events-none mix-blend-overlay z-2" />
        
        {/* Ambient radial glow to illuminate the background of the slides */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[700px] h-[700px] bg-brand-gold-light/10 rounded-full blur-[140px] pointer-events-none mix-blend-screen z-2" />
      </div>

      {/* ================= TOP AREA: BRAND BAR HOUSING LOGO (PISANDO EL SLIDE CON CORTE DE TRANSPARENCIA CASUAL Y DIFUMINADO) ================= */}
      <div className="w-full bg-gradient-to-b from-white/[0.14] via-white/[0.03] to-transparent py-9 md:py-12 relative z-25 select-none transition-all duration-300">
        <div className="w-full px-4 md:px-8 container mx-auto max-w-[1240px] flex flex-col sm:flex-row justify-between items-center gap-4">
          
          {/* Brand logo positioned at the top left, aligned with the main container - increased size by 15% */}
          <div className="flex items-center justify-center sm:justify-start select-none w-full sm:w-auto">
            <img 
              src={logoImg1} 
              alt="Dra. María José Lizaso" 
              className="h-[46px] sm:h-[58px] md:h-[69px] w-auto object-contain drop-shadow-md hover:scale-[1.01] transition-all duration-300 pointer-events-auto"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Right matriculate registry detail for absolute architectural distinction */}
          <div className="hidden sm:flex items-center gap-2.5 text-right opacity-70">
            <span className="font-mono text-[9px] text-brand-gold-light font-bold tracking-[0.2em] uppercase">REG. MAT. T° VI F° 89</span>
            <span className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
          </div>

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
                  className="bg-brand-gold-light text-[#0a2240] hover:bg-white px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 group transition-all duration-300 cursor-pointer shadow-lg hover:shadow-brand-gold/20 hover:scale-[1.02] active:scale-98 rounded-xl w-auto inline-flex"
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
                      className={`w-full text-left py-4 px-4 transition-all duration-500 flex items-center justify-start border relative group cursor-pointer overflow-hidden rounded-xl ${
                        isActive 
                          ? 'bg-brand-gold-light/15 text-brand-gold border-brand-gold/40 pl-5 shadow-lg' 
                          : 'text-slate-300 border-transparent hover:bg-brand-gold-light/15 hover:border-brand-gold/40 hover:text-white hover:pl-5 bg-white/[0.01] shadow-sm'
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
                  className="w-full max-w-[220px] px-4 py-3 bg-brand-gold-light hover:bg-white text-[#0a2240] text-[12px] md:text-[13px] font-bold uppercase flex items-center justify-center gap-2 transition-all duration-300 font-sans rounded-2xl shadow-xl hover:shadow-brand-gold-light/20 hover:scale-[1.03] active:scale-98 cursor-pointer group"
                >
                  <div className="transition-transform duration-300 ease-out group-hover:scale-110 group-hover:-translate-y-0.5">
                    <Calendar className="w-4 h-4 text-[#0a2240] stroke-[2.5]" />
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

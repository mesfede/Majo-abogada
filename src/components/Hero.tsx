import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Scale, BookOpen } from 'lucide-react';

// Require the images statically so Vite correctly bundles them and injects the proper asset URL
import bg1 from '../assets/images/abstract_justice_bw_1780411545859.png';
import bg2 from '../assets/images/abstract_law_columns_1780413667454.png';
import bg3 from '../assets/images/abstract_law_books_1780413680806.png';

interface HeroProps {
  onScrollTo: (id: string) => void;
}

const BACKGROUND_IMAGES = [
  bg1,
  bg2,
  bg3
];

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=1920",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1920",
  "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=1920"
];

export default function Hero({ onScrollTo }: HeroProps) {
  const [index, setIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<boolean[]>([false, false, false]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % BACKGROUND_IMAGES.length);
    }, 6500);
    return () => clearInterval(interval);
  }, []);

  const handleImageError = (imgIdx: number) => {
    setImageErrors((prev) => {
      const updated = [...prev];
      updated[imgIdx] = true;
      return updated;
    });
  };

  return (
    <section className="relative min-h-[90vh] md:min-h-screen flex items-center bg-[#041627] pt-28 pb-16 overflow-hidden">
      
      {/* ================= BACKGROUND IMAGES SLIDER ================= */}
      <div className="absolute inset-0 z-0 bg-[#041627] select-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.85, scale: 1 }} // Significantly increased opacity for more presence
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 1.8, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
          >
            <img
              src={imageErrors[index] ? FALLBACK_IMAGES[index] : BACKGROUND_IMAGES[index]}
              alt={`Fondo legal e ilustrativo de derecho mª josé lizaso ${index + 1}`}
              className="w-full h-full object-cover grayscale contrast-[1.10] brightness-[1.15]" // Adjusted contrast/brightness for better duotone presence
              onError={() => handleImageError(index)}
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </AnimatePresence>

        {/* Duotone Overlay - this tints the grayscale image to the brand blue */}
        <div className="absolute inset-0 bg-[#041627] mix-blend-color pointer-events-none" />
        
        {/* Edge Vignettes to frame the content but letting the image shine through more */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#041627]/85 via-transparent to-[#041627]/85 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#041627]/90 via-[#041627]/10 to-[#041627]/80 pointer-events-none" />
      </div>

      {/* ================= GRAPHICAL DESIGN ORNAMENTAL PATTERNS ================= */}
      {/* Editorial fine grid or blueprint pattern for structured corporate weight */}
      <div 
        className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay z-0" 
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg stroke='%23eddfb6' stroke-width='1' stroke-opacity='0.4'%3E%3Cpath d='M40 0v80M0 40h80'/%3E%3Ccircle cx='40' cy='40' r='12'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
        }}
      />
      
      {/* Subtle organic elegant paper grain */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none mix-blend-soft-light z-0" 
        style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/natural-paper.png')" }}
      />

      {/* Golden spotlight glows in background corners to draw eye into the center */}
      <div className="absolute top-[-10%] left-[10%] w-[500px] h-[500px] bg-brand-gold/8 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] bg-brand-gold/8 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* ================= CONTENEDOR PRINCIPAL CON INTERFAZ EDITORIAL DE ALTA JERARQUÍA ================= */}
      <div className="max-w-[1280px] mx-auto w-full px-6 md:px-16 relative z-10 py-12 flex justify-center items-center">
        
        {/* Double Gold Outlined Frame wrapping the master text to add outstanding structure ("Filetes de Jerarquía") */}
        <div className="relative w-full max-w-4xl p-8 md:p-14 border border-brand-gold/15 bg-[#031322]/50 backdrop-blur-sm shadow-3xl text-center overflow-hidden">
          
          {/* External visual offsets "Filetes" that break boundaries elegantly */}
          <div className="absolute -inset-2 border border-brand-gold/10 pointer-events-none" />
          
          {/* Classical Law Office Corner Brackets "Esquineros" */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-brand-gold/60" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-brand-gold/60" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-brand-gold/60" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-brand-gold/60" />

          {/* Sutil line spacer inside frame */}
          <div className="flex justify-center items-center gap-4 mb-6">
            <div className="h-[1px] w-12 bg-brand-gold/45" />
            <span className="font-sans text-[10px] uppercase tracking-[0.4em] text-brand-gold/90 font-bold">ESTUDIO JURÍDICO</span>
            <div className="h-[1px] w-12 bg-brand-gold/45" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white font-extrabold tracking-widest uppercase mb-4 leading-tight">
              MARÍA JOSÉ LIZASO
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <h2 className="font-display text-lg sm:text-2xl text-[#eddfb6] italic font-medium tracking-wide mb-8">
              Derecho Sucesorio & Especialista en Divorcios y Familia
            </h2>
          </motion.div>

          {/* Elegant horizontal separator separator */}
          <div className="max-w-xs mx-auto h-[1px] bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent mb-8" />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <p className="font-modern font-light tracking-wide text-[16px] md:text-lg text-slate-200 max-w-2xl mx-auto mb-10 leading-relaxed text-center">
              Excelencia técnica y acompañamiento humano para resolver conflictos familiares y proteger su patrimonio con rigor legal.
            </p>
          </motion.div>

          {/* Actions & Interactive triggers */}
          <motion.div 
            className="flex flex-col sm:flex-row justify-center items-center gap-4 md:gap-6"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <button
              onClick={() => onScrollTo('sucesiones')}
              className="w-full sm:w-auto bg-[#eddfb6] text-[#041627] hover:bg-[#ebd59a] px-8 py-4 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 group transition-all duration-300 cursor-pointer shadow-md hover:shadow-xl hover:scale-[1.02] active:scale-98"
            >
              <Scale className="w-3.5 h-3.5 text-brand-primary" />
              <span>Sucesiones</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </button>
            <button
              onClick={() => onScrollTo('divorcios')}
              className="w-full sm:w-auto border border-white/20 text-white hover:bg-white/5 hover:border-brand-gold px-8 py-4 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer hover:scale-[1.02] active:scale-98"
            >
              <BookOpen className="w-3.5 h-3.5 text-brand-gold-light" />
              <span>Divorcios & Familia</span>
            </button>
          </motion.div>

          {/* Subtle Carousel Dots indicator */}
          <div className="flex justify-center items-center gap-2 mt-12 md:mt-16">
            {BACKGROUND_IMAGES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                  index === idx ? 'w-6 bg-brand-gold' : 'w-1.5 bg-white/20 hover:bg-white/40'
                }`}
                title={`Ver diapositiva ${idx + 1}`}
              />
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}

import React, { useState, useEffect } from 'react';
import { Landmark, Users, Calculator, User } from 'lucide-react';

export default function QuickNav({ onScrollTo }: { onScrollTo: (id: string) => void }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled past roughly the hero section (e.g. 600px)
      if (window.scrollY > 600) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const items = [
    { label: "Sucesiones", id: "sucesiones", icon: Landmark },
    { label: "Divorcios", id: "divorcios", icon: Users },
    { label: "Honorarios", id: "calculadora", icon: Calculator },
    { label: "Quién Soy", id: "nosotros", icon: User }
  ];

  return (
    <div 
      className={`fixed bottom-[96px] right-6 z-40 flex flex-col gap-3 transition-all duration-300 transform origin-bottom border-transparent ${isVisible ? 'scale-100 opacity-100' : 'scale-75 opacity-0 pointer-events-none'}`}
    >
      {items.map((item, idx) => {
        const Icon = item.icon;
        return (
          <button
            key={idx}
            onClick={() => onScrollTo(item.id)}
            className="flex items-center justify-center w-[56px] h-[56px] rounded-full bg-white/80 backdrop-blur-md text-[#0a2240] shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-white/50 hover:bg-brand-gold hover:text-white transition-all duration-300 hover:-translate-x-1 cursor-pointer group relative"
            title={item.label}
          >
            <Icon className="w-6 h-6" />
            <span className="absolute right-[68px] px-3 py-1.5 bg-slate-900 border border-brand-gold/30 text-white text-[10px] font-bold uppercase tracking-wider rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 whitespace-nowrap shadow-xl">
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

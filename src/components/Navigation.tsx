import React, { useState, useEffect } from 'react';
import { Menu, X, Shield, Calendar } from 'lucide-react';

interface NavigationProps {
  onToggleDashboard: () => void;
  showDashboard: boolean;
  onScrollTo: (id: string) => void;
}

export default function Navigation({ onToggleDashboard, showDashboard, onScrollTo }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Sucesiones', target: 'sucesiones' },
    { label: 'Divorcios', target: 'divorcios' },
    { label: 'Especialidades', target: 'especialidades' },
    { label: 'Quién Soy', target: 'nosotros' },
  ];

  const handleNavClick = (target: string) => {
    setIsOpen(false);
    onScrollTo(target);
  };

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 border-b ${isScrolled ? 'bg-[#f5f5f5]/80 backdrop-blur-lg border-brand-primary/10 shadow-sm' : 'bg-[#f5f5f5] border-transparent'}`}>
      <div className={`flex justify-between items-center w-full px-6 md:px-16 max-w-[1280px] mx-auto transition-all duration-500 ${isScrolled ? 'py-[18px]' : 'py-[28px]'}`}>
        
        {/* Brand / Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onScrollTo('top')}>
          <div className="flex flex-col">
            <span className="font-display text-lg md:text-xl font-bold tracking-widest text-[#041627] uppercase">
              MARÍA JOSÉ LIZASO
            </span>
            <span className="text-[10px] uppercase tracking-[0.35em] text-brand-gold font-bold">
              Abogada
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {!showDashboard && navItems.map((item) => (
            <button
              key={item.target}
              onClick={() => handleNavClick(item.target)}
              className="relative group px-4 py-2 rounded-full font-sans text-[12px] uppercase tracking-[0.15em] text-[#041627]/70 border border-transparent hover:text-[#041627] hover:bg-[#041627]/5 hover:border-[#041627]/20 transition-all duration-300 font-bold cursor-pointer"
            >
              {item.label}
            </button>
          ))}
          
          {showDashboard && (
            <button
              onClick={onToggleDashboard}
              className="flex items-center gap-1.5 font-sans text-xs uppercase tracking-wider px-3 py-1.5 rounded-full border bg-[#041627]/10 text-[#041627] border-[#041627]/20 cursor-pointer hover:bg-[#041627] hover:text-white transition-all"
              title="Volver al Sitio Público"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Ver Sitio</span>
            </button>
          )}
        </nav>

        {/* Action Button */}
        <div className="hidden md:flex items-center ml-2 pl-6 border-l border-[#041627]/10">
          <button
            onClick={() => handleNavClick('consulta')}
            className="group relative inline-flex items-center justify-center gap-2.5 px-6 py-2 rounded-full bg-[#eddfb6] text-[#041627] border border-[#ebd59a] hover:bg-[#e4d19e] hover:border-[#dcb56d] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 font-sans text-[12px] font-bold tracking-widest uppercase cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-[#041627] group-hover:scale-110 transition-transform duration-300" />
            <span className="relative z-10 transition-colors duration-300">Agendar Consulta</span>
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-3 md:hidden">
          {showDashboard && (
            <button
              onClick={onToggleDashboard}
              className="p-1.5 rounded text-[#041627] hover:bg-[#041627]/5"
              title="Volver a la Web"
            >
              <Shield className="w-5 h-5" />
            </button>
          )}
          
          <button 
            className="text-brand-primary p-1.5 rounded-sm"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden bg-[#f5f5f5] border-t border-brand-primary/10 py-6 px-6 flex flex-col space-y-4 shadow-lg animate-fade-in">
          {!showDashboard && navItems.map((item) => (
            <button
              key={item.target}
              onClick={() => handleNavClick(item.target)}
              className="text-left py-2 font-sans text-xs uppercase tracking-widest text-[#041627]/80 font-bold border-b border-[#041627]/10 cursor-pointer"
            >
              {item.label}
            </button>
          ))}
          
          {showDashboard && (
            <button
              onClick={() => {
                setIsOpen(false);
                onToggleDashboard();
              }}
              className="flex items-center justify-center gap-2 py-3 bg-[#041627]/10 text-[#041627] border border-[#041627]/20 rounded font-sans text-xs uppercase tracking-widest font-semibold cursor-pointer"
            >
              <Shield className="w-4 h-4" />
              Ver Sitio Público
            </button>
          )}

          <button
            onClick={() => handleNavClick('consulta')}
            className="group flex items-center justify-center gap-2.5 mt-2 py-3.5 rounded-full bg-[#eddfb6] text-[#041627] border border-[#ebd59a] hover:bg-[#e4d19e] hover:border-[#dcb56d] hover:-translate-y-1 hover:shadow-md transition-all duration-300 font-sans text-[12px] font-bold tracking-widest uppercase cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-[#041627] group-hover:scale-110 transition-transform duration-300" />
            Agendar Consulta
          </button>
        </div>
      )}
    </header>
  );
}

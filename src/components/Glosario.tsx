import React, { useState } from 'react';
import { BookOpen, Tag, ChevronDown, X } from 'lucide-react';

const GlosarioItem = ({ term, def }: { term: string, def: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-neutral-100">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-3 text-left focus:outline-none cursor-pointer group"
      >
        <div className="flex items-center gap-2">
          <Tag className={`w-3 h-3 transition-colors ${isOpen ? 'text-brand-gold' : 'text-slate-400 group-hover:text-brand-primary'}`} />
          <span className={`font-sans text-xs font-semibold transition-colors ${isOpen ? 'text-brand-primary' : 'text-slate-700 group-hover:text-brand-primary'}`}>
            {term}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-40 pb-3 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <p className="pl-6 pr-2 text-xs text-slate-500 leading-relaxed font-sans border-l-2 border-brand-gold/20 ml-1.5">
          {def}
        </p>
      </div>
    </div>
  );
};

export default function GlosarioModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  if (!isOpen) return null;

  const definitions = [
    { term: "Acervo Hereditario", def: "Conjunto de bienes, derechos y obligaciones que deja una persona al fallecer y que se transmite a sus herederos." },
    { term: "Causante / De cujus", def: "Persona fallecida cuya herencia se transmite mediante el proceso sucesorio." },
    { term: "Declaratoria de Herederos", def: "Resolución judicial dictada por el juez reconociendo formalmente quiénes son los herederos legítimos del causante." },
    { term: "Tracto Abreviado", def: "Mecanismo registral que permite vender un inmueble directamente a nombre del nuevo comprador durante una sucesión, sin tener que inscribirlo previamente a nombre de los herederos." },
    { term: "Cuidado Personal", def: "Es el término legal actual en Argentina (antes 'tenencia') para referirse a los deberes y derechos de los padres en la vida cotidiana de sus hijos menores de edad." },
    { term: "Derecho de Comunicación", def: "Es el término legal actual (antes 'régimen de visitas') que garantiza el contacto regular entre los hijos y el progenitor con el cual no conviven de forma permanente." },
    { term: "Compensación Económica", def: "Derecho de un cónyuge en caso de divorcio a recibir una suma o renta si el fin del matrimonio le produce un desequilibrio económico manifiesto." },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div 
        className="bg-white rounded shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh] animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 md:p-5 border-b border-neutral-100 bg-neutral-50 relative">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#bd7d8a]"></div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#bd7d8a]" />
            <h3 className="font-display font-bold text-[#bd7d8a] uppercase tracking-widest text-xs md:text-sm">Glosario Legal</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-red-500 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4 md:p-6 overflow-y-auto font-sans bg-white flex flex-col">
          <p className="text-xs text-slate-500 mb-4 bg-slate-50 p-3 rounded border border-neutral-100">
            Conceptos traducidos al lenguaje claro para entender mejor sus trámites.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            <div className="flex flex-col">
              {definitions.slice(0, 4).map((item, idx) => (
                <GlosarioItem key={idx} term={item.term} def={item.def} />
              ))}
            </div>
            <div className="flex flex-col mt-0 md:mt-0">
              {definitions.slice(4).map((item, idx) => (
                <GlosarioItem key={idx} term={item.term} def={item.def} />
              ))}
            </div>
          </div>
        </div>
        
        <div className="p-4 md:p-5 border-t border-neutral-100 bg-neutral-50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-5 py-2 hover:bg-[#bd7d8a] text-[#bd7d8a] hover:text-white border border-[#bd7d8a] text-[10px] font-bold uppercase tracking-wider rounded transition-colors cursor-pointer"
          >
            Cerrar Glosario
          </button>
        </div>
      </div>
    </div>
  );
}

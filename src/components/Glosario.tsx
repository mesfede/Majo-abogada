import React, { useState } from 'react';
import { BookOpen, Tag, ChevronDown } from 'lucide-react';

const GlosarioItem = ({ term, def }: { term: string, def: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-neutral-200">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-5 text-left focus:outline-none cursor-pointer group"
      >
        <div className="flex items-center gap-3">
          <Tag className={`w-4 h-4 transition-colors ${isOpen ? 'text-brand-gold' : 'text-slate-400 group-hover:text-brand-primary'}`} />
          <span className={`font-sans text-sm md:text-base font-semibold transition-colors ${isOpen ? 'text-brand-primary' : 'text-slate-700 group-hover:text-brand-primary'}`}>
            {term}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-40 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <p className="pl-7 pr-4 text-sm text-slate-500 leading-relaxed font-sans border-l-2 border-brand-gold/20 ml-2">
          {def}
        </p>
      </div>
    </div>
  );
};

export default function Glosario() {
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
    <section className="py-20 md:py-28 bg-[#f9f9f9]">
      <div className="max-w-[1000px] mx-auto px-6 md:px-16">
        
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white text-slate-600 border border-neutral-200 uppercase tracking-widest text-[10px] font-bold rounded mb-4 shadow-sm">
            <BookOpen className="w-3.5 h-3.5 text-brand-gold" />
            Lenguaje Claro
          </div>
          <h2 className="font-display text-4xl font-bold tracking-tight text-slate-900 mb-4">
            Glosario Legal
          </h2>
          <p className="text-slate-600 font-sans max-w-2xl mx-auto">
            Traduciendo los términos complejos del derecho para brindarle máxima claridad sobre su situación.
          </p>
        </div>

        <div className="bg-white rounded p-6 md:p-10 shadow-xl shadow-slate-200/50 border border-neutral-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
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
        
      </div>
    </section>
  );
}

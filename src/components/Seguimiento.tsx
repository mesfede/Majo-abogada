import React, { useState } from 'react';
import { Search, MapPin, CheckCircle, Clock, SearchX, Activity } from 'lucide-react';

export default function Seguimiento() {
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    setSearched(false);
    
    // Simulate network
    setTimeout(() => {
      setLoading(false);
      setSearched(true);
    }, 1200);
  };

  return (
    <section className="py-20 md:py-24 bg-white border-t border-b border-neutral-100">
      <div className="max-w-[1280px] mx-auto px-6 md:px-16">
        
        <div className="grid md:grid-cols-5 gap-12 items-start">
          
          <div className="md:col-span-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-50 text-brand-primary border border-neutral-200 uppercase tracking-widest text-[10px] font-bold rounded mb-4">
              <Activity className="w-3.5 h-3.5" />
              Portal de Clientes
            </div>
            
            <h2 className="font-display text-4xl font-bold tracking-tight text-slate-900 mb-4">
              Mi Expediente
            </h2>
            <p className="text-slate-600 font-sans text-sm leading-relaxed mb-8">
              Mantenemos absoluta transparencia. Si usted ya es cliente del estudio, puede hacer un seguimiento simulado del estado de su caso sin moverse de su casa.
            </p>
            
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Ingrese su DNI o N° de Expediente..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-neutral-50 text-slate-900 font-sans text-sm p-4 pr-12 border border-neutral-200 rounded focus:border-brand-primary focus:bg-white focus:ring-1 focus:ring-brand-primary/20 transition-all outline-none"
              />
              <button 
                type="submit"
                disabled={loading}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-brand-primary text-white rounded hover:bg-brand-gold transition-colors cursor-pointer disabled:opacity-50"
              >
                {loading ? <Activity className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              </button>
            </form>
            <p className="text-[10px] text-slate-400 mt-2">
              (Esta es una herramienta de demostración técnica. En un entorno real se conectaría a la base judicial o al CRM.)
            </p>
          </div>

          <div className="md:col-span-3 bg-neutral-50 border border-neutral-200 rounded p-8 min-h-[300px]">
            {!searched && !loading && (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <MapPin className="w-8 h-8 mb-4 opacity-50" />
                <p className="text-sm font-sans tracking-wide text-center max-w-sm">
                  Ingrese un número en el buscador para visualizar el historial de avances de su trámite.
                </p>
              </div>
            )}

            {loading && (
              <div className="h-full flex flex-col items-center justify-center text-brand-gold">
                <Activity className="w-8 h-8 mb-4 animate-spin" />
                <p className="text-sm font-sans tracking-wide text-center uppercase font-bold animate-pulse">
                  Buscando registros...
                </p>
              </div>
            )}

            {searched && (
              <div className="animate-fade-in relative pl-4 border-l-2 border-brand-gold/30 space-y-8">
                
                <div className="relative">
                  <div className="absolute -left-[26px] top-1 bg-white border border-brand-gold rounded-full p-1 shadow-sm">
                    <CheckCircle className="w-3 h-3 text-brand-gold" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800">Radicación en Juzgado Civil</h4>
                  <p className="text-xs text-slate-500 mt-1">Expte N° 12345/2026 - Juzgado Civil y Comercial N° 5.</p>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold mt-2 block">24 Mayo 2026</span>
                </div>

                <div className="relative">
                  <div className="absolute -left-[26px] top-1 bg-white border border-brand-gold rounded-full p-1 shadow-sm">
                    <CheckCircle className="w-3 h-3 text-brand-gold" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800">Publicación de Edictos</h4>
                  <p className="text-xs text-slate-500 mt-1">Cumplimiento de la publicación en Boletín Oficial finalizada.</p>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold mt-2 block">03 Junio 2026</span>
                </div>

                <div className="relative">
                  <div className="absolute -left-[26px] top-1 bg-brand-primary border-2 border-white rounded-full p-1 shadow-md">
                    <Clock className="w-3 h-3 text-white" />
                  </div>
                  <h4 className="text-sm font-bold text-brand-primary">Aguardando Declaratoria</h4>
                  <p className="text-xs text-slate-500 mt-1">El expediente se encuentra a despacho para dictar resolución judicial (Declaratoria de Herederos).</p>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-primary mt-2 block">Estado Actual</span>
                </div>
                
              </div>
            )}
          </div>
          
        </div>
      </div>
    </section>
  );
}

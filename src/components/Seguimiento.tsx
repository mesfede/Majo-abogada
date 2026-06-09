import React, { useState } from 'react';
import { Search, MapPin, CheckCircle, Clock, SearchX, Activity, FileText } from 'lucide-react';
import expedientesData from '../data/expedientes.json';

interface Paso {
  titulo: string;
  descripcion: string;
  fecha: string;
  estado: "completado" | "pendiente";
}

interface Expediente {
  idBusqueda: string;
  tituloBase: string;
  juzgado: string;
  pasos: Paso[];
}

export default function Seguimiento() {
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<Expediente | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    setSearched(false);
    setResultado(null);
    
    // Simular el retraso de una consulta interna
    setTimeout(() => {
      // First try to load from localStorage to sync with the protected Admin Area
      let currentData = expedientesData;
      try {
        const localData = localStorage.getItem('majolaw_expedientes');
        if (localData) {
          currentData = JSON.parse(localData);
        }
      } catch (e) {
        // Fallback to static JSON
      }

      const match = currentData.find(ex => 
        ex.idBusqueda.toLowerCase() === query.trim().toLowerCase()
      );
      setResultado(match || null);
      setLoading(false);
      setSearched(true);
    }, 1200);
  };

  return (
    <section id="seguimiento" className="py-20 md:py-24 bg-white border-t border-b border-neutral-100">
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
              Mantenemos absoluta transparencia. Si usted ya es cliente del estudio, puede hacer un seguimiento de los avances de su caso. Ingrese el DNI o ID provisto por la abogada.
            </p>
            
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Ejemplo: 12345678 o EXP-2026..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-neutral-50 text-slate-900 font-sans text-sm p-4 pr-12 border border-neutral-200 rounded focus:border-brand-primary focus:bg-white focus:ring-1 focus:ring-brand-primary/20 transition-all outline-none uppercase"
              />
              <button 
                type="submit"
                disabled={loading}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-brand-primary text-white rounded hover:bg-[#bd7d8a] transition-colors cursor-pointer disabled:opacity-50"
              >
                {loading ? <Activity className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              </button>
            </form>
            <p className="text-[10px] text-slate-400 mt-4 leading-relaxed">
              <strong>Mecanismo de actualización:</strong> Esta información es actualizada internamente. Las novedades judiciales se sincronizan periódicamente en este portal con un resumen en lenguaje claro para su mayor tranquilidad.
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
              <div className="h-full flex flex-col items-center justify-center text-[#bd7d8a]">
                <Activity className="w-8 h-8 mb-4 animate-spin" />
                <p className="text-sm font-sans tracking-wide text-center uppercase font-bold animate-pulse">
                  Consultando registros internos...
                </p>
              </div>
            )}

            {searched && resultado && (
              <div className="animate-fade-in relative space-y-6">
                
                <div className="pb-4 mb-4 border-b border-neutral-200 flex items-center justify-between">
                  <div>
                    <h3 className="font-display font-bold text-xl text-brand-primary">{resultado.tituloBase}</h3>
                    <p className="text-xs text-slate-500 font-sans mt-1 flex items-center gap-1">
                      <FileText className="w-3 h-3" /> Radicado en: {resultado.juzgado}
                    </p>
                  </div>
                </div>

                <div className="relative pl-4 border-l-2 border-[#bd7d8a]/30 space-y-8">
                  {resultado.pasos.map((paso, idx) => (
                    <div key={idx} className="relative">
                      {paso.estado === 'completado' ? (
                        <div className="absolute -left-[26px] top-1 bg-white border border-[#bd7d8a] rounded-full p-1 shadow-sm">
                          <CheckCircle className="w-3 h-3 text-[#bd7d8a]" />
                        </div>
                      ) : (
                        <div className="absolute -left-[26px] top-1 bg-brand-primary border-2 border-white rounded-full p-1 shadow-md">
                          <Clock className="w-3 h-3 text-white" />
                        </div>
                      )}
                      
                      <h4 className={`text-sm font-bold ${paso.estado === 'completado' ? 'text-slate-800' : 'text-brand-primary'}`}>
                        {paso.titulo}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{paso.descripcion}</p>
                      <span className={`text-[10px] font-bold uppercase tracking-wider mt-2 block ${paso.estado === 'completado' ? 'text-[#bd7d8a]' : 'text-brand-primary'}`}>
                        {paso.fecha}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {searched && !resultado && (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 animate-fade-in">
                <SearchX className="w-8 h-8 mb-4 opacity-50" />
                <p className="text-sm font-sans tracking-wide text-center max-w-sm">
                  No se encontraron expedientes activos vinculados al identificador ingresado. Por favor, verifique el número e intente nuevamente.
                </p>
              </div>
            )}

          </div>
          
        </div>
      </div>
    </section>
  );
}

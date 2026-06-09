import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Edit3, CheckCircle, Clock, ChevronDown, ChevronUp, FileText } from 'lucide-react';
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

export default function ExpedientesManager() {
  const [expedientes, setExpedientes] = useState<Expediente[]>([]);
  const [selectedExpediente, setSelectedExpediente] = useState<Expediente | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Load data
  useEffect(() => {
    const localData = localStorage.getItem('majolaw_expedientes');
    if (localData) {
      try {
        setExpedientes(JSON.parse(localData));
      } catch (e) {
        setExpedientes(expedientesData as Expediente[]);
      }
    } else {
      setExpedientes(expedientesData as Expediente[]);
    }
  }, []);

  const saveToLocal = (newExpedientes: Expediente[]) => {
    localStorage.setItem('majolaw_expedientes', JSON.stringify(newExpedientes));
    setExpedientes(newExpedientes);
  };

  const handleAddNew = () => {
    const newExp: Expediente = {
      idBusqueda: '',
      tituloBase: 'Nuevo Expediente',
      juzgado: '',
      pasos: []
    };
    setSelectedExpediente(newExp);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!selectedExpediente) return;
    
    // Validate
    if (!selectedExpediente.idBusqueda.trim()) {
      alert("El ID de Búsqueda es obligatorio.");
      return;
    }

    let nextExpedientes = [...expedientes];
    const existIndex = nextExpedientes.findIndex(e => e.idBusqueda === selectedExpediente.idBusqueda);
    
    if (existIndex >= 0) {
      nextExpedientes[existIndex] = selectedExpediente;
    } else {
      nextExpedientes.push(selectedExpediente);
    }
    
    saveToLocal(nextExpedientes);
    setIsEditing(false);
  };

  const handleDelete = (idBusqueda: string) => {
    if (confirm("¿Seguro que desea eliminar este expediente?")) {
      const nextExp = expedientes.filter(e => e.idBusqueda !== idBusqueda);
      saveToLocal(nextExp);
      if (selectedExpediente?.idBusqueda === idBusqueda) {
        setSelectedExpediente(null);
        setIsEditing(false);
      }
    }
  };

  const handleAddPaso = () => {
    if (!selectedExpediente) return;
    setSelectedExpediente({
      ...selectedExpediente,
      pasos: [
        ...selectedExpediente.pasos,
        { titulo: 'Nuevo Paso', descripcion: '', fecha: '', estado: 'pendiente' }
      ]
    });
  };

  const handleUpdatePaso = (index: number, updatedPaso: Paso) => {
    if (!selectedExpediente) return;
    const newPasos = [...selectedExpediente.pasos];
    newPasos[index] = updatedPaso;
    setSelectedExpediente({ ...selectedExpediente, pasos: newPasos });
  };

  const handleRemovePaso = (index: number) => {
    if (!selectedExpediente) return;
    const newPasos = selectedExpediente.pasos.filter((_, i) => i !== index);
    setSelectedExpediente({ ...selectedExpediente, pasos: newPasos });
  };

  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* Panel Izquierdo: Lista de Expedientes */}
      <div className="lg:col-span-4 xl:col-span-3 border border-neutral-200 rounded bg-white max-h-[640px] overflow-y-auto flex flex-col shadow-sm">
        <div className="p-4 border-b border-neutral-100 bg-neutral-50 flex justify-between items-center sticky top-0 z-10">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Expedientes Activos</span>
          <button 
            onClick={handleAddNew}
            className="flex items-center gap-1 bg-brand-primary text-white px-2 py-1 rounded text-[10px] uppercase font-bold hover:bg-[#bd7d8a] transition-colors"
          >
            <Plus className="w-3 h-3" /> Nuevo
          </button>
        </div>
        <div className="divide-y divide-neutral-100 flex-grow">
          {expedientes.length === 0 ? (
            <div className="p-6 text-center text-slate-500 text-xs">No hay expedientes cargados.</div>
          ) : (
            expedientes.map((exp) => (
              <div
                key={exp.idBusqueda}
                onClick={() => {
                  setSelectedExpediente(exp);
                  setIsEditing(false);
                }}
                className={`p-4 transition-all hover:bg-neutral-50 cursor-pointer relative flex flex-col gap-1 ${
                  selectedExpediente?.idBusqueda === exp.idBusqueda ? 'bg-neutral-50 border-l-4 border-[#bd7d8a]' : 'border-l-4 border-transparent'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-slate-800 break-words">{exp.tituloBase}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">ID: {exp.idBusqueda}</span>
                <span className="text-[10px] text-slate-600 truncate">{exp.juzgado}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Panel Derecho: Edición de Expediente */}
      <div className="lg:col-span-8 xl:col-span-9 flex flex-col bg-white shadow-sm border border-neutral-200 rounded p-6">
        {selectedExpediente ? (
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-neutral-100">
              <h2 className="font-display text-xl font-bold text-slate-800 tracking-widest uppercase">
                {isEditing ? 'Detalles del Expediente (Edición)' : 'Detalles del Expediente'}
              </h2>
              <div className="flex gap-2">
                {!isEditing ? (
                  <>
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="px-3 py-1.5 bg-neutral-100 text-slate-700 text-[10px] font-bold uppercase rounded flex items-center gap-1 hover:bg-neutral-200 transition-colors border border-neutral-200"
                    >
                      <Edit3 className="w-3 h-3" /> Editar
                    </button>
                    <button 
                      onClick={() => handleDelete(selectedExpediente.idBusqueda)}
                      className="px-3 py-1.5 bg-red-50 text-red-600 text-[10px] font-bold uppercase rounded flex items-center gap-1 hover:bg-red-100 transition-colors border border-red-100"
                    >
                      <Trash2 className="w-3 h-3" /> Eliminar
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={handleSave}
                    className="px-4 py-1.5 bg-[#bd7d8a] text-white text-[10px] font-bold uppercase rounded flex items-center gap-1 hover:bg-[#a66a77] transition-colors"
                  >
                    <Save className="w-3 h-3" /> Guardar Cambios
                  </button>
                )}
              </div>
            </div>

            <div className="flex-grow overflow-y-auto pr-2 space-y-6">
              {/* Información General */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">ID o DNI de Búsqueda (Único)</label>
                  <input 
                    type="text" 
                    value={selectedExpediente.idBusqueda}
                    onChange={e => setSelectedExpediente({...selectedExpediente, idBusqueda: e.target.value})}
                    disabled={!isEditing}
                    placeholder="Ej. 12345678 o EXP-2026"
                    className="w-full bg-white border border-neutral-300 rounded p-2 text-xs text-slate-800 disabled:bg-neutral-50 disabled:text-slate-500 outline-none focus:border-[#bd7d8a] focus:ring-1 focus:ring-[#bd7d8a]/20"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Título Base</label>
                  <input 
                    type="text" 
                    value={selectedExpediente.tituloBase}
                    onChange={e => setSelectedExpediente({...selectedExpediente, tituloBase: e.target.value})}
                    disabled={!isEditing}
                    placeholder="Ej. Sucesión Ab intestato"
                    className="w-full bg-white border border-neutral-300 rounded p-2 text-xs text-slate-800 disabled:bg-neutral-50 disabled:text-slate-500 outline-none focus:border-[#bd7d8a] focus:ring-1 focus:ring-[#bd7d8a]/20"
                  />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Radicación (Juzgado)</label>
                  <input 
                    type="text" 
                    value={selectedExpediente.juzgado}
                    onChange={e => setSelectedExpediente({...selectedExpediente, juzgado: e.target.value})}
                    disabled={!isEditing}
                    placeholder="Ej. Juzgado Civil y Comercial N° 5"
                    className="w-full bg-white border border-neutral-300 rounded p-2 text-xs text-slate-800 disabled:bg-neutral-50 disabled:text-slate-500 outline-none focus:border-[#bd7d8a] focus:ring-1 focus:ring-[#bd7d8a]/20"
                  />
                </div>
              </div>

              {/* Trazabilidad (Pasos) */}
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-neutral-100 pb-2">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#bd7d8a]" />
                    Hoja de Ruta / Avances
                  </span>
                  {isEditing && (
                    <button 
                      onClick={handleAddPaso}
                      className="px-2 py-1 bg-neutral-100 text-slate-600 text-[10px] border border-neutral-200 rounded uppercase font-bold hover:bg-neutral-200 transition"
                    >
                      + Añadir Paso
                    </button>
                  )}
                </div>

                <div className="space-y-3 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-neutral-300 before:to-transparent">
                  {selectedExpediente.pasos.map((paso, idx) => (
                    <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active border border-neutral-200 bg-neutral-50/50 p-4 rounded-lg shadow-sm">
                      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {isEditing && (
                          <button onClick={() => handleRemovePaso(idx)} className="text-red-400 hover:text-red-600">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>

                      <div className="flex-1 w-full flex flex-col gap-2">
                        <div className="flex gap-2 items-center">
                          <select 
                            value={paso.estado}
                            disabled={!isEditing}
                            onChange={(e) => handleUpdatePaso(idx, {...paso, estado: e.target.value as "completado" | "pendiente"})}
                            className={`text-[9px] font-bold uppercase rounded px-2 py-1 outline-none disabled:opacity-80 ${
                              paso.estado === 'completado' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-amber-100 text-amber-700 border border-amber-200'
                            }`}
                          >
                            <option value="completado">Completado</option>
                            <option value="pendiente">Pendiente / Actual</option>
                          </select>
                          <input 
                            type="text" 
                            value={paso.fecha}
                            onChange={(e) => handleUpdatePaso(idx, {...paso, fecha: e.target.value})}
                            disabled={!isEditing}
                            placeholder="Fecha o Referencia (ej. 24 Mayo 2026)"
                            className="bg-transparent border-b border-neutral-300 text-[10px] text-slate-500 font-medium outline-none flex-1 max-w-[150px] focus:border-[#bd7d8a] disabled:opacity-60"
                          />
                        </div>
                        <input 
                          type="text" 
                          value={paso.titulo}
                          onChange={(e) => handleUpdatePaso(idx, {...paso, titulo: e.target.value})}
                          disabled={!isEditing}
                          placeholder="Título del paso"
                          className="bg-transparent border-none text-sm font-bold text-slate-800 outline-none w-full disabled:opacity-80"
                        />
                        <textarea 
                          value={paso.descripcion}
                          onChange={(e) => handleUpdatePaso(idx, {...paso, descripcion: e.target.value})}
                          disabled={!isEditing}
                          placeholder="Descripción breve de lo sucedido..."
                          rows={2}
                          className="bg-white border border-neutral-300 rounded p-2 text-xs text-slate-600 outline-none w-full disabled:bg-transparent disabled:border-transparent disabled:opacity-80 disabled:px-0 resize-none focus:border-[#bd7d8a]"
                        />
                      </div>
                    </div>
                  ))}
                  {selectedExpediente.pasos.length === 0 && (
                    <p className="text-xs text-slate-400 italic text-center py-4">Sin registro de movimientos. Añada un paso para comenzar.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4">
            <FileText className="w-12 h-12 opacity-30" />
            <p className="text-sm font-semibold">Seleccione un expediente de la lista para ver o editar sus detalles</p>
          </div>
        )}
      </div>
    </div>
  );
}

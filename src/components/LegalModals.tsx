import React from 'react';
import { X } from 'lucide-react';

export type LegalDocType = 'aviso' | 'privacidad' | 'terminos' | null;

interface LegalModalsProps {
  isOpen: LegalDocType;
  onClose: () => void;
}

export default function LegalModals({ isOpen, onClose }: LegalModalsProps) {
  if (!isOpen) return null;

  const content = {
    aviso: {
      title: "Aviso Legal",
      text: (
        <>
          <p><strong>1. Datos Identificativos:</strong> El presente aviso legal regula el uso del sitio web de María José Lizaso - Abogada. El acceso y navegación por este sitio implica la aceptación de estas condiciones.</p>
          <p><strong>2. Propiedad Intelectual:</strong> Todos los contenidos, textos, imágenes y logotipos son propiedad de María José Lizaso, estando protegidos por la normativa de propiedad intelectual e industrial.</p>
          <p><strong>3. Responsabilidad:</strong> La información proporcionada en este sitio web tiene carácter orientativo y no constituye asesoramiento legal personalizado. Para una consulta legal profesional, es necesario contactar y contratar formalmente nuestros servicios.</p>
          <p><strong>4. Jurisdicción:</strong> Para la resolución de todas las controversias relacionadas con este sitio web, será de aplicación la legislación argentina, sometiéndose a los Juzgados y Tribunales competentes.</p>
        </>
      )
    },
    privacidad: {
      title: "Política de Privacidad",
      text: (
        <>
          <p><strong>1. Protección de Datos:</strong> Su privacidad es de suma importancia. Los datos personales que nos proporcione a través de los formularios o por correo electrónico serán tratados con estricta confidencialidad bajo el secreto profesional.</p>
          <p><strong>2. Finalidad:</strong> Recabamos sus datos exclusivamente para gestionar sus consultas legales, brindarle asesoramiento adecuado y contactarlo en relación a los servicios solicitados.</p>
          <p><strong>3. Retención de Datos:</strong> Conservaremos sus datos personales durante el tiempo necesario para la resolución de su caso y en resguardo de nuestras obligaciones profesionales, salvo que solicite su eliminación.</p>
          <p><strong>4. Derechos de Usuarios:</strong> Usted puede ejercer sus derechos de acceso, rectificación, cancelación u oposición contactándonos a través de los medios oficiales informados en esta página.</p>
        </>
      )
    },
    terminos: {
      title: "Términos de Servicio",
      text: (
        <>
          <p><strong>1. Objeto del Servicio:</strong> Ofrecemos servicios de representación, mediación y asesoría legal en Argentina, enfocados en derecho de familia y sucesiones. El sitio web es un canal inicial de información e intermediación.</p>
          <p><strong>2. Consultas y Honorarios:</strong> El costo de las consultas y procesos se rige por las Leyes de Honorarios Profesionales de cada jurisdicción correspondiente. Todo monto final será debidamente presupuestado y consentido por el cliente mediante acuerdo previo de honorarios de inicio.</p>
          <p><strong>3. Limitación de Vínculo:</strong> El envío de un mensaje a través del formulario web o la interacción con el asistente de IA no constituyen de forma automática una relación de "Abogado-Cliente". Dicho vínculo se perfecciona únicamente al firmar el convenio respectivo.</p>
          <p><strong>4. Modificaciones:</strong> Nos reservamos el derecho de modificar estos términos para adaptarnos a novedades legislativas, variaciones jurisprudenciales o modificaciones operativas en la prestación de servicios.</p>
        </>
      )
    }
  };

  const { title, text } = content[isOpen];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white rounded shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[85vh] animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 md:p-5 border-b border-neutral-100 bg-neutral-50 relative">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-gold"></div>
          <h3 className="font-display font-bold text-brand-primary uppercase tracking-widest text-xs md:text-sm">{title}</h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-red-500 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-5 md:p-7 overflow-y-auto font-sans text-xs md:text-sm text-slate-600 space-y-4 md:space-y-5 leading-relaxed bg-white">
          {text}
        </div>
        
        <div className="p-4 md:p-5 border-t border-neutral-100 bg-neutral-50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 bg-brand-primary text-white text-xs font-bold uppercase tracking-wider rounded hover:bg-brand-gold transition-colors shadow-sm cursor-pointer"
          >
            Aceptar y Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

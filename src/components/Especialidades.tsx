import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Handshake, ShieldAlert, CheckCircle2, Briefcase, MapPin, Building, Globe, Scale } from 'lucide-react';

export default function Especialidades() {
  const secondarySpecialties = [
    {
      title: 'Derecho Civil & Obligaciones',
      desc: 'Redacción, negociación y litigio de contratos civiles complejos, reclamos por daños y perjuicios, y regularización de dominios inmobiliarios.',
      icon: BookOpen
    },
    {
      title: 'Mediaciones Prejudiciales (CABA y Bs. As.)',
      desc: 'Asesoramiento riguroso y patrocinio letrado en audiencias de mediación prejudicial obligatoria, buscando acuerdos ágiles sin llegar a juicio.',
      icon: Handshake
    },
    {
      title: 'Defensa de Derechos de Familia y Conyugales',
      desc: 'Medidas cautelares urgentes, fijación y aumento de cuota alimentaria, convenios de coparentalidad y división de bienes matrimoniales.',
      icon: ShieldAlert
    }
  ];

  const faqs = [
    {
      q: '¿Qué documentación se necesita para iniciar una sucesión con una abogada?',
      a: 'Para comenzar el juicio sucesorio se requiere: partida de defunción original del causante, partidas de nacimiento de los hijos (o de matrimonio del cónyuge supérstite) que acrediten el parentesco, y títulos o escrituras de los bienes a transmitir. Si falta alguna partida, nuestra abogada puede tramitarla ante el Registro Civil.'
    },
    {
      q: '¿Cuánto demora el trámite hasta obtener la Declaratoria de Herederos?',
      a: 'En sucesiones ab-intestato (sin testamento) en los tribunales de CABA o Provincia de Buenos Aires, la Declaratoria de Herederos suele obtenerse entre 3 y 6 meses, dependiendo de los tiempos del juzgado. Luego se procede a la inscripción de los bienes o tracto abreviado para venta directa.'
    },
    {
      q: '¿Cómo se inicia un divorcio unilateral si la otra parte no está de acuerdo?',
      a: 'Desde la sanción del Código Civil y Comercial, cualquier cónyuge puede solicitar el divorcio de manera individual (unilateral) sin necesidad de justificar causas ni de contar con el consentimiento del otro. Nuestra abogada presenta la demanda junto a una propuesta de convenio regulador.'
    },
    {
      q: '¿Cómo se fijan la cuota alimentaria y el régimen de comunicación con los hijos?',
      a: 'La cuota de alimentos se calcula en función de las necesidades de los hijos y la capacidad económica de ambos progenitores. Siempre promovemos un convenio regulador consensuado; si no hay acuerdo, se litiga judicialmente con medidas cautelares provisorias.'
    },
    {
      q: '¿Cómo se abonan los honorarios de la abogada en sucesiones y divorcios?',
      a: 'Los honorarios se establecen con absoluta claridad y transparencia desde la primera consulta, conforme a las leyes arancelarias vigentes en CABA (Ley 5134) y Provincia de Buenos Aires (Ley 14967), con opciones de pago en cuotas y etapas procesales.'
    },
    {
      q: '¿La abogada atiende de manera virtual o presencial?',
      a: 'Brindamos ambas modalidades: consultas presenciales en estudio con cita previa y asesoramiento legal online vía videollamada para clientes de todo el país o radicados en el exterior con bienes en Argentina.'
    }
  ];

  const locations = [
    { name: 'CABA (Capital Federal)', detail: 'Fueros Civiles y de Familia de Tribunales, Recoleta, Palermo, Belgrano, Caballito y Microcentro.' },
    { name: 'Provincia de Buenos Aires', detail: 'Departamentos Judiciales de San Isidro, Vicente López, San Martín, Morón, Lomas de Zamora, Quilmes y La Plata.' },
    { name: 'Atención Federal y Online', detail: 'Consultas jurídicas virtuales por videollamada y gestión digital para herederos en el interior y exterior.' }
  ];

  return (
    <section className="py-24 bg-neutral-100 relative overflow-hidden" id="especialidades">
      {/* Giant Graphic Typography Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden opacity-[0.015]">
        <span className="font-display font-black text-[35rem] lg:text-[55rem] leading-none tracking-[0.05em] text-[#0a2240] whitespace-nowrap">
          ESPECIALIDADES
        </span>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 md:px-16 relative z-10">
        
        {/* Superior part layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Secondary specialties cards Column */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -100px 0px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <div>
              <span className="font-sans text-xs uppercase tracking-[0.25em] text-brand-gold font-bold block mb-4">
                Estudio Jurídico &middot; Áreas de Práctica
              </span>
              <div className="flex items-center gap-4 mb-6">
                <Briefcase className="w-8 h-8 md:w-10 md:h-10 text-brand-gold stroke-[1.5]" />
                <div className="h-10 w-[1px] bg-brand-gold/30"></div>
                <h2 className="font-display text-3xl md:text-3xl lg:text-4xl text-brand-primary m-0 p-0 leading-none">
                  <span className="font-light">Servicios</span> <span className="font-medium">Jurídicos</span>
                </h2>
              </div>
              <p className="font-sans text-sm md:text-base text-[#44474c] leading-relaxed">
                Brindamos un asesoramiento global en materia de derecho civil, sucesorio y familiar en Buenos Aires, articulando soluciones estratégicas con celeridad y resguardo patrimonial.
              </p>
            </div>

            <div className="flex flex-col space-y-3.5">
              {secondarySpecialties.map((specialty, idx) => {
                const Icon = specialty.icon;
                return (
                  <div 
                    key={idx} 
                    className="group bg-white/80 backdrop-blur-sm border border-brand-primary/5 p-4 md:p-5 shadow-sm hover:shadow-lg flex items-start gap-4 rounded-xl hover:bg-brand-gold-light/20 hover:border-brand-gold/30 hover:-translate-y-1.5 transition-all duration-300 cursor-default"
                  >
                    <div className="text-brand-gold flex-shrink-0 pt-0.5 group-hover:text-[#0a2240] transition-all duration-300 group-hover:scale-110">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-sans text-[13px] font-bold text-brand-primary group-hover:text-[#0a2240] uppercase tracking-wide mb-1 transition-colors">{specialty.title}</h4>
                      <p className="font-sans text-[13px] text-neutral-500 group-hover:text-[#0a2240]/80 leading-snug transition-colors">{specialty.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Geographical coverage / Local SEO badge card */}
            <div className="bg-white/90 border border-brand-gold/25 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-5 h-5 text-brand-gold" />
                <h3 className="font-display text-lg font-bold text-brand-primary">
                  Ámbito de Actuación Judicial y Cobertura
                </h3>
              </div>
              <p className="text-xs text-neutral-600 mb-4 leading-relaxed">
                La Dra. María José Lizaso litiga y patrocina causas ante fueros judiciales de:
              </p>
              <div className="space-y-3">
                {locations.map((loc, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-neutral-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-gold mt-1.5 flex-shrink-0" />
                    <div>
                      <strong className="text-brand-primary">{loc.name}:</strong>{' '}
                      <span className="text-neutral-600">{loc.detail}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* FAQ Column layout */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -100px 0px" }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="bg-white p-8 md:p-10 border border-brand-primary/5 shadow-lg space-y-8 rounded-2xl"
          >
            <div>
              <span className="font-sans text-[10px] uppercase tracking-widest text-[#44474c] font-bold block mb-2">
                Consultas Habituales
              </span>
              <h3 className="font-display text-2xl font-bold text-brand-primary">
                Preguntas Frecuentes sobre Sucesiones y Divorcios
              </h3>
              <p className="font-sans text-xs text-neutral-500 mt-2">
                Respuestas legales claras para orientarlo en sus primeros pasos procesales.
              </p>
            </div>

            <div className="divide-y divide-brand-primary/10">
              {faqs.map((faq, i) => (
                <div key={i} className="py-4 first:pt-0 last:pb-0">
                  <h4 className="font-sans text-[13px] font-bold text-brand-primary flex items-start gap-2.5 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-gold flex-shrink-0 mt-0.5" />
                    <span>{faq.q}</span>
                  </h4>
                  <p className="font-sans text-xs text-[#44474c] pl-6.5 leading-relaxed text-justify">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}

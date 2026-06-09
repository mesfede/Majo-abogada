import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, User, Sparkles, MessageSquare } from 'lucide-react';

export default function AsistenteIA() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string, sender: 'bot' | 'user' }[]>([
    { text: "Hola! Soy MajoBot, el asistente virtual del estudio. ¿En qué te puedo orientar rápidamente hoy?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    setMessages(prev => [...prev, { text: userText, sender: 'user' }]);
    setInput('');
    setIsTyping(true);

    // Simple simulated classification logic for the bot
    setTimeout(() => {
      setIsTyping(false);
      let reply = "Entiendo. Para ese tipo de situaciones, le recomiendo que nos envíe un mensaje a través del formulario de contacto para que la Dra. Lizaso evalúe su caso con la rigurosidad necesaria.";
      const lower = userText.toLowerCase();
      
      if (lower.includes('sucesion') || lower.includes('morir') || lower.includes('herencia')) {
        reply = "Las sucesiones en Argentina requieren determinar el acervo (los bienes) y los herederos. Le sugerimos tener a mano el Acta de Defunción. Puede ver más detalles en la sección superior o contactarnos.";
      } else if (lower.includes('divorcio') || lower.includes('separar')) {
        reply = "Si ambas partes están de acuerdo, el divorcio suele ser rápido (presentación conjunta). Si no hay acuerdo, es unilateral. En ambos casos, le garantizamos acompañamiento legal empático.";
      } else if (lower.includes('precio') || lower.includes('costo') || lower.includes('honorarios')) {
        reply = "Los honorarios legales se rigen por las leyes provinciales vigentes, brindando transparencia. Puede utilizar nuestra calculadora orientativa arriba o escribirnos directamente.";
      } else if (lower.includes('hola')) {
        reply = "¡Hola! Estoy aquí para brindarle una primera orientación. ¿Estás buscando información sobre sucesiones o divorcios?";
      }

      setMessages(prev => [...prev, { text: reply, sender: 'bot' }]);
    }, 1500);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center justify-center p-4 rounded-full shadow-2xl transition-transform duration-300 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'} bg-[#0a2240] text-white hover:bg-[#bd7d8a]`}
          title="Abrir Asistente Virtual IA"
        >
          <MessageSquare className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#bd7d8a] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#e0b7be]"></span>
          </span>
        </button>
      </div>

      {/* Chat Window */}
      <div 
        className={`fixed bottom-6 right-6 w-[340px] sm:w-[380px] bg-white rounded-lg shadow-2xl border border-neutral-200 z-50 overflow-hidden flex flex-col transition-all duration-300 transform origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}
        style={{ maxHeight: 'calc(100vh - 100px)', height: '500px' }}
      >
        {/* Header */}
        <div className="bg-[#0a2240] text-white p-4 flex justify-between items-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#bd7d8a]/20 blur-2xl rounded-full translate-x-10 -translate-y-10" />
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <Bot className="w-4 h-4 text-[#e0b7be]" />
            </div>
            <div>
              <h4 className="font-sans text-sm font-bold">MajoBot IA</h4>
              <p className="text-[10px] text-slate-300 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Asistente de Orientación
              </p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-white/60 hover:text-white p-1 relative z-10 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Layout */}
        <div className="flex-1 p-4 overflow-y-auto bg-[#f9f9f9] space-y-4">
          <div className="text-center mb-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#bd7d8a]">Hoy</span>
          </div>

          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-lg p-3 text-sm font-sans leading-relaxed ${
                msg.sender === 'user' 
                  ? 'bg-[#0a2240] text-white rounded-br-none' 
                  : 'bg-white text-slate-700 border border-neutral-200 rounded-bl-none shadow-sm'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-lg p-3 bg-white border border-neutral-200 rounded-bl-none shadow-sm flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-[#bd7d8a] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-[#bd7d8a] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-[#bd7d8a] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <div className="p-3 bg-white border-t border-neutral-200">
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu duda brevemente..."
              className="flex-1 bg-neutral-100 text-slate-800 text-sm font-sans rounded-full px-4 py-2 border-none focus:ring-1 focus:ring-[#0a2240] outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="w-9 h-9 rounded-full bg-[#bd7d8a] text-white flex items-center justify-center hover:bg-[#0a2240] transition-colors disabled:opacity-50 cursor-pointer flex-shrink-0"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </form>
          <div className="text-center mt-2">
            <span className="text-[8px] text-slate-400 font-sans">
              La Inteligencia Artificial no sustituye el asesoramiento legal.
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

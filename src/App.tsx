import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Sucesiones from './components/Sucesiones';
import Divorcios from './components/Divorcios';
import Especialidades from './components/Especialidades';
import Nosotros from './components/Nosotros';
import ConsultForm from './components/ConsultForm';
import Dashboard from './components/Dashboard';
import { Mail, Share2, Scale, ExternalLink, Lock, X, AlertCircle, ShieldAlert, Sparkles, Loader2 } from 'lucide-react';

export default function App() {
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('abogada_authenticated') === 'true';
  });
  const [showDashboard, setShowDashboard] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  
  // Gmail validation inputs
  const [gmailInput, setGmailInput] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState(false);

  // Smooth scroll handler matches Navigation target targets
  const handleScrollTo = (id: string) => {
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Toggle dashboard route
  const handleToggleDashboard = () => {
    if (showDashboard) {
      setShowDashboard(false);
      window.scrollTo({ top: 0 });
    } else {
      handleTriggerAdminAuth();
    }
  };

  // Triggers hidden verification flow
  const handleTriggerAdminAuth = () => {
    if (isAuthenticated) {
      // Already authenticated, log straight into dashboard
      setShowDashboard(true);
      window.scrollTo({ top: 0 });
    } else {
      // Needs secure Gmail verification
      setGmailInput('');
      setAuthError(null);
      setAuthSuccess(false);
      setIsLoginModalOpen(true);
    }
  };

  // Process secure log in
  const handleVerifyGmail = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsVerifying(true);

    setTimeout(() => {
      const cleanEmail = gmailInput.trim().toLowerCase();
      
      if (cleanEmail === 'mesfede@gmail.com') {
        setAuthSuccess(true);
        setTimeout(() => {
          setIsAuthenticated(true);
          localStorage.setItem('abogada_authenticated', 'true');
          localStorage.setItem('abogada_email', cleanEmail);
          setIsLoginModalOpen(false);
          setShowDashboard(true);
          window.scrollTo({ top: 0 });
          setIsVerifying(false);
        }, 1200);
      } else {
        setIsVerifying(false);
        setAuthError(
          'Correo electrónico no autorizado. Únicamente la cuenta de Google vinculada de la Dra. María José Lizaso (mesfede@gmail.com) posee credenciales válidas para ingresar al panel de expedientes.'
        );
      }
    }, 1000);
  };

  // Force Logout
  const handleLogoutAdmin = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('abogada_authenticated');
    localStorage.removeItem('abogada_email');
    setShowDashboard(false);
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9] text-[#1a1c1c] flex flex-col font-sans selection:bg-brand-gold-light selection:text-brand-primary">
      
      {/* Universal header navigation */}
      <Navigation 
        onToggleDashboard={handleToggleDashboard} 
        showDashboard={showDashboard} 
        onScrollTo={handleScrollTo}
      />

      {/* Main layout contents conditionally renders Client views vs Admin CRM Dashboard */}
      <main className="flex-grow">
        {showDashboard ? (
          <div className="relative">
            {/* Direct dynamic logout toggle at the top of Dashboard layout */}
            <div className="absolute top-4 right-16 z-30 flex gap-2">
              <button
                onClick={handleLogoutAdmin}
                className="bg-red-650 hover:bg-red-750 text-white font-sans text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded transition-all cursor-pointer shadow-sm hover:shadow-md"
                title="Cerrar sesión segura del letrado"
              >
                Cerrar Sesión
              </button>
            </div>
            <Dashboard onBackToPublic={() => setShowDashboard(false)} />
          </div>
        ) : (
          <div className="animate-fade-in">
            {/* Beautiful client views stack */}
            <Hero onScrollTo={handleScrollTo} />
            <Sucesiones />
            <Divorcios />
            
            {/* Visual divider as requested by design */}
            <div className="max-w-[1280px] mx-auto px-6 md:px-16">
              <hr className="border-t border-brand-gold/15" />
            </div>

            <Especialidades />
            <Nosotros />
            <ConsultForm />
          </div>
        )}
      </main>

      {/* Footer block matches aesthetic perfectly */}
      <footer className="bg-brand-primary text-white border-t border-brand-gold/15 py-12 md:py-16">
        <div className="max-w-[1280px] mx-auto px-6 md:px-16 flex flex-col md:flex-row justify-between items-center gap-10">
          
          {/* Trademark details */}
          <div className="flex flex-col items-center md:items-start gap-4 text-center md:text-left">
            <div className="flex flex-col">
              <span className="font-display text-lg font-bold tracking-widest text-[#eddfb6] uppercase">
                MARÍA JOSÉ LIZASO
              </span>
              <span className="text-[10px] uppercase tracking-[0.25em] text-slate-400 font-semibold mt-0.5">
                Abogada
              </span>
            </div>
            
            <p className="font-sans text-xs text-slate-400 mt-2 flex items-center justify-center md:justify-start gap-1 select-none">
              <span>© {new Date().getFullYear()} MARIA JOSE LIZASO. Todos los derechos reservados.</span>
              
              {/* Discrete entry padlock */}
              <span 
                onClick={handleTriggerAdminAuth}
                className="ml-1 px-1 text-slate-500/40 hover:text-brand-gold transition-colors duration-300 cursor-pointer"
                title="Google Workspace Acceso Seguro (Abogada)"
              >
                <Lock className="w-3 h-3 hover:scale-115 transition-transform" />
              </span>
            </p>
          </div>

          {/* Legal references navigation list */}
          <nav className="flex flex-wrap justify-center gap-6 md:gap-8 text-xs font-semibold uppercase tracking-wider text-slate-350">
            <a href="#" className="hover:text-brand-gold-light transition-colors">Aviso Legal</a>
            <a href="#" className="hover:text-brand-gold-light transition-colors">Política de Privacidad</a>
            <a href="#" className="hover:text-brand-gold-light transition-colors">Términos de Servicio</a>
            <a href="#consulta" className="hover:text-brand-gold-light transition-colors" onClick={(e) => { e.preventDefault(); handleScrollTo('consulta'); }}>Contacto</a>
          </nav>

          {/* External action indicators */}
          <div className="flex gap-4">
            <button 
              onClick={() => {
                navigator.share ? navigator.share({
                  title: 'María José Lizaso - Abogada',
                  text: 'Especialista en Sucesiones y Divorcios en Argentina.',
                  url: window.location.href
                }) : alert('Sugerencia: Copie la URL del navegador para compartir.');
              }}
              className="p-2.5 rounded-full bg-white/5 hover:bg-brand-gold/20 text-slate-300 hover:text-brand-gold-light transition-all cursor-pointer border border-white/5" 
              title="Compartir enlace de este estudio"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <a 
              href="mailto:estudio.lizaso@gmail.com" 
              className="p-2.5 rounded-full bg-white/5 hover:bg-brand-gold/20 text-slate-300 hover:text-brand-gold-light transition-all border border-white/5" 
              title="Contacto Directo por Correo"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>

        </div>
      </footer>

      {/* --- EXQUISITE GMAIL AUTHENTICATION MODAL --- */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in">
          
          <div className="relative w-full max-w-[420px] bg-white text-slate-900 border border-neutral-200 shadow-2xl overflow-hidden rounded-xs flex flex-col">
            
            {/* Small decorative colored banner representing official Google flow */}
            <div className="h-1.5 w-full bg-gradient-to-r from-red-500 via-blue-500 to-green-500" />
            
            {/* Close modal button top corner */}
            <button
              onClick={() => setIsLoginModalOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700 transition-colors p-1"
              title="Cerrar"
            >
              <X className="w-4.5 h-4.5" />
            </button>

            {/* Modal Workspace */}
            <div className="p-8 pb-10 flex flex-col items-center text-center">
              
              {/* Authenticator icon banner */}
              <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-5 relative">
                <ShieldAlert className="w-7 h-7" />
                <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-ping" />
              </div>

              <h3 className="font-display text-lg font-bold text-slate-900 tracking-tight leading-tight">
                Verificación de Cuenta Google
              </h3>
              
              <p className="font-sans text-xs text-neutral-500 mt-1.5 max-w-[300px] leading-relaxed">
                El acceso a la bandeja de expedientes judiciales del estudio está rigurosamente limitado a la letrada titular.
              </p>

              {/* The Authorization Form */}
              <form onSubmit={handleVerifyGmail} className="w-full mt-8 space-y-5 text-left">
                
                <div className="space-y-1.5">
                  <label className="block font-sans text-[10px] font-bold uppercase tracking-wider text-neutral-700">
                    Correo Electrónico (Gmail) <span className="text-red-500">*</span>
                  </label>
                  
                  <div className="relative">
                    <input
                      type="email"
                      required
                      autoFocus
                      placeholder="ejemplo@gmail.com"
                      value={gmailInput}
                      onChange={(e) => {
                        setGmailInput(e.target.value);
                        if (authError) setAuthError(null);
                      }}
                      disabled={isVerifying || authSuccess}
                      className="w-full bg-neutral-50 font-sans text-sm p-3.5 pr-10 border border-neutral-300 rounded focus:border-blue-600 focus:bg-white focus:ring-1 focus:ring-blue-100 transition-all outline-none"
                    />
                    
                    {/* Google specific chrome icon or locked indicator */}
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400">
                      <Lock className="w-4 h-4" />
                    </span>
                  </div>
                </div>

                {/* Direct helper shortcut for rapid inspection */}
                <div className="pt-1">
                  <p className="text-[10px] text-neutral-400 leading-normal text-justify leading-snug">
                    <strong className="text-brand-gold">Seguridad titular:</strong> Al autenticarse, el portal confirmará que el correo coincida con el padrón habilitado (<span className="text-[#041627] select-all font-semibold">mesfede@gmail.com</span>).
                  </p>
                </div>

                {/* Error Box display if email doesn't match */}
                {authError && (
                  <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded leading-normal flex items-start gap-2.5">
                    <AlertCircle className="w-4.5 h-4.5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-justify font-sans">{authError}</span>
                  </div>
                )}

                {/* Success sign state */}
                {authSuccess && (
                  <div className="p-4 bg-emerald-50 text-emerald-700 text-xs rounded border border-emerald-250 leading-relaxed font-semibold flex items-center gap-2">
                    <Sparkles className="w-4.5 h-4.5 text-emerald-600 flex-shrink-0" />
                    <span>¡Identidad confirmada! Conectando con el servidor administrativo...</span>
                  </div>
                )}

                {/* Actions row */}
                <div className="pt-3 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsLoginModalOpen(false)}
                    className="flex-1 py-3 text-xs font-bold uppercase tracking-wider text-neutral-500 hover:bg-neutral-100 transition-colors text-center cursor-pointer border border-neutral-200 rounded"
                  >
                    Cancelar
                  </button>
                  
                  <button
                    type="submit"
                    disabled={isVerifying || authSuccess}
                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 rounded"
                  >
                    {isVerifying ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                        <span>Verificando...</span>
                      </>
                    ) : (
                      <span>Acceder</span>
                    )}
                  </button>
                </div>

              </form>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}

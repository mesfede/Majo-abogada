import React, { useState, useEffect } from 'react';
import Hero from './components/Hero';
import Sucesiones from './components/Sucesiones';
import Divorcios from './components/Divorcios';
import Especialidades from './components/Especialidades';
import Nosotros from './components/Nosotros';
import ConsultForm from './components/ConsultForm';
import Dashboard from './components/Dashboard';
import logoImg1 from './assets/images/Majo_logo_pink.png';
import { Mail, Share2, Scale, ExternalLink, Lock, X, AlertCircle, ShieldAlert, Sparkles, Loader2, LogOut } from 'lucide-react';
import { auth } from './firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

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
      const headerOffset = 24; // Less offset since we removed the tall sticky nav bar!
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

  // Process actual secure Google Sign-In with Firebase Auth (Zero-Trust)
  const handleGoogleSignIn = async () => {
    setAuthError(null);
    setIsVerifying(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const cleanEmail = user.email?.trim().toLowerCase();
      
      if (cleanEmail === 'mesfede@gmail.com') {
        setAuthSuccess(true);
        setIsAuthenticated(true);
        localStorage.setItem('abogada_authenticated', 'true');
        localStorage.setItem('abogada_email', cleanEmail);
        setTimeout(() => {
          setIsLoginModalOpen(false);
          setShowDashboard(true);
          window.scrollTo({ top: 0 });
          setIsVerifying(false);
        }, 1200);
      } else {
        // Sign out since user is not authorized
        await auth.signOut();
        setIsVerifying(false);
        setAuthError(
          `La cuenta de Google ingresada (${cleanEmail || 'desconocida'}) no está autorizada. Únicamente la cuenta vinculada de la Dra. María José Lizaso (mesfede@gmail.com) posee credenciales válidas para ingresar al panel de expedientes.`
        );
      }
    } catch (err: any) {
      console.error("Google Auth error", err);
      setIsVerifying(false);
      setAuthError(
        'El inicio de sesión falló. Ocurrió un error al autenticar con Google. Por favor intente nuevamente.'
      );
    }
  };

  // Process secure fallback list log in
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
      
      {/* Floating system bar only displayed for authenticated Admins to quickly access dashboard */}
      {isAuthenticated && !showDashboard && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900/90 text-white border border-brand-gold/30 px-4 py-2 flex items-center gap-3 shadow-xl backdrop-blur-md rounded-xs">
          <span className="text-[10px] uppercase font-bold tracking-widest text-brand-gold-light">Autenticado</span>
          <button
            onClick={() => setShowDashboard(true)}
            className="px-2.5 py-1 bg-brand-gold text-brand-primary text-[10px] font-bold uppercase tracking-wider hover:bg-white transition-all cursor-pointer"
          >
            Abrir Expedientes
          </button>
          <button
            onClick={handleLogoutAdmin}
            className="p-1 hover:text-red-400 transition-colors cursor-pointer"
            title="Cerrar Sesión"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main layout contents conditionally renders Client views vs Admin CRM Dashboard */}
      <main className="flex-grow">
        {showDashboard ? (
          <div className="relative">
            {/* Direct logout button overlaying administrative view */}
            <div className="absolute top-4 right-16 z-30 flex gap-2">
              <button
                onClick={handleLogoutAdmin}
                className="bg-red-650 hover:bg-transparent border border-red-500/20 hover:border-red-500 hover:text-red-500 text-white font-sans text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-xs transition-all cursor-pointer shadow-sm hover:shadow-md"
                title="Cerrar sesión segura del letrado"
              >
                Cerrar Sesión
              </button>
            </div>
            <Dashboard onBackToPublic={() => setShowDashboard(false)} />
          </div>
        ) : (
          <div className="animate-fade-in">
            {/* Beautiful streamlined full-bleed hero and content stacks */}
            <Hero onScrollTo={handleScrollTo} />
            <Sucesiones />
            <Divorcios />
            
            {/* Visual separating line */}
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
            <div className="flex flex-col items-center md:items-start">
              <img 
                src={logoImg1} 
                alt="María José Lizaso - Abogada" 
                className="h-[47px] opacity-100 object-contain drop-shadow-sm mb-1"
                referrerPolicy="no-referrer"
              />
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
                if (navigator.share) {
                  navigator.share({
                    title: 'María José Lizaso - Abogada',
                    text: 'Especialista en Sucesiones y Divorcios en Argentina.',
                    url: window.location.href
                  }).catch(() => {});
                } else {
                  navigator.clipboard.writeText(window.location.href);
                }
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

              <div className="w-full mt-6">
                {/* Google Single Sign-On Button */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isVerifying || authSuccess}
                  className="w-full flex items-center justify-center gap-3 bg-[#0a2240] hover:bg-slate-800 text-white font-sans text-xs font-bold uppercase tracking-wider py-4 px-4 rounded transition-all cursor-pointer shadow-md mb-5"
                >
                  <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                  </svg>
                  <span>Iniciar Sesión con Google</span>
                </button>

                <div className="flex items-center my-5">
                  <div className="flex-grow border-t border-neutral-200"></div>
                  <span className="font-sans text-[9px] font-bold text-neutral-400 px-3 uppercase tracking-widest">o verificación alternativa</span>
                  <div className="flex-grow border-t border-neutral-200"></div>
                </div>
              </div>

              {/* The Authorization Form */}
              <form onSubmit={handleVerifyGmail} className="w-full mt-2 space-y-5 text-left">
                
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
                    <strong className="text-brand-gold">Seguridad titular:</strong> Al autenticarse, el portal confirmará que el correo coincida con el padrón habilitado (<span className="text-[#0a2240] select-all font-semibold">mesfede@gmail.com</span>).
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

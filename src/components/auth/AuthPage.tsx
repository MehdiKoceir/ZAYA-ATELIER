import React, { useState } from 'react';
import { Crown, Sparkles, Lock, Mail, User, Phone, Eye, EyeOff, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AppRoute } from '../../lib/router';
import { ALGERIAN_WILAYAS } from '../../data/wilayas';

interface AuthPageProps {
  initialTab?: 'login' | 'register';
  onNavigate: (route: AppRoute) => void;
  promptMessage?: string | null;
}

export const AuthPage: React.FC<AuthPageProps> = ({ initialTab = 'login', onNavigate, promptMessage }) => {
  const { login, register } = useAuth();
  const [tab, setTab] = useState<'login' | 'register'>(initialTab);

  // Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [forgotModal, setForgotModal] = useState(false);

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regWilaya, setRegWilaya] = useState<number>(16); // Alger
  const [regCommune, setRegCommune] = useState('Hydra');
  const [regAddress, setRegAddress] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regDeliveryMethod, setRegDeliveryMethod] = useState<'home' | 'desk'>('home');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(true);

  // UI state
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Handle Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!loginIdentifier.trim() || !loginPassword.trim()) {
      setErrorMsg('Veuillez renseigner votre email ou téléphone et mot de passe.');
      return;
    }

    setLoading(true);
    try {
      const res = await login(loginIdentifier.trim(), loginPassword);
      if (res.success) {
        setSuccessMsg('Connexion réussie. Redirection vers votre tableau de bord...');
        setTimeout(() => {
          onNavigate('/dashboard');
        }, 500);
      } else {
        setErrorMsg(res.error || 'Identifiants invalides. Veuillez réessayer.');
      }
    } catch {
      setErrorMsg('Une erreur inattendue est survenue.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Quick Demo Login
  const handleQuickDemo = async (email: string, pass: string) => {
    setErrorMsg(null);
    setLoginIdentifier(email);
    setLoginPassword(pass);
    setLoading(true);
    try {
      const res = await login(email, pass);
      if (res.success) {
        setSuccessMsg(`Connecté en tant que ${email}. Redirection...`);
        setTimeout(() => {
          onNavigate('/dashboard');
        }, 400);
      } else {
        setErrorMsg(res.error || 'Erreur de connexion');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Register
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!regName.trim() || !regEmail.trim() || !regPhone.trim() || !regPassword) {
      setErrorMsg('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMsg('Le mot de passe doit comporter au moins 6 caractères.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMsg('Les mots de passe ne correspondent pas.');
      return;
    }

    if (!termsAccepted) {
      setErrorMsg('Veuillez accepter les conditions d’utilisation.');
      return;
    }

    setLoading(true);
    const selectedWilayaObj = ALGERIAN_WILAYAS.find(w => w.code === regWilaya);

    try {
      const res = await register({
        name: regName.trim(),
        email: regEmail.trim(),
        phone: regPhone.trim(),
        wilayaCode: regWilaya,
        wilayaName: selectedWilayaObj?.name || 'Alger',
        commune: regCommune.trim() || 'Alger-Centre',
        address: regAddress.trim() || 'Adresse principale',
        deliveryMethod: regDeliveryMethod,
        password: regPassword,
      });

      if (res.success) {
        setSuccessMsg('Compte créé avec succès ! Bienvenue chez ZAYA.');
        setTimeout(() => {
          onNavigate('/dashboard');
        }, 600);
      } else {
        setErrorMsg(res.error || 'Impossible de créer le compte.');
      }
    } catch {
      setErrorMsg('Une erreur inattendue est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] bg-[#FAF8F5] py-12 px-4 sm:px-6 flex flex-col justify-center items-center">
      {/* Return to home button */}
      <div className="w-full max-w-lg mb-6 flex items-center justify-between">
        <button
          onClick={() => onNavigate('/')}
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-[#786F62] hover:text-[#1A1918] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à la Boutique Publique</span>
        </button>

        <span className="text-[11px] font-mono text-stone-400">
          ZAYA • ESPACE SÉCURISÉ
        </span>
      </div>

      {/* Main Card Container */}
      <div className="w-full max-w-lg bg-white border border-[#EAE4DC] shadow-xl p-6 sm:p-8 rounded-2xl relative">
        {/* Brand Header */}
        <div className="text-center space-y-1.5 mb-6">
          <div className="inline-flex items-center gap-1 text-[#C5A880]">
            <Crown className="w-4 h-4" />
          </div>
          <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold tracking-widest text-[#1A1918]">
            ZAYA
          </h1>
          <p className="text-[10px] uppercase tracking-[0.24em] text-[#8C8275]">
            ATELIER • ALGER
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 bg-[#FAF8F5] border border-[#EAE4DC] rounded-xl mb-6 text-xs font-semibold uppercase tracking-wider">
          <button
            type="button"
            onClick={() => {
              setTab('login');
              setErrorMsg(null);
            }}
            className={`py-2.5 rounded-lg transition-all ${
              tab === 'login'
                ? 'bg-[#1A1918] text-[#FAF8F5] shadow-xs'
                : 'text-[#655D52] hover:text-[#1A1918]'
            }`}
          >
            Se Connecter
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('register');
              setErrorMsg(null);
            }}
            className={`py-2.5 rounded-lg transition-all ${
              tab === 'register'
                ? 'bg-[#1A1918] text-[#FAF8F5] shadow-xs'
                : 'text-[#655D52] hover:text-[#1A1918]'
            }`}
          >
            Créer un Compte
          </button>
        </div>

        {/* Messages */}
        {promptMessage && !errorMsg && !successMsg && (
          <div className="mb-4 p-3.5 bg-[#F4EFEA] border border-[#DDD5CA] text-[#1A1918] text-xs rounded-xl flex items-center gap-2.5 animate-fadeIn">
            <Lock className="w-4 h-4 text-[#C5A880] shrink-0" />
            <span className="font-medium">{promptMessage}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 bg-[#F0FDF4] border border-[#BBF7D0] text-[#166534] text-xs rounded-lg flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SIGN IN FORM */}
        {/* ========================================================================= */}
        {tab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#1A1918] mb-1">
                Email ou Téléphone Mobile
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  required
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  placeholder="sarah@zaya.dz ou 0550 12 34 56"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#FAF8F5] border border-[#DDD5CA] rounded-lg text-xs text-[#1A1918] placeholder-[#9D9487] focus:outline-none focus:border-[#C5A880]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-[#1A1918]">
                  Mot de Passe
                </label>
                <button
                  type="button"
                  onClick={() => setForgotModal(true)}
                  className="text-[11px] text-[#A66C44] hover:underline"
                >
                  Mot de passe oublié ?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-[#FAF8F5] border border-[#DDD5CA] rounded-lg text-xs text-[#1A1918] placeholder-[#9D9487] focus:outline-none focus:border-[#C5A880]"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1"
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-[#5C5449]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-[#DDD5CA] text-[#1A1918] focus:ring-0"
                />
                <span>Se souvenir de moi</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#1A1918] text-[#FAF8F5] text-xs uppercase tracking-widest font-bold rounded-lg hover:bg-black transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-md"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Accéder à Mon Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* 1-Click Demo Accounts for Easy Evaluation */}
            <div className="pt-4 border-t border-[#EAE4DC] space-y-2">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-stone-400 font-semibold justify-center">
                <Sparkles className="w-3 h-3 text-[#C5A880]" />
                <span>Accès Démo 1-Clic pour tester le Dashboard</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemo('sarah@zaya.dz', 'sarah2026')}
                  className="p-2 border border-[#E5DDD0] bg-[#FAF8F5] hover:bg-[#F0EBE1] rounded-lg text-left transition-colors text-[11px]"
                >
                  <p className="font-bold text-[#1A1918] flex items-center gap-1">
                    <span>Sarah Benali</span>
                    <Crown className="w-2.5 h-2.5 text-[#C5A880]" />
                  </p>
                  <p className="text-[10px] text-stone-500">VIP Atelier (Alger)</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemo('amelia@zaya.dz', 'amelia123')}
                  className="p-2 border border-[#E5DDD0] bg-[#FAF8F5] hover:bg-[#F0EBE1] rounded-lg text-left transition-colors text-[11px]"
                >
                  <p className="font-bold text-[#1A1918]">Amélia Ziani</p>
                  <p className="text-[10px] text-stone-500">Privilège (Alger)</p>
                </button>
              </div>
            </div>

            <div className="text-center pt-2 text-xs text-[#736B60]">
              Pas encore de compte ?{' '}
              <button
                type="button"
                onClick={() => setTab('register')}
                className="font-bold text-[#1A1918] hover:underline"
              >
                Créer un compte
              </button>
            </div>
          </form>
        )}

        {/* ========================================================================= */}
        {/* CREATE ACCOUNT FORM */}
        {/* ========================================================================= */}
        {tab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#1A1918] mb-1">
                  Nom et Prénom *
                </label>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Ex: Sarah Benali"
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD5CA] rounded-lg text-xs text-[#1A1918] focus:outline-none focus:border-[#C5A880]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#1A1918] mb-1">
                  Téléphone (Mobile) *
                </label>
                <input
                  type="tel"
                  required
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="Ex: 0550 12 34 56"
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD5CA] rounded-lg text-xs text-[#1A1918] focus:outline-none focus:border-[#C5A880]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#1A1918] mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="sarah@example.com"
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD5CA] rounded-lg text-xs text-[#1A1918] focus:outline-none focus:border-[#C5A880]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#1A1918] mb-1">
                  Wilaya (58 Wilayas) *
                </label>
                <select
                  value={regWilaya}
                  onChange={(e) => {
                    const code = Number(e.target.value);
                    setRegWilaya(code);
                    const found = ALGERIAN_WILAYAS.find(w => w.code === code);
                    if (found && found.communes.length > 0) {
                      setRegCommune(found.communes[0]);
                    }
                  }}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD5CA] rounded-lg text-xs text-[#1A1918] focus:outline-none focus:border-[#C5A880] cursor-pointer"
                >
                  {ALGERIAN_WILAYAS.map(w => (
                    <option key={w.code} value={w.code}>
                      {w.code} - {w.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#1A1918] mb-1">
                  Mot de Passe (min. 6 car.) *
                </label>
                <input
                  type={showRegPassword ? 'text' : 'password'}
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD5CA] rounded-lg text-xs text-[#1A1918] focus:outline-none focus:border-[#C5A880]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#1A1918] mb-1">
                  Confirmer Mot de Passe *
                </label>
                <input
                  type={showRegPassword ? 'text' : 'password'}
                  required
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD5CA] rounded-lg text-xs text-[#1A1918] focus:outline-none focus:border-[#C5A880]"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="terms"
                required
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="rounded border-[#DDD5CA] text-[#1A1918] focus:ring-0"
              />
              <label htmlFor="terms" className="text-[11px] text-[#5C5449] cursor-pointer">
                J'accepte les conditions de commande et de livraison COD sur 58 wilayas.
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#1A1918] text-[#FAF8F5] text-xs uppercase tracking-widest font-bold rounded-lg hover:bg-black transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-md"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#C5A880]" />
                  <span>Créer mon Compte & Entrer au Dashboard</span>
                </>
              )}
            </button>

            <div className="text-center pt-2 text-xs text-[#736B60]">
              Déjà membre ?{' '}
              <button
                type="button"
                onClick={() => setTab('login')}
                className="font-bold text-[#1A1918] hover:underline"
              >
                Se connecter
              </button>
            </div>
          </form>
        )}

        {/* Forgot password dialog */}
        {forgotModal && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
            <div className="bg-white p-6 max-w-sm w-full rounded-xl space-y-3">
              <h3 className="font-serif-luxury text-lg font-bold text-[#1A1918]">
                Réinitialisation du Mot de Passe
              </h3>
              <p className="text-xs text-[#6B6357]">
                Pour des raisons de sécurité de vos commandes à Alger, contactez directement la conciergerie ZAYA sur WhatsApp (<strong>0550 00 11 22</strong>) avec votre numéro de téléphone pour recevoir un code d'accès temporaire.
              </p>
              <button
                onClick={() => setForgotModal(false)}
                className="w-full py-2 bg-[#1A1918] text-white text-xs uppercase font-semibold rounded-lg"
              >
                Compris
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

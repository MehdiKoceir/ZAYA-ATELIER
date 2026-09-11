import React, { useState, useEffect } from 'react';
import {
  X,
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Truck,
  ShieldCheck,
  Crown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ALGERIAN_WILAYAS } from '../data/wilayas';
import { Language, RegisterData } from '../types';

interface AuthModalProps {
  language: Language;
}

export const AuthModal: React.FC<AuthModalProps> = ({ language }) => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalTab,
    setAuthModalTab,
    login,
    register
  } = useAuth();

  const isRtl = language === 'ar';

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginRemember, setLoginRemember] = useState(true);

  // Register form state
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [registerWilayaCode, setRegisterWilayaCode] = useState<number>(16); // Alger default
  const [registerCommune, setRegisterCommune] = useState('Hydra');
  const [registerAddress, setRegisterAddress] = useState('');
  const [registerDeliveryMethod, setRegisterDeliveryMethod] = useState<'home' | 'desk'>('home');
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Status state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);

  // Reset errors when switching tabs
  useEffect(() => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setForgotPasswordOpen(false);
  }, [authModalTab]);

  // Sync communes when registerWilayaCode changes
  useEffect(() => {
    const target = ALGERIAN_WILAYAS.find(w => w.code === registerWilayaCode);
    if (target && target.communes.length > 0) {
      setRegisterCommune(target.communes[0]);
    } else {
      setRegisterCommune('');
    }
  }, [registerWilayaCode]);

  if (!isAuthModalOpen) return null;

  // Selected wilaya details
  const selectedWilayaObj = ALGERIAN_WILAYAS.find(w => w.code === registerWilayaCode) || ALGERIAN_WILAYAS[15];

  // Demo Login quick fill
  const handleDemoFill = (identifier: string, pass: string) => {
    setLoginIdentifier(identifier);
    setLoginPassword(pass);
    setErrorMessage(null);
  };

  // Submit Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!loginIdentifier.trim()) {
      setErrorMessage(
        language === 'ar'
          ? 'يرجى إدخال البريد الإلكتروني أو رقم الهاتف'
          : 'Veuillez saisir votre email ou numéro de téléphone.'
      );
      return;
    }

    if (!loginPassword) {
      setErrorMessage(
        language === 'ar'
          ? 'يرجى إدخال كلمة المرور'
          : 'Veuillez saisir votre mot de passe.'
      );
      return;
    }

    setIsSubmitting(true);
    const res = await login(loginIdentifier.trim(), loginPassword);
    setIsSubmitting(false);

    if (res.success) {
      setSuccessMessage(
        language === 'ar' ? 'تم تسجيل الدخول بنجاح!' : 'Connexion réussie ! Ravi de vous revoir.'
      );
      setTimeout(() => {
        closeAuthModal();
      }, 700);
    } else {
      setErrorMessage(res.error || (language === 'ar' ? 'خطأ في تسجيل الدخول' : 'Échec de la connexion'));
    }
  };

  // Submit Register
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!registerName.trim()) {
      setErrorMessage(
        language === 'ar' ? 'يرجى إدخال الاسم واللقب الكامل' : 'Veuillez renseigner votre nom et prénom.'
      );
      return;
    }

    if (!registerEmail.trim() || !registerEmail.includes('@')) {
      setErrorMessage(
        language === 'ar' ? 'يرجى إدخال بريد إلكتروني صحيح' : 'Veuillez renseigner une adresse email valide.'
      );
      return;
    }

    const cleanPhone = registerPhone.replace(/\s+/g, '');
    const isDzPhone = /^(0)(5|6|7)[0-9]{8}$/.test(cleanPhone) || /^\+213(5|6|7)[0-9]{8}$/.test(cleanPhone);
    if (!isDzPhone) {
      setErrorMessage(
        language === 'ar'
          ? 'يرجى إدخال رقم هاتف جزائري صحيح (مثال: 0550123456 أو 0661...)'
          : 'Veuillez saisir un numéro de téléphone algérien valide (ex: 0550 12 34 56).'
      );
      return;
    }

    if (registerPassword.length < 6) {
      setErrorMessage(
        language === 'ar'
          ? 'يجب أن تتكون كلمة المرور من 6 أحرف على الأقل'
          : 'Le mot de passe doit comporter au moins 6 caractères.'
      );
      return;
    }

    if (registerPassword !== registerConfirmPassword) {
      setErrorMessage(
        language === 'ar'
          ? 'كلمتا المرور غير متطابقتين'
          : 'Les deux mots de passe ne correspondent pas.'
      );
      return;
    }

    if (!agreeTerms) {
      setErrorMessage(
        language === 'ar'
          ? 'يرجى الموافقة على شروط الاستخدام وسياسة الخصوصية'
          : 'Veuillez accepter les conditions d’utilisation de l’Atelier.'
      );
      return;
    }

    setIsSubmitting(true);
    const payload: RegisterData = {
      name: registerName.trim(),
      email: registerEmail.trim(),
      phone: cleanPhone,
      password: registerPassword,
      wilayaCode: registerWilayaCode,
      commune: registerCommune,
      address: registerAddress.trim(),
      deliveryMethod: registerDeliveryMethod
    };

    const res = await register(payload);
    setIsSubmitting(false);

    if (res.success) {
      setSuccessMessage(
        language === 'ar'
          ? 'تم إنشاء حسابك بنجاح! مرحباً بك في عائلة زايا.'
          : 'Compte créé avec succès ! Bienvenue au sein de l’Atelier ZAYA.'
      );
      setTimeout(() => {
        closeAuthModal();
      }, 900);
    } else {
      setErrorMessage(res.error || (language === 'ar' ? 'فشل إنشاء الحساب' : 'Impossible de créer le compte'));
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#141210]/75 backdrop-blur-xs animate-fadeIn overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeAuthModal();
      }}
    >
      <div
        className={`relative w-full max-w-lg bg-[#FAF8F5] border border-[#EAE4DC] rounded-xl shadow-2xl overflow-hidden transition-all my-auto ${
          isRtl ? 'rtl' : 'ltr'
        }`}
      >
        {/* Top Decorative Gold Bar */}
        <div className="h-1 w-full bg-gradient-to-r from-[#C5A880] via-[#E6D5BC] to-[#A88860]" />

        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-2.5 right-2.5 z-10 p-1 text-[#7E7569] hover:text-[#1A1918] hover:bg-[#F2ECE4] rounded-full transition-colors"
          title="Fermer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Branding - Ultra Compact */}
        <div className="pt-3 pb-2 px-4 sm:px-6 text-center bg-gradient-to-b from-[#F6F1EA] to-[#FAF8F5] border-b border-[#EFE8DF]">
          <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#231F1C] text-[#FAF8F5] rounded-full text-[9px] font-medium uppercase tracking-[0.18em] mb-0.5 shadow-2xs">
            <Crown className="w-2.5 h-2.5 text-[#C5A880]" />
            <span>ZAYA ATELIER • ESPACE CLIENT</span>
          </div>
          <h2 className="font-serif-luxury text-base sm:text-lg font-bold tracking-wide text-[#1A1918]">
            {language === 'ar' ? 'أتيليه زايا الجزائر' : 'Maison ZAYA Alger'}
          </h2>

          {/* Switchable Modern Tab Segment */}
          <div className="mt-1.5 p-0.5 bg-[#EFE9E0] rounded-lg flex items-center relative max-w-[240px] mx-auto border border-[#E3DBD0]">
            <button
              type="button"
              id="auth-tab-login"
              onClick={() => setAuthModalTab('login')}
              className={`relative flex-1 py-1 text-[11px] font-semibold tracking-wide uppercase transition-all rounded-md flex items-center justify-center gap-1 ${
                authModalTab === 'login'
                  ? 'bg-[#1A1918] text-[#FAF8F5] shadow-xs'
                  : 'text-[#6C6356] hover:text-[#1A1918]'
              }`}
            >
              <span>{language === 'ar' ? 'تسجيل الدخول' : 'Connexion'}</span>
            </button>

            <button
              type="button"
              id="auth-tab-register"
              onClick={() => setAuthModalTab('register')}
              className={`relative flex-1 py-1 text-[11px] font-semibold tracking-wide uppercase transition-all rounded-md flex items-center justify-center gap-1 ${
                authModalTab === 'register'
                  ? 'bg-[#1A1918] text-[#FAF8F5] shadow-xs'
                  : 'text-[#6C6356] hover:text-[#1A1918]'
              }`}
            >
              <span>{language === 'ar' ? 'إنشاء حساب' : 'Créer Compte'}</span>
            </button>
          </div>
        </div>

        {/* Feedback Messages */}
        {errorMessage && (
          <div className="mx-4 sm:mx-6 mt-2 p-2 rounded-lg bg-[#FDF2F0] border border-[#F5C2BA] flex items-center gap-2 text-[11px] text-[#A83220] animate-shake">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span className="font-medium">{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mx-4 sm:mx-6 mt-2 p-2 rounded-lg bg-[#F0FDF4] border border-[#BBF7D0] flex items-center gap-2 text-[11px] text-[#166534] animate-fadeIn">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span className="font-medium">{successMessage}</span>
          </div>
        )}

        {/* Form Content */}
        <div className="px-4 sm:px-6 py-3">
          {authModalTab === 'login' ? (
            /* ================= LOGIN VIEW ================= */
            <form
              key="login-form"
              onSubmit={handleLoginSubmit}
              className="space-y-2.5 animate-in fade-in duration-150"
            >
              {/* Identifier Input */}
              <div>
                <label className="block text-[10px] font-semibold text-[#4A443D] uppercase tracking-wider mb-0.5">
                  {language === 'ar' ? 'البريد الإلكتروني أو رقم الهاتف' : 'Email ou Numéro de Téléphone'}
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-2.5 text-[#8A8175] pointer-events-none">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="text"
                    id="login-identifier"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder={
                      language === 'ar'
                        ? 'sarah@zaya.dz أو 0550123456'
                        : 'ex: sarah@zaya.dz ou 0550 12 34 56'
                    }
                    className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#DDD5CA] rounded-lg text-xs text-[#1A1918] placeholder-[#9D9487] focus:outline-none focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880]/30 transition-all"
                    autoComplete="username"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-0.5">
                  <label className="block text-[10px] font-semibold text-[#4A443D] uppercase tracking-wider">
                    {language === 'ar' ? 'كلمة المرور' : 'Mot de passe'}
                  </label>
                  <button
                    type="button"
                    onClick={() => setForgotPasswordOpen(!forgotPasswordOpen)}
                    className="text-[10px] text-[#A66C44] hover:text-[#1A1918] underline font-medium transition-colors"
                  >
                    {language === 'ar' ? 'نسيت كلمة المرور؟' : 'Mot de passe oublié ?'}
                  </button>
                </div>
                <div className="relative flex items-center">
                  <div className="absolute left-2.5 text-[#8A8175] pointer-events-none">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    id="login-password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-8 pr-8 py-1.5 bg-white border border-[#DDD5CA] rounded-lg text-xs text-[#1A1918] placeholder-[#9D9487] focus:outline-none focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880]/30 transition-all"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-2 text-[#8A8175] hover:text-[#1A1918] p-0.5 transition-colors"
                    tabIndex={-1}
                  >
                    {showLoginPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Forgot Password Helper Popover */}
              {forgotPasswordOpen && (
                <div className="p-2 bg-[#F4EFEA] border border-[#DDD5CA] rounded-lg text-[10px] text-[#5C5348] animate-fadeIn">
                  <p className="font-semibold text-[#1A1918]">
                    {language === 'ar' ? 'استرجاع الحساب' : 'Réinitialisation du compte'}
                  </p>
                  <p className="leading-snug mt-0.5">
                    {language === 'ar'
                      ? 'يرجى التواصل مع خدمة زبائن الأتيليه عبر واتساب (0550 00 11 22) لإعادة تعيين كلمة المرور فورياً.'
                      : 'Contactez notre conciergerie WhatsApp au 0550 00 11 22 avec votre numéro ou email.'}
                  </p>
                </div>
              )}

              {/* Remember Me */}
              <div className="flex items-center justify-between text-[11px] text-[#6B6356] pt-0.5">
                <label className="flex items-center gap-1.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={loginRemember}
                    onChange={(e) => setLoginRemember(e.target.checked)}
                    className="w-3.5 h-3.5 text-[#1A1918] border-[#DDD5CA] rounded focus:ring-[#C5A880]"
                  />
                  <span>{language === 'ar' ? 'تذكرني على هذا الجهاز' : 'Rester connecté'}</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                id="auth-submit-login-btn"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 bg-[#1A1918] text-[#FAF8F5] rounded-lg font-medium text-xs uppercase tracking-wider hover:bg-black transition-all flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-60 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-[#C5A880] border-t-transparent rounded-full animate-spin" />
                    <span>{language === 'ar' ? 'جارٍ التحقق...' : 'Connexion...'}</span>
                  </>
                ) : (
                  <>
                    <span>{language === 'ar' ? 'دخول إلى حسابي' : 'Accéder à Mon Espace'}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#C5A880]" />
                  </>
                )}
              </button>

              {/* Quick 1-Tap Demo Logins */}
              <div className="pt-2 border-t border-[#EAE4DC]">
                <p className="text-[10px] uppercase tracking-wider text-[#8A8175] font-semibold text-center mb-1.5">
                  {language === 'ar' ? 'أو تجربة الحسابات السريعة' : 'Comptes Démo (1 Clic)'}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleDemoFill('sarah@zaya.dz', 'sarah2026')}
                    className="p-1.5 bg-white hover:bg-[#F2EDE6] border border-[#DDD5CA] rounded-md text-left text-[11px] transition-all flex items-center justify-between group"
                  >
                    <span className="font-semibold text-[#1A1918] group-hover:text-[#A66C44] flex items-center gap-1">
                      <Crown className="w-3 h-3 text-[#C5A880]" /> Sarah (VIP)
                    </span>
                    <span className="text-[10px] text-[#7E7569]">Hydra</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDemoFill('amelia@zaya.dz', 'amelia123')}
                    className="p-1.5 bg-white hover:bg-[#F2EDE6] border border-[#DDD5CA] rounded-md text-left text-[11px] transition-all flex items-center justify-between group"
                  >
                    <span className="font-semibold text-[#1A1918] group-hover:text-[#A66C44] flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#C5A880]" /> Amélia
                    </span>
                    <span className="text-[10px] text-[#7E7569]">Alger</span>
                  </button>
                </div>
              </div>

              {/* Switch to Register footer */}
              <div className="text-center pt-1 text-[11px] text-[#7E7569]">
                <span>{language === 'ar' ? 'ليس لديك حساب بعد؟' : 'Pas encore de compte ?'}{' '}</span>
                <button
                  type="button"
                  onClick={() => setAuthModalTab('register')}
                  className="font-semibold text-[#1A1918] hover:text-[#A66C44] underline transition-colors"
                >
                  {language === 'ar' ? 'إنشاء حساب جديد' : 'Créer un compte'}
                </button>
              </div>
            </form>
          ) : (
            /* ================= REGISTER VIEW (NO SCROLL, ALL VISIBLE) ================= */
            <form
              key="register-form"
              onSubmit={handleRegisterSubmit}
              className="space-y-2 animate-in fade-in duration-150"
            >
              {/* Row 1: Nom & Téléphone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-semibold text-[#4A443D] uppercase tracking-wider mb-0.5">
                    {language === 'ar' ? 'الاسم واللقب *' : 'Nom & Prénom *'}
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-2.5 text-[#8A8175] pointer-events-none">
                      <User className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="text"
                      id="register-name"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      placeholder={language === 'ar' ? 'سارة بن علي' : 'ex: Sarah Benali'}
                      className="w-full pl-8 pr-2.5 py-1.5 bg-white border border-[#DDD5CA] rounded-lg text-xs text-[#1A1918] placeholder-[#9D9487] focus:outline-none focus:border-[#C5A880]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-[#4A443D] uppercase tracking-wider mb-0.5">
                    {language === 'ar' ? 'رقم الهاتف *' : 'Téléphone *'}
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-2.5 text-[#8A8175] pointer-events-none text-xs">
                      🇩🇿
                    </div>
                    <input
                      type="tel"
                      id="register-phone"
                      value={registerPhone}
                      onChange={(e) => setRegisterPhone(e.target.value)}
                      placeholder="0550 12 34 56"
                      className="w-full pl-8 pr-2.5 py-1.5 bg-white border border-[#DDD5CA] rounded-lg text-xs text-[#1A1918] placeholder-[#9D9487] focus:outline-none focus:border-[#C5A880]"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Email & Wilaya */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-semibold text-[#4A443D] uppercase tracking-wider mb-0.5">
                    {language === 'ar' ? 'البريد الإلكتروني *' : 'Email *'}
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-2.5 text-[#8A8175] pointer-events-none">
                      <Mail className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="email"
                      id="register-email"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      placeholder="sarah@exemple.dz"
                      className="w-full pl-8 pr-2.5 py-1.5 bg-white border border-[#DDD5CA] rounded-lg text-xs text-[#1A1918] placeholder-[#9D9487] focus:outline-none focus:border-[#C5A880]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-[#4A443D] uppercase tracking-wider mb-0.5">
                    {language === 'ar' ? 'الولاية (58 ولاية) *' : 'Wilaya de Livraison *'}
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-2.5 text-[#8A8175] pointer-events-none">
                      <MapPin className="w-3.5 h-3.5 text-[#C5A880]" />
                    </div>
                    <select
                      id="register-wilaya"
                      value={registerWilayaCode}
                      onChange={(e) => setRegisterWilayaCode(Number(e.target.value))}
                      className="w-full pl-8 pr-2.5 py-1.5 bg-white border border-[#DDD5CA] rounded-lg text-xs text-[#1A1918] focus:outline-none focus:border-[#C5A880] cursor-pointer"
                    >
                      {ALGERIAN_WILAYAS.map((w) => (
                        <option key={w.code} value={w.code}>
                          {String(w.code).padStart(2, '0')} - {w.name} {language === 'ar' ? `(${w.nameAr})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Row 3: Commune & Adresse */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-semibold text-[#4A443D] uppercase tracking-wider mb-0.5">
                    {language === 'ar' ? 'البلدية *' : 'Commune *'}
                  </label>
                  {selectedWilayaObj.communes.length > 0 ? (
                    <select
                      id="register-commune"
                      value={registerCommune}
                      onChange={(e) => setRegisterCommune(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-[#DDD5CA] rounded-lg text-xs text-[#1A1918] focus:outline-none focus:border-[#C5A880] cursor-pointer"
                    >
                      {selectedWilayaObj.communes.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      id="register-commune-text"
                      value={registerCommune}
                      onChange={(e) => setRegisterCommune(e.target.value)}
                      placeholder="Commune"
                      className="w-full px-2.5 py-1.5 bg-white border border-[#DDD5CA] rounded-lg text-xs text-[#1A1918] focus:outline-none focus:border-[#C5A880]"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-[#4A443D] uppercase tracking-wider mb-0.5">
                    {language === 'ar' ? 'العنوان / الحي' : 'Adresse / Quartier'}
                  </label>
                  <input
                    type="text"
                    id="register-address"
                    value={registerAddress}
                    onChange={(e) => setRegisterAddress(e.target.value)}
                    placeholder={language === 'ar' ? 'رقم العمارة، الحي' : 'ex: Résidence, Cité'}
                    className="w-full px-2.5 py-1.5 bg-white border border-[#DDD5CA] rounded-lg text-xs text-[#1A1918] placeholder-[#9D9487] focus:outline-none focus:border-[#C5A880]"
                  />
                </div>
              </div>

              {/* Row 4: Mot de passe & Confirmer */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-semibold text-[#4A443D] uppercase tracking-wider mb-0.5">
                    {language === 'ar' ? 'كلمة المرور *' : 'Mot de passe *'}
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-2.5 text-[#8A8175] pointer-events-none">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type={showRegisterPassword ? 'text' : 'password'}
                      id="register-password"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      placeholder="Min. 6 car."
                      className="w-full pl-8 pr-7 py-1.5 bg-white border border-[#DDD5CA] rounded-lg text-xs text-[#1A1918] placeholder-[#9D9487] focus:outline-none focus:border-[#C5A880]"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                      className="absolute right-2 text-[#8A8175] hover:text-[#1A1918]"
                      tabIndex={-1}
                    >
                      {showRegisterPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-[#4A443D] uppercase tracking-wider mb-0.5">
                    {language === 'ar' ? 'تأكيد كلمة المرور *' : 'Confirmation *'}
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-2.5 text-[#8A8175] pointer-events-none">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type={showRegisterPassword ? 'text' : 'password'}
                      id="register-confirm-password"
                      value={registerConfirmPassword}
                      onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-8 pr-2.5 py-1.5 bg-white border border-[#DDD5CA] rounded-lg text-xs text-[#1A1918] placeholder-[#9D9487] focus:outline-none focus:border-[#C5A880]"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Row 5: Preference & Terms in compact single line */}
              <div className="flex flex-wrap items-center justify-between gap-1.5 pt-0.5 text-[10px] text-[#5C5348]">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{language === 'ar' ? 'الاستلام:' : 'Livraison:'}</span>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="deliveryMethod"
                      checked={registerDeliveryMethod === 'home'}
                      onChange={() => setRegisterDeliveryMethod('home')}
                      className="text-[#1A1918] w-3 h-3"
                    />
                    <span>{language === 'ar' ? 'منزل' : 'Domicile'}</span>
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="deliveryMethod"
                      checked={registerDeliveryMethod === 'desk'}
                      onChange={() => setRegisterDeliveryMethod('desk')}
                      className="text-[#1A1918] w-3 h-3"
                    />
                    <span>{language === 'ar' ? 'مكتب' : 'Bureau'}</span>
                  </label>
                </div>

                <label className="flex items-center gap-1 cursor-pointer text-[#7E7569]">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-3 h-3 text-[#1A1918] rounded"
                  />
                  <span>{language === 'ar' ? 'أوافق على الشروط' : 'J’accepte les conditions'}</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                id="auth-submit-register-btn"
                disabled={isSubmitting}
                className="w-full py-2 px-4 bg-[#1A1918] text-[#FAF8F5] rounded-lg font-medium text-xs uppercase tracking-wider hover:bg-black transition-all flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-60 cursor-pointer mt-1"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-[#C5A880] border-t-transparent rounded-full animate-spin" />
                    <span>{language === 'ar' ? 'جارٍ التسجيل...' : 'Création...'}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
                    <span>{language === 'ar' ? 'إنشاء حساب العضوية' : 'Créer Mon Compte Privilège'}</span>
                  </>
                )}
              </button>

              {/* Switch to Login */}
              <div className="text-center pt-0.5 text-[11px] text-[#7E7569]">
                <span>{language === 'ar' ? 'لديك حساب بالفعل؟' : 'Déjà client ?'}{' '}</span>
                <button
                  type="button"
                  onClick={() => setAuthModalTab('login')}
                  className="font-semibold text-[#1A1918] hover:text-[#A66C44] underline transition-colors"
                >
                  {language === 'ar' ? 'تسجيل الدخول' : 'Se connecter'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer Benefits - Ultra Sleek */}
        <div className="px-4 py-1.5 bg-[#F4EFEA] border-t border-[#EAE4DC] flex items-center justify-center gap-6 text-[10px] text-[#6B6255]">
          <div className="flex items-center gap-1">
            <Truck className="w-3 h-3 text-[#C5A880]" />
            <span>Livraison 58 Wilayas</span>
          </div>
          <div className="h-2.5 w-px bg-[#DDD5CA]" />
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-[#C5A880]" />
            <span>Paiement à la Livraison (COD)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

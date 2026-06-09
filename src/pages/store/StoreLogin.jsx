import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useLang } from '@/lib/LanguageContext';
import { translations } from '@/lib/i18n';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function StoreLogin() {
  const { lang } = useLang();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/store/account';
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const a = translations.auth;

  const handleLogin = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    await base44.auth.loginViaEmailPassword(email, password);
    window.location.href = redirectTo;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) { setError(lang === 'ar' ? 'كلمتا المرور غير متطابقتين' : 'Passwords do not match'); return; }
    setError(''); setLoading(true);
    await base44.auth.register({ email, password, full_name: fullName });
    setMode('otp'); setLoading(false);
  };

  const handleOtp = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    const res = await base44.auth.verifyOtp({ email, otpCode });
    base44.auth.setToken(res.access_token);
    window.location.href = redirectTo;
  };

  return (
    <div className="min-h-screen bg-store-bg flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/store" className="inline-flex items-center gap-2">
            <div className="w-9 h-9 bg-brand-primary rounded-xl flex items-center justify-center"><span className="text-white font-heading font-black text-sm">O</span></div>
            <span className="font-heading font-black text-corp-dark text-xl tracking-wider">OPTIVANCE</span>
          </Link>
          <p className="text-slate-500 text-sm mt-2">{lang === 'ar' ? 'المتجر الرقمي' : 'Digital Store'}</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8">
          {mode !== 'otp' && (
            <div className="flex rounded-xl bg-slate-100 p-1 mb-8">
              {['login', 'register'].map(m => (
                <button key={m} onClick={() => { setMode(m); setError(''); }}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mode === m ? 'bg-white shadow text-corp-dark' : 'text-slate-500'}`}>
                  {m === 'login' ? a.login[lang] : a.register[lang]}
                </button>
              ))}
            </div>
          )}

          {error && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm mb-5">{error}</div>}

          {mode !== 'otp' && (
            <>
              <button onClick={() => base44.auth.loginWithProvider('google', redirectTo)}
                className="w-full py-3 rounded-xl border border-slate-200 flex items-center justify-center gap-3 text-slate-700 font-medium text-sm hover:bg-slate-50 transition-all mb-4">
                <svg viewBox="0 0 24 24" width="18" height="18">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {a.loginWithGoogle[lang]}
              </button>
              <div className="flex items-center gap-3 mb-4"><div className="flex-1 h-px bg-slate-100"></div><span className="text-slate-400 text-xs">{a.orDivider[lang]}</span><div className="flex-1 h-px bg-slate-100"></div></div>
            </>
          )}

          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">{a.email[lang]}</label>
                <div className="relative"><Mail size={15} className="absolute start-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full border border-slate-200 rounded-xl ps-9 pe-4 py-3 text-sm focus:outline-none focus:border-brand-primary" placeholder="email@example.com" /></div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">{a.password[lang]}</label>
                <div className="relative"><Lock size={15} className="absolute start-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required className="w-full border border-slate-200 rounded-xl ps-9 pe-10 py-3 text-sm focus:outline-none focus:border-brand-primary" />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute end-3 top-1/2 -translate-y-1/2 text-slate-400">{showPass ? <EyeOff size={15} /> : <Eye size={15} />}</button>
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-authority w-full py-3 rounded-xl disabled:opacity-60 flex items-center justify-center gap-2">
                {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : a.login[lang]}
              </button>
            </form>
          )}

          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">{a.fullName[lang]}</label>
                <div className="relative"><User size={15} className="absolute start-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input value={fullName} onChange={e => setFullName(e.target.value)} required className="w-full border border-slate-200 rounded-xl ps-9 pe-4 py-3 text-sm focus:outline-none focus:border-brand-primary" /></div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">{a.email[lang]}</label>
                <div className="relative"><Mail size={15} className="absolute start-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full border border-slate-200 rounded-xl ps-9 pe-4 py-3 text-sm focus:outline-none focus:border-brand-primary" /></div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">{a.password[lang]}</label>
                <div className="relative"><Lock size={15} className="absolute start-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full border border-slate-200 rounded-xl ps-9 pe-4 py-3 text-sm focus:outline-none focus:border-brand-primary" /></div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">{a.confirmPassword[lang]}</label>
                <div className="relative"><Lock size={15} className="absolute start-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="w-full border border-slate-200 rounded-xl ps-9 pe-4 py-3 text-sm focus:outline-none focus:border-brand-primary" /></div>
              </div>
              <button type="submit" disabled={loading} className="btn-catalyst w-full py-3 rounded-xl disabled:opacity-60 flex items-center justify-center">
                {loading ? <div className="w-4 h-4 border-2 border-corp-dark/30 border-t-corp-dark rounded-full animate-spin"></div> : a.register[lang]}
              </button>
            </form>
          )}

          {mode === 'otp' && (
            <form onSubmit={handleOtp} className="space-y-5">
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-brand-accent/10 flex items-center justify-center mx-auto mb-3"><Mail size={22} className="text-brand-accent" /></div>
                <h3 className="font-heading font-bold text-corp-dark text-xl mb-1">{lang === 'ar' ? 'تحقق من بريدك' : 'Check Your Email'}</h3>
                <p className="text-slate-500 text-sm">{lang === 'ar' ? `أرسلنا رمز التحقق إلى ${email}` : `We sent a code to ${email}`}</p>
              </div>
              <input value={otpCode} onChange={e => setOtpCode(e.target.value)} required maxLength={6}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-center text-2xl font-bold tracking-widest focus:outline-none focus:border-brand-primary" placeholder="000000" />
              <button type="submit" disabled={loading} className="btn-catalyst w-full py-3 rounded-xl disabled:opacity-60">{loading ? '...' : lang === 'ar' ? 'تأكيد' : 'Verify'}</button>
              <button type="button" onClick={() => base44.auth.resendOtp(email)} className="w-full text-slate-500 text-sm hover:text-brand-primary transition-colors">
                {lang === 'ar' ? 'إعادة إرسال الرمز' : 'Resend Code'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
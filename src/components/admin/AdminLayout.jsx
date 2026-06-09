import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useLang } from '@/lib/LanguageContext';
import { translations } from '@/lib/i18n';
import { LayoutDashboard, Package, BarChart2, ShoppingBag, MessageSquare, Users, LogOut, Globe, Menu, X, ChevronRight, ChevronLeft } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function AdminLayout() {
  const { lang, isRTL, toggleLang } = useLang();
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const t = translations.admin;

  useEffect(() => {
    base44.auth.isAuthenticated().then(async authed => {
      if (!authed) { navigate('/store/login'); return; }
      const me = await base44.auth.me();
      if (me.role !== 'admin') { navigate('/store'); return; }
      setUser(me);
    });
  }, []);

  const navItems = [
    { to: '/admin', label: t.dashboard[lang], icon: LayoutDashboard },
    { to: '/admin/products', label: t.products[lang], icon: Package },
    { to: '/admin/assessments', label: t.assessments[lang], icon: BarChart2 },
    { to: '/admin/orders', label: t.orders[lang], icon: ShoppingBag },
    { to: '/admin/consultations', label: t.consultations[lang], icon: MessageSquare },
    { to: '/admin/clients', label: t.clients[lang], icon: Users },
  ];

  const Chevron = isRTL ? ChevronLeft : ChevronRight;

  return (
    <div className="min-h-screen bg-slate-50 flex" dir={isRTL ? 'rtl' : 'ltr'}>
      <aside className={`fixed inset-y-0 ${isRTL ? 'right-0' : 'left-0'} w-60 bg-corp-dark text-white flex flex-col z-40 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : isRTL ? 'translate-x-full lg:translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-5 border-b border-white/10">
          <Link to="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #05E1AE, #1A3A5C)' }}>
              <span className="text-white font-heading font-black text-sm">O</span>
            </div>
            <span className="font-heading font-black text-white text-base tracking-wider">OPTIVANCE</span>
          </Link>
          <p className="text-white/40 text-xs mt-1">{lang === 'ar' ? 'لوحة الإدارة' : 'Admin Panel'}</p>
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-1 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            const active = location.pathname === item.to;
            return (
              <Link key={item.to} to={item.to} onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${active ? 'bg-brand-accent/20 text-brand-accent' : 'text-white/60 hover:bg-white/10 hover:text-white'}`}>
                <Icon size={16} />{item.label}
                {active && <Chevron size={12} className="ms-auto" />}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white">{user?.full_name?.charAt(0) || 'A'}</div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-xs font-medium truncate">{user?.full_name || '...'}</div>
              <div className="text-white/40 text-xs truncate">{user?.email || ''}</div>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={toggleLang} className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/60 text-xs transition-all">
              <Globe size={12} /> {lang === 'ar' ? 'EN' : 'عر'}
            </button>
            <button onClick={() => base44.auth.logout('/')} className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl bg-white/10 hover:bg-red-500/20 text-white/60 hover:text-red-400 text-xs transition-all">
              <LogOut size={12} /> {translations.nav.logout[lang]}
            </button>
          </div>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="flex-1 lg:ms-60 flex flex-col min-w-0">
        <div className="lg:hidden sticky top-0 z-20 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 text-slate-600">{sidebarOpen ? <X size={20} /> : <Menu size={20} />}</button>
          <span className="font-heading font-bold text-corp-dark text-sm">OPTIVANCE Admin</span>
          <div />
        </div>
        <main className="flex-1 p-6 max-w-6xl mx-auto w-full"><Outlet /></main>
      </div>
    </div>
  );
}
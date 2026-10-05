import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BadgePercent, Check, Lock, ShieldCheck, Zap, FileText, ArrowLeft, ArrowRight } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { OFFER, currencyLabel } from '@/lib/quickCareerOffer';
import QuickCountdown from '@/components/store/quick/QuickCountdown';

/**
 * QuickOfferCard — the ad offer: anchored price, live countdown, benefits and CTA.
 * Shared by the ad landing, the unlock gate and the result page.
 */
export default function QuickOfferCard({ lang = 'ar', isRTL = true }) {
  const navigate = useNavigate();
  const t = (ar, en) => (lang === 'ar' ? ar : en);
  const Arrow = isRTL ? ArrowLeft : ArrowRight;
  const currency = currencyLabel(lang);

  const handleCta = async () => {
    const authed = await base44.auth.isAuthenticated().catch(() => false);
    if (authed) navigate(OFFER.ctaPath);
    else navigate('/store/login?redirect=' + encodeURIComponent(OFFER.ctaPath));
  };

  const trust = [
    { icon: Zap, label: t('الخصم يُفعّل على حسابك فورًا', 'Discount applied to your account instantly') },
    { icon: ShieldCheck, label: t('بياناتك محفوظة بسرية كاملة', 'Your data stays fully private') },
    { icon: FileText, label: t('تقرير PDF قابل للتحميل', 'Downloadable PDF report') },
  ];

  return (
    <div className="rounded-3xl overflow-hidden border border-slate-100 bg-white shadow-sm">
      {/* Price header */}
      <div className="px-6 pt-6 pb-5" style={{ background: 'linear-gradient(135deg, #0D1F33, #1A3A5C)' }}>
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="inline-flex items-center gap-1.5 bg-brand-accent/20 border border-brand-accent/30 rounded-full px-3 py-1">
            <BadgePercent size={13} className="text-brand-accent" />
            <span className="text-brand-accent text-xs font-bold">
              {t(`خصم ${OFFER.discountPercent}% لزوار الإعلان`, `${OFFER.discountPercent}% ad-exclusive discount`)}
            </span>
          </div>
          <span className="text-white/40 text-xs">{t('العرض محدود', 'Limited offer')}</span>
        </div>

        <h3 className="font-heading font-black text-white text-xl mb-1">
          {t('المقياس المهني الكامل', 'The Complete Career Assessment')}
        </h3>
        <p className="text-white/50 text-xs mb-5 leading-relaxed">
          {lang === 'ar' ? OFFER.valueLine.ar : OFFER.valueLine.en}
        </p>

        <div className="flex items-end justify-between gap-4">
          <div className="flex items-baseline gap-2">
            <span className="text-white/35 text-sm line-through tabular-nums">{OFFER.regularPrice}</span>
            <span className="font-heading font-black text-4xl text-white tabular-nums">{OFFER.offerPrice}</span>
            <span className="text-white/50 text-sm">{currency}</span>
          </div>
          <span className="bg-brand-accent text-corp-dark text-xs font-black px-2.5 py-1 rounded-lg" dir="ltr">
            -{OFFER.discountPercent}%
          </span>
        </div>

        <div className="mt-4">
          <QuickCountdown lang={lang} tone="dark" />
        </div>
      </div>

      {/* Benefits + CTA */}
      <div className="px-6 py-5">
        <div className="space-y-2.5 mb-5">
          {(lang === 'ar' ? OFFER.benefits.ar : OFFER.benefits.en).map((item, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <Check size={14} className="text-brand-accent flex-shrink-0" />
              <span className="text-sm text-slate-600">{item}</span>
            </div>
          ))}
        </div>

        <button
          onClick={handleCta}
          className="w-full py-4 rounded-2xl font-heading font-black text-base text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.99]"
          style={{ background: 'linear-gradient(135deg, #1A3A5C, #05E1AE)' }}
        >
          <Lock size={15} />
          {t(`افتح تقريري بـ ${OFFER.offerPrice} ${currency}`, `Unlock my report for ${OFFER.offerPrice} ${currency}`)}
          <Arrow size={16} />
        </button>

        <div className="grid grid-cols-1 gap-2 mt-4">
          {trust.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="flex items-center gap-2">
                <Icon size={12} className="text-slate-400 flex-shrink-0" />
                <span className="text-xs text-slate-400">{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
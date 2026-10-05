// ═══════════════════════════════════════════════════════════════════════════════
// Quick funnel — ad offer configuration.
// Every price, discount and countdown number in the ad funnel reads from here,
// so the whole offer can be tuned in one place.
// ═══════════════════════════════════════════════════════════════════════════════

export const OFFER = {
  regularPrice: 499,
  offerPrice: 99,
  discountPercent: 80,
  windowMinutes: 30,
  ctaPath: '/store/career/intake',
  valueLine: {
    ar: 'المقياس الكامل + تقرير من 9 صفحات + خطة عمل 90 يومًا',
    en: 'Full assessment + 9-page report + 90-day action plan',
  },
  benefits: {
    ar: [
      'المقياس المهني الكامل: 150 سؤالًا و6 أبعاد',
      'رمز هولاند النهائي (RIASEC)',
      'تحليل قيم العمل ونقاط القوة',
      'مسارات مهنية مطابقة بالاسم',
      'تقرير PDF احترافي من 9 صفحات',
      'خطة عمل شخصية لـ 90 يومًا',
    ],
    en: [
      'Complete career assessment: 150 questions, 6 dimensions',
      'Your final Holland Code (RIASEC)',
      'Work values and strengths analysis',
      'Career paths matched by name',
      'Professional 9-page PDF report',
      'Personalized 90-day action plan',
    ],
  },
};

export const OFFER_DEADLINE_KEY = 'quick_career_offer_deadline';

export function currencyLabel(lang) {
  return lang === 'ar' ? 'ر.س' : 'SAR';
}

/** Returns a live deadline, refreshing the window when the previous one lapsed. */
export function getOfferDeadline() {
  try {
    const stored = Number(localStorage.getItem(OFFER_DEADLINE_KEY) || 0);
    if (stored > Date.now()) return stored;
  } catch { /* storage unavailable — fall through */ }
  return renewOfferDeadline();
}

export function renewOfferDeadline() {
  const deadline = Date.now() + OFFER.windowMinutes * 60 * 1000;
  try { localStorage.setItem(OFFER_DEADLINE_KEY, String(deadline)); } catch { /* ignore */ }
  return deadline;
}

/** True once the visitor has entered the ad funnel (used to show the saved discount). */
export function hasFunnelEntry() {
  try { return Number(localStorage.getItem(OFFER_DEADLINE_KEY) || 0) > 0; } catch { return false; }
}
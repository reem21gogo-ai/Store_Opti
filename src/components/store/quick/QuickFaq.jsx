import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { QUICK_TOTAL } from '@/lib/quickCareerQuestions';
import { OFFER } from '@/lib/quickCareerOffer';

const ITEMS = {
  ar: [
    {
      q: 'هل الاختبار مجاني فعلًا؟',
      a: `${QUICK_TOTAL} أسئلة مجانية بالكامل وبدون تسجيل، وستحصل على ملفك المهني الأولي مباشرة بعد الانتهاء.`,
    },
    {
      q: 'لماذا تطلبون بياناتي؟',
      a: 'الاسم ووسيلة تواصل واحدة فقط لحفظ ملفك وربطه بتقريرك، حتى تستطيع إكمال المقياس الكامل لاحقًا. لا نشارك بياناتك مع أي طرف آخر.',
    },
    {
      q: 'هل النتيجة علمية؟',
      a: 'المقياس مبني على نموذج RIASEC المعتمد عالميًا في تحديد الميول المهنية، والنتائج تُحسب بمعادلة رياضية مباشرة دون أي تخمين.',
    },
    {
      q: 'ما الفرق بين المقياس السريع والكامل؟',
      a: `السريع يعطيك مؤشرًا أوليًا من ${QUICK_TOTAL} أسئلة. الكامل يقيس 150 سؤالًا عبر 6 أبعاد وينتج تقرير PDF من 9 صفحات مع خطة عمل لـ 90 يومًا.`,
    },
    {
      q: 'كم يستغرق المقياس الكامل؟',
      a: 'حوالي 40 إلى 45 دقيقة، ويمكنك إكماله على مراحل لأن إجاباتك تُحفظ تلقائيًا بعد كل سؤال.',
    },
    {
      q: 'إلى متى يستمر الخصم؟',
      a: `قيمة الخصم ${OFFER.discountPercent}%، ويسري حتى انتهاء المهلة الظاهرة أعلى الصفحة.`,
    },
  ],
  en: [
    {
      q: 'Is the test really free?',
      a: `All ${QUICK_TOTAL} questions are free and need no sign-up, and you get your preliminary career profile right after finishing.`,
    },
    {
      q: 'Why do you ask for my details?',
      a: 'Only your name and one contact detail so we can save your profile and link it to your report, letting you continue to the full assessment later. We never share your data.',
    },
    {
      q: 'Is the result scientifically grounded?',
      a: 'The assessment is built on the globally recognized RIASEC model of career interests, and results are computed with a direct mathematical formula — no guesswork.',
    },
    {
      q: 'What is the difference between the quick and full assessment?',
      a: `The quick version gives you an initial indication from ${QUICK_TOTAL} questions. The full version measures 150 questions across 6 dimensions and produces a 9-page PDF report with a 90-day action plan.`,
    },
    {
      q: 'How long does the full assessment take?',
      a: 'Around 40 to 45 minutes, and you can complete it in stages because every answer is saved automatically.',
    },
    {
      q: 'How long does the discount last?',
      a: `The discount is ${OFFER.discountPercent}% off, and it stays valid until the countdown at the top of the page ends.`,
    },
  ],
};

export default function QuickFaq({ lang = 'ar' }) {
  const items = ITEMS[lang === 'ar' ? 'ar' : 'en'];

  return (
    <section className="px-5 py-12">
      <div className="max-w-2xl mx-auto">
        <h2 className="font-heading font-black text-corp-dark text-xl text-center mb-6">
          {lang === 'ar' ? 'أسئلة يتكرر سؤالها' : 'Frequently asked questions'}
        </h2>
        <Accordion type="single" collapsible className="w-full">
          {items.map((item, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="border-slate-100">
              <AccordionTrigger className="text-start text-sm font-semibold text-corp-dark hover:no-underline">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-slate-500 leading-relaxed">{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLang } from '@/lib/LanguageContext';
import { translations } from '@/lib/i18n';
import { ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const SAMPLE_QUESTIONS = [
  { id: 'q1', question_ar: 'كيف تقيّم قدرتك على اتخاذ القرارات الصعبة تحت الضغط؟', question_en: 'How do you rate your ability to make difficult decisions under pressure?', question_type: 'scale_5', weight: 2, dimension: 'decision_making' },
  { id: 'q2', question_ar: 'هل تتحدث بوضوح ومباشرة مع فريقك حول التوقعات؟', question_en: 'Do you communicate clearly with your team about expectations?', question_type: 'yes_no', weight: 1, dimension: 'communication' },
  { id: 'q3', question_ar: 'ما مدى قدرتك على إلهام فريقك وتحفيزه نحو الأهداف؟', question_en: 'How well can you inspire and motivate your team toward goals?', question_type: 'scale_10', weight: 2, dimension: 'inspiration' },
  { id: 'q4', question_ar: 'ما الجانب الأكثر أهمية للقيادة الفعّالة في رأيك؟', question_en: 'What aspect of leadership do you consider most important?', question_type: 'mcq', weight: 1, dimension: 'values', options: [{ value: 'vision', ar: 'الرؤية', en: 'Vision' }, { value: 'communication', ar: 'التواصل', en: 'Communication' }, { value: 'empathy', ar: 'التعاطف', en: 'Empathy' }, { value: 'results', ar: 'النتائج', en: 'Results' }] },
  { id: 'q5', question_ar: 'اذكر أهم تحدٍّ قيادي تواجهه حالياً', question_en: 'Describe the most significant leadership challenge you currently face', question_type: 'open_text', weight: 1, dimension: 'self_awareness' },
];

export default function TakeAssessment() {
  const { id } = useParams();
  const { lang, isRTL } = useLang();
  const navigate = useNavigate();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;
  const BackArrow = isRTL ? ArrowRight : ArrowLeft;
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [openTextValue, setOpenTextValue] = useState('');

  useEffect(() => {
    initAssessment();
  }, [id]);

  const initAssessment = async () => {
    setLoading(true);
    const user = await base44.auth.me();
    if (!user) { navigate('/store/login'); return; }

    const [asmts, qs] = await Promise.all([
      base44.entities.Assessment.filter({ id }),
      base44.entities.AssessmentQuestion.filter({ assessment_id: id }, 'sort_order', 50),
    ]);

    const questionData = qs.length > 0 ? qs : SAMPLE_QUESTIONS;
    setQuestions(questionData);

    const existing = await base44.entities.AssessmentAttempt.filter({ assessment_id: id, user_id: user.id, status: 'in_progress' });
    if (existing.length > 0) {
      setAttempt(existing[0]);
      setAnswers(existing[0].answers || {});
      setCurrentIndex(existing[0].current_question_index || 0);
    } else {
      const newAttempt = await base44.entities.AssessmentAttempt.create({
        assessment_id: id, user_id: user.id, user_email: user.email, user_name: user.full_name,
        status: 'in_progress', answers: {}, current_question_index: 0,
      });
      setAttempt(newAttempt);
    }
    setLoading(false);
  };

  const saveProgress = async (newAnswers, idx) => {
    if (!attempt) return;
    await base44.entities.AssessmentAttempt.update(attempt.id, { answers: newAnswers, current_question_index: idx, status: 'in_progress' });
  };

  const handleAnswer = (value) => {
    const newAnswers = { ...answers, [questions[currentIndex].id]: value };
    setAnswers(newAnswers);
    saveProgress(newAnswers, currentIndex);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) { const next = currentIndex + 1; setCurrentIndex(next); saveProgress(answers, next); setOpenTextValue(answers[questions[next]?.id] || ''); }
  };

  const handlePrev = () => {
    if (currentIndex > 0) { const prev = currentIndex - 1; setCurrentIndex(prev); setOpenTextValue(answers[questions[prev]?.id] || ''); }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const maxScore = questions.reduce((s, q) => s + 10 * (q.weight || 1), 0) || 100;
    let score = 0;
    questions.forEach(q => {
      const a = answers[q.id];
      if (!a) return;
      if (q.question_type === 'scale_5') score += (a / 5) * 10 * (q.weight || 1);
      else if (q.question_type === 'scale_10') score += a * (q.weight || 1);
      else if (q.question_type === 'yes_no') score += (a === 'yes' ? 10 : 3) * (q.weight || 1);
      else score += 7 * (q.weight || 1);
    });
    const pct = Math.round((score / maxScore) * 100);
    const level = pct >= 80 ? (lang === 'ar' ? 'متقدم' : 'Advanced') : pct >= 60 ? (lang === 'ar' ? 'متوسط متقدم' : 'Upper Intermediate') : pct >= 40 ? (lang === 'ar' ? 'متوسط' : 'Intermediate') : (lang === 'ar' ? 'مبتدئ' : 'Beginner');
    const strengths = lang === 'ar' ? ['اتخاذ القرار تحت الضغط', 'الوضوح في التواصل'] : ['Decision-making under pressure', 'Clear communication'];
    const improvements = lang === 'ar' ? ['التفويض الفعّال', 'التفكير الاستراتيجي'] : ['Effective delegation', 'Strategic thinking'];
    const recommendations = pct >= 70
      ? (lang === 'ar' ? ['انضم لبرنامج القيادة التنفيذية', 'طوّر مهاراتك الاستراتيجية'] : ['Join an executive leadership program', 'Develop your strategic skills'])
      : (lang === 'ar' ? ['ابدأ بأساسيات القيادة', 'اطلب برنامج تدريب مخصص'] : ['Start with leadership fundamentals', 'Request a customized training program']);

    await base44.entities.AssessmentAttempt.update(attempt.id, {
      status: 'completed', total_score: Math.round(score), percentage: pct, level,
      completed_at: new Date().toISOString(), report_data: { score: Math.round(score), percentage: pct, level, strengths, improvements, recommendations },
    });
    navigate(`/store/assessments/${id}/results/${attempt.id}`);
  };

  if (loading) return <div className="min-h-screen bg-store-bg flex items-center justify-center"><div className="w-8 h-8 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin"></div></div>;

  const question = questions[currentIndex];
  const currentAnswer = answers[question?.id];
  const progress = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;
  const isLast = currentIndex === questions.length - 1;

  return (
    <div className="min-h-screen bg-store-bg flex flex-col">
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="bg-white/90 backdrop-blur-sm border-b border-slate-100 px-6 py-3 flex items-center gap-4">
          <button onClick={handlePrev} disabled={currentIndex === 0} className="text-slate-400 disabled:opacity-30 hover:text-slate-600 transition-colors">
            <BackArrow size={18} />
          </button>
          <div className="flex-1">
            <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
              <div className="assessment-progress h-full rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
          <span className="text-sm font-medium text-slate-500 flex-shrink-0">{currentIndex + 1} / {questions.length}</span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">{translations.assessment.questions[lang]} {currentIndex + 1}</div>
            <h2 className="font-heading font-bold text-corp-dark text-2xl md:text-3xl mb-8 leading-snug">{question?.[`question_${lang}`] || question?.question_ar}</h2>

            {question?.question_type === 'yes_no' && (
              <div className="grid grid-cols-2 gap-4">
                {[{ value: 'yes', ar: 'نعم', en: 'Yes' }, { value: 'no', ar: 'لا', en: 'No' }].map(opt => (
                  <button key={opt.value} onClick={() => handleAnswer(opt.value)}
                    className={`py-5 rounded-2xl border-2 font-heading font-bold text-xl transition-all ${currentAnswer === opt.value ? 'border-brand-accent bg-brand-accent/10 text-corp-dark' : 'border-slate-100 hover:border-brand-primary/50 text-slate-600'}`}>
                    {opt[lang]}
                  </button>
                ))}
              </div>
            )}

            {question?.question_type === 'mcq' && (
              <div className="flex flex-col gap-3">
                {question.options?.map(opt => (
                  <button key={opt.value} onClick={() => handleAnswer(opt.value)}
                    className={`py-4 px-5 rounded-xl border-2 text-start font-medium transition-all ${currentAnswer === opt.value ? 'border-brand-accent bg-brand-accent/10 text-corp-dark' : 'border-slate-100 hover:border-brand-primary/50 text-slate-600'}`}>
                    {opt[lang] || opt.ar}
                  </button>
                ))}
              </div>
            )}

            {(question?.question_type === 'scale_5' || question?.question_type === 'scale_10') && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-slate-400">{lang === 'ar' ? 'ضعيف جداً' : 'Very weak'}</span>
                  <span className="text-xs text-slate-400">{lang === 'ar' ? 'ممتاز' : 'Excellent'}</span>
                </div>
                <div className="flex gap-2">
                  {Array.from({ length: question.question_type === 'scale_5' ? 5 : 10 }, (_, i) => i + 1).map(n => (
                    <button key={n} onClick={() => handleAnswer(n)}
                      className={`flex-1 py-4 rounded-xl font-heading font-bold text-lg transition-all ${currentAnswer === n ? 'bg-brand-accent text-corp-dark shadow-md' : 'bg-slate-50 hover:bg-brand-primary/10 text-slate-600'}`}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {question?.question_type === 'open_text' && (
              <textarea value={openTextValue} onChange={e => { setOpenTextValue(e.target.value); handleAnswer(e.target.value); }} rows={4}
                className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-brand-primary resize-none"
                placeholder={lang === 'ar' ? 'اكتب إجابتك هنا...' : 'Write your answer here...'} />
            )}

            <div className="flex items-center justify-between mt-10">
              <button onClick={handlePrev} disabled={currentIndex === 0} className="flex items-center gap-2 text-slate-400 disabled:opacity-30 hover:text-slate-600 transition-colors text-sm">
                <BackArrow size={16} /> {translations.assessment.previous[lang]}
              </button>
              {isLast ? (
                <button onClick={handleSubmit} disabled={submitting || (!currentAnswer && question?.question_type !== 'open_text')}
                  className="btn-catalyst px-8 py-3 rounded-full flex items-center gap-2 disabled:opacity-60">
                  {submitting ? <div className="w-4 h-4 border-2 border-corp-dark/30 border-t-corp-dark rounded-full animate-spin"></div> : <CheckCircle size={16} />}
                  {translations.assessment.submit[lang]}
                </button>
              ) : (
                <button onClick={handleNext} disabled={!currentAnswer && question?.question_type !== 'open_text'}
                  className="btn-authority px-8 py-3 rounded-full flex items-center gap-2 disabled:opacity-60">
                  {translations.assessment.next[lang]} <Arrow size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
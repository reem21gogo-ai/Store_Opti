import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLang } from '@/lib/LanguageContext';
import { ArrowRight, ArrowLeft, CheckCircle, Clock, Zap } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const TIMER_SECONDS = 25;

const SAMPLE_QUESTIONS = [
  { id: 'q1', question_ar: 'عند مواجهة قرار صعب تحت الضغط، ما الذي يوجه تفكيرك أولاً؟', question_en: 'When facing a difficult decision under pressure, what guides your thinking first?', question_type: 'mcq', weight: 2, dimension: 'decision_style', options: [{ value: 'a', ar: 'البيانات والتحليل الموضوعي', en: 'Data and objective analysis' }, { value: 'b', ar: 'حدسي وتجاربي السابقة', en: 'My intuition and past experience' }, { value: 'c', ar: 'تأثير القرار على الفريق', en: 'The impact on my team' }, { value: 'd', ar: 'الهدف النهائي والنتيجة المطلوبة', en: 'The end goal and desired outcome' }] },
  { id: 'q2', question_ar: 'كيف يصف زملاؤك أسلوبك في التعامل مع التحديات؟', question_en: 'How would colleagues describe your approach to challenges?', question_type: 'mcq', weight: 2, dimension: 'self_perception', options: [{ value: 'a', ar: 'منهجي ومنظم', en: 'Systematic and organized' }, { value: 'b', ar: 'مبدع وتلقائي', en: 'Creative and spontaneous' }, { value: 'c', ar: 'داعم وتعاوني', en: 'Supportive and collaborative' }, { value: 'd', ar: 'حازم وموجه نحو النتائج', en: 'Decisive and results-driven' }] },
  { id: 'q3', question_ar: 'ما مدى راحتك في تفويض المهام المهمة لأعضاء فريقك؟', question_en: 'How comfortable are you delegating important tasks to team members?', question_type: 'scale_5', weight: 2, dimension: 'delegation' },
  { id: 'q4', question_ar: 'هل تستطيع التعبير عن رؤيتك بوضوح لفريقك؟', question_en: 'Can you clearly articulate your vision to your team?', question_type: 'yes_no', weight: 1, dimension: 'communication' },
  { id: 'q5', question_ar: 'ما مدى تركيزك على تطوير أعضاء فريقك بشكل فردي؟', question_en: 'How much do you focus on developing team members individually?', question_type: 'scale_10', weight: 2, dimension: 'people_development' },
  { id: 'q6', question_ar: 'ما الذي تراه أهم مسؤوليات القائد؟', question_en: 'What do you consider the leader\'s most critical responsibility?', question_type: 'mcq', weight: 1, dimension: 'leadership_values', options: [{ value: 'a', ar: 'تحقيق الأهداف والنتائج', en: 'Achieving goals and results' }, { value: 'b', ar: 'بناء ثقافة الفريق', en: 'Building team culture' }, { value: 'c', ar: 'التطوير المهني للأعضاء', en: 'Professional development of members' }, { value: 'd', ar: 'الابتكار والتحسين المستمر', en: 'Innovation and continuous improvement' }] },
  { id: 'q7', question_ar: 'كيف تتعامل مع الصراعات داخل الفريق؟', question_en: 'How do you handle conflicts within your team?', question_type: 'mcq', weight: 2, dimension: 'conflict_resolution', options: [{ value: 'a', ar: 'أتدخل فوراً وأحسم الأمر', en: 'I intervene immediately and resolve it decisively' }, { value: 'b', ar: 'أستمع للطرفين وأوجد حلاً وسطاً', en: 'I listen to both sides and find a middle ground' }, { value: 'c', ar: 'أشجع الفريق على حله ذاتياً', en: 'I encourage the team to resolve it themselves' }, { value: 'd', ar: 'أحلله لفهم جذوره قبل التدخل', en: 'I analyze its root causes before intervening' }] },
];

export default function TakeAssessment() {
  const { id } = useParams();
  const { lang, isRTL } = useLang();
  const navigate = useNavigate();
  const BackArrow = isRTL ? ArrowRight : ArrowLeft;

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [openTextValue, setOpenTextValue] = useState('');

  // Timer state
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [timerActive, setTimerActive] = useState(false);
  const [justAnswered, setJustAnswered] = useState(false);
  const timerRef = useRef(null);
  const autoAdvanceRef = useRef(null);

  useEffect(() => {
    initAssessment();
  }, [id]);

  // Reset + start timer whenever question changes
  useEffect(() => {
    if (!loading && questions.length > 0) {
      clearInterval(timerRef.current);
      clearTimeout(autoAdvanceRef.current);
      setTimeLeft(TIMER_SECONDS);
      setTimerActive(true);
      setJustAnswered(false);
    }
  }, [currentIndex, loading, questions.length]);

  // Timer countdown
  useEffect(() => {
    if (!timerActive) return;
    if (timeLeft <= 0) {
      setTimerActive(false);
      // Auto-advance on timeout (even without answer)
      autoAdvanceRef.current = setTimeout(() => {
        advanceQuestion();
      }, 400);
      return;
    }
    timerRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [timeLeft, timerActive]);

  const advanceQuestion = useCallback(() => {
    setJustAnswered(false);
    if (currentIndex < questions.length - 1) {
      const next = currentIndex + 1;
      setCurrentIndex(next);
    } else {
      submitAssessment();
    }
  }, [currentIndex, questions.length]);

  const initAssessment = async () => {
    setLoading(true);
    const user = await base44.auth.me();
    if (!user) { navigate('/store/login'); return; }

    const [, qs] = await Promise.all([
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
    await base44.entities.AssessmentAttempt.update(attempt.id, {
      answers: newAnswers, current_question_index: idx, status: 'in_progress'
    });
  };

  const handleAnswer = (value) => {
    const q = questions[currentIndex];
    const newAnswers = { ...answers, [q.id]: value };
    setAnswers(newAnswers);
    saveProgress(newAnswers, currentIndex);

    // Stop timer and auto-advance after brief visual confirmation
    setTimerActive(false);
    clearTimeout(timerRef.current);
    setJustAnswered(true);

    autoAdvanceRef.current = setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(i => i + 1);
      } else {
        submitAssessmentWithAnswers(newAnswers);
      }
    }, 600);
  };

  const handlePrev = () => {
    clearTimeout(autoAdvanceRef.current);
    clearInterval(timerRef.current);
    if (currentIndex > 0) {
      const prev = currentIndex - 1;
      setCurrentIndex(prev);
      setOpenTextValue(answers[questions[prev]?.id] || '');
    }
  };

  const submitAssessmentWithAnswers = async (finalAnswers) => {
    setSubmitting(true);
    const maxScore = questions.reduce((s, q) => s + 10 * (q.weight || 1), 0) || 100;
    let score = 0;
    questions.forEach(q => {
      const a = finalAnswers[q.id];
      if (!a) return;
      if (q.question_type === 'scale_5') score += (a / 5) * 10 * (q.weight || 1);
      else if (q.question_type === 'scale_10') score += a * (q.weight || 1);
      else if (q.question_type === 'yes_no') score += (a === 'yes' ? 10 : 3) * (q.weight || 1);
      else score += 7 * (q.weight || 1);
    });
    const pct = Math.round((score / maxScore) * 100);
    const level = pct >= 80 ? (lang === 'ar' ? 'متقدم' : 'Advanced') : pct >= 60 ? (lang === 'ar' ? 'متوسط متقدم' : 'Upper Intermediate') : pct >= 40 ? (lang === 'ar' ? 'متوسط' : 'Intermediate') : (lang === 'ar' ? 'مبتدئ' : 'Beginner');
    await base44.entities.AssessmentAttempt.update(attempt.id, {
      status: 'completed', total_score: Math.round(score), percentage: pct, level,
      completed_at: new Date().toISOString(),
      report_data: {
        score: Math.round(score), percentage: pct, level,
        strengths: lang === 'ar' ? ['اتخاذ القرار تحت الضغط', 'الوضوح في التواصل', 'التوجه نحو النتائج'] : ['Decision-making under pressure', 'Clear communication', 'Results orientation'],
        improvements: lang === 'ar' ? ['التفويض الفعّال', 'التفكير الاستراتيجي', 'التطوير الفردي للفريق'] : ['Effective delegation', 'Strategic thinking', 'Individual team development'],
        recommendations: pct >= 70
          ? (lang === 'ar' ? ['انضم لبرنامج القيادة التنفيذية المتقدمة', 'طوّر مهاراتك الاستراتيجية مع مدرب متخصص', 'شارك في برنامج قيادة الفريق'] : ['Join an advanced executive leadership program', 'Develop strategic skills with a specialist coach', 'Participate in team leadership programs'])
          : (lang === 'ar' ? ['ابدأ بأساسيات القيادة الحديثة', 'اطلب برنامج تدريب مخصص من أوبتيفانس', 'التحق بدورة إدارة الفريق'] : ['Start with modern leadership fundamentals', 'Request a customized training from OPTIVANCE', 'Enroll in team management course']),
        dimensions: {
          decision_style: 82, self_perception: 75, delegation: 68, communication: 90, people_development: 72, leadership_values: 85, conflict_resolution: 78
        }
      },
    });
    navigate(`/store/assessments/${id}/results/${attempt.id}`);
  };

  const submitAssessment = () => submitAssessmentWithAnswers(answers);

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-white/10 border-t-white/60 rounded-full animate-spin"></div>
    </div>
  );

  const question = questions[currentIndex];
  const currentAnswer = answers[question?.id];
  const progress = questions.length > 0 ? (currentIndex / questions.length) * 100 : 0;
  const progressFilled = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;
  const timerPct = (timeLeft / TIMER_SECONDS) * 100;
  const timerColor = timeLeft > 15 ? '#05E1AE' : timeLeft > 8 ? '#F59E0B' : '#EF4444';

  return (
    <div className="min-h-screen flex flex-col" dir={isRTL ? 'rtl' : 'ltr'} style={{ background: '#0D1220' }}>
      {/* TOP BAR */}
      <div className="fixed top-0 left-0 right-0 z-50" style={{ background: 'rgba(13,18,32,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-4">
          <button onClick={handlePrev} disabled={currentIndex === 0} className="text-white/30 disabled:opacity-20 hover:text-white/70 transition-colors flex-shrink-0">
            <BackArrow size={18} />
          </button>

          {/* Progress bar */}
          <div className="flex-1 relative">
            {/* Segment dots */}
            <div className="flex gap-1 mb-1.5">
              {questions.map((_, i) => (
                <div
                  key={i}
                  className="flex-1 h-1.5 rounded-full transition-all duration-500"
                  style={{
                    background: i < currentIndex
                      ? '#05E1AE'
                      : i === currentIndex
                        ? `linear-gradient(90deg, #05E1AE ${timerPct}%, rgba(255,255,255,0.1) ${timerPct}%)`
                        : 'rgba(255,255,255,0.08)'
                  }}
                />
              ))}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/35 text-xs">{lang === 'ar' ? 'السؤال' : 'Question'} {currentIndex + 1} {lang === 'ar' ? 'من' : 'of'} {questions.length}</span>
              <span className="text-xs font-bold" style={{ color: timerColor }}>{Math.round(progress)}%</span>
            </div>
          </div>

          {/* Timer circle */}
          <div className="relative flex-shrink-0 w-12 h-12">
            <svg className="w-12 h-12 -rotate-90" viewBox="0 0 44 44">
              <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
              <circle cx="22" cy="22" r="18" fill="none" stroke={timerColor} strokeWidth="3"
                strokeDasharray={`${2 * Math.PI * 18}`}
                strokeDashoffset={`${2 * Math.PI * 18 * (1 - timerPct / 100)}`}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.5s ease' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-mono font-bold text-sm" style={{ color: timerColor }}>{timeLeft}</span>
            </div>
          </div>
        </div>
      </div>

      {/* QUESTION AREA */}
      <div className="flex-1 flex items-center justify-center px-4 pt-28 pb-12">
        <div className="max-w-2xl w-full">
          {/* Dimension badge */}
          {question?.dimension && (
            <div className="flex justify-center mb-5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium" style={{ background: 'rgba(5,225,174,0.1)', border: '1px solid rgba(5,225,174,0.2)', color: '#05E1AE' }}>
                <Zap size={10} />
                {question.dimension.replace(/_/g, ' ')}
              </span>
            </div>
          )}

          {/* Question card */}
          <div className={`rounded-3xl p-8 md:p-10 mb-6 transition-all duration-300 ${justAnswered ? 'scale-[0.99] opacity-75' : 'scale-100 opacity-100'}`}
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(10px)' }}>
            <h2 className="font-heading font-bold text-white text-xl md:text-2xl leading-snug mb-8">
              {question?.[`question_${lang}`] || question?.question_ar}
            </h2>

            {/* MCQ */}
            {question?.question_type === 'mcq' && (
              <div className="flex flex-col gap-3">
                {question.options?.map((opt, i) => {
                  const isSelected = currentAnswer === opt.value;
                  const letters = ['A', 'B', 'C', 'D', 'E'];
                  return (
                    <button key={opt.value} onClick={() => handleAnswer(opt.value)} disabled={justAnswered}
                      className="flex items-center gap-4 p-4 rounded-2xl text-start transition-all duration-200 group"
                      style={{
                        background: isSelected ? 'rgba(5,225,174,0.12)' : 'rgba(255,255,255,0.04)',
                        border: `2px solid ${isSelected ? '#05E1AE' : 'rgba(255,255,255,0.08)'}`,
                        transform: isSelected ? 'scale(1.01)' : 'scale(1)',
                      }}>
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-sm transition-all"
                        style={{ background: isSelected ? '#05E1AE' : 'rgba(255,255,255,0.08)', color: isSelected ? '#0D1220' : 'rgba(255,255,255,0.5)' }}>
                        {letters[i]}
                      </div>
                      <span className="font-medium text-sm" style={{ color: isSelected ? '#05E1AE' : 'rgba(255,255,255,0.8)' }}>
                        {opt[lang] || opt.ar}
                      </span>
                      {isSelected && <CheckCircle size={16} className="ms-auto flex-shrink-0" style={{ color: '#05E1AE' }} />}
                    </button>
                  );
                })}
              </div>
            )}

            {/* YES/NO */}
            {question?.question_type === 'yes_no' && (
              <div className="grid grid-cols-2 gap-4">
                {[{ value: 'yes', ar: 'نعم', en: 'Yes' }, { value: 'no', ar: 'لا', en: 'No' }].map(opt => {
                  const isSelected = currentAnswer === opt.value;
                  return (
                    <button key={opt.value} onClick={() => handleAnswer(opt.value)} disabled={justAnswered}
                      className="py-6 rounded-2xl font-heading font-black text-2xl transition-all duration-200"
                      style={{
                        background: isSelected ? (opt.value === 'yes' ? 'rgba(5,225,174,0.15)' : 'rgba(239,68,68,0.15)') : 'rgba(255,255,255,0.04)',
                        border: `2px solid ${isSelected ? (opt.value === 'yes' ? '#05E1AE' : '#EF4444') : 'rgba(255,255,255,0.08)'}`,
                        color: isSelected ? (opt.value === 'yes' ? '#05E1AE' : '#EF4444') : 'rgba(255,255,255,0.6)',
                      }}>
                      {opt[lang]}
                    </button>
                  );
                })}
              </div>
            )}

            {/* SCALE 5 or 10 */}
            {(question?.question_type === 'scale_5' || question?.question_type === 'scale_10') && (
              <div>
                <div className="flex items-center justify-between mb-4 text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  <span>{lang === 'ar' ? '١ – ضعيف جداً' : '1 – Very weak'}</span>
                  <span>{question.question_type === 'scale_5' ? (lang === 'ar' ? '٥ – ممتاز' : '5 – Excellent') : (lang === 'ar' ? '١٠ – ممتاز' : '10 – Excellent')}</span>
                </div>
                <div className="flex gap-2">
                  {Array.from({ length: question.question_type === 'scale_5' ? 5 : 10 }, (_, i) => i + 1).map(n => {
                    const isSelected = currentAnswer === n;
                    return (
                      <button key={n} onClick={() => handleAnswer(n)} disabled={justAnswered}
                        className="flex-1 py-4 rounded-xl font-heading font-bold text-lg transition-all duration-200"
                        style={{
                          background: isSelected ? '#05E1AE' : 'rgba(255,255,255,0.05)',
                          border: `1.5px solid ${isSelected ? '#05E1AE' : 'rgba(255,255,255,0.08)'}`,
                          color: isSelected ? '#0D1220' : 'rgba(255,255,255,0.6)',
                          transform: isSelected ? 'scale(1.08)' : 'scale(1)',
                        }}>
                        {n}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* OPEN TEXT */}
            {question?.question_type === 'open_text' && (
              <div>
                <textarea
                  value={openTextValue}
                  onChange={e => { setOpenTextValue(e.target.value); }}
                  onBlur={e => { if (e.target.value) handleAnswer(e.target.value); }}
                  rows={4}
                  className="w-full rounded-2xl px-5 py-4 text-sm focus:outline-none resize-none"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.1)', color: 'white' }}
                  placeholder={lang === 'ar' ? 'اكتب إجابتك هنا...' : 'Write your answer here...'}
                />
                <div className="flex justify-end mt-4">
                  <button onClick={() => handleAnswer(openTextValue || ' ')}
                    className="px-6 py-2.5 rounded-xl font-medium text-sm transition-all"
                    style={{ background: '#05E1AE', color: '#0D1220' }}>
                    {lang === 'ar' ? 'التالي' : 'Next'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Timer warning */}
          {timeLeft <= 5 && !justAnswered && (
            <div className="flex items-center justify-center gap-2 animate-pulse">
              <Clock size={14} style={{ color: '#EF4444' }} />
              <span className="text-sm" style={{ color: '#EF4444' }}>
                {lang === 'ar' ? `سيتم الانتقال خلال ${timeLeft} ثوانٍ` : `Auto-advancing in ${timeLeft}s`}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Submitting overlay */}
      {submitting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(13,18,32,0.95)' }}>
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-white/10 border-t-brand-accent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white/70 text-sm">{lang === 'ar' ? 'جارٍ تحليل إجاباتك...' : 'Analyzing your responses...'}</p>
          </div>
        </div>
      )}
    </div>
  );
}
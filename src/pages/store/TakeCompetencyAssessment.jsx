import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useLang } from '@/lib/LanguageContext';
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import StoreNavbar from '@/components/store/StoreNavbar';
import { base44 } from '@/api/base44Client';

export default function TakeCompetencyAssessment() {
  const { lang, isRTL } = useLang();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const level = searchParams.get('level') || 'operational';
  const version = searchParams.get('version') || 'quick';

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(25);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mock questions
  const questions = version === 'quick'
    ? [
        {
          id: 1,
          en: 'When faced with a complex problem at work, what is your first action?',
          ar: 'عندما تواجه مشكلة معقدة في العمل، ما إجراؤك الأول؟',
          options: [
            { id: 'a', en: 'React immediately', ar: 'تتفاعل فوراً', score: 20 },
            { id: 'b', en: 'Analyze thoroughly', ar: 'تحلل بعمق', score: 75 },
            { id: 'c', en: 'Consult others', ar: 'تاستشير الآخرين', score: 50 },
          ],
        },
        {
          id: 2,
          en: 'How do you typically handle team conflicts?',
          ar: 'كيف تتعامل عادة مع تضاربات الفريق؟',
          options: [
            { id: 'a', en: 'Avoid them', ar: 'تتجنبها', score: 15 },
            { id: 'b', en: 'Address directly', ar: 'تعالجها مباشرة', score: 80 },
            { id: 'c', en: 'Delegate resolution', ar: 'تفوض الحل', score: 40 },
          ],
        },
      ]
    : [
        {
          id: 1,
          en: 'When faced with a complex problem at work, what is your first action?',
          ar: 'عندما تواجه مشكلة معقدة في العمل، ما إجراؤك الأول؟',
          options: [
            { id: 'a', en: 'React immediately', ar: 'تتفاعل فوراً', score: 20 },
            { id: 'b', en: 'Analyze thoroughly', ar: 'تحلل بعمق', score: 75 },
            { id: 'c', en: 'Consult others', ar: 'تاستشير الآخرين', score: 50 },
          ],
        },
        {
          id: 2,
          en: 'How do you typically handle team conflicts?',
          ar: 'كيف تتعامل عادة مع تضاربات الفريق؟',
          options: [
            { id: 'a', en: 'Avoid them', ar: 'تتجنبها', score: 15 },
            { id: 'b', en: 'Address directly', ar: 'تعالجها مباشرة', score: 80 },
            { id: 'c', en: 'Delegate resolution', ar: 'تفوض الحل', score: 40 },
          ],
        },
        {
          id: 3,
          en: 'What is your approach to achieving results?',
          ar: 'ما نهجك لتحقيق النتائج؟',
          options: [
            { id: 'a', en: 'Quick wins', ar: 'انتصارات سريعة', score: 45 },
            { id: 'b', en: 'Sustainable growth', ar: 'نمو مستدام', score: 85 },
            { id: 'c', en: 'Whatever works', ar: 'أي شيء ينجح', score: 30 },
          ],
        },
      ];

  const totalQuestions = questions.length;
  const timePerQuestion = 25;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleNext();
          return timePerQuestion;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [currentQuestion]);

  const handleSelectAnswer = (optionId) => {
    const newAnswers = { ...answers };
    newAnswers[currentQuestion] = optionId;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setTimeLeft(timePerQuestion);
    } else {
      setSubmitted(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setTimeLeft(timePerQuestion);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    // Simulate submission delay
    setTimeout(() => {
      navigate(`/store/competency/report/attempt123`);
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-store-bg flex flex-col">
        <StoreNavbar />
        <div className="flex-1 flex items-center justify-center px-6 py-16">
          <div className="bg-white rounded-2xl p-12 max-w-md w-full text-center shadow-lg">
            <div className="mb-6 flex justify-center">
              <div className="w-20 h-20 rounded-full bg-brand-accent/10 flex items-center justify-center">
                <CheckCircle2 size={40} className="text-brand-accent" />
              </div>
            </div>
            <h1 className="font-heading font-black text-corp-dark text-2xl mb-3">
              {lang === 'ar' ? 'تم إكمال التقييم' : 'Assessment Complete!'}
            </h1>
            <p className="text-slate-500 text-sm mb-8">
              {lang === 'ar' ? 'شكراً لإكمالك التقييم. يتم معالجة نتائجك الآن...' : 'Thank you for completing the assessment. Your results are being processed...'}
            </p>
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-brand-accent animate-pulse" />
                <div className="w-2.5 h-2.5 rounded-full bg-brand-accent animate-pulse" style={{ animationDelay: '0.2s' }} />
                <div className="w-2.5 h-2.5 rounded-full bg-brand-accent animate-pulse" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progressPercent = ((currentQuestion + 1) / totalQuestions) * 100;
  const isTimeWarning = timeLeft <= 5;

  return (
    <div className="min-h-screen bg-store-bg flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
      <StoreNavbar />

      <div className="flex-1 px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                  {lang === 'ar' ? `السؤال ${currentQuestion + 1} من ${totalQuestions}` : `Question ${currentQuestion + 1} of ${totalQuestions}`}
                </div>
                <h1 className="font-heading font-black text-corp-dark text-2xl">
                  {question[lang === 'ar' ? 'ar' : 'en']}
                </h1>
              </div>
              <div className={`text-center flex-shrink-0 ${isTimeWarning ? 'animate-pulse' : ''}`}>
                <div className={`font-heading font-black text-4xl mb-1 ${isTimeWarning ? 'text-red-500' : 'text-brand-accent'}`}>
                  {timeLeft}
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-1 justify-center">
                  <Clock size={12} /> {lang === 'ar' ? 'ثانية' : 'sec'}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-300 rounded-full"
                style={{
                  width: `${progressPercent}%`,
                  background: 'linear-gradient(90deg, #1A3A5C, #05E1AE)',
                }}
              />
            </div>
          </div>

          {/* Answer Options */}
          <div className="space-y-3 mb-10">
            {question.options.map(option => (
              <button
                key={option.id}
                onClick={() => handleSelectAnswer(option.id)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  answers[currentQuestion] === option.id
                    ? 'border-brand-primary bg-brand-primary/5'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    answers[currentQuestion] === option.id ? 'border-brand-primary bg-brand-primary' : 'border-slate-300'
                  }`}>
                    {answers[currentQuestion] === option.id && (
                      <div className="w-2.5 h-2.5 rounded-full bg-white" />
                    )}
                  </div>
                  <span className="font-medium text-slate-700">
                    {option[lang === 'ar' ? 'ar' : 'en']}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex gap-3">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="px-6 py-3 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {lang === 'ar' ? 'السابق' : 'Previous'}
            </button>

            <button
              onClick={currentQuestion === totalQuestions - 1 ? handleSubmit : handleNext}
              disabled={!answers[currentQuestion] || loading}
              className="flex-1 py-3 rounded-xl font-heading font-bold text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: !answers[currentQuestion] || loading ? '#ccc' : 'linear-gradient(135deg, #1A3A5C, #05E1AE)' }}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {lang === 'ar' ? 'جاري المعالجة...' : 'Processing...'}
                </>
              ) : currentQuestion === totalQuestions - 1 ? (
                <>{lang === 'ar' ? 'أنهِ التقييم' : 'Submit Assessment'}</>
              ) : (
                <>{lang === 'ar' ? 'التالي' : 'Next'}</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
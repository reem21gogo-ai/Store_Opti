import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useLang } from '@/lib/LanguageContext';
import { motion } from 'framer-motion';
import StoreNavbar from '@/components/store/StoreNavbar';

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

  // Mock questions
  const questions = [
    {
      id: 1,
      en: 'When faced with a complex problem at work, how do you typically approach it?',
      ar: 'عندما تواجه مشكلة معقدة في العمل، كيف تتعامل معها؟',
      options: [
        { id: 'a', en: 'React immediately based on my first instinct', ar: 'تتفاعل فوراً بناءً على حدسك الأول', score: 20 },
        { id: 'b', en: 'Take time to analyze the situation and consider options', ar: 'تأخذ وقتاً لتحليل الموقف والنظر في الخيارات', score: 75 },
        { id: 'c', en: 'Ask colleagues for their opinions before deciding', ar: 'تطلب من الزملاء آرائهم قبل القرار', score: 50 },
      ],
      domain: 'thought_analysis',
    },
  ];

  const totalQuestions = version === 'quick' ? 15 : 40;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleNext();
          return 25;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSelectAnswer = (optionId) => {
    const newAnswers = { ...answers };
    newAnswers[currentQuestion] = optionId;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setTimeLeft(25);
    } else {
      setSubmitted(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setTimeLeft(25);
    }
  };

  const handleSubmit = () => {
    // Here, calculate scores and navigate to report
    navigate(`/store/competency/report/attempt123`);
  };

  if (submitted) {
    return (
      <div dir={isRTL ? 'rtl' : 'ltr'} className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
        <StoreNavbar />
        <div className="pt-24 pb-16 px-6 flex items-center justify-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl p-12 max-w-2xl shadow-lg text-center">
            <div className="text-6xl mb-6">✓</div>
            <h1 className="text-3xl font-black text-slate-900 mb-4">
              {lang === 'ar' ? 'تم إكمال التقييم بنجاح' : 'Assessment Completed'}
            </h1>
            <p className="text-lg text-slate-600 mb-8">
              {lang === 'ar' ? 'يتم معالجة نتائجك الآن' : 'Your results are being processed...'}
            </p>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }} className="inline-block">
              <div className="w-12 h-12 border-4 border-brand-accent border-t-brand-primary rounded-full"></div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
      <StoreNavbar />

      <div className="pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Progress & Timer */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  {lang === 'ar' ? `السؤال ${currentQuestion + 1} من ${totalQuestions}` : `Question ${currentQuestion + 1} of ${totalQuestions}`}
                </h2>
                <p className="text-slate-600">{lang === 'ar' ? `المستوى: ${level}` : `Level: ${level}`}</p>
              </div>
              <div className={`text-4xl font-black ${timeLeft <= 5 ? 'text-red-600' : 'text-brand-accent'}`}>
                {timeLeft}s
              </div>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <motion.div className="bg-gradient-to-r from-brand-accent to-brand-primary h-full rounded-full" initial={{ width: 0 }} animate={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }} />
            </div>
          </motion.div>

          {/* Question Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-lg p-10 mb-8">
            <h3 className="text-xl font-bold text-slate-900 mb-8">
              {questions[0][lang === 'ar' ? 'ar' : 'en']}
            </h3>

            {/* Answer Options */}
            <div className="space-y-4">
              {questions[0].options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleSelectAnswer(option.id)}
                  className={`w-full p-5 rounded-xl border-2 transition-all text-left ${
                    answers[currentQuestion] === option.id
                      ? 'border-brand-accent bg-blue-50'
                      : 'border-slate-200 hover:border-brand-primary'
                  }`}
                >
                  <p className="font-semibold text-slate-900">
                    {option[lang === 'ar' ? 'ar' : 'en']}
                  </p>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Navigation Buttons */}
          <div className="flex gap-4 justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="px-8 py-3 rounded-xl font-bold border-2 border-slate-300 text-slate-700 disabled:opacity-50 hover:bg-slate-50 transition-all"
            >
              {lang === 'ar' ? 'السابق' : 'Previous'}
            </button>

            {currentQuestion === totalQuestions - 1 ? (
              <button
                onClick={handleSubmit}
                className="px-8 py-3 rounded-xl font-bold bg-gradient-to-r from-brand-primary to-brand-accent text-white hover:opacity-90 transition-all"
              >
                {lang === 'ar' ? 'إنهاء التقييم' : 'Submit Assessment'}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-8 py-3 rounded-xl font-bold bg-gradient-to-r from-brand-primary to-brand-accent text-white hover:opacity-90 transition-all"
              >
                {lang === 'ar' ? 'التالي' : 'Next'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
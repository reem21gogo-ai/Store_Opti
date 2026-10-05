// ═══════════════════════════════════════════════════════════════════════════════
// Quick Career Interest Assessment — Question Subset
// 6 items drawn verbatim from the full Career Orientation question bank,
// one per RIASEC dimension, so answers carry over to the full assessment.
// ═══════════════════════════════════════════════════════════════════════════════
import { ALL_QUESTIONS } from './careerQuestions';

export const QUICK_QUESTION_IDS = [
  'riasec_I_3', // حل المشكلات المعقدة — Investigative
  'riasec_A_7', // ابتكار أفكار جديدة — Artistic
  'riasec_S_2', // مساعدة الناس في حل مشاكلهم — Social
  'riasec_E_3', // بدء مشروع تجاري خاص — Enterprising
  'riasec_R_9', // القيام بأعمال يدوية تتطلب مهارة — Realistic
  'riasec_C_1', // تنظيم البيانات والسجلات — Conventional
];

export const QUICK_QUESTIONS = QUICK_QUESTION_IDS
  .map(id => ALL_QUESTIONS.find(q => q.id === id))
  .filter(Boolean);

export const QUICK_TOTAL = QUICK_QUESTIONS.length;

export const QUICK_SAVE_KEY = 'quick_career_answers';
export const QUICK_PROFILE_KEY = 'quick_career_profile';
export const QUICK_LEAD_KEY = 'quick_career_lead';
export const FULL_ANSWERS_KEY = 'career_assessment_answers';
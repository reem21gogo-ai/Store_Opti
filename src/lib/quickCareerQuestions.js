// ═══════════════════════════════════════════════════════════════════════════════
// Quick Career Interest Assessment — Question Subset
// 12 items drawn verbatim from the full Career Orientation question bank,
// two per RIASEC dimension, so every answer carries over to the full assessment.
// ═══════════════════════════════════════════════════════════════════════════════
import { ALL_QUESTIONS } from './careerQuestions';

export const QUICK_QUESTION_IDS = [
  'riasec_A_7', // ابتكار أفكار جديدة — Artistic
  'riasec_I_3', // حل المشكلات المعقدة — Investigative
  'riasec_S_2', // مساعدة الناس في حل مشاكلهم — Social
  'riasec_E_1', // إدارة المشاريع والفرق — Enterprising
  'riasec_R_9', // القيام بأعمال يدوية تتطلب مهارة — Realistic
  'riasec_C_1', // تنظيم البيانات والسجلات — Conventional
  'riasec_E_3', // بدء مشروع تجاري خاص — Enterprising
  'riasec_A_1', // الرسم والتصميم الفني — Artistic
  'riasec_I_1', // البحث العلمي وإجراء التجارب — Investigative
  'riasec_S_1', // تعليم وتدريب الآخرين — Social
  'riasec_R_7', // العمل في الهواء الطلق — Realistic
  'riasec_C_3', // العمل بالميزانية والحسابات — Conventional
];

export const QUICK_QUESTIONS = QUICK_QUESTION_IDS
  .map(id => ALL_QUESTIONS.find(q => q.id === id))
  .filter(Boolean);

export const QUICK_TOTAL = QUICK_QUESTIONS.length;

export const QUICK_SAVE_KEY = 'quick_career_answers';
export const QUICK_PROFILE_KEY = 'quick_career_profile';
export const QUICK_LEAD_KEY = 'quick_career_lead';
export const FULL_ANSWERS_KEY = 'career_assessment_answers';
// ═══════════════════════════════════════════════════════════════════════════════
// Career Orientation — Question Bank (150 questions)
// مقياس الميول والتوجّه المهني
// ═══════════════════════════════════════════════════════════════════════════════

// ─── SCALE DEFINITIONS ────────────────────────────────────────────────────────
export const SCALES = {
  preference: [
    { value: 1, label_ar: 'لا أحبه أبدًا', label_en: 'Strongly Dislike' },
    { value: 2, label_ar: 'لا أحبه', label_en: 'Dislike' },
    { value: 3, label_ar: 'محايد', label_en: 'Neutral' },
    { value: 4, label_ar: 'أحبه', label_en: 'Like' },
    { value: 5, label_ar: 'أحبه كثيرًا', label_en: 'Strongly Like' },
  ],
  importance: [
    { value: 1, label_ar: 'غير مهم', label_en: 'Not Important' },
    { value: 2, label_ar: 'قليل الأهمية', label_en: 'Slightly Important' },
    { value: 3, label_ar: 'محايد', label_en: 'Neutral' },
    { value: 4, label_ar: 'مهم', label_en: 'Important' },
    { value: 5, label_ar: 'مهم جدًا', label_en: 'Very Important' },
  ],
  ability: [
    { value: 1, label_ar: 'ضعيف جدًا', label_en: 'Very Weak' },
    { value: 2, label_ar: 'ضعيف', label_en: 'Weak' },
    { value: 3, label_ar: 'محايد', label_en: 'Neutral' },
    { value: 4, label_ar: 'جيد', label_en: 'Good' },
    { value: 5, label_ar: 'ممتاز', label_en: 'Excellent' },
  ],
  agreement: [
    { value: 1, label_ar: 'لا ينطبق عليّ أبدًا', label_en: 'Strongly Disagree' },
    { value: 2, label_ar: 'لا ينطبق عليّ غالبًا', label_en: 'Disagree' },
    { value: 3, label_ar: 'محايد', label_en: 'Neutral' },
    { value: 4, label_ar: 'ينطبق عليّ', label_en: 'Agree' },
    { value: 5, label_ar: 'ينطبق عليّ كثيرًا', label_en: 'Strongly Agree' },
  ],
};

// ─── RIASEC QUESTIONS (60) ────────────────────────────────────────────────────
const riasecQuestions = [
  // R — Realistic (10)
  ...['إصلاح الأجهزة والمعدات الكهربائية', 'العمل في ورشة أو مصنع', 'قيادة المركبات والآلات الثقيلة', 'الزراعة والعمل في الحقول', 'البناء والنجارة', 'تركيب وصيانة الأنظمة الميكانيكية', 'العمل في الهواء الطلق', 'تشغيل الآلات والأدوات التقنية', 'القيام بأعمال يدوية تتطلب مهارة', 'تنظيم وإدارة المخزون والمعدات']
    .map((q, i) => ({ id: `riasec_R_${i+1}`, section: 'riasec', dimension: 'R', type: 'scale_5', scale: 'preference', question_ar: `كم تحب: ${q}؟`, question_en: `How much do you enjoy: ${q}?`, reverse: false, sort_order: i+1 })),
  // I — Investigative (10)
  ...['البحث العلمي وإجراء التجارب', 'تحليل البيانات والإحصاءات', 'حل المشكلات المعقدة', 'دراسة الظواهر الطبيعية', 'قراءة المقالات العلمية', 'استخدام المنطق والتفكير النقدي', 'فهم كيفية عمل الأنظمة المعقدة', 'إجراء الدراسات الميدانية', 'طرح الأسئلة واكتشاف الإجابات', 'العمل في المختبرات']
    .map((q, i) => ({ id: `riasec_I_${i+1}`, section: 'riasec', dimension: 'I', type: 'scale_5', scale: 'preference', question_ar: `كم تحب: ${q}؟`, question_en: `How much do you enjoy: ${q}?`, reverse: false, sort_order: i+1 })),
  // A — Artistic (10)
  ...['الرسم والتصميم الفني', 'الكتابة الإبداعية', 'تأليف الموسيقى', 'التصوير الفوتوغرافي', 'التمثيل والأداء', 'تصميم الديكور والمساحات', 'ابتكار أفكار جديدة', 'العمل في مجال الموضة', 'تحرير الفيديو والإنتاج', 'التعبير عن الأفكار من خلال الفن']
    .map((q, i) => ({ id: `riasec_A_${i+1}`, section: 'riasec', dimension: 'A', type: 'scale_5', scale: 'preference', question_ar: `كم تحب: ${q}؟`, question_en: `How much do you enjoy: ${q}?`, reverse: false, sort_order: i+1 })),
  // S — Social (10)
  ...['تعليم وتدريب الآخرين', 'مساعدة الناس في حل مشاكلهم', 'العمل في مجال الرعاية الصحية', 'تقديم الاستشارات والإرشاد', 'العمل في الخدمات الاجتماعية', 'تنظيم الفعاليات المجتمعية', 'الإرشاد والتوجيه المهني', 'العمل التطوعي لمساعدة المحتاجين', 'قيادة المجموعات والفرق', 'تطوير مهارات التواصل مع الآخرين']
    .map((q, i) => ({ id: `riasec_S_${i+1}`, section: 'riasec', dimension: 'S', type: 'scale_5', scale: 'preference', question_ar: `كم تحب: ${q}؟`, question_en: `How much do you enjoy: ${q}?`, reverse: false, sort_order: i+1 })),
  // E — Enterprising (10)
  ...['إدارة المشاريع والفرق', 'بيع المنتجات والخدمات', 'بدء مشروع تجاري خاص', 'قيادة الاجتماعات والتفاوض', 'التسويق والترويج للأفكار', 'اتخاذ القرارات الاستراتيجية', 'إقناع الآخرين بوجهة نظرك', 'العمل في مجال المبيعات', 'تطوير الأعمال وتوسيع الشركات', 'المنافسة في بيئة الأعمال']
    .map((q, i) => ({ id: `riasec_E_${i+1}`, section: 'riasec', dimension: 'E', type: 'scale_5', scale: 'preference', question_ar: `كم تحب: ${q}؟`, question_en: `How much do you enjoy: ${q}?`, reverse: false, sort_order: i+1 })),
  // C — Conventional (10)
  ...['تنظيم البيانات والسجلات', 'إدارة الملفات والمستندات', 'العمل بالميزانية والحسابات', 'اتباع الإجراءات والأنظمة', 'إدخال البيانات وتنظيمها', 'المراجعة والتدقيق المالي', 'العمل بالجداول والقوائم', 'تنظيم الجداول الزمنية', 'إدارة المكاتب والإدارة', 'العمل بالأنظمة المحاسبية']
    .map((q, i) => ({ id: `riasec_C_${i+1}`, section: 'riasec', dimension: 'C', type: 'scale_5', scale: 'preference', question_ar: `كم تحب: ${q}؟`, question_en: `How much do you enjoy: ${q}?`, reverse: false, sort_order: i+1 })),
];

// ─── WORK VALUES QUESTIONS (18) ──────────────────────────────────────────────
const workValuesQuestions = [
  // Achievement (3)
  ...['إنجاز أعمال ذات قيمة ونتائج ملموسة', 'الشعور بالتحقيق والإنجاز في عملي', 'العمل على تحديات تتطلب مهارات عالية']
    .map((q, i) => ({ id: `wv_achievement_${i+1}`, section: 'work_values', dimension: 'achievement', type: 'scale_5', scale: 'importance', question_ar: `ما مدى أهمية: ${q}؟`, question_en: `How important is: ${q}?`, reverse: false, sort_order: i+1 })),
  // Working Conditions (3)
  ...['العمل في بيئة آمنة ومريحة', 'الحصول على راتب ومزايا جيدة', 'العمل في ظروف مستقرة وثابتة']
    .map((q, i) => ({ id: `wv_conditions_${i+1}`, section: 'work_values', dimension: 'working_conditions', type: 'scale_5', scale: 'importance', question_ar: `ما مدى أهمية: ${q}؟`, question_en: `How important is: ${q}?`, reverse: false, sort_order: i+1 })),
  // Recognition (3)
  ...['الحصول على تقدير لإنجازاتي', 'أن يعرف الآخرون قيمة عملي', 'الحصول على مكافآت وتقدير علني']
    .map((q, i) => ({ id: `wv_recognition_${i+1}`, section: 'work_values', dimension: 'recognition', type: 'scale_5', scale: 'importance', question_ar: `ما مدى أهمية: ${q}؟`, question_en: `How important is: ${q}?`, reverse: false, sort_order: i+1 })),
  // Relationships (3)
  ...['العمل مع زملاء ودودين ومتعاونين', 'بناء علاقات اجتماعية إيجابية في العمل', 'العمل في جو اجتماعي داعم']
    .map((q, i) => ({ id: `wv_relationships_${i+1}`, section: 'work_values', dimension: 'relationships', type: 'scale_5', scale: 'importance', question_ar: `ما مدى أهمية: ${q}؟`, question_en: `How important is: ${q}?`, reverse: false, sort_order: i+1 })),
  // Support (3)
  ...['الحصول على دعم من الإدارة', 'وجود مشرفين يقدمون توجيهات واضحة', 'العمل في بيئة توفر التطوير المهني']
    .map((q, i) => ({ id: `wv_support_${i+1}`, section: 'work_values', dimension: 'support', type: 'scale_5', scale: 'importance', question_ar: `ما مدى أهمية: ${q}؟`, question_en: `How important is: ${q}?`, reverse: false, sort_order: i+1 })),
  // Independence (3)
  ...['الحرية في اتخاذ القرارات', 'العمل بشكل مستقل دون إشراف مستمر', 'تحديد أسلوب عملي بنفسي']
    .map((q, i) => ({ id: `wv_independence_${i+1}`, section: 'work_values', dimension: 'independence', type: 'scale_5', scale: 'importance', question_ar: `ما مدى أهمية: ${q}؟`, question_en: `How important is: ${q}?`, reverse: false, sort_order: i+1 })),
];

// ─── SKILLS QUESTIONS (19) ────────────────────────────────────────────────────
const skillsSelfAssessed = [
  // Analytical (2)
  { id: 'skill_an_1', section: 'skills', dimension: 'analytical', type: 'scale_5', scale: 'ability', question_ar: 'قدرتي على تحليل المعلومات المعقدة', question_en: 'My ability to analyze complex information', reverse: false, sort_order: 1 },
  { id: 'skill_an_2', section: 'skills', dimension: 'analytical', type: 'scale_5', scale: 'ability', question_ar: 'قدرتي على استخلاص استنتاجات منطقية', question_en: 'My ability to draw logical conclusions', reverse: false, sort_order: 2 },
  // Communication (2)
  { id: 'skill_co_1', section: 'skills', dimension: 'communication', type: 'scale_5', scale: 'ability', question_ar: 'قدرتي على التواصل الكتابي بوضوح', question_en: 'My ability to communicate clearly in writing', reverse: false, sort_order: 1 },
  { id: 'skill_co_2', section: 'skills', dimension: 'communication', type: 'scale_5', scale: 'ability', question_ar: 'قدرتي على التقديم والإلقاء أمام الجمهور', question_en: 'My ability to present in front of audiences', reverse: false, sort_order: 2 },
  // Organization (2)
  { id: 'skill_or_1', section: 'skills', dimension: 'organization', type: 'scale_5', scale: 'ability', question_ar: 'قدرتي على تنظيم المهام وإدارتها', question_en: 'My ability to organize and manage tasks', reverse: false, sort_order: 1 },
  { id: 'skill_or_2', section: 'skills', dimension: 'organization', type: 'scale_5', scale: 'ability', question_ar: 'قدرتي على إدارة الوقت والوفاء بالمواعيد', question_en: 'My ability to manage time and meet deadlines', reverse: false, sort_order: 2 },
  // Digital (2)
  { id: 'skill_dg_1', section: 'skills', dimension: 'digital_learning', type: 'scale_5', scale: 'ability', question_ar: 'قدرتي على استخدام الأدوات الرقمية والتقنية', question_en: 'My ability to use digital and technical tools', reverse: false, sort_order: 1 },
  { id: 'skill_dg_2', section: 'skills', dimension: 'digital_learning', type: 'scale_5', scale: 'ability', question_ar: 'سرعة تعلمي لمهارات جديدة', question_en: 'How quickly I learn new skills', reverse: false, sort_order: 2 },
  // Collaboration (2)
  { id: 'skill_cl_1', section: 'skills', dimension: 'collaboration', type: 'scale_5', scale: 'ability', question_ar: 'قدرتي على العمل ضمن فريق', question_en: 'My ability to work within a team', reverse: false, sort_order: 1 },
  { id: 'skill_cl_2', section: 'skills', dimension: 'collaboration', type: 'scale_5', scale: 'ability', question_ar: 'قدرتي على التأثير في الآخرين إيجابياً', question_en: 'My ability to positively influence others', reverse: false, sort_order: 2 },
  // Creativity (2)
  { id: 'skill_cr_1', section: 'skills', dimension: 'creativity', type: 'scale_5', scale: 'ability', question_ar: 'قدرتي على ابتكار حلول جديدة', question_en: 'My ability to innovate new solutions', reverse: false, sort_order: 1 },
  { id: 'skill_cr_2', section: 'skills', dimension: 'creativity', type: 'scale_5', scale: 'ability', question_ar: 'قدرتي على التفكير الإبداعي', question_en: 'My ability to think creatively', reverse: false, sort_order: 2 },
  // General (1)
  { id: 'skill_ge_1', section: 'skills', dimension: 'analytical', type: 'scale_5', scale: 'ability', question_ar: 'قدرتي على حل المشكلات بطرق فعّالة', question_en: 'My ability to solve problems effectively', reverse: false, sort_order: 3 },
];

const skillsSituational = [
  { id: 'skill_sit_1', section: 'skills', dimension: 'analytical', type: 'situational',
    question_ar: 'تواجه مشكلة معقدة في العمل. ماذا تفعل أولاً؟', question_en: 'You face a complex problem at work. What do you do first?',
    options: [
      { value: 'A', label_ar: 'أحلل المشكلة بشكل منهجي وأجمع البيانات', label_en: 'Analyze the problem systematically and gather data', score: 5 },
      { value: 'B', label_ar: 'أطلب المشورة من زملاء أكثر خبرة', label_en: 'Seek advice from more experienced colleagues', score: 3 },
      { value: 'C', label_ar: 'أجرّب حلاً سريعاً وأرى النتيجة', label_en: 'Try a quick solution and see the result', score: 2 },
    ], sort_order: 1 },
  { id: 'skill_sit_2', section: 'skills', dimension: 'communication', type: 'situational',
    question_ar: 'تحتاج لإقناع فريقك بفكرة جديدة. ما أسلوبك؟', question_en: 'You need to persuade your team of a new idea. What is your approach?',
    options: [
      { value: 'A', label_ar: 'أعدّ عرضاً منظماً بالأدلة والحجج', label_en: 'Prepare an organized presentation with evidence', score: 5 },
      { value: 'B', label_ar: 'أتحدث مع كل عضو على حدة', label_en: 'Speak with each member individually', score: 4 },
      { value: 'C', label_ar: 'أطرح الفكرة بشكل غير رسمي', label_en: 'Present the idea informally', score: 2 },
    ], sort_order: 2 },
  { id: 'skill_sit_3', section: 'skills', dimension: 'organization', type: 'situational',
    question_ar: 'لديك 5 مهام عاجلة في وقت واحد. كيف تتصرف؟', question_en: 'You have 5 urgent tasks at once. What do you do?',
    options: [
      { value: 'A', label_ar: 'أرتّبها حسب الأولوية والأهمية', label_en: 'Prioritize by importance and urgency', score: 5 },
      { value: 'B', label_ar: 'أبدأ بأسهلها وأكمل الباقي', label_en: 'Start with the easiest and continue', score: 3 },
      { value: 'C', label_ar: 'أحاول إنجازها جميعاً بالتوازي', label_en: 'Try to do them all in parallel', score: 2 },
    ], sort_order: 3 },
  { id: 'skill_sit_4', section: 'skills', dimension: 'collaboration', type: 'situational',
    question_ar: 'يختلف عضو في فريقك معك حول نهج مشروع. ماذا تفعل؟', question_en: 'A team member disagrees with you on a project approach. What do you do?',
    options: [
      { value: 'A', label_ar: 'أستمع لرأيه وأبحث عن حل مشترك', label_en: 'Listen to their view and find common ground', score: 5 },
      { value: 'B', label_ar: 'أشرح وجهة نظري بالتفصيل', label_en: 'Explain my viewpoint in detail', score: 3 },
      { value: 'C', label_ar: 'أطلب قراراً من المشرف', label_en: 'Ask the supervisor to decide', score: 2 },
    ], sort_order: 4 },
  { id: 'skill_sit_5', section: 'skills', dimension: 'creativity', type: 'situational',
    question_ar: 'يطلب منك مديرك حلاً مبتكراً لمشكلة قديمة. ماذا تفعل؟', question_en: 'Your manager asks for an innovative solution to an old problem. What do you do?',
    options: [
      { value: 'A', label_ar: 'أبحث عن حلول من مجالات مختلفة وأدمجها', label_en: 'Look for solutions from different fields and combine them', score: 5 },
      { value: 'B', label_ar: 'أعدل على الحلول الحالية', label_en: 'Modify existing solutions', score: 3 },
      { value: 'C', label_ar: 'أطلب أمثلة من شركات أخرى', label_en: 'Ask for examples from other companies', score: 4 },
    ], sort_order: 5 },
  { id: 'skill_sit_6', section: 'skills', dimension: 'digital_learning', type: 'situational',
    question_ar: 'تنتج تقنية جديدة في مجالك. كيف تتفاعل؟', question_en: 'A new technology emerges in your field. How do you react?',
    options: [
      { value: 'A', label_ar: 'أبدأ تعلمها فوراً وأجربها', label_en: 'Start learning it immediately and experiment', score: 5 },
      { value: 'B', label_ar: 'أنتظر حتى يثبت نجاحها', label_en: 'Wait until it proves successful', score: 2 },
      { value: 'C', label_ar: 'أقرأ عنها وأتابع تطورها', label_en: 'Read about it and follow its development', score: 4 },
    ], sort_order: 6 },
];

const skillsQuestions = [...skillsSelfAssessed, ...skillsSituational];

// ─── PERSONALITY QUESTIONS (25, forced-choice A/B) ────────────────────────────
const personalityQuestions = [
  // Structured vs Flexible (5)
  { id: 'pers_sf_1', section: 'personality', dimension: 'structured_flexible', type: 'forced_choice',
    question_ar: 'أفضّل أن يكون يومي مُخططاً مسبقاً', question_en: 'I prefer my day planned in advance',
    options: [
      { value: 'A', label_ar: 'أحب الجداول والخطط الواضحة', label_en: 'I like clear schedules and plans', score: { structured: 1 } },
      { value: 'B', label_ar: 'أفضل المرونة والتكيف مع الظروف', label_en: 'I prefer flexibility and adapting to circumstances', score: { flexible: 1 } },
    ], sort_order: 1 },
  { id: 'pers_sf_2', section: 'personality', dimension: 'structured_flexible', type: 'forced_choice',
    question_ar: 'عندما أبدأ مشروعاً', question_en: 'When I start a project',
    options: [
      { value: 'A', label_ar: 'أضع خطة تفصيلية قبل البدء', label_en: 'I make a detailed plan before starting', score: { structured: 1 } },
      { value: 'B', label_ar: 'أبدأ وأكيف الخطة مع التقدم', label_en: 'I start and adapt the plan as I go', score: { flexible: 1 } },
    ], sort_order: 2 },
  { id: 'pers_sf_3', section: 'personality', dimension: 'structured_flexible', type: 'forced_choice',
    question_ar: 'في عملي', question_en: 'In my work',
    options: [
      { value: 'A', label_ar: 'أفضل الإجراءات والأنظمة الواضحة', label_en: 'I prefer clear procedures and systems', score: { structured: 1 } },
      { value: 'B', label_ar: 'أفضل الحرية في اختيار الأسلوب', label_en: 'I prefer freedom to choose my approach', score: { flexible: 1 } },
    ], sort_order: 3 },
  { id: 'pers_sf_4', section: 'personality', dimension: 'structured_flexible', type: 'forced_choice',
    question_ar: 'أشعر براحة أكبر عندما', question_en: 'I feel more comfortable when',
    options: [
      { value: 'A', label_ar: 'أعرف ما هو متوقع مني بالضبط', label_en: 'I know exactly what is expected of me', score: { structured: 1 } },
      { value: 'B', label_ar: 'لدي مساحة للإبداع والتجريب', label_en: 'I have room for creativity and experimentation', score: { flexible: 1 } },
    ], sort_order: 4 },
  { id: 'pers_sf_5', section: 'personality', dimension: 'structured_flexible', type: 'forced_choice',
    question_ar: 'في إنجاز المهام', question_en: 'In completing tasks',
    options: [
      { value: 'A', label_ar: 'أتبع خطوات منظمة ومرتبة', label_en: 'I follow organized, ordered steps', score: { structured: 1 } },
      { value: 'B', label_ar: 'أقفز بين المهام حسب الحاجة', label_en: 'I jump between tasks as needed', score: { flexible: 1 } },
    ], sort_order: 5 },
  // Detail vs Big-Picture (5)
  { id: 'pers_db_1', section: 'personality', dimension: 'detail_bigpicture', type: 'forced_choice',
    question_ar: 'عند النظر إلى مشروع', question_en: 'When looking at a project',
    options: [
      { value: 'A', label_ar: 'أركز على التفاصيل الدقيقة', label_en: 'I focus on fine details', score: { detail: 1 } },
      { value: 'B', label_ar: 'أرى الصورة الكبرى والاستراتيجية', label_en: 'I see the big picture and strategy', score: { bigpicture: 1 } },
    ], sort_order: 1 },
  { id: 'pers_db_2', section: 'personality', dimension: 'detail_bigpicture', type: 'forced_choice',
    question_ar: 'في تحليل المشكلات', question_en: 'In analyzing problems',
    options: [
      { value: 'A', label_ar: 'أغوص في التفاصيل والبيانات', label_en: 'I dive into details and data', score: { detail: 1 } },
      { value: 'B', label_ar: 'أنظر إلى الأنماط والاتجاهات', label_en: 'I look at patterns and trends', score: { bigpicture: 1 } },
    ], sort_order: 2 },
  { id: 'pers_db_3', section: 'personality', dimension: 'detail_bigpicture', type: 'forced_choice',
    question_ar: 'عند قراءة تقرير', question_en: 'When reading a report',
    options: [
      { value: 'A', label_ar: 'أتحقق من كل رقم وتفصيلة', label_en: 'I check every number and detail', score: { detail: 1 } },
      { value: 'B', label_ar: 'أبحث عن الخلاصة والمعنى العام', label_en: 'I look for the summary and overall meaning', score: { bigpicture: 1 } },
    ], sort_order: 3 },
  { id: 'pers_db_4', section: 'personality', dimension: 'detail_bigpicture', type: 'forced_choice',
    question_ar: 'في تخطيط الأهداف', question_en: 'In planning goals',
    options: [
      { value: 'A', label_ar: 'أحدّد خطوات دقيقة وقابلة للقياس', label_en: 'I define precise, measurable steps', score: { detail: 1 } },
      { value: 'B', label_ar: 'أضع رؤية عامة وأكيف التفاصيل', label_en: 'I set a general vision and adapt details', score: { bigpicture: 1 } },
    ], sort_order: 4 },
  { id: 'pers_db_5', section: 'personality', dimension: 'detail_bigpicture', type: 'forced_choice',
    question_ar: 'أنا في عملي', question_en: 'In my work, I am',
    options: [
      { value: 'A', label_ar: 'دقيق ومنتبه للتفاصيل الصغيرة', label_en: 'Precise and attentive to small details', score: { detail: 1 } },
      { value: 'B', label_ar: 'مفكر استراتيجي يرى الروابط', label_en: 'A strategic thinker who sees connections', score: { bigpicture: 1 } },
    ], sort_order: 5 },
  // Independent vs Collaborative (5)
  { id: 'pers_ic_1', section: 'personality', dimension: 'independent_collaborative', type: 'forced_choice',
    question_ar: 'في إنجاز المهام', question_en: 'In completing tasks',
    options: [
      { value: 'A', label_ar: 'أفضل العمل بمفردي', label_en: 'I prefer working alone', score: { independent: 1 } },
      { value: 'B', label_ar: 'أفضل العمل ضمن فريق', label_en: 'I prefer working in a team', score: { collaborative: 1 } },
    ], sort_order: 1 },
  { id: 'pers_ic_2', section: 'personality', dimension: 'independent_collaborative', type: 'forced_choice',
    question_ar: 'عند اتخاذ القرارات', question_en: 'When making decisions',
    options: [
      { value: 'A', label_ar: 'أفضل أن أقرر بنفسي', label_en: 'I prefer to decide on my own', score: { independent: 1 } },
      { value: 'B', label_ar: 'أفضل التشاور مع الآخرين', label_en: 'I prefer consulting with others', score: { collaborative: 1 } },
    ], sort_order: 2 },
  { id: 'pers_ic_3', section: 'personality', dimension: 'independent_collaborative', type: 'forced_choice',
    question_ar: 'في حل المشكلات', question_en: 'In solving problems',
    options: [
      { value: 'A', label_ar: 'أعتمد على تفكيري الخاص', label_en: 'I rely on my own thinking', score: { independent: 1 } },
      { value: 'B', label_ar: 'أستفيد من أفكار الآخرين', label_en: 'I benefit from others\' ideas', score: { collaborative: 1 } },
    ], sort_order: 3 },
  { id: 'pers_ic_4', section: 'personality', dimension: 'independent_collaborative', type: 'forced_choice',
    question_ar: 'في بيئة العمل المثالية لي', question_en: 'In my ideal work environment',
    options: [
      { value: 'A', label_ar: 'أعمل بشكل مستقل ومسؤول', label_en: 'I work independently and responsibly', score: { independent: 1 } },
      { value: 'B', label_ar: 'أعمل ضمن فريق متعاون', label_en: 'I work in a collaborative team', score: { collaborative: 1 } },
    ], sort_order: 4 },
  { id: 'pers_ic_5', section: 'personality', dimension: 'independent_collaborative', type: 'forced_choice',
    question_ar: 'عند تعلم شيء جديد', question_en: 'When learning something new',
    options: [
      { value: 'A', label_ar: 'أفضل الدراسة بمفردي', label_en: 'I prefer studying alone', score: { independent: 1 } },
      { value: 'B', label_ar: 'أفضل التعلم في مجموعة', label_en: 'I prefer learning in a group', score: { collaborative: 1 } },
    ], sort_order: 5 },
  // Reflective vs Fast-Acting (5)
  { id: 'pers_rf_1', section: 'personality', dimension: 'reflective_fast', type: 'forced_choice',
    question_ar: 'عند اتخاذ قرارات مهمة', question_en: 'When making important decisions',
    options: [
      { value: 'A', label_ar: 'آخذ وقتي في التفكير والتحليل', label_en: 'I take time to think and analyze', score: { reflective: 1 } },
      { value: 'B', label_ar: 'أتخذ القرار بسرعة وثقة', label_en: 'I decide quickly and confidently', score: { fast: 1 } },
    ], sort_order: 1 },
  { id: 'pers_rf_2', section: 'personality', dimension: 'reflective_fast', type: 'forced_choice',
    question_ar: 'أمام موقف جديد', question_en: 'Facing a new situation',
    options: [
      { value: 'A', label_ar: 'أتأمل وأجمع المعلومات أولاً', label_en: 'I reflect and gather information first', score: { reflective: 1 } },
      { value: 'B', label_ar: 'أتصرف بسرعة وأكيف لاحقاً', label_en: 'I act quickly and adapt later', score: { fast: 1 } },
    ], sort_order: 2 },
  { id: 'pers_rf_3', section: 'personality', dimension: 'reflective_fast', type: 'forced_choice',
    question_ar: 'في اجتماع عمل', question_en: 'In a work meeting',
    options: [
      { value: 'A', label_ar: 'أستمع وأفكر قبل أن أتحدث', label_en: 'I listen and think before speaking', score: { reflective: 1 } },
      { value: 'B', label_ar: 'أشارك أفكاري بسرعة وعفوية', label_en: 'I share my ideas quickly and spontaneously', score: { fast: 1 } },
    ], sort_order: 3 },
  { id: 'pers_rf_4', section: 'personality', dimension: 'reflective_fast', type: 'forced_choice',
    question_ar: 'عند تقييم خيارين', question_en: 'When evaluating two options',
    options: [
      { value: 'A', label_ar: 'أقارن بعناية وأزن الأبعاد', label_en: 'I compare carefully and weigh aspects', score: { reflective: 1 } },
      { value: 'B', label_ar: 'أثق بحدسي وأقرر بسرعة', label_en: 'I trust my intuition and decide quickly', score: { fast: 1 } },
    ], sort_order: 4 },
  { id: 'pers_rf_5', section: 'personality', dimension: 'reflective_fast', type: 'forced_choice',
    question_ar: 'في عملي اليومي', question_en: 'In my daily work',
    options: [
      { value: 'A', label_ar: 'أخطط وأتأمل قبل التنفيذ', label_en: 'I plan and reflect before executing', score: { reflective: 1 } },
      { value: 'B', label_ar: 'أبدأ التنفيذ وأكيف في الطريق', label_en: 'I start executing and adapt along the way', score: { fast: 1 } },
    ], sort_order: 5 },
  // Stability vs Novelty (5)
  { id: 'pers_sn_1', section: 'personality', dimension: 'stability_novelty', type: 'forced_choice',
    question_ar: 'في بيئة العمل', question_en: 'In a work environment',
    options: [
      { value: 'A', label_ar: 'أفضل الروتين والثبات', label_en: 'I prefer routine and stability', score: { stability: 1 } },
      { value: 'B', label_ar: 'أفضل التنوع والتجديد', label_en: 'I prefer variety and change', score: { novelty: 1 } },
    ], sort_order: 1 },
  { id: 'pers_sn_2', section: 'personality', dimension: 'stability_novelty', type: 'forced_choice',
    question_ar: 'عند التفكير في وظيفتي', question_en: 'When thinking about my job',
    options: [
      { value: 'A', label_ar: 'أقدّر الاستقرار والأمان الوظيفي', label_en: 'I value stability and job security', score: { stability: 1 } },
      { value: 'B', label_ar: 'أبحث عن التحديات والفرص الجديدة', label_en: 'I seek challenges and new opportunities', score: { novelty: 1 } },
    ], sort_order: 2 },
  { id: 'pers_sn_3', section: 'personality', dimension: 'stability_novelty', type: 'forced_choice',
    question_ar: 'في مهامي اليومية', question_en: 'In my daily tasks',
    options: [
      { value: 'A', label_ar: 'أحب الأنماط المألوفة والمتكررة', label_en: 'I like familiar, repeating patterns', score: { stability: 1 } },
      { value: 'B', label_ar: 'أحب المهام الجديدة والمختلفة', label_en: 'I like new and different tasks', score: { novelty: 1 } },
    ], sort_order: 3 },
  { id: 'pers_sn_4', section: 'personality', dimension: 'stability_novelty', type: 'forced_choice',
    question_ar: 'عندما يتغير شيء في عملي', question_en: 'When something changes in my work',
    options: [
      { value: 'A', label_ar: 'أشعر بعدم الراحة وأفضل المألوف', label_en: 'I feel uncomfortable and prefer the familiar', score: { stability: 1 } },
      { value: 'B', label_ar: 'أشعر بالحماس والفضول', label_en: 'I feel excited and curious', score: { novelty: 1 } },
    ], sort_order: 4 },
  { id: 'pers_sn_5', section: 'personality', dimension: 'stability_novelty', type: 'forced_choice',
    question_ar: 'في تطوري المهني', question_en: 'In my professional development',
    options: [
      { value: 'A', label_ar: 'أفضل التعمق في مجال محدد', label_en: 'I prefer deepening in one field', score: { stability: 1 } },
      { value: 'B', label_ar: 'أفضل استكشاف مجالات متنوعة', label_en: 'I prefer exploring diverse fields', score: { novelty: 1 } },
    ], sort_order: 5 },
];

// ─── STRENGTHS QUESTIONS (20, 5-point agreement) ──────────────────────────────
const strengthsQuestions = [
  // Thinking & Learning (4)
  ...['أتعلم مفاهيم جديدة بسرعة', 'أستمتع بالتفكير العميق في المشكلات', 'أبحث عن فهم الأسباب الجذرية للأشياء', 'أقرأ وأتعلم باستمرار']
    .map((q, i) => ({ id: `str_tl_${i+1}`, section: 'strengths', dimension: 'thinking_learning', type: 'scale_5', scale: 'agreement', question_ar: q, question_en: q, reverse: false, sort_order: i+1 })),
  // Achievement & Perseverance (4)
  ...['لا أستسلم بسهولة أمام التحديات', 'أحقق الأهداف التي أضعها لنفسي', 'أكمل ما أبدأ حتى لو كان صعباً', 'أعمل بجد لتحقيق النجاح']
    .map((q, i) => ({ id: `str_ap_${i+1}`, section: 'strengths', dimension: 'achievement_perseverance', type: 'scale_5', scale: 'agreement', question_ar: q, question_en: q, reverse: false, sort_order: i+1 })),
  // Influence & Leadership (4)
  ...['يستمع الآخرون لرأيي باحترام', 'أقود المجموعات بفعالية', 'أستطيع إقناع الآخرين بأفكاري', 'يطلب مني الآخرون التوجيه']
    .map((q, i) => ({ id: `str_il_${i+1}`, section: 'strengths', dimension: 'influence_leadership', type: 'scale_5', scale: 'agreement', question_ar: q, question_en: q, reverse: false, sort_order: i+1 })),
  // Relationships & Cooperation (4)
  ...['أبني علاقات إيجابية مع الآخرين', 'أعمل بفعالية ضمن فريق', 'أحل الخلافات بأسلوب بناء', 'يسهل عليّ التعاون مع الآخرين']
    .map((q, i) => ({ id: `str_rc_${i+1}`, section: 'strengths', dimension: 'relationships_cooperation', type: 'scale_5', scale: 'agreement', question_ar: q, question_en: q, reverse: false, sort_order: i+1 })),
  // Self-Management & Resilience (4)
  ...['أتعامل مع الضغط بهدوء', 'أتعافى بسرعة من النكسات', 'أدير وقتي ومواردي بفعالية', 'أحافظ على تركيزي في المهام الصعبة']
    .map((q, i) => ({ id: `str_sm_${i+1}`, section: 'strengths', dimension: 'self_management', type: 'scale_5', scale: 'agreement', question_ar: q, question_en: q, reverse: false, sort_order: i+1 })),
];

// ─── ENVIRONMENT QUESTIONS (8, paired preference) ─────────────────────────────
const environmentQuestions = [
  { id: 'env_1', section: 'environment', dimension: 'indoor_outdoor', type: 'paired',
    question_ar: 'أفضل العمل في بيئة:', question_en: 'I prefer working in a:',
    options: [
      { value: 'A', label_ar: 'داخلية (مكتب، مختبر)', label_en: 'Indoor (office, lab)', score: { indoor: 1 } },
      { value: 'B', label_ar: 'خارجية (ميدان، مواقع)', label_en: 'Outdoor (field, sites)', score: { outdoor: 1 } },
    ], sort_order: 1 },
  { id: 'env_2', section: 'environment', dimension: 'team_solo', type: 'paired',
    question_ar: 'أفضل العمل:', question_en: 'I prefer working:',
    options: [
      { value: 'A', label_ar: 'ضمن فريق', label_en: 'In a team', score: { team: 1 } },
      { value: 'B', label_ar: 'بمفردي', label_en: 'Solo', score: { solo: 1 } },
    ], sort_order: 2 },
  { id: 'env_3', section: 'environment', dimension: 'structured_flexible_env', type: 'paired',
    question_ar: 'أفضل بيئة عمل:', question_en: 'I prefer a work environment that is:',
    options: [
      { value: 'A', label_ar: 'منظمة بإجراءات واضحة', label_en: 'Structured with clear procedures', score: { structured: 1 } },
      { value: 'B', label_ar: 'مرنة وحرة', label_en: 'Flexible and free', score: { flexible: 1 } },
    ], sort_order: 3 },
  { id: 'env_4', section: 'environment', dimension: 'quiet_active', type: 'paired',
    question_ar: 'أفضل بيئة:', question_en: 'I prefer an environment that is:',
    options: [
      { value: 'A', label_ar: 'هادئة ومركزة', label_en: 'Quiet and focused', score: { quiet: 1 } },
      { value: 'B', label_ar: 'نشطة وحيوية', label_en: 'Active and lively', score: { active: 1 } },
    ], sort_order: 4 },
  { id: 'env_5', section: 'environment', dimension: 'office_remote', type: 'paired',
    question_ar: 'أفضل العمل:', question_en: 'I prefer working:',
    options: [
      { value: 'A', label_ar: 'من المكتب', label_en: 'From the office', score: { office: 1 } },
      { value: 'B', label_ar: 'عن بُعد', label_en: 'Remotely', score: { remote: 1 } },
    ], sort_order: 5 },
  { id: 'env_6', section: 'environment', dimension: 'technical_social', type: 'paired',
    question_ar: 'أفضل بيئة تركز على:', question_en: 'I prefer an environment focused on:',
    options: [
      { value: 'A', label_ar: 'الجوانب التقنية', label_en: 'Technical aspects', score: { technical: 1 } },
      { value: 'B', label_ar: 'التفاعل الاجتماعي', label_en: 'Social interaction', score: { social: 1 } },
    ], sort_order: 6 },
  { id: 'env_7', section: 'environment', dimension: 'routine_varied', type: 'paired',
    question_ar: 'أفضل عملاً:', question_en: 'I prefer work that is:',
    options: [
      { value: 'A', label_ar: 'روتينياً ومنتظماً', label_en: 'Routine and regular', score: { routine: 1 } },
      { value: 'B', label_ar: 'متنوعاً ومتجدداً', label_en: 'Varied and changing', score: { varied: 1 } },
    ], sort_order: 7 },
  { id: 'env_8', section: 'environment', dimension: 'high_low_pressure', type: 'paired',
    question_ar: 'أفضل بيئة ذات ضغط:', question_en: 'I prefer an environment with:',
    options: [
      { value: 'A', label_ar: 'ضغط عالٍ وتحديات', label_en: 'High pressure and challenges', score: { high: 1 } },
      { value: 'B', label_ar: 'ضغط منخفض وهدوء', label_en: 'Low pressure and calm', score: { low: 1 } },
    ], sort_order: 8 },
];

// ─── ALL QUESTIONS ────────────────────────────────────────────────────────────
export const ALL_QUESTIONS = [
  ...riasecQuestions,
  ...workValuesQuestions,
  ...skillsQuestions,
  ...personalityQuestions,
  ...strengthsQuestions,
  ...environmentQuestions,
];

export const SECTION_ORDER = ['riasec', 'work_values', 'skills', 'personality', 'strengths', 'environment'];

export function getQuestionsBySection(sectionId) {
  return ALL_QUESTIONS.filter(q => q.section === sectionId);
}

export function getQuestionIndex(questionId) {
  return ALL_QUESTIONS.findIndex(q => q.id === questionId);
}

export function getSectionStartIndex(sectionId) {
  let idx = 0;
  for (const s of SECTION_ORDER) {
    if (s === sectionId) return idx;
    idx += getQuestionsBySection(s).length;
  }
  return 0;
}
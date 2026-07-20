// ═══════════════════════════════════════════════════════════════════════════════
// Career Orientation — Deterministic Scoring Engine
// All numerical scoring is deterministic — no AI for score calculation.
// ═══════════════════════════════════════════════════════════════════════════════
import { ALL_QUESTIONS, SECTION_ORDER, getQuestionsBySection } from './careerQuestions';
import { RIASEC_TYPES, WORK_VALUES, SKILLS, PERSONALITY_AXES, STRENGTHS, ENVIRONMENT_AXES, OCCUPATIONS } from './careerContent';

// ─── NORMALIZE: ((raw - min) / (max - min)) * 100 ─────────────────────────────
const norm = (raw, min, max) => Math.round(((raw - min) / (max - min)) * 100);

// ─── RIASEC SCORING ────────────────────────────────────────────────────────────
// 10 items per dimension, each scored 1-5 → raw range 10-50
// normalized = ((raw - 10) / 40) * 100
function scoreRIASEC(answers) {
  const dims = ['R', 'I', 'A', 'S', 'E', 'C'];
  const scores = {};
  dims.forEach(d => {
    const qs = ALL_QUESTIONS.filter(q => q.section === 'riasec' && q.dimension === d);
    let raw = 0;
    qs.forEach(q => {
      const a = answers[q.id];
      if (a) raw += a.reverse ? (6 - a.value) : a.value;
    });
    const min = qs.length * 1;
    const max = qs.length * 5;
    scores[d] = {
      raw,
      min,
      max,
      normalized: norm(raw, min, max),
    };
  });
  return scores;
}

// ─── WORK VALUES SCORING ──────────────────────────────────────────────────────
// 3 items per value, each scored 1-5 → raw range 3-15
function scoreWorkValues(answers) {
  const scores = {};
  Object.keys(WORK_VALUES).forEach(v => {
    const qs = ALL_QUESTIONS.filter(q => q.section === 'work_values' && q.dimension === v);
    let raw = 0;
    qs.forEach(q => {
      const a = answers[q.id];
      if (a) raw += a.reverse ? (6 - a.value) : a.value;
    });
    const min = qs.length * 1;
    const max = qs.length * 5;
    scores[v] = { raw, min, max, normalized: norm(raw, min, max) };
  });
  return scores;
}

// ─── SKILLS SCORING ────────────────────────────────────────────────────────────
// Mix of self-assessed (1-5) and situational (predefined scores)
function scoreSkills(answers) {
  const scores = {};
  Object.keys(SKILLS).forEach(s => {
    const qs = ALL_QUESTIONS.filter(q => q.section === 'skills' && q.dimension === s);
    let raw = 0, min = 0, max = 0;
    qs.forEach(q => {
      const a = answers[q.id];
      if (q.type === 'situational') {
        max += 5; min += 1;
        if (a) raw += a.score || 1;
      } else {
        max += 5; min += 1;
        if (a) raw += a.reverse ? (6 - a.value) : a.value;
      }
    });
    scores[s] = { raw, min, max, normalized: norm(raw, min, max) };
  });
  return scores;
}

// ─── PERSONALITY SCORING (forced-choice) ───────────────────────────────────────
// Each axis has 5 questions. Count A vs B → percentage leaning.
function scorePersonality(answers) {
  const scores = {};
  Object.keys(PERSONALITY_AXES).forEach(axis => {
    const qs = ALL_QUESTIONS.filter(q => q.section === 'personality' && q.dimension === axis);
    let leftCount = 0, rightCount = 0;
    qs.forEach(q => {
      const a = answers[q.id];
      if (a) {
        const opt = q.options.find(o => o.value === a.value);
        if (opt) {
          const score = opt.score;
          if (score.structured || score.detail || score.independent || score.reflective || score.stability) leftCount++;
          if (score.flexible || score.bigpicture || score.collaborative || score.fast || score.novelty) rightCount++;
        }
      }
    });
    const total = leftCount + rightCount;
    // 0 = fully left, 100 = fully right
    const normalized = total > 0 ? Math.round((rightCount / total) * 100) : 50;
    scores[axis] = { leftCount, rightCount, total, normalized };
  });
  return scores;
}

// ─── STRENGTHS SCORING ────────────────────────────────────────────────────────
// 4 items per strength, each scored 1-5 → raw range 4-20
function scoreStrengths(answers) {
  const scores = {};
  Object.keys(STRENGTHS).forEach(s => {
    const qs = ALL_QUESTIONS.filter(q => q.section === 'strengths' && q.dimension === s);
    let raw = 0;
    qs.forEach(q => {
      const a = answers[q.id];
      if (a) raw += a.reverse ? (6 - a.value) : a.value;
    });
    const min = qs.length * 1;
    const max = qs.length * 5;
    scores[s] = { raw, min, max, normalized: norm(raw, min, max) };
  });
  return scores;
}

// ─── ENVIRONMENT SCORING (paired preference) ──────────────────────────────────
// Each axis has 1 question. 0 = left, 100 = right.
function scoreEnvironment(answers) {
  const scores = {};
  Object.keys(ENVIRONMENT_AXES).forEach(axis => {
    const qs = ALL_QUESTIONS.filter(q => q.section === 'environment' && q.dimension === axis);
    let leftCount = 0, rightCount = 0;
    qs.forEach(q => {
      const a = answers[q.id];
      if (a) {
        const opt = q.options.find(o => o.value === a.value);
        if (opt) {
          const score = opt.score;
          // Left keys: indoor, team, structured, quiet, office, technical, routine, high
          if (score.indoor || score.team || score.structured || score.quiet || score.office || score.technical || score.routine || score.high) leftCount++;
          // Right keys: outdoor, solo, flexible, active, remote, social, varied, low
          if (score.outdoor || score.solo || score.flexible || score.active || score.remote || score.social || score.varied || score.low) rightCount++;
        }
      }
    });
    const total = leftCount + rightCount;
    const normalized = total > 0 ? Math.round((rightCount / total) * 100) : 50;
    scores[axis] = { leftCount, rightCount, normalized };
  });
  return scores;
}

// ─── HOLLAND CODE ─────────────────────────────────────────────────────────────
function buildHollandCode(riasecScores) {
  const sorted = Object.entries(riasecScores)
    .map(([code, data]) => ({ code, score: data.normalized }))
    .sort((a, b) => b.score - a.score);

  const top3 = sorted.slice(0, 3);
  const hollandCode = top3.map(t => t.code).join('');

  // Check for closely matched dimensions (differ by < 3 points)
  const closelyMatched = [];
  for (let i = 0; i < sorted.length - 1; i++) {
    if (Math.abs(sorted[i].score - sorted[i + 1].score) < 3) {
      closelyMatched.push([sorted[i].code, sorted[i + 1].code]);
    }
  }

  return { hollandCode, top3, sorted, closelyMatched };
}

// ─── COSINE SIMILARITY (for RIASEC vectors) ───────────────────────────────────
function cosineSim(a, b) {
  const keys = ['R', 'I', 'A', 'S', 'E', 'C'];
  let dot = 0, magA = 0, magB = 0;
  keys.forEach(k => {
    const av = a[k] || 0, bv = b[k] || 0;
    dot += av * bv; magA += av * av; magB += bv * bv;
  });
  if (magA === 0 || magB === 0) return 0;
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

// ─── NORMALIZED DISTANCE (for other dimensions) ──────────────────────────────
function normDistance(userVec, occVec, keys) {
  let dist = 0;
  keys.forEach(k => {
    const u = userVec[k] || 0, o = occVec[k] || 0;
    dist += Math.abs(u - o);
  });
  const maxDist = keys.length; // max possible distance
  return Math.round((1 - dist / maxDist) * 100);
}

// ─── CAREER MATCHING ──────────────────────────────────────────────────────────
// Career Fit Score = 35% RIASEC + 25% skills + 15% strengths + 10% work values + 10% work style + 5% work environment
function matchCareers(scores) {
  const riasecUser = {};
  Object.keys(RIASEC_TYPES).forEach(k => { riasecUser[k] = (scores.riasec[k]?.normalized || 0) / 100; });

  const skillsKeys = Object.keys(SKILLS);
  const strengthsKeys = Object.keys(STRENGTHS);
  const valuesKeys = Object.keys(WORK_VALUES);
  const styleKeys = Object.keys(PERSONALITY_AXES);
  const envKeys = Object.keys(ENVIRONMENT_AXES);

  const skillsUser = {};
  skillsKeys.forEach(k => { skillsUser[k] = (scores.skills[k]?.normalized || 0) / 100; });
  const strengthsUser = {};
  strengthsKeys.forEach(k => { strengthsUser[k] = (scores.strengths[k]?.normalized || 0) / 100; });
  const valuesUser = {};
  valuesKeys.forEach(k => { valuesUser[k] = (scores.workValues[k]?.normalized || 0) / 100; });
  const styleUser = {};
  styleKeys.forEach(k => { styleUser[k] = (scores.personality[k]?.normalized || 50) / 100; });
  const envUser = {};
  envKeys.forEach(k => { envUser[k] = (scores.environment[k]?.normalized || 50) / 100; });

  const matches = OCCUPATIONS.map(occ => {
    const riasecSim = Math.round(cosineSim(riasecUser, occ.riasec) * 100);
    const skillsMatch = normDistance(skillsUser, occ.skills, skillsKeys);
    const strengthsMatch = normDistance(strengthsUser, occ.strengths, strengthsKeys);
    const valuesMatch = normDistance(valuesUser, occ.work_values, valuesKeys);
    const styleMatch = normDistance(styleUser, occ.work_style, styleKeys);
    const envMatch = normDistance(envUser, occ.environment, envKeys);

    const fitScore = Math.round(
      0.35 * riasecSim + 0.25 * skillsMatch + 0.15 * strengthsMatch +
      0.10 * valuesMatch + 0.10 * styleMatch + 0.05 * envMatch
    );

    return {
      occupation: occ,
      fitScore,
      components: {
        riasec: riasecSim,
        skills: skillsMatch,
        strengths: strengthsMatch,
        values: valuesMatch,
        style: styleMatch,
        environment: envMatch,
      },
    };
  }).sort((a, b) => b.fitScore - a.fitScore);

  return matches;
}

// ─── GENERATE INSIGHTS (deterministic, from stored scores) ────────────────────
function generateInsights(scores, holland, careerMatches, lang) {
  const isAr = lang === 'ar';
  const insights = [];

  // Insight 1: Holland code + top interests
  const top3Names = holland.top3.map(t => RIASEC_TYPES[t.code].name[lang]).join(isAr ? '، ' : ', ');
  insights.push(isAr
    ? `رمز هولاند الخاص بك هو ${holland.hollandCode}، مما يعني أن ميولك المهنية الأقوى هي: ${top3Names}.`
    : `Your Holland Code is ${holland.hollandCode}, meaning your strongest career interests are: ${top3Names}.`);

  // Insight 2: Top work values
  const topValues = Object.entries(scores.workValues)
    .sort((a, b) => b[1].normalized - a[1].normalized).slice(0, 2);
  const valueNames = topValues.map(([k]) => WORK_VALUES[k].name[lang]).join(isAr ? ' و' : ' and ');
  insights.push(isAr
    ? `أهم قيم العمل لديك هي ${valueNames}، مما يشير إلى أنك تبحث عن بيئة عمل توفر هذه القيم.`
    : `Your top work values are ${valueNames}, indicating you seek a work environment that provides these.`);

  // Insight 3: Top career match
  if (careerMatches[0]) {
    const top = careerMatches[0];
    insights.push(isAr
      ? `أفضل مسار مهني يناسبك هو ${top.occupation.title_ar} بنسبة تطابق ${top.fitScore}%، بناءً على ميولك ومهاراتك وقيمك.`
      : `Your best career match is ${top.occupation.title_en} with a ${top.fitScore}% fit, based on your interests, skills, and values.`);
  }

  return insights;
}

// ─── MAIN SCORING FUNCTION ────────────────────────────────────────────────────
export function calculateCareerScores(answers, userProfile = {}) {
  const lang = userProfile.language || 'ar';
  const timestamp = new Date().toISOString();

  const riasec = scoreRIASEC(answers);
  const workValues = scoreWorkValues(answers);
  const skills = scoreSkills(answers);
  const personality = scorePersonality(answers);
  const strengths = scoreStrengths(answers);
  const environment = scoreEnvironment(answers);

  const holland = buildHollandCode(riasec);
  const careerMatches = matchCareers({ riasec, workValues, skills, personality, strengths, environment });

  const insights = generateInsights({ riasec, workValues, skills, personality, strengths, environment }, holland, careerMatches, lang);

  // Top career families
  const familyCount = {};
  careerMatches.slice(0, 6).forEach(m => {
    const fam = lang === 'ar' ? m.occupation.family_ar : m.occupation.family_en;
    familyCount[fam] = (familyCount[fam] || 0) + 1;
  });
  const topFamilies = Object.entries(familyCount).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([name]) => name);

  return {
    product_type: 'career_orientation',
    assessment_version: '1.0',
    timestamp,
    user: userProfile,
    riasec,
    workValues,
    skills,
    personality,
    strengths,
    environment,
    holland,
    careerMatches: careerMatches.slice(0, 9), // top 6 + 3 alternatives
    topFamilies,
    insights,
    top3Careers: careerMatches.slice(0, 3),
    top6Careers: careerMatches.slice(0, 6),
    alternativeCareers: careerMatches.slice(6, 9),
  };
}

// ─── COMPLETION STATS ─────────────────────────────────────────────────────────
export function getCompletionStats(answers) {
  const total = ALL_QUESTIONS.length;
  const answered = Object.keys(answers).filter(id => {
    const a = answers[id];
    return a && (a.value !== undefined || a.value !== null);
  }).length;
  const percentage = Math.round((answered / total) * 100);

  const sections = {};
  SECTION_ORDER.forEach(s => {
    const qs = getQuestionsBySection(s);
    const answeredInSection = qs.filter(q => answers[q.id]).length;
    sections[s] = { total: qs.length, answered: answeredInSection, complete: answeredInSection === qs.length };
  });

  return { total, answered, percentage, sections };
}
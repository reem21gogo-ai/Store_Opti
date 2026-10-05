// ═══════════════════════════════════════════════════════════════════════════════
// Quick Career Interest Assessment — Deterministic Scoring
// Same normalization used by the full engine: ((raw - min) / (max - min)) * 100
// Each RIASEC dimension is represented by one item → raw range 1-5.
// ═══════════════════════════════════════════════════════════════════════════════
import { QUICK_QUESTIONS } from './quickCareerQuestions';
import { RIASEC_TYPES } from './careerContent';

const DIMS = ['R', 'I', 'A', 'S', 'E', 'C'];
const norm = (raw, min, max) => Math.round(((raw - min) / (max - min)) * 100);

export function calculateQuickCareerScores(answers = {}) {
  const scores = {};

  DIMS.forEach(code => {
    const qs = QUICK_QUESTIONS.filter(q => q.dimension === code);
    let raw = 0;
    qs.forEach(q => {
      const a = answers[q.id];
      if (a) raw += a.reverse ? (6 - a.value) : a.value;
    });
    const min = qs.length * 1;
    const max = qs.length * 5;
    scores[code] = { raw, min, max, normalized: norm(raw, min, max) };
  });

  const ranked = DIMS
    .map(code => ({ code, score: scores[code].normalized }))
    .sort((a, b) => b.score - a.score);

  const topScore = ranked[0]?.score || 0;
  const strongest = ranked.filter(r => r.score === topScore).map(r => r.code);
  const top3 = ranked.slice(0, 3);

  return {
    scores,
    ranked,
    top3,
    strongest,
    hollandCode: top3.map(t => t.code).join(''),
  };
}

export function buildQuickProfile(answers = {}, lang = 'ar') {
  const result = calculateQuickCareerScores(answers);
  const maxScore = Math.max(...result.ranked.map(r => r.score), 1);

  return {
    ...result,
    language: lang,
    completedAt: new Date().toISOString(),
    strongestTypes: result.strongest.map(code => ({ code, ...RIASEC_TYPES[code] })),
    top3: result.top3.map(t => ({
      code: t.code,
      score: t.score,
      relative: Math.round((t.score / maxScore) * 100),
      ...RIASEC_TYPES[t.code],
    })),
  };
}
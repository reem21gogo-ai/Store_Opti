import { getBand } from './competencyContent';

export const calculateScores = (answers, questions) => {
  const domainGroups = {};
  const subGroups    = {};

  questions.forEach((q, idx) => {
    const answer = answers[idx];
    if (answer === undefined) return;
    const opt = q.options.find(o => o.id === answer);
    const score = opt ? opt.score : 0;
    const maxScore = 4;

    if (!domainGroups[q.domain]) domainGroups[q.domain] = { sum: 0, max: 0 };
    domainGroups[q.domain].sum += score;
    domainGroups[q.domain].max += maxScore;

    const subKey = `${q.domain}__${q.sub_competency}`;
    if (!subGroups[subKey]) subGroups[subKey] = { sum: 0, max: 0 };
    subGroups[subKey].sum += score;
    subGroups[subKey].max += maxScore;
  });

  const domain_scores = {};
  Object.entries(domainGroups).forEach(([id, { sum, max }]) => {
    const pct = max > 0 ? Math.round((sum / max) * 100) : 0;
    domain_scores[id] = { score: pct, band: getBand(pct) };
  });

  const sub_competency_scores = {};
  Object.entries(subGroups).forEach(([key, { sum, max }]) => {
    const pct = max > 0 ? Math.round((sum / max) * 100) : 0;
    sub_competency_scores[key] = { score: pct, band: getBand(pct) };
  });

  const domainValues = Object.values(domain_scores).map(d => d.score);
  const overall_score = domainValues.length > 0
    ? Math.round(domainValues.reduce((a, b) => a + b, 0) / domainValues.length)
    : 0;

  return { domain_scores, sub_competency_scores, overall_score, overall_band: getBand(overall_score) };
};

export const generateReportId = () => {
  const now = new Date();
  const dd  = String(now.getDate()).padStart(2, '0');
  const mm  = String(now.getMonth() + 1).padStart(2, '0');
  const yy  = now.getFullYear();
  return `${dd}${mm}${yy}`;
};

export const formatDate = (date = new Date()) => {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yy = date.getFullYear();
  return `${dd}/${mm}/${yy}`;
};
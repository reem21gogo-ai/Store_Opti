import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';

const clean = (value, max = 200) => (typeof value === 'string' ? value.trim().slice(0, max) : '');
const AGE_RANGES = ['under_18', '18_24', '25_34', '35_44', '45_54', '55_plus'];
const DIMS = ['R', 'I', 'A', 'S', 'E', 'C'];

export default async function (req) {
  try {
    if (req.method !== 'POST') {
      return Response.json({ error: 'Method not allowed' }, { status: 405 });
    }

    const body = await req.json().catch(() => ({}));

    const contact = clean(body?.contact, 160);
    if (!contact) {
      return Response.json({ error: 'contact is required' }, { status: 400 });
    }

    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);

    const ageRange = AGE_RANGES.includes(body?.age_range) ? body.age_range : undefined;
    const topInterests = Array.isArray(body?.top_interests)
      ? body.top_interests.filter(code => DIMS.includes(code)).slice(0, 6)
      : [];

    const lead = await base44.asServiceRole.entities.QuickCareerLead.create({
      first_name: clean(body?.first_name, 80),
      age_range: ageRange,
      contact,
      contact_type: body?.contact_type === 'mobile' ? 'mobile' : 'email',
      language: body?.language === 'en' ? 'en' : 'ar',
      strongest_interest: DIMS.includes(body?.strongest_interest) ? body.strongest_interest : undefined,
      top_interests: topInterests,
      holland_code: clean(body?.holland_code, 12),
      source: 'quick_career',
      status: 'new',
      user_email: user?.email || undefined,
    });

    return Response.json({ id: lead.id, saved: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
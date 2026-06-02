// mockData.js
// Seed data for the Nimbus SaaS demo. Everything lives in memory — these arrays
// are deep-cloned into the reactive store on boot so a "Reset demo" restores
// this exact starting state.

export const DEMO_USER = {
  name: 'Michel Carlos',
  email: 'demo@nimbus.app',
  role: 'Workspace owner',
  initials: 'MC',
}

// The single demo credential. Any password is accepted, but this is pre-filled.
export const DEMO_CREDENTIALS = {
  email: 'demo@nimbus.app',
  password: 'nimbus-demo',
}

export const PLANS = ['Starter', 'Growth', 'Scale', 'Enterprise']
export const CUSTOMER_STATUSES = ['active', 'trialing', 'past_due', 'churned']
export const INVOICE_STATUSES = ['paid', 'open', 'overdue', 'draft']

const PLAN_MRR = { Starter: 49, Growth: 199, Scale: 499, Enterprise: 1500 }
export const planMrr = (plan) => PLAN_MRR[plan] ?? 0

export const seedCustomers = [
  { id: 'cus_8fK21', name: 'Ana Beatriz Lima', email: 'ana@quanta.io', company: 'Quanta Labs', plan: 'Scale', status: 'active', seats: 24, createdAt: '2025-11-03', country: 'BR' },
  { id: 'cus_3pL90', name: 'Daniel Okonkwo', email: 'daniel@helio.dev', company: 'Helio', plan: 'Growth', status: 'active', seats: 9, createdAt: '2026-01-14', country: 'NG' },
  { id: 'cus_7zX44', name: 'Sofia Marchetti', email: 'sofia@verdant.eco', company: 'Verdant', plan: 'Enterprise', status: 'active', seats: 140, createdAt: '2025-08-22', country: 'IT' },
  { id: 'cus_1qW58', name: 'Marcus Hale', email: 'marcus@northpeak.co', company: 'Northpeak', plan: 'Starter', status: 'trialing', seats: 3, createdAt: '2026-05-19', country: 'US' },
  { id: 'cus_5tR12', name: 'Priya Nair', email: 'priya@kosmo.in', company: 'Kosmo', plan: 'Growth', status: 'past_due', seats: 12, createdAt: '2025-12-01', country: 'IN' },
  { id: 'cus_9bN73', name: 'Lukas Brandt', email: 'lukas@feldwork.de', company: 'Feldwork', plan: 'Scale', status: 'active', seats: 38, createdAt: '2025-10-09', country: 'DE' },
  { id: 'cus_2hG36', name: 'Yuki Tanaka', email: 'yuki@sora.jp', company: 'Sora Studio', plan: 'Starter', status: 'churned', seats: 0, createdAt: '2025-06-30', country: 'JP' },
  { id: 'cus_4mC81', name: 'Camila Rojas', email: 'camila@andico.cl', company: 'Andico', plan: 'Growth', status: 'active', seats: 16, createdAt: '2026-02-27', country: 'CL' },
  { id: 'cus_6vB29', name: 'Tom Fairweather', email: 'tom@brightloop.io', company: 'Brightloop', plan: 'Scale', status: 'trialing', seats: 21, createdAt: '2026-05-02', country: 'GB' },
  { id: 'cus_0dF67', name: 'Amara Diallo', email: 'amara@sahel.africa', company: 'Sahel Energy', plan: 'Enterprise', status: 'active', seats: 96, createdAt: '2025-09-15', country: 'SN' },
  { id: 'cus_3kP18', name: 'Elena Petrova', email: 'elena@arktos.ru', company: 'Arktos', plan: 'Growth', status: 'active', seats: 11, createdAt: '2026-03-11', country: 'RS' },
  { id: 'cus_8wQ52', name: 'Noah Bergström', email: 'noah@frost.se', company: 'Frost', plan: 'Starter', status: 'past_due', seats: 4, createdAt: '2026-04-08', country: 'SE' },
]

export const seedInvoices = [
  { id: 'inv_1042', customer: 'Quanta Labs', amount: 499, status: 'paid', issuedAt: '2026-05-01', dueAt: '2026-05-15' },
  { id: 'inv_1043', customer: 'Helio', amount: 199, status: 'paid', issuedAt: '2026-05-01', dueAt: '2026-05-15' },
  { id: 'inv_1044', customer: 'Verdant', amount: 1500, status: 'paid', issuedAt: '2026-05-01', dueAt: '2026-05-15' },
  { id: 'inv_1045', customer: 'Kosmo', amount: 199, status: 'overdue', issuedAt: '2026-04-01', dueAt: '2026-04-15' },
  { id: 'inv_1046', customer: 'Feldwork', amount: 499, status: 'open', issuedAt: '2026-05-20', dueAt: '2026-06-03' },
  { id: 'inv_1047', customer: 'Andico', amount: 199, status: 'open', issuedAt: '2026-05-20', dueAt: '2026-06-03' },
  { id: 'inv_1048', customer: 'Sahel Energy', amount: 1500, status: 'paid', issuedAt: '2026-05-01', dueAt: '2026-05-15' },
  { id: 'inv_1049', customer: 'Frost', amount: 49, status: 'overdue', issuedAt: '2026-04-08', dueAt: '2026-04-22' },
  { id: 'inv_1050', customer: 'Brightloop', amount: 499, status: 'draft', issuedAt: '2026-05-28', dueAt: '2026-06-11' },
]

// 12-week signup trend for the dashboard sparkline/bars (newest last).
export const seedSignupTrend = [4, 6, 5, 9, 7, 11, 8, 13, 10, 14, 12, 17]

export const seedActivity = [
  { id: 'a1', who: 'Sofia Marchetti', action: 'upgraded to Enterprise', when: '2h ago', kind: 'upgrade' },
  { id: 'a2', who: 'Marcus Hale', action: 'started a Starter trial', when: '5h ago', kind: 'trial' },
  { id: 'a3', who: 'Kosmo', action: 'invoice inv_1045 went overdue', when: '1d ago', kind: 'alert' },
  { id: 'a4', who: 'Camila Rojas', action: 'added 4 seats', when: '2d ago', kind: 'seats' },
  { id: 'a5', who: 'Yuki Tanaka', action: 'cancelled their subscription', when: '4d ago', kind: 'churn' },
]

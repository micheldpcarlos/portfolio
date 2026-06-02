// store.js
// A tiny shared reactive store for the Nimbus SaaS demo — no Pinia, no backend.
// All CRUD happens in memory against these arrays; refreshing the page or hitting
// "Reset demo" restores the seed data from mockData.js.

import { reactive, computed } from 'vue'
import {
  DEMO_USER,
  seedCustomers,
  seedInvoices,
  seedSignupTrend,
  seedActivity,
  planMrr,
} from './mockData.js'

const clone = (v) => JSON.parse(JSON.stringify(v))

// A non-crypto id generator that is deterministic-enough for a demo. We avoid
// Math.random in places that must be stable, but ids only need to be unique.
let counter = 100
const nextId = (prefix) => {
  counter += 1
  const tail = (counter * 37).toString(36).slice(-5)
  return `${prefix}_${tail}`
}

export const state = reactive({
  authed: false,
  user: clone(DEMO_USER),
  view: 'dashboard', // dashboard | customers | invoices | settings
  customers: clone(seedCustomers),
  invoices: clone(seedInvoices),
  signupTrend: clone(seedSignupTrend),
  activity: clone(seedActivity),
  toasts: [],
  settings: {
    workspaceName: 'Nimbus',
    billingEmail: 'billing@nimbus.app',
    weeklyDigest: true,
    seatAlerts: true,
  },
})

/* ---------- auth ---------- */
export function login(email) {
  state.authed = true
  if (email) state.user.email = email
  state.view = 'dashboard'
}
export function logout() {
  state.authed = false
}

/* ---------- navigation ---------- */
export function go(view) {
  state.view = view
}

/* ---------- derived metrics ---------- */
export const mrr = computed(() =>
  state.customers
    .filter((c) => c.status === 'active' || c.status === 'past_due')
    .reduce((sum, c) => sum + planMrr(c.plan), 0),
)

export const activeCount = computed(
  () => state.customers.filter((c) => c.status === 'active').length,
)
export const trialingCount = computed(
  () => state.customers.filter((c) => c.status === 'trialing').length,
)
export const pastDueCount = computed(
  () => state.customers.filter((c) => c.status === 'past_due').length,
)

export const outstanding = computed(() =>
  state.invoices
    .filter((i) => i.status === 'open' || i.status === 'overdue')
    .reduce((sum, i) => sum + i.amount, 0),
)

export const churnRate = computed(() => {
  const total = state.customers.length || 1
  const churned = state.customers.filter((c) => c.status === 'churned').length
  return Math.round((churned / total) * 1000) / 10
})

/* ---------- customer CRUD ---------- */
export function createCustomer(data) {
  const cust = {
    id: nextId('cus'),
    name: data.name.trim(),
    email: data.email.trim(),
    company: data.company.trim(),
    plan: data.plan,
    status: data.status,
    seats: Number(data.seats) || 0,
    country: (data.country || '').trim().toUpperCase().slice(0, 2),
    createdAt: todayISO(),
  }
  state.customers.unshift(cust)
  pushActivity(cust.name, `was added as a ${cust.plan} customer`, 'upgrade')
  toast(`Added ${cust.name}`, 'success')
  return cust
}

export function updateCustomer(id, data) {
  const c = state.customers.find((x) => x.id === id)
  if (!c) return
  Object.assign(c, {
    name: data.name.trim(),
    email: data.email.trim(),
    company: data.company.trim(),
    plan: data.plan,
    status: data.status,
    seats: Number(data.seats) || 0,
    country: (data.country || '').trim().toUpperCase().slice(0, 2),
  })
  toast(`Saved changes to ${c.name}`, 'success')
  return c
}

export function deleteCustomer(id) {
  const idx = state.customers.findIndex((x) => x.id === id)
  if (idx === -1) return
  const [removed] = state.customers.splice(idx, 1)
  toast(`Deleted ${removed.name}`, 'info')
}

/* ---------- invoice actions ---------- */
export function createInvoice(data) {
  const inv = {
    id: nextId('inv'),
    customer: data.customer.trim(),
    amount: Number(data.amount) || 0,
    status: data.status || 'draft',
    issuedAt: todayISO(),
    dueAt: addDaysISO(14),
  }
  state.invoices.unshift(inv)
  toast(`Created invoice ${inv.id}`, 'success')
  return inv
}

export function markInvoicePaid(id) {
  const inv = state.invoices.find((x) => x.id === id)
  if (!inv) return
  inv.status = 'paid'
  toast(`Marked ${inv.id} as paid`, 'success')
}

export function deleteInvoice(id) {
  const idx = state.invoices.findIndex((x) => x.id === id)
  if (idx === -1) return
  const [removed] = state.invoices.splice(idx, 1)
  toast(`Deleted invoice ${removed.id}`, 'info')
}

/* ---------- settings ---------- */
export function saveSettings(patch) {
  Object.assign(state.settings, patch)
  toast('Settings saved', 'success')
}

/* ---------- toasts ---------- */
export function toast(message, kind = 'info') {
  const id = nextId('t')
  state.toasts.push({ id, message, kind })
  // Auto-dismiss handled in ToastHost via setTimeout per toast.
  return id
}
export function dismissToast(id) {
  const idx = state.toasts.findIndex((t) => t.id === id)
  if (idx !== -1) state.toasts.splice(idx, 1)
}

/* ---------- reset ---------- */
export function resetDemo() {
  state.customers = clone(seedCustomers)
  state.invoices = clone(seedInvoices)
  state.signupTrend = clone(seedSignupTrend)
  state.activity = clone(seedActivity)
  state.settings = {
    workspaceName: 'Nimbus',
    billingEmail: 'billing@nimbus.app',
    weeklyDigest: true,
    seatAlerts: true,
  }
  toast('Demo data reset to defaults', 'info')
}

/* ---------- helpers ---------- */
function pushActivity(who, action, kind) {
  state.activity.unshift({ id: nextId('a'), who, action, when: 'just now', kind })
  state.activity = state.activity.slice(0, 8)
}

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}
function addDaysISO(days) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

<script setup>
import { ref, reactive, computed } from 'vue'
import {
  state,
  outstanding,
  createInvoice,
  markInvoicePaid,
  deleteInvoice,
} from '../store.js'
import { INVOICE_STATUSES } from '../mockData.js'
import ConfirmDialog from '../ConfirmDialog.vue'

const money = (n) => '$' + n.toLocaleString('en-US')

const tab = ref('all')
const tabs = ['all', ...INVOICE_STATUSES]

const filtered = computed(() =>
  tab.value === 'all'
    ? state.invoices
    : state.invoices.filter((i) => i.status === tab.value),
)

const totals = computed(() => {
  const paid = state.invoices
    .filter((i) => i.status === 'paid')
    .reduce((s, i) => s + i.amount, 0)
  return { paid, outstanding: outstanding.value }
})

const showForm = ref(false)
const form = reactive({ customer: '', amount: 0, status: 'open' })
function resetForm() {
  form.customer = ''
  form.amount = 0
  form.status = 'open'
}
function submitInvoice() {
  if (!form.customer.trim() || Number(form.amount) <= 0) return
  createInvoice({ ...form })
  resetForm()
  showForm.value = false
}

const confirmOpen = ref(false)
const pendingDelete = ref(null)
function askDelete(inv) {
  pendingDelete.value = inv
  confirmOpen.value = true
}
function confirmDelete() {
  if (pendingDelete.value) deleteInvoice(pendingDelete.value.id)
  confirmOpen.value = false
  pendingDelete.value = null
}
</script>

<template>
  <div class="nb-view" data-testid="view-invoices">
    <header class="nb-view-head">
      <div>
        <h1>Invoices</h1>
        <p class="nb-sub">
          {{ money(totals.paid) }} collected · {{ money(totals.outstanding) }} outstanding
        </p>
      </div>
      <button class="nb-btn nb-btn-primary" data-testid="new-invoice" @click="showForm = !showForm">
        + New invoice
      </button>
    </header>

    <form v-if="showForm" class="nb-inline-form" data-testid="invoice-form" @submit.prevent="submitInvoice">
      <input
        v-model="form.customer"
        data-testid="invoice-customer"
        type="text"
        placeholder="Customer or company"
      />
      <input
        v-model.number="form.amount"
        data-testid="invoice-amount"
        type="number"
        min="1"
        placeholder="Amount (USD)"
      />
      <select v-model="form.status" data-testid="invoice-status">
        <option v-for="s in INVOICE_STATUSES" :key="s" :value="s">{{ s }}</option>
      </select>
      <button type="submit" class="nb-btn nb-btn-primary" data-testid="invoice-submit">Create</button>
    </form>

    <div class="nb-tabs" role="tablist">
      <button
        v-for="t in tabs"
        :key="t"
        class="nb-tab"
        :class="{ active: tab === t }"
        :data-testid="`tab-${t}`"
        role="tab"
        :aria-selected="tab === t"
        @click="tab = t"
      >
        {{ t }}
      </button>
    </div>

    <div class="nb-table-wrap">
      <table class="nb-table" data-testid="invoices-table">
        <thead>
          <tr>
            <th>Invoice</th>
            <th>Customer</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Issued</th>
            <th>Due</th>
            <th class="nb-th-actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="inv in filtered" :key="inv.id" :data-testid="`inv-row-${inv.id}`">
            <td class="nb-mono">{{ inv.id }}</td>
            <td>{{ inv.customer }}</td>
            <td class="nb-mono">{{ money(inv.amount) }}</td>
            <td><span class="nb-pill" :class="`i-${inv.status}`">{{ inv.status }}</span></td>
            <td class="nb-muted">{{ inv.issuedAt }}</td>
            <td class="nb-muted">{{ inv.dueAt }}</td>
            <td class="nb-th-actions">
              <button
                v-if="inv.status !== 'paid'"
                class="nb-btn nb-btn-tiny"
                :data-testid="`pay-${inv.id}`"
                @click="markInvoicePaid(inv.id)"
              >
                Mark paid
              </button>
              <button
                class="nb-icon-btn nb-icon-danger"
                :data-testid="`del-inv-${inv.id}`"
                aria-label="Delete invoice"
                @click="askDelete(inv)"
              >
                🗑
              </button>
            </td>
          </tr>
          <tr v-if="filtered.length === 0">
            <td colspan="7" class="nb-empty">No invoices in this view.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <ConfirmDialog
      :open="confirmOpen"
      title="Delete invoice?"
      :message="pendingDelete ? `Invoice ${pendingDelete.id} will be removed.` : ''"
      confirm-label="Delete"
      danger
      @confirm="confirmDelete"
      @cancel="confirmOpen = false"
    />
  </div>
</template>

<style scoped>
.nb-view {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.nb-view-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}
.nb-view-head h1 {
  margin: 0;
  font-size: 1.55rem;
  color: #f5f5f7;
}
.nb-sub {
  margin: 4px 0 0;
  color: #8a8a9c;
  font-size: 0.92rem;
}
.nb-inline-form {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  padding: 14px;
  border-radius: 12px;
  background: #15151e;
  border: 1px solid #25252f;
}
.nb-inline-form input,
.nb-inline-form select {
  padding: 9px 12px;
  border-radius: 9px;
  border: 1px solid #2f2f3d;
  background: #0f0f16;
  color: #e8e8ee;
  font-size: 0.88rem;
}
.nb-inline-form input[type='text'] {
  flex: 1;
  min-width: 180px;
}
.nb-inline-form input:focus,
.nb-inline-form select:focus {
  outline: none;
  border-color: #7e8aff;
  box-shadow: 0 0 0 3px rgba(126, 138, 255, 0.18);
}
.nb-tabs {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
.nb-tab {
  padding: 7px 14px;
  border-radius: 999px;
  border: 1px solid #2c2c3a;
  background: #15151e;
  color: #9a9aac;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  text-transform: capitalize;
}
.nb-tab:hover {
  color: #e8e8ee;
}
.nb-tab.active {
  background: #2a2f5e;
  border-color: #7e8aff;
  color: #d9ddff;
}
.nb-table-wrap {
  border-radius: 14px;
  border: 1px solid #25252f;
  overflow-x: auto;
  background: #15151e;
}
.nb-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.88rem;
}
.nb-table th {
  text-align: left;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #75758a;
  padding: 12px 14px;
  border-bottom: 1px solid #25252f;
  white-space: nowrap;
}
.nb-th-actions {
  text-align: right;
}
.nb-table td {
  padding: 11px 14px;
  border-bottom: 1px solid #1d1d27;
  color: #d4d4de;
}
.nb-table tbody tr:last-child td {
  border-bottom: none;
}
.nb-table tbody tr:hover {
  background: #1a1a24;
}
.nb-mono {
  font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
  font-variant-numeric: tabular-nums;
}
.nb-muted {
  color: #75758a;
  font-variant-numeric: tabular-nums;
}
.nb-pill {
  display: inline-block;
  padding: 2px 9px;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: capitalize;
}
.i-paid {
  background: rgba(0, 209, 132, 0.16);
  color: #00d184;
}
.i-open {
  background: rgba(126, 138, 255, 0.16);
  color: #9aa6ff;
}
.i-overdue {
  background: rgba(255, 92, 122, 0.16);
  color: #ff5c7a;
}
.i-draft {
  background: rgba(150, 150, 165, 0.16);
  color: #b6b6c6;
}
.nb-btn-tiny {
  padding: 5px 10px;
  font-size: 0.76rem;
  margin-right: 6px;
}
.nb-icon-btn {
  background: #1f1f2b;
  border: 1px solid #2c2c3a;
  color: #c4c4d2;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.85rem;
}
.nb-icon-danger:hover {
  background: rgba(255, 92, 122, 0.2);
  border-color: #ff5c7a;
}
.nb-empty {
  text-align: center;
  color: #75758a;
  padding: 28px 14px;
}
</style>

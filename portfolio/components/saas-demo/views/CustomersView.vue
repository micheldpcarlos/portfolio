<script setup>
import { ref, computed } from 'vue'
import {
  state,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from '../store.js'
import { CUSTOMER_STATUSES } from '../mockData.js'
import CustomerModal from '../CustomerModal.vue'
import ConfirmDialog from '../ConfirmDialog.vue'

const search = ref('')
const statusFilter = ref('all')
const sortKey = ref('createdAt')
const sortDir = ref('desc')
const page = ref(1)
const perPage = 6

const modalOpen = ref(false)
const editing = ref(null)

const confirmOpen = ref(false)
const pendingDelete = ref(null)

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  let rows = state.customers.filter((c) => {
    const matchesQ =
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.company.toLowerCase().includes(q)
    const matchesStatus =
      statusFilter.value === 'all' || c.status === statusFilter.value
    return matchesQ && matchesStatus
  })
  const dir = sortDir.value === 'asc' ? 1 : -1
  rows = [...rows].sort((a, b) => {
    const av = a[sortKey.value]
    const bv = b[sortKey.value]
    if (av < bv) return -1 * dir
    if (av > bv) return 1 * dir
    return 0
  })
  return rows
})

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filtered.value.length / perPage)),
)
const paged = computed(() => {
  const start = (Math.min(page.value, totalPages.value) - 1) * perPage
  return filtered.value.slice(start, start + perPage)
})

function setSort(key) {
  if (sortKey.value === key) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortDir.value = 'asc'
  }
}
function sortArrow(key) {
  if (sortKey.value !== key) return ''
  return sortDir.value === 'asc' ? ' ▲' : ' ▼'
}

function openCreate() {
  editing.value = null
  modalOpen.value = true
}
function openEdit(c) {
  editing.value = c
  modalOpen.value = true
}
function onSave(data) {
  if (editing.value) updateCustomer(editing.value.id, data)
  else createCustomer(data)
  modalOpen.value = false
}
function askDelete(c) {
  pendingDelete.value = c
  confirmOpen.value = true
}
function confirmDelete() {
  if (pendingDelete.value) deleteCustomer(pendingDelete.value.id)
  confirmOpen.value = false
  pendingDelete.value = null
}
</script>

<template>
  <div class="nb-view" data-testid="view-customers">
    <header class="nb-view-head">
      <div>
        <h1>Customers</h1>
        <p class="nb-sub">{{ filtered.length }} of {{ state.customers.length }} shown</p>
      </div>
      <button class="nb-btn nb-btn-primary" data-testid="add-customer" @click="openCreate">
        + Add customer
      </button>
    </header>

    <div class="nb-toolbar">
      <input
        v-model="search"
        class="nb-search"
        data-testid="customer-search"
        type="search"
        placeholder="Search name, email or company…"
        @input="page = 1"
      />
      <select
        v-model="statusFilter"
        class="nb-filter"
        data-testid="status-filter"
        @change="page = 1"
      >
        <option value="all">All statuses</option>
        <option v-for="s in CUSTOMER_STATUSES" :key="s" :value="s">{{ s }}</option>
      </select>
    </div>

    <div class="nb-table-wrap">
      <table class="nb-table" data-testid="customers-table">
        <thead>
          <tr>
            <th class="nb-th-sort" @click="setSort('name')">Customer{{ sortArrow('name') }}</th>
            <th>Company</th>
            <th class="nb-th-sort" @click="setSort('plan')">Plan{{ sortArrow('plan') }}</th>
            <th class="nb-th-sort" @click="setSort('seats')">Seats{{ sortArrow('seats') }}</th>
            <th>Status</th>
            <th class="nb-th-sort" @click="setSort('createdAt')">Joined{{ sortArrow('createdAt') }}</th>
            <th class="nb-th-actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in paged" :key="c.id" :data-testid="`row-${c.id}`">
            <td>
              <div class="nb-cust">
                <span class="nb-avatar" aria-hidden="true">{{ c.name.charAt(0) }}</span>
                <div class="nb-cust-meta">
                  <span class="nb-cust-name">{{ c.name }}</span>
                  <span class="nb-cust-email">{{ c.email }}</span>
                </div>
              </div>
            </td>
            <td>{{ c.company }}<span v-if="c.country" class="nb-flag">{{ c.country }}</span></td>
            <td>{{ c.plan }}</td>
            <td>{{ c.seats }}</td>
            <td><span class="nb-pill" :class="`s-${c.status}`">{{ c.status }}</span></td>
            <td class="nb-muted">{{ c.createdAt }}</td>
            <td class="nb-th-actions">
              <button
                class="nb-icon-btn"
                :data-testid="`edit-${c.id}`"
                aria-label="Edit"
                @click="openEdit(c)"
              >
                ✎
              </button>
              <button
                class="nb-icon-btn nb-icon-danger"
                :data-testid="`delete-${c.id}`"
                aria-label="Delete"
                @click="askDelete(c)"
              >
                🗑
              </button>
            </td>
          </tr>
          <tr v-if="paged.length === 0">
            <td colspan="7" class="nb-empty" data-testid="customers-empty">
              No customers match your filters.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="nb-pager" v-if="totalPages > 1">
      <button
        class="nb-btn nb-btn-ghost"
        data-testid="page-prev"
        :disabled="page <= 1"
        @click="page = Math.max(1, page - 1)"
      >
        ← Prev
      </button>
      <span class="nb-page-info" data-testid="page-info">Page {{ Math.min(page, totalPages) }} of {{ totalPages }}</span>
      <button
        class="nb-btn nb-btn-ghost"
        data-testid="page-next"
        :disabled="page >= totalPages"
        @click="page = Math.min(totalPages, page + 1)"
      >
        Next →
      </button>
    </div>

    <CustomerModal
      :open="modalOpen"
      :customer="editing"
      @save="onSave"
      @close="modalOpen = false"
    />
    <ConfirmDialog
      :open="confirmOpen"
      title="Delete customer?"
      :message="pendingDelete ? `This will permanently remove ${pendingDelete.name} from the demo.` : ''"
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
.nb-toolbar {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.nb-search {
  flex: 1;
  min-width: 200px;
  padding: 10px 13px;
  border-radius: 10px;
  border: 1px solid #2f2f3d;
  background: #0f0f16;
  color: #e8e8ee;
  font-size: 0.9rem;
}
.nb-filter {
  padding: 10px 13px;
  border-radius: 10px;
  border: 1px solid #2f2f3d;
  background: #0f0f16;
  color: #e8e8ee;
  font-size: 0.9rem;
}
.nb-search:focus,
.nb-filter:focus {
  outline: none;
  border-color: #7e8aff;
  box-shadow: 0 0 0 3px rgba(126, 138, 255, 0.18);
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
.nb-th-sort {
  cursor: pointer;
  user-select: none;
}
.nb-th-sort:hover {
  color: #b6b6c6;
}
.nb-th-actions {
  text-align: right;
}
.nb-table td {
  padding: 11px 14px;
  border-bottom: 1px solid #1d1d27;
  color: #d4d4de;
  vertical-align: middle;
}
.nb-table tbody tr:last-child td {
  border-bottom: none;
}
.nb-table tbody tr:hover {
  background: #1a1a24;
}
.nb-cust {
  display: flex;
  align-items: center;
  gap: 10px;
}
.nb-avatar {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 999px;
  background: linear-gradient(135deg, #7e8aff, #b14bff);
  color: #fff;
  font-weight: 700;
  font-size: 0.85rem;
  flex: none;
}
.nb-cust-meta {
  display: flex;
  flex-direction: column;
}
.nb-cust-name {
  color: #f0f0f4;
  font-weight: 600;
}
.nb-cust-email {
  font-size: 0.76rem;
  color: #75758a;
}
.nb-flag {
  margin-left: 7px;
  font-size: 0.66rem;
  padding: 1px 6px;
  border-radius: 5px;
  background: #23232f;
  color: #9a9aac;
  vertical-align: middle;
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
.s-active {
  background: rgba(0, 209, 132, 0.16);
  color: #00d184;
}
.s-trialing {
  background: rgba(126, 138, 255, 0.16);
  color: #9aa6ff;
}
.s-past_due {
  background: rgba(255, 181, 71, 0.16);
  color: #ffb547;
}
.s-churned {
  background: rgba(255, 92, 122, 0.16);
  color: #ff5c7a;
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
  margin-left: 6px;
}
.nb-icon-btn:hover {
  background: #2a2a3a;
  color: #fff;
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
.nb-pager {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
}
.nb-page-info {
  font-size: 0.82rem;
  color: #8a8a9c;
}
</style>

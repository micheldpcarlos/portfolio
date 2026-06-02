<script setup>
import { reactive, watch, computed, ref, nextTick } from 'vue'
import { PLANS, CUSTOMER_STATUSES } from './mockData.js'

const props = defineProps({
  open: { type: Boolean, default: false },
  customer: { type: Object, default: null }, // null = create mode
})
const emit = defineEmits(['save', 'close'])

const isEdit = computed(() => !!props.customer)
const form = reactive(blank())
const errors = reactive({})
const firstField = ref(null)

function blank() {
  return {
    name: '',
    email: '',
    company: '',
    plan: 'Starter',
    status: 'trialing',
    seats: 1,
    country: '',
  }
}

watch(
  () => props.open,
  (open) => {
    if (!open) return
    Object.assign(form, props.customer ? { ...props.customer } : blank())
    for (const k of Object.keys(errors)) delete errors[k]
    nextTick(() => firstField.value?.focus())
  },
)

function validate() {
  for (const k of Object.keys(errors)) delete errors[k]
  if (!form.name.trim()) errors.name = 'Name is required'
  if (!form.email.trim()) errors.email = 'Email is required'
  else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email))
    errors.email = 'Enter a valid email'
  if (!form.company.trim()) errors.company = 'Company is required'
  if (Number(form.seats) < 0) errors.seats = 'Seats cannot be negative'
  return Object.keys(errors).length === 0
}

function submit() {
  if (!validate()) return
  emit('save', { ...form })
}
</script>

<template>
  <transition name="nb-fade">
    <div
      v-if="open"
      class="nb-overlay"
      data-testid="customer-modal"
      @click.self="emit('close')"
      @keydown.esc="emit('close')"
    >
      <div class="nb-modal" role="dialog" aria-modal="true" aria-labelledby="nb-modal-title">
        <header class="nb-modal-head">
          <h3 id="nb-modal-title">{{ isEdit ? 'Edit customer' : 'New customer' }}</h3>
          <button
            type="button"
            class="nb-modal-x"
            aria-label="Close"
            data-testid="modal-close"
            @click="emit('close')"
          >
            ×
          </button>
        </header>

        <form class="nb-form" @submit.prevent="submit">
          <div class="nb-field">
            <label for="f-name">Full name</label>
            <input
              id="f-name"
              ref="firstField"
              v-model="form.name"
              data-testid="field-name"
              type="text"
              placeholder="Jane Cooper"
              autocomplete="off"
            />
            <span v-if="errors.name" class="nb-err" data-testid="error-name">{{ errors.name }}</span>
          </div>

          <div class="nb-field">
            <label for="f-email">Email</label>
            <input
              id="f-email"
              v-model="form.email"
              data-testid="field-email"
              type="email"
              placeholder="jane@acme.co"
              autocomplete="off"
            />
            <span v-if="errors.email" class="nb-err" data-testid="error-email">{{ errors.email }}</span>
          </div>

          <div class="nb-field">
            <label for="f-company">Company</label>
            <input
              id="f-company"
              v-model="form.company"
              data-testid="field-company"
              type="text"
              placeholder="Acme Inc."
              autocomplete="off"
            />
            <span v-if="errors.company" class="nb-err" data-testid="error-company">{{ errors.company }}</span>
          </div>

          <div class="nb-row">
            <div class="nb-field">
              <label for="f-plan">Plan</label>
              <select id="f-plan" v-model="form.plan" data-testid="field-plan">
                <option v-for="p in PLANS" :key="p" :value="p">{{ p }}</option>
              </select>
            </div>
            <div class="nb-field">
              <label for="f-status">Status</label>
              <select id="f-status" v-model="form.status" data-testid="field-status">
                <option v-for="s in CUSTOMER_STATUSES" :key="s" :value="s">{{ s }}</option>
              </select>
            </div>
          </div>

          <div class="nb-row">
            <div class="nb-field">
              <label for="f-seats">Seats</label>
              <input
                id="f-seats"
                v-model.number="form.seats"
                data-testid="field-seats"
                type="number"
                min="0"
              />
              <span v-if="errors.seats" class="nb-err" data-testid="error-seats">{{ errors.seats }}</span>
            </div>
            <div class="nb-field">
              <label for="f-country">Country (ISO)</label>
              <input
                id="f-country"
                v-model="form.country"
                data-testid="field-country"
                type="text"
                maxlength="2"
                placeholder="US"
                autocomplete="off"
              />
            </div>
          </div>

          <footer class="nb-modal-foot">
            <button type="button" class="nb-btn nb-btn-ghost" @click="emit('close')">
              Cancel
            </button>
            <button type="submit" class="nb-btn nb-btn-primary" data-testid="modal-save">
              {{ isEdit ? 'Save changes' : 'Create customer' }}
            </button>
          </footer>
        </form>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.nb-overlay {
  position: fixed;
  inset: 0;
  z-index: 65;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(8, 8, 12, 0.66);
  backdrop-filter: blur(2px);
  overflow-y: auto;
}
.nb-modal {
  width: 100%;
  max-width: 480px;
  border-radius: 16px;
  background: #16161f;
  border: 1px solid #2c2c3a;
  box-shadow: 0 30px 70px -30px rgba(0, 0, 0, 0.9);
}
.nb-modal-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px;
  border-bottom: 1px solid #24242f;
}
.nb-modal-head h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #f5f5f7;
}
.nb-modal-x {
  background: none;
  border: none;
  color: #75758a;
  font-size: 1.4rem;
  line-height: 1;
  cursor: pointer;
}
.nb-modal-x:hover {
  color: #e8e8ee;
}
.nb-form {
  padding: 18px 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.nb-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}
.nb-field {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.nb-field label {
  font-size: 0.74rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: #8a8a9c;
}
.nb-field input,
.nb-field select {
  width: 100%;
  padding: 9px 11px;
  border-radius: 9px;
  border: 1px solid #2f2f3d;
  background: #0f0f16;
  color: #e8e8ee;
  font-size: 0.9rem;
  box-sizing: border-box;
}
.nb-field input:focus,
.nb-field select:focus {
  outline: none;
  border-color: #7e8aff;
  box-shadow: 0 0 0 3px rgba(126, 138, 255, 0.18);
}
.nb-err {
  font-size: 0.74rem;
  color: #ff5c7a;
}
.nb-modal-foot {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 4px;
}
.nb-fade-enter-active,
.nb-fade-leave-active {
  transition: opacity 0.18s ease;
}
.nb-fade-enter-from,
.nb-fade-leave-to {
  opacity: 0;
}
@media (max-width: 480px) {
  .nb-row {
    grid-template-columns: 1fr;
  }
}
</style>

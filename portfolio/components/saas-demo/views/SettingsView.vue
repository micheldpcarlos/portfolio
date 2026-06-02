<script setup>
import { reactive } from 'vue'
import { state, saveSettings, resetDemo } from '../store.js'

const form = reactive({ ...state.settings })

function save() {
  saveSettings({ ...form })
}
</script>

<template>
  <div class="nb-view" data-testid="view-settings">
    <header class="nb-view-head">
      <div>
        <h1>Settings</h1>
        <p class="nb-sub">Workspace preferences for this demo.</p>
      </div>
    </header>

    <form class="nb-panel nb-settings" data-testid="settings-form" @submit.prevent="save">
      <div class="nb-field">
        <label for="s-name">Workspace name</label>
        <input id="s-name" v-model="form.workspaceName" data-testid="setting-workspace" type="text" />
      </div>

      <div class="nb-field">
        <label for="s-email">Billing email</label>
        <input id="s-email" v-model="form.billingEmail" data-testid="setting-email" type="email" />
      </div>

      <label class="nb-switch" data-testid="setting-digest">
        <input v-model="form.weeklyDigest" type="checkbox" />
        <span class="nb-switch-track" aria-hidden="true"></span>
        <span class="nb-switch-label">Send me a weekly revenue digest</span>
      </label>

      <label class="nb-switch" data-testid="setting-seats">
        <input v-model="form.seatAlerts" type="checkbox" />
        <span class="nb-switch-track" aria-hidden="true"></span>
        <span class="nb-switch-label">Alert me when a customer hits their seat limit</span>
      </label>

      <div class="nb-settings-actions">
        <button type="submit" class="nb-btn nb-btn-primary" data-testid="settings-save">
          Save changes
        </button>
      </div>
    </form>

    <section class="nb-panel nb-danger-zone">
      <div>
        <h2>Reset demo data</h2>
        <p class="nb-sub">
          Restore all customers, invoices and settings to their original seed values.
        </p>
      </div>
      <button class="nb-btn nb-btn-danger" data-testid="reset-demo" @click="resetDemo">
        Reset demo
      </button>
    </section>
  </div>
</template>

<style scoped>
.nb-view {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 640px;
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
.nb-panel {
  padding: 20px;
  border-radius: 14px;
  background: #15151e;
  border: 1px solid #25252f;
}
.nb-settings {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.nb-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.nb-field label {
  font-size: 0.74rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: #8a8a9c;
}
.nb-field input {
  padding: 10px 12px;
  border-radius: 9px;
  border: 1px solid #2f2f3d;
  background: #0f0f16;
  color: #e8e8ee;
  font-size: 0.9rem;
}
.nb-field input:focus {
  outline: none;
  border-color: #7e8aff;
  box-shadow: 0 0 0 3px rgba(126, 138, 255, 0.18);
}
.nb-switch {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  font-size: 0.9rem;
  color: #d4d4de;
}
.nb-switch input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}
.nb-switch-track {
  position: relative;
  width: 42px;
  height: 24px;
  border-radius: 999px;
  background: #2c2c3a;
  transition: background 0.2s ease;
  flex: none;
}
.nb-switch-track::after {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  width: 18px;
  height: 18px;
  border-radius: 999px;
  background: #fff;
  transition: transform 0.2s ease;
}
.nb-switch input:checked + .nb-switch-track {
  background: #4b54c9;
}
.nb-switch input:checked + .nb-switch-track::after {
  transform: translateX(18px);
}
.nb-switch input:focus-visible + .nb-switch-track {
  box-shadow: 0 0 0 3px rgba(126, 138, 255, 0.4);
}
.nb-settings-actions {
  display: flex;
  justify-content: flex-end;
}
.nb-danger-zone {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border-color: rgba(255, 92, 122, 0.3);
}
.nb-danger-zone h2 {
  margin: 0;
  font-size: 1rem;
  color: #f5f5f7;
}
</style>

<script setup>
import { state } from './store.js'
import LoginView from './LoginView.vue'
import AppShell from './AppShell.vue'
import ToastHost from './ToastHost.vue'
</script>

<template>
  <div class="nb-app" data-testid="nimbus-app">
    <LoginView v-if="!state.authed" />
    <AppShell v-else />
    <ToastHost />
  </div>
</template>

<!-- Layout-scoped base. -->
<style scoped>
.nb-app {
  width: 100%;
  min-height: 100vh;
  background: #0d0d12;
  color: #e8e8ee;
  font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
}
</style>

<!-- Shared primitives (buttons, pills) used across every child component.
     Not scoped so they cascade into children, but every rule is prefixed with
     .nb-app so it cannot leak into the rest of the VitePress site. The button
     margin reset neutralises a stray global `button { margin }` from the
     production CSS bundle (same issue Selector City guards against). -->
<style>
.nb-app button {
  margin: 0;
  font-family: inherit;
}
.nb-app *,
.nb-app *::before,
.nb-app *::after {
  box-sizing: border-box;
}
.nb-app .nb-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 9px 16px;
  border-radius: 10px;
  border: 1px solid transparent;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.12s ease, background 0.18s ease, border-color 0.18s ease;
  white-space: nowrap;
}
.nb-app .nb-btn:active {
  transform: translateY(1px);
}
.nb-app .nb-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
.nb-app .nb-btn-primary {
  background: linear-gradient(180deg, #7e8aff, #5b64d9);
  color: #fff;
}
.nb-app .nb-btn-primary:hover:not(:disabled) {
  background: linear-gradient(180deg, #8d98ff, #6a72e6);
}
.nb-app .nb-btn-ghost {
  background: #1a1a24;
  border-color: #2c2c3a;
  color: #c4c4d2;
}
.nb-app .nb-btn-ghost:hover:not(:disabled) {
  background: #23232f;
  color: #fff;
}
.nb-app .nb-btn-danger {
  background: linear-gradient(180deg, #ff5c7a, #e0455f);
  color: #fff;
}
.nb-app .nb-btn-danger:hover:not(:disabled) {
  background: linear-gradient(180deg, #ff6e89, #ef536d);
}
.nb-app .nb-btn-block {
  width: 100%;
}
.nb-app .nb-btn:focus-visible {
  outline: 3px solid rgba(126, 138, 255, 0.5);
  outline-offset: 2px;
}
</style>

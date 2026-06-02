<script setup>
import { ref } from 'vue'
import { login } from './store.js'
import { DEMO_CREDENTIALS } from './mockData.js'

const email = ref(DEMO_CREDENTIALS.email)
const password = ref(DEMO_CREDENTIALS.password)
const loading = ref(false)

function submit() {
  // Fake auth: any input works. A short delay sells the "real SaaS" feel and
  // gives automation tools a loading state to wait on.
  loading.value = true
  setTimeout(() => {
    loading.value = false
    login(email.value)
  }, 450)
}
</script>

<template>
  <div class="nb-login" data-testid="login-view">
    <div class="nb-login-card">
      <div class="nb-brand">
        <span class="nb-logo" aria-hidden="true">◳</span>
        <span class="nb-brand-name">Nimbus</span>
      </div>
      <h1 class="nb-login-title">Sign in to your workspace</h1>
      <p class="nb-login-sub">Welcome back. Use the pre-filled demo credentials.</p>

      <form class="nb-login-form" @submit.prevent="submit">
        <div class="nb-field">
          <label for="l-email">Work email</label>
          <input id="l-email" v-model="email" data-testid="login-email" type="email" autocomplete="username" />
        </div>
        <div class="nb-field">
          <label for="l-pass">Password</label>
          <input
            id="l-pass"
            v-model="password"
            data-testid="login-password"
            type="password"
            autocomplete="current-password"
          />
        </div>
        <button type="submit" class="nb-btn nb-btn-primary nb-btn-block" data-testid="login-submit" :disabled="loading">
          {{ loading ? 'Signing in…' : 'Sign in' }}
        </button>
      </form>

      <p class="nb-login-foot">
        This is a fictional product for portfolio/testing purposes — no real
        account, no real data.
      </p>
    </div>
  </div>
</template>

<style scoped>
.nb-login {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background:
    radial-gradient(900px 480px at 80% -10%, #221634 0%, transparent 60%),
    radial-gradient(800px 460px at 0% 100%, #11202c 0%, transparent 55%),
    #0d0d12;
}
.nb-login-card {
  width: 100%;
  max-width: 400px;
  padding: 34px 30px;
  border-radius: 20px;
  background: #15151e;
  border: 1px solid #25252f;
  box-shadow: 0 40px 90px -40px rgba(0, 0, 0, 0.9);
}
.nb-brand {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-bottom: 22px;
}
.nb-logo {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 9px;
  background: linear-gradient(135deg, #7e8aff, #b14bff);
  color: #fff;
  font-size: 1.1rem;
}
.nb-brand-name {
  font-size: 1.2rem;
  font-weight: 800;
  color: #f5f5f7;
}
.nb-login-title {
  margin: 0 0 6px;
  font-size: 1.35rem;
  color: #f5f5f7;
}
.nb-login-sub {
  margin: 0 0 22px;
  font-size: 0.88rem;
  color: #8a8a9c;
}
.nb-login-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
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
  padding: 11px 13px;
  border-radius: 10px;
  border: 1px solid #2f2f3d;
  background: #0f0f16;
  color: #e8e8ee;
  font-size: 0.92rem;
}
.nb-field input:focus {
  outline: none;
  border-color: #7e8aff;
  box-shadow: 0 0 0 3px rgba(126, 138, 255, 0.18);
}
.nb-login-foot {
  margin: 20px 0 0;
  font-size: 0.74rem;
  line-height: 1.5;
  color: #5f5f70;
}
</style>

<script setup>
import { ref, computed } from 'vue'
import { state, go, logout, pastDueCount } from './store.js'
import DashboardView from './views/DashboardView.vue'
import CustomersView from './views/CustomersView.vue'
import InvoicesView from './views/InvoicesView.vue'
import SettingsView from './views/SettingsView.vue'

const nav = [
  { id: 'dashboard', label: 'Dashboard', icon: '◧' },
  { id: 'customers', label: 'Customers', icon: '☷' },
  { id: 'invoices', label: 'Invoices', icon: '▤' },
  { id: 'settings', label: 'Settings', icon: '⚙' },
]

const view = computed(() => {
  switch (state.view) {
    case 'customers':
      return CustomersView
    case 'invoices':
      return InvoicesView
    case 'settings':
      return SettingsView
    default:
      return DashboardView
  }
})

const sidebarOpen = ref(false)
const userMenuOpen = ref(false)
const title = computed(
  () => nav.find((n) => n.id === state.view)?.label ?? 'Dashboard',
)

function navTo(id) {
  go(id)
  sidebarOpen.value = false
}
</script>

<template>
  <div class="nb-shell" data-testid="app-shell" :class="{ 'nav-open': sidebarOpen }">
    <aside class="nb-sidebar" data-testid="sidebar">
      <div class="nb-brand">
        <span class="nb-logo" aria-hidden="true">◳</span>
        <span class="nb-brand-name">Nimbus</span>
      </div>

      <nav class="nb-nav" aria-label="Primary">
        <button
          v-for="n in nav"
          :key="n.id"
          class="nb-nav-item"
          :class="{ active: state.view === n.id }"
          :data-testid="`nav-${n.id}`"
          :aria-current="state.view === n.id ? 'page' : undefined"
          @click="navTo(n.id)"
        >
          <span class="nb-nav-icon" aria-hidden="true">{{ n.icon }}</span>
          {{ n.label }}
          <span
            v-if="n.id === 'invoices' && pastDueCount > 0"
            class="nb-badge"
            data-testid="nav-badge"
          >{{ pastDueCount }}</span>
        </button>
      </nav>

      <div class="nb-sidebar-foot">
        <div class="nb-plan-card">
          <p class="nb-plan-name">Scale plan</p>
          <p class="nb-plan-meta">14 days left in cycle</p>
          <div class="nb-plan-bar"><span :style="{ width: '62%' }"></span></div>
        </div>
      </div>
    </aside>

    <div
      class="nb-scrim"
      data-testid="scrim"
      @click="sidebarOpen = false"
    ></div>

    <div class="nb-main">
      <header class="nb-topbar" data-testid="topbar">
        <button
          class="nb-hamburger"
          aria-label="Toggle navigation"
          data-testid="menu-toggle"
          @click="sidebarOpen = !sidebarOpen"
        >
          ☰
        </button>
        <h2 class="nb-topbar-title">{{ title }}</h2>

        <div class="nb-topbar-right">
          <button class="nb-bell" aria-label="Notifications" data-testid="notifications">
            🔔
            <span v-if="pastDueCount > 0" class="nb-bell-dot" aria-hidden="true"></span>
          </button>

          <div class="nb-user">
            <button
              class="nb-user-btn"
              data-testid="user-menu"
              :aria-expanded="userMenuOpen"
              @click="userMenuOpen = !userMenuOpen"
            >
              <span class="nb-user-avatar" aria-hidden="true">{{ state.user.initials }}</span>
              <span class="nb-user-name">{{ state.user.name }}</span>
              <span class="nb-caret" aria-hidden="true">▾</span>
            </button>
            <div v-if="userMenuOpen" class="nb-user-pop" data-testid="user-popover">
              <p class="nb-user-email">{{ state.user.email }}</p>
              <button class="nb-pop-item" @click="go('settings'); userMenuOpen = false">
                Settings
              </button>
              <button class="nb-pop-item nb-pop-danger" data-testid="logout" @click="logout">
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main class="nb-content" data-testid="content">
        <component :is="view" />
      </main>
    </div>
  </div>
</template>

<style scoped>
.nb-shell {
  display: grid;
  grid-template-columns: 244px minmax(0, 1fr);
  min-height: 100vh;
}
.nb-sidebar {
  position: sticky;
  top: 0;
  align-self: start;
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 20px 14px;
  background: #101017;
  border-right: 1px solid #20202a;
}
.nb-brand {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 0 8px 18px;
}
.nb-logo {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 9px;
  background: linear-gradient(135deg, #7e8aff, #b14bff);
  color: #fff;
  font-size: 1.05rem;
}
.nb-brand-name {
  font-size: 1.15rem;
  font-weight: 800;
  color: #f5f5f7;
}
.nb-nav {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.nb-nav-item {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 10px 12px;
  border-radius: 10px;
  border: none;
  background: none;
  color: #9a9aac;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  text-align: left;
  width: 100%;
}
.nb-nav-item:hover {
  background: #1a1a24;
  color: #e8e8ee;
}
.nb-nav-item.active {
  background: #1d2042;
  color: #d9ddff;
}
.nb-nav-icon {
  font-size: 1rem;
  width: 18px;
  text-align: center;
}
.nb-badge {
  margin-left: auto;
  background: #ff5c7a;
  color: #fff;
  font-size: 0.68rem;
  font-weight: 700;
  padding: 1px 7px;
  border-radius: 999px;
}
.nb-sidebar-foot {
  margin-top: auto;
}
.nb-plan-card {
  padding: 13px;
  border-radius: 12px;
  background: linear-gradient(160deg, #1c1c2c, #15151e);
  border: 1px solid #28283a;
}
.nb-plan-name {
  margin: 0;
  font-size: 0.85rem;
  font-weight: 700;
  color: #e8e8ee;
}
.nb-plan-meta {
  margin: 3px 0 9px;
  font-size: 0.72rem;
  color: #75758a;
}
.nb-plan-bar {
  height: 6px;
  border-radius: 999px;
  background: #2a2a3a;
  overflow: hidden;
}
.nb-plan-bar span {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, #7e8aff, #b14bff);
}
.nb-scrim {
  display: none;
}
.nb-main {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.nb-topbar {
  position: sticky;
  top: 0;
  z-index: 30;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px 22px;
  background: rgba(13, 13, 18, 0.85);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid #20202a;
}
.nb-hamburger {
  display: none;
  background: none;
  border: none;
  color: #c4c4d2;
  font-size: 1.25rem;
  cursor: pointer;
}
.nb-topbar-title {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  color: #f5f5f7;
}
.nb-topbar-right {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 12px;
}
.nb-bell {
  position: relative;
  background: none;
  border: none;
  font-size: 1.05rem;
  cursor: pointer;
  padding: 4px;
}
.nb-bell-dot {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #ff5c7a;
  border: 2px solid #0d0d12;
}
.nb-user {
  position: relative;
}
.nb-user-btn {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 5px 9px 5px 5px;
  border-radius: 999px;
  border: 1px solid #25252f;
  background: #15151e;
  color: #e8e8ee;
  cursor: pointer;
  font-size: 0.85rem;
}
.nb-user-btn:hover {
  border-color: #34344a;
}
.nb-user-avatar {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 999px;
  background: linear-gradient(135deg, #00d184, #4b54c9);
  color: #fff;
  font-size: 0.72rem;
  font-weight: 700;
}
.nb-caret {
  color: #75758a;
  font-size: 0.7rem;
}
.nb-user-pop {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 190px;
  padding: 8px;
  border-radius: 12px;
  background: #1a1a24;
  border: 1px solid #2c2c3a;
  box-shadow: 0 24px 50px -24px rgba(0, 0, 0, 0.9);
  z-index: 40;
}
.nb-user-email {
  margin: 4px 8px 8px;
  font-size: 0.76rem;
  color: #75758a;
  border-bottom: 1px solid #25252f;
  padding-bottom: 8px;
}
.nb-pop-item {
  display: block;
  width: 100%;
  text-align: left;
  padding: 8px 10px;
  border-radius: 8px;
  border: none;
  background: none;
  color: #d4d4de;
  font-size: 0.85rem;
  cursor: pointer;
}
.nb-pop-item:hover {
  background: #24242f;
}
.nb-pop-danger {
  color: #ff7a92;
}
.nb-content {
  padding: 26px 22px 60px;
  max-width: 1180px;
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
}
.nb-user-name {
  white-space: nowrap;
}

@media (max-width: 880px) {
  .nb-shell {
    grid-template-columns: 1fr;
  }
  .nb-hamburger {
    display: block;
  }
  .nb-sidebar {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 50;
    width: 244px;
    transform: translateX(-100%);
    transition: transform 0.25s ease;
  }
  .nav-open .nb-sidebar {
    transform: translateX(0);
  }
  .nav-open .nb-scrim {
    display: block;
    position: fixed;
    inset: 0;
    z-index: 45;
    background: rgba(8, 8, 12, 0.6);
  }
  .nb-user-name {
    display: none;
  }
}
</style>

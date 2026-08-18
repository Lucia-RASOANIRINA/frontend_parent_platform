<template>
  <transition name="notif-fade">
    <div v-if="notifyState.show" class="notif-overlay" @click.self="onBackdrop">
      <div class="notif-box" :class="notifyState.type">
        <div class="notif-shine"></div>

        <div class="notif-inner">
          <div class="notif-icon">
            <!-- succès -->
            <svg v-if="notifyState.type === 'success'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <!-- erreur -->
            <svg v-else-if="notifyState.type === 'error'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <!-- visiteur -->
            <svg v-else-if="notifyState.type === 'visitor'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <!-- info -->
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <div class="notif-content">
            <h3 class="notif-title">{{ notifyState.title }}</h3>
            <p class="notif-text">{{ notifyState.text }}</p>
          </div>
        </div>

        <div class="notif-footer">
          <template v-if="notifyState.actions && notifyState.actions.length">
            <button
              v-for="a in notifyState.actions"
              :key="a.label"
              class="notif-btn"
              :class="{ ghost: !a.primary }"
              @click="runAction(a)">
              {{ a.label }}
            </button>
          </template>
          <button v-else class="notif-btn" @click="close">{{ t('entete.continuer') }}</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { t } from '../i18n'
import { useRouter } from 'vue-router'
import { notifyState, closeNotify } from '../services/notify'

const router = useRouter()

function close() { closeNotify() }
function onBackdrop() { if (notifyState.type !== 'visitor') closeNotify() }

function runAction(a) {
  closeNotify()
  if (a.onClick) a.onClick()
  if (a.to) router.push(a.to)
}
</script>

<style scoped>
.notif-overlay {
  position: fixed; inset: 0; z-index: 2000;
  background: rgba(62, 44, 31, 0.5); backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center; padding: 20px;
}

.notif-box {
  position: relative; overflow: hidden;
  width: 100%; max-width: 420px;
  background: rgba(210, 180, 140, 0.18);
  backdrop-filter: blur(20px);
  border-radius: 32px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-top: 4px solid rgba(210, 180, 140, 0.85);
  border-bottom: 4px solid rgba(210, 180, 140, 0.6);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  animation: slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.notif-box.error { background: rgba(239, 68, 68, 0.16); border-top-color: rgba(239, 68, 68, 0.85); border-bottom-color: rgba(239, 68, 68, 0.6); }

@keyframes slideUp { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

.notif-shine {
  position: absolute; top: 0; left: -100%; width: 100%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.18), transparent);
  animation: shine 3s infinite; pointer-events: none;
}
@keyframes shine { 0% { left: -100%; } 20%, 100% { left: 100%; } }

.notif-inner { display: flex; flex-direction: column; align-items: center; gap: 22px; padding: 38px 32px 18px; text-align: center; }
.notif-icon {
  width: 92px; height: 92px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  background: rgba(210, 180, 140, 0.3); backdrop-filter: blur(5px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.15);
  animation: pulse 2s infinite;
}
.notif-box.error .notif-icon { background: rgba(239, 68, 68, 0.3); }
.notif-icon svg { width: 46px; height: 46px; color: #fff; }
@keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }

.notif-title { font-weight: 800; font-size: 1.6rem; margin: 0 0 10px; color: #fff; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); }
.notif-text { font-size: 1rem; color: rgba(255, 255, 255, 0.95); line-height: 1.6; margin: 0; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.05); }

/* Boutons superposés (les uns au-dessus des autres) */
.notif-footer { display: flex; flex-direction: column; gap: 10px; padding: 8px 32px 34px; }
.notif-btn {
  width: 100%; padding: 14px 30px; border-radius: 60px; font-weight: 700; font-size: 0.95rem;
  border: none; cursor: pointer; transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.95); color: #6F4E37;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.12);
}
.notif-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 22px rgba(0, 0, 0, 0.18); }
.notif-btn.ghost { background: rgba(255, 255, 255, 0.22); color: #fff; border: 1px solid rgba(255, 255, 255, 0.55); box-shadow: none; }
.notif-box.error .notif-btn { color: #b91c1c; }

.notif-fade-enter-active, .notif-fade-leave-active { transition: opacity 0.3s ease; }
.notif-fade-enter-from, .notif-fade-leave-to { opacity: 0; }
</style>

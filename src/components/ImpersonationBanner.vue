<template>
  <transition name="banner-up">
    <div v-if="preview" class="impersonation-banner">
      <span class="dot"></span>
      <span class="txt">
        {{ t('entete.modeVisite') }} <strong>{{ roleLabel }}</strong>
      </span>
      <button class="back" @click="back">{{ t('entete.revenirAdmin') }}</button>
    </div>
  </transition>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { t } from '../i18n'
import { previewRole, stopViewing } from '../services/impersonate'

/**
 * La bannière lisait l'état une seule fois au montage. Après une déconnexion,
 * qui est une simple navigation interne, elle restait donc affichée alors qu'il
 * n'y avait plus de session. On relit l'état à chaque changement de page.
 */
const route = useRoute()

const role = computed(() => {
  route.fullPath // relecture à chaque navigation
  return previewRole()
})

const preview = computed(() => !!role.value)

const roleLabel = computed(() => ({
  PARENT: t('roles.parent'),
  EDUCATEUR: t('roles.educatrice'),
  PSY: t('roles.psychologue'),
}[role.value] || ''))

function back() { stopViewing() }
</script>

<style scoped>
.impersonation-banner {
  position: fixed; left: 50%; bottom: 18px; transform: translateX(-50%);
  z-index: 1500; display: flex; align-items: center; gap: 14px;
  background: linear-gradient(135deg, #6F4E37, #6F4E37); color: #fff;
  padding: 10px 12px 10px 18px; border-radius: 40px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25); font-size: .88rem;
  max-width: 94vw;
}
.dot { width: 9px; height: 9px; border-radius: 50%; background: #4ade80; box-shadow: 0 0 0 4px rgba(74,222,128,.3); flex-shrink: 0; }
.txt { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.back {
  flex-shrink: 0; border: none; cursor: pointer; background: #fff; color: #6F4E37;
  font-weight: 700; padding: 8px 16px; border-radius: 30px; transition: transform .2s;
}
.back:hover { transform: translateY(-1px); }
.banner-up-enter-active, .banner-up-leave-active { transition: all .35s; }
.banner-up-enter-from, .banner-up-leave-to { opacity: 0; transform: translate(-50%, 20px); }
</style>

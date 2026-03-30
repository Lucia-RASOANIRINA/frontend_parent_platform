<template>
  <div class="w-full flex items-center justify-center overflow-hidden relative font-sans ">
    
    <div class="relative z-8 w-full max-w-[420px] h-[500px] custom-border shadow-[0_25px_70px_-15px_rgba(62,44,31,0.15)] bg-white/90 backdrop-blur-lg rounded-[40px]">
      
      <div class="absolute inset-0 flex flex-col overflow-hidden rounded-[27px]">
        
        <div class="pt-7 pb-4 flex flex-col items-center flex-none">
          <div class="w-12 h-12 rounded-full bg-[#EFE9E4] flex items-center justify-center mb-4 border border-[#D2B48C]/30 shadow-inner">
            <svg class="w-6 h-6 text-[#3E2C1F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 0012 11c0-2.876-.733-5.55-2.019-7.882M12 11a13.917 13.917 0 01-2.019-7.882m0 0a6.002 6.002 0 0111.903 0M12 11c0 2.876.733 5.550 2.019 7.882m0 0a13.917 13.917 0 01-1.127 8.632m-5.196-8.632a13.917 13.917 0 00-1.127 8.632M13.2 4a13.917 13.917 0 002.819-2.019c.406-.34.988-.034 1.162.467a3.001 3.001 0 01-5.961 0c.174-.501.756-.807 1.162-.467A13.917 13.917 0 0013.2 4z" />
            </svg>
          </div>
          
          <div class="relative inline-flex p-1 bg-[#F9F7F5] rounded-full border border-[#EFE9E4]">
            <div class="absolute inset-1 w-[calc(50%-4px)] h-[calc(100%-8px)] bg-white rounded-full shadow-sm transition-transform duration-300 ease-out"
                 :class="isLoginMode ? 'translate-x-0' : 'translate-x-full'"></div>
            
            <button @click="isLoginMode = true" 
              :class="isLoginMode ? 'text-[#3E2C1F]' : 'text-[#3E2C1F]/40'"
              class="relative z-10 px-6 py-2 rounded-full text-[11px] font-bold tracking-widest uppercase transition-colors duration-300">
              Connexion
            </button>
            <button @click="isLoginMode = false" 
              :class="!isLoginMode ? 'text-[#3E2C1F]' : 'text-[#3E2C1F]/40'"
              class="relative z-10 px-6 py-2 rounded-full text-[11px] font-bold tracking-widest uppercase transition-colors duration-300">
              Inscription
            </button>
          </div>
        </div>

        <div class="flex-grow p-8 pt-2 relative">
          <Transition name="shatter" mode="out-in">
            
            <form v-if="isLoginMode" key="login" @submit.prevent="handleLogin" class="flex flex-col h-full gap-5">
              <div class="space-y-4">
                <div class="relative group">
                  <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#D2B48C] transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>
                  </span>
                  <input v-model="loginForm.email" type="email" placeholder="Adresse email"
                    class="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-gray-50 border border-[#EFE9E4] focus:border-[#D2B48C] focus:bg-white outline-none transition-all text-sm">
                </div>
                
                <div class="relative group">
                  <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#D2B48C] transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  </span>
                  <input v-model="loginForm.password" :type="showPassword ? 'text' : 'password'" placeholder="Mot de passe"
                    class="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-gray-50 border border-[#EFE9E4] focus:border-[#D2B48C] focus:bg-white outline-none transition-all text-sm">
                  <button type="button" @click="showPassword = !showPassword" class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#D2B48C] transition-colors">
                    <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                    <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  </button>
                </div>
              </div>

              <div class="mt-auto pt-6">
                <button type="submit" class="w-full py-4 rounded-full bg-[#D2B48C] text-white font-bold text-sm hover:bg-[#C1A37B] transition-all duration-300 shadow-lg shadow-[#D2B48C]/20 active:scale-[0.98]">
                  Se connecter
                </button>
              </div>
            </form>

            <form v-else key="register" @submit.prevent="handleRegister" class="flex flex-col h-full gap-3.5">
              <div class="relative group">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#D2B48C] transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </span>
                <input v-model="registerForm.name" type="text" placeholder="Nom complet"
                  class="w-full pl-12 pr-4 py-3 rounded-2xl bg-gray-50 border border-[#EFE9E4] focus:border-[#D2B48C] outline-none text-sm">
              </div>
              
              <div class="relative group">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#D2B48C] transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>
                </span>
                <input v-model="registerForm.email" type="email" placeholder="Email"
                  class="w-full pl-12 pr-4 py-3 rounded-2xl bg-gray-50 border border-[#EFE9E4] focus:border-[#D2B48C] outline-none text-sm">
              </div>
              
              <div class="flex flex-col gap-2">
                <div class="grid grid-cols-2 gap-2">
                  <input v-model="registerForm.password" :type="showPassword ? 'text' : 'password'" placeholder="Passe"
                    class="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-[#EFE9E4] focus:border-[#D2B48C] outline-none text-sm">
                  <input v-model="registerForm.confirmPassword" :type="showPassword ? 'text' : 'password'" placeholder="Confirm"
                    class="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-[#EFE9E4] focus:border-[#D2B48C] outline-none text-sm">
                </div>
                <button type="button" @click="showPassword = !showPassword" class="text-right text-[10px] text-gray-400 hover:text-[#D2B48C] uppercase tracking-wider pr-2">
                  {{ showPassword ? 'Masquer' : 'Afficher' }}
                </button>
              </div>

              <div class="relative group">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#D2B48C] transition-colors z-10">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </span>
                <select v-model="registerForm.role" class="w-full pl-12 pr-8 py-3 rounded-2xl bg-gray-50 border border-[#EFE9E4] focus:border-[#D2B48C] outline-none text-sm text-gray-500 appearance-none relative z-0">
                  <option value="parent">Parent</option>
                  <option value="educatrice">Éducatrice</option>
                  <option value="educatrice">Psycologue</option>
                </select>
                <span class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                </span>
              </div>
              
              <div class="mt-auto pt-4">
                <button type="submit" class="w-full py-4 rounded-full bg-[#D2B48C] text-white font-bold text-sm hover:bg-[#C1A37B] transition-all duration-300 shadow-lg shadow-[#D2B48C]/20 active:scale-[0.98]">
                  S'inscrire
                  <svg class="inline-block w-4 h-4 ml-1.5 -translate-y-px" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                </button>
              </div>
            </form>
          </Transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

const isLoginMode = ref(true)
const showPassword = ref(false)

const loginForm = reactive({ email: '', password: '' })
const registerForm = reactive({ 
  name: '', 
  email: '', 
  password: '', 
  confirmPassword: '', 
  role: 'parent' 
})

const handleLogin = () => console.log('Login', loginForm)
const handleRegister = () => console.log('Register', registerForm)
</script>

<style scoped>
/* Bordure bicolore personnalisée nette */
.custom-border {
  padding: 3px;
  background: linear-gradient(135deg, #D2B48C 0%, #D2B48C 50%, #3E2C1F 50%, #3E2C1F 100%);
}

/* --- ANIMATION FRACTURE POWERPOINT AMÉLIORÉE --- */
.shatter-leave-active {
  animation: shatter-exit 0.7s cubic-bezier(0.5, 0, 0.2, 1) forwards;
  pointer-events: none; /* Évite les clics pendant l'animation */
  position: absolute; /* Superpose les panneaux pendant la transition */
  width: calc(100% - 64px); /* Ajustement du padding parent */
}

.shatter-enter-active {
  animation: shatter-entry 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  animation-delay: 0.1s; /* La syntaxe correcte est ici */
}

@keyframes shatter-exit {
  0% {
    clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
    opacity: 1;
    transform: scale(1) rotate(0deg);
    filter: blur(0);
  }
  20% {
    /* Création de fissures initiales */
    clip-path: polygon(0% 15%, 45% 0%, 100% 10%, 90% 50%, 100% 85%, 50% 100%, 0% 90%, 10% 50%);
    transform: scale(1.02) rotate(0.5deg);
  }
  100% {
    /* Éclatement total en morceaux irréguliers */
    clip-path: polygon(
      10% 10%, 30% 0%, 60% 15%, 90% 5%, 
      100% 40%, 85% 60%, 100% 90%, 70% 100%, 
      40% 85%, 10% 100%, 0% 70%, 15% 40%
    );
    opacity: 0;
    transform: scale(0.8) translateY(40px) rotate(-5deg); /* Tombe et rétrécit */
    filter: blur(8px);
  }
}

@keyframes shatter-entry {
  0% {
    opacity: 0;
    transform: scale(1.1) translateY(-20px);
    filter: blur(4px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
    filter: blur(0);
  }
}

/* Design des inputs pour le mode personnalisé */
input::placeholder {
  color: #a3a3a3;
  transition: color 0.3s;
}

input:focus::placeholder {
  color: #d1d5db;
}

/* Supprime le contour par défaut de safari sur les select */
select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}
</style>
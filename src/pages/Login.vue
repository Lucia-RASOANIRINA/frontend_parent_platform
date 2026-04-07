<template>
  <div class="w-full flex items-center justify-center overflow-hidden relative font-sans">
    
    <!-- Message Box avec overlay qui bloque le formulaire -->
    <div v-if="messageBox.show" class="message-overlay">
      <div class="message-box-container">
        <div class="message-box" :class="messageBox.type" :style="getMessageBoxStyle()">
          <div class="message-box-shine"></div>
          
          <div class="message-box-corner top-left"></div>
          <div class="message-box-corner top-right"></div>
          <div class="message-box-corner bottom-left"></div>
          <div class="message-box-corner bottom-right"></div>
          
          <div class="message-box-inner">
            <div class="message-box-icon" :style="getMessageIconStyle()">
              <svg v-if="messageBox.type === 'success'" class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <svg v-else-if="messageBox.type === 'error'" class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <svg v-else-if="messageBox.type === 'info'" class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <svg v-else-if="messageBox.type === 'welcome-parent' || messageBox.type.toLowerCase().includes('parent')" class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <svg v-else-if="messageBox.type === 'welcome-educatrice' || messageBox.type === 'welcome-EDUCATEUR' || messageBox.type.toLowerCase().includes('educateur') || messageBox.type.toLowerCase().includes('educatrice')" class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14.5c-1.5 0-3-1-3-3s1.5-3 3-3 3 1 3 3-1.5 3-3 3zm0 0v4m-6-4h12M9 21h6" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v2m-4 2H6m12 0h-2" />
              </svg>
              <svg v-else-if="messageBox.type === 'welcome-psy' || messageBox.type.toLowerCase().includes('psy')" class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <svg v-else class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            <div class="message-box-content">
              <h3 class="message-box-title">{{ messageBox.title }}</h3>
              <p class="message-box-text">{{ messageBox.text }}</p>
            </div>
          </div>
          
          <div class="message-box-footer">
            <button @click="closeMessageBox" class="message-box-button" :style="getButtonStyle()">
              Continuer
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <div class="relative z-8 w-full max-w-[420px] custom-border shadow-[0_25px_70px_-15px_rgba(62,44,31,0.15)] bg-white/90 backdrop-blur-lg rounded-[40px] h-[500px]">
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
            
            <button @click="switchToLogin" 
              :class="isLoginMode ? 'text-[#3E2C1F]' : 'text-[#3E2C1F]/40'"
              class="relative z-10 px-6 py-2 rounded-full text-[11px] font-bold tracking-widest uppercase transition-colors duration-300">
              Connexion
            </button>
            <button @click="switchToRegister" 
              :class="!isLoginMode ? 'text-[#3E2C1F]' : 'text-[#3E2C1F]/40'"
              class="relative z-10 px-6 py-2 rounded-full text-[11px] font-bold tracking-widest uppercase transition-colors duration-300">
              Inscription
            </button>
          </div>
        </div>

        <div class="flex-grow p-8 pt-2 relative overflow-hidden">
          <Transition 
            name="shatter" 
            mode="out-in"
            @before-leave="onBeforeLeave"
            @after-enter="onAfterEnter">
            <form v-if="isLoginMode" key="login" @submit.prevent="handleLogin" class="flex flex-col h-full gap-5">
              <div class="space-y-4">
                <div class="relative group">
                  <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#D2B48C] transition-colors z-10">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>
                  </span>
                  <input 
                    v-model="loginForm.email" 
                    type="email" 
                    placeholder="Adresse email" 
                    :disabled="isLoading || messageBox.show"
                    @input="validateLoginEmailInput"
                    @blur="validateLoginEmailOnBlur"
                    @focus="clearLoginEmailError"
                    required
                    class="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-gray-50 border focus:outline-none transition-all text-sm"
                    :class="loginEmailError ? 'border-red-500/50 focus:border-red-500' : 'border-[#EFE9E4] focus:border-[#D2B48C]'">
                  <div v-if="loginEmailError" class="absolute right-4 top-1/2 -translate-y-1/2">
                    <div class="relative group/tooltip">
                      <svg class="w-5 h-5 text-red-400 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div class="absolute right-0 top-full mt-1 hidden group-hover/tooltip:block z-50">
                        <div class="bg-red-500/90 backdrop-blur-sm text-white text-xs rounded-lg py-1 px-2 whitespace-nowrap">
                          {{ loginEmailError }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="relative group">
                  <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#D2B48C] transition-colors z-10">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  </span>
                  <input 
                    v-model="loginForm.password" 
                    :type="showPassword ? 'text' : 'password'" 
                    placeholder="Mot de passe" 
                    :disabled="isLoading || messageBox.show"
                    @blur="validateLoginPasswordOnBlur"
                    @focus="clearLoginPasswordError"
                    required
                    class="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-gray-50 border focus:outline-none transition-all text-sm"
                    :class="loginPasswordError ? 'border-red-500/50 focus:border-red-500' : 'border-[#EFE9E4] focus:border-[#D2B48C]'">
                  <button type="button" @click="showPassword = !showPassword" class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#D2B48C] transition-colors">
                    <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                    <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  </button>
                  <div v-if="loginPasswordError" class="absolute right-12 top-1/2 -translate-y-1/2">
                    <div class="relative group/tooltip">
                      <svg class="w-5 h-5 text-red-400 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div class="absolute right-0 top-full mt-1 hidden group-hover/tooltip:block z-50">
                        <div class="bg-red-500/90 backdrop-blur-sm text-white text-xs rounded-lg py-1 px-2 whitespace-nowrap">
                          {{ loginPasswordError }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mt-auto pt-6">
                <button type="submit" :disabled="isLoading || messageBox.show" class="w-full py-4 rounded-full bg-[#D2B48C] text-white font-bold text-sm hover:bg-[#C1A37B] transition-all duration-300 shadow-lg shadow-[#D2B48C]/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
                  <span v-if="isLoading" class="flex items-center justify-center gap-2">
                    <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connexion...
                  </span>
                  <span v-else>Se connecter</span>
                </button>
              </div>
            </form>

            <form v-else key="register" @submit.prevent="handleRegister" class="flex flex-col h-full gap-3.5">
              <div class="relative group">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#D2B48C] transition-colors z-10">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </span>
                <input 
                  v-model="registerForm.nom" 
                  type="text" 
                  placeholder="Nom complet" 
                  :disabled="isLoading || messageBox.show"
                  @input="validateNameInput"
                  @blur="validateNameOnBlur"
                  @focus="clearNameError"
                  required
                  class="w-full pl-12 pr-12 py-3 rounded-2xl bg-gray-50 border focus:outline-none transition-all text-sm"
                  :class="nameError ? 'border-red-500/50 focus:border-red-500' : 'border-[#EFE9E4] focus:border-[#D2B48C]'">
                <div v-if="nameError" class="absolute right-4 top-1/2 -translate-y-1/2">
                  <div class="relative group/tooltip">
                    <svg class="w-5 h-5 text-red-400 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div class="absolute right-0 top-full mt-1 hidden group-hover/tooltip:block z-50">
                      <div class="bg-red-500/90 backdrop-blur-sm text-white text-xs rounded-lg py-1 px-2 whitespace-nowrap">
                        {{ nameError }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="relative group">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#D2B48C] transition-colors z-10">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>
                </span>
                <input 
                  v-model="registerForm.email" 
                  type="email" 
                  placeholder="Email" 
                  :disabled="isLoading || messageBox.show"
                  @input="validateEmailInput"
                  @blur="validateEmailOnBlur"
                  @focus="clearEmailError"
                  required
                  class="w-full pl-12 pr-12 py-3 rounded-2xl bg-gray-50 border focus:outline-none transition-all text-sm"
                  :class="emailError ? 'border-red-500/50 focus:border-red-500' : 'border-[#EFE9E4] focus:border-[#D2B48C]'">
                <div v-if="emailError" class="absolute right-4 top-1/2 -translate-y-1/2">
                  <div class="relative group/tooltip">
                    <svg class="w-5 h-5 text-red-400 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div class="absolute right-0 top-full mt-1 hidden group-hover/tooltip:block z-50">
                      <div class="bg-red-500/90 backdrop-blur-sm text-white text-xs rounded-lg py-1 px-2 whitespace-nowrap">
                        {{ emailError }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="flex flex-col gap-2">
                <div class="grid grid-cols-2 gap-2">
                  <div class="relative">
                    <input 
                      v-model="registerForm.password" 
                      :type="showPassword ? 'text' : 'password'" 
                      placeholder="Mot de passe" 
                      :disabled="isLoading || messageBox.show"
                      @blur="validatePasswordOnBlur"
                      @focus="clearPasswordError"
                      class="w-full px-4 py-3 rounded-2xl bg-gray-50 border focus:outline-none transition-all text-sm pr-8"
                      :class="passwordError ? 'border-red-500/50 focus:border-red-500' : 'border-[#EFE9E4] focus:border-[#D2B48C]'">
                    <div v-if="passwordError" class="absolute right-2 top-1/2 -translate-y-1/2">
                      <div class="relative group/tooltip">
                        <svg class="w-4 h-4 text-red-400 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div class="absolute right-0 top-full mt-1 hidden group-hover/tooltip:block z-50">
                          <div class="bg-red-500/90 backdrop-blur-sm text-white text-xs rounded-lg py-1 px-2 whitespace-nowrap">
                            {{ passwordError }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="relative">
                    <input 
                      v-model="registerForm.confirmPassword" 
                      :type="showPassword ? 'text' : 'password'" 
                      placeholder="Confirmer" 
                      :disabled="isLoading || messageBox.show"
                      @blur="validateConfirmPasswordOnBlur"
                      @focus="clearConfirmPasswordError"
                      class="w-full px-4 py-3 rounded-2xl bg-gray-50 border focus:outline-none transition-all text-sm pr-8"
                      :class="confirmPasswordError ? 'border-red-500/50 focus:border-red-500' : 'border-[#EFE9E4] focus:border-[#D2B48C]'">
                    <div v-if="confirmPasswordError" class="absolute right-2 top-1/2 -translate-y-1/2">
                      <div class="relative group/tooltip">
                        <svg class="w-4 h-4 text-red-400 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div class="absolute right-0 top-full mt-1 hidden group-hover/tooltip:block z-50">
                          <div class="bg-red-500/90 backdrop-blur-sm text-white text-xs rounded-lg py-1 px-2 whitespace-nowrap">
                            {{ confirmPasswordError }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <button type="button" @click="showPassword = !showPassword" class="text-right text-[10px] text-gray-400 hover:text-[#D2B48C] uppercase tracking-wider pr-2">
                  {{ showPassword ? 'Masquer' : 'Afficher' }}
                </button>
              </div>

              <div class="relative">
                <div class="flex gap-2 p-1 bg-[#EFE9E4]/30 rounded-2xl border border-[#D2B48C]/20">
                  <button
                    type="button"
                    @click="registerForm.role = 'PARENT'"
                    class="flex-1 py-2.5 rounded-xl transition-all duration-300 relative overflow-hidden group"
                    :class="registerForm.role === 'PARENT' ? 'bg-gradient-to-r from-[#A78B7A] to-[#8B7355] text-white shadow-lg' : 'text-white/70 hover:bg-white/10'">
                    <div class="flex items-center justify-center gap-2">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span class="text-xs font-semibold">Parent</span>
                    </div>
                  </button>
                  <button
                    type="button"
                    @click="registerForm.role = 'EDUCATEUR'"
                    class="flex-1 py-2.5 rounded-xl transition-all duration-300 relative overflow-hidden group"
                    :class="registerForm.role === 'EDUCATEUR' ? 'bg-gradient-to-r from-[#D2B48C] to-[#B8A070] text-white shadow-lg' : 'text-white/70 hover:bg-white/10'">
                    <div class="flex items-center justify-center gap-2">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14.5c-1.5 0-3-1-3-3s1.5-3 3-3 3 1 3 3-1.5 3-3 3zm0 0v4m-6-4h12M9 21h6" />
                      </svg>
                      <span class="text-xs font-semibold">Éducatrice</span>
                    </div>
                  </button>
                  <button
                    type="button"
                    @click="registerForm.role = 'PSY'"
                    class="flex-1 py-2.5 rounded-xl transition-all duration-300 relative overflow-hidden group"
                    :class="registerForm.role === 'PSY' ? 'bg-gradient-to-r from-[#8B7355] to-[#6B5335] text-white shadow-lg' : 'text-white/70 hover:bg-white/10'">
                    <div class="flex items-center justify-center gap-2">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span class="text-xs font-semibold">Psychologue</span>
                    </div>
                  </button>
                </div>
              </div>
              
              <div class="mt-auto pt-4">
                <button type="submit" :disabled="isLoading || messageBox.show" class="w-full py-4 rounded-full bg-[#D2B48C] text-white font-bold text-sm hover:bg-[#C1A37B] transition-all duration-300 shadow-lg shadow-[#D2B48C]/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
                  <span v-if="isLoading" class="flex items-center justify-center gap-2">
                    <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Inscription...
                  </span>
                  <span v-else>
                    S'inscrire
                  </span>
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
import { ref, reactive, onMounted } from 'vue'      // ✅ onMounted depuis 'vue'
import { useRoute } from 'vue-router'             // ✅ useRoute depuis 'vue-router'
import axios from 'axios'

// État du formulaire
const isLoginMode = ref(true)
const showPassword = ref(false)
const isLoading = ref(false)

// Récupération de la route pour lire les paramètres
const route = useRoute()

// États pour les erreurs de validation inscription
const nameError = ref('')
const emailError = ref('')
const passwordError = ref('')
const confirmPasswordError = ref('')

// États pour les erreurs de validation connexion
const loginEmailError = ref('')
const loginPasswordError = ref('')

// Message Box state
const messageBox = reactive({
  show: false,
  type: 'info',
  title: '',
  text: '',
  redirectUrl: null as string | null
})

const loginForm = reactive({ email: '', password: '' })
const registerForm = reactive({ 
  nom: '',
  email: '', 
  password: '', 
  confirmPassword: '', 
  role: 'EDUCATEUR'
})

// Constantes
const API_BASE_URL = 'http://localhost:8082/api'

// Variables pour stocker la dernière valeur valide
let lastValidName = ''
let lastValidEmail = ''

// Initialisation du mode (connexion ou inscription) via paramètre URL
const initMode = () => {
  const mode = route.query.mode
  if (mode === 'register') {
    isLoginMode.value = false   // Affiche l'onglet Inscription
  } else if (mode === 'login') {
    isLoginMode.value = true    // Affiche l'onglet Connexion
  }
}

// Appel au montage du composant
onMounted(() => {
  initMode()
})

// Validation connexion email
const validateLoginEmailInput = () => {
  const email = loginForm.email
  loginForm.email = email.toLowerCase()
}

const validateLoginEmailOnBlur = () => {
  const email = loginForm.email
  if (!email || email.trim() === '') {
    loginEmailError.value = 'L\'email est requis'
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      loginEmailError.value = 'Email invalide'
    } else {
      loginEmailError.value = ''
    }
  }
}

const clearLoginEmailError = () => {
  loginEmailError.value = ''
}

// Validation connexion mot de passe
const validateLoginPasswordOnBlur = () => {
  const password = loginForm.password
  if (!password) {
    loginPasswordError.value = 'Le mot de passe est requis'
  } else {
    loginPasswordError.value = ''
  }
}

const clearLoginPasswordError = () => {
  loginPasswordError.value = ''
}

// Fonction pour valider le nom en temps réel (bloque les caractères non autorisés)
const validateNameInput = () => {
  let name = registerForm.nom
  
  // Bloquer les chiffres
  if (/\d/.test(name)) {
    name = name.replace(/\d/g, '')
    registerForm.nom = name
  }
  
  // Bloquer les caractères spéciaux (sauf espaces, tirets, apostrophes)
  if (/[^a-zA-ZÀ-ÿ\s\-']/.test(name)) {
    name = name.replace(/[^a-zA-ZÀ-ÿ\s\-']/g, '')
    registerForm.nom = name
  }
  
  // Mettre à jour la dernière valeur valide
  if (name && !nameError.value) {
    lastValidName = name
  }
}

// Valider le nom quand le curseur quitte le champ
const validateNameOnBlur = () => {
  const name = registerForm.nom
  if (!name || name.trim() === '') {
    nameError.value = 'Le nom est requis'
  } else if (name.length < 2) {
    nameError.value = 'Le nom doit contenir au moins 2 caractères'
  } else {
    nameError.value = ''
    // Formater le nom
    registerForm.nom = name.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
    lastValidName = registerForm.nom
  }
}

// Effacer l'erreur quand le curseur revient
const clearNameError = () => {
  nameError.value = ''
  if (!registerForm.nom && lastValidName) {
    registerForm.nom = lastValidName
  }
}

// Valider l'email en temps réel
const validateEmailInput = () => {
  const email = registerForm.email
  registerForm.email = email.toLowerCase()
  
  if (email && !emailError.value) {
    lastValidEmail = email
  }
}

// Valider l'email quand le curseur quitte le champ
const validateEmailOnBlur = () => {
  const email = registerForm.email
  if (!email || email.trim() === '') {
    emailError.value = 'L\'email est requis'
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      emailError.value = 'Email invalide'
    } else {
      emailError.value = ''
      lastValidEmail = email
    }
  }
}

// Effacer l'erreur email quand le curseur revient
const clearEmailError = () => {
  emailError.value = ''
  if (!registerForm.email && lastValidEmail) {
    registerForm.email = lastValidEmail
  }
}

// Valider le mot de passe quand le curseur quitte le champ
const validatePasswordOnBlur = () => {
  const password = registerForm.password
  if (!password) {
    passwordError.value = 'Le mot de passe est requis'
  } else if (password.length < 6) {
    passwordError.value = '6 caractères minimum'
  } else {
    passwordError.value = ''
  }
}

// Effacer l'erreur mot de passe
const clearPasswordError = () => {
  passwordError.value = ''
}

// Valider la confirmation du mot de passe
const validateConfirmPasswordOnBlur = () => {
  const password = registerForm.password
  const confirmPassword = registerForm.confirmPassword
  
  if (!confirmPassword) {
    confirmPasswordError.value = 'Confirmation requise'
  } else if (password !== confirmPassword) {
    confirmPasswordError.value = 'Mots de passe différents'
  } else {
    confirmPasswordError.value = ''
  }
}

// Effacer l'erreur de confirmation
const clearConfirmPasswordError = () => {
  confirmPasswordError.value = ''
}

// Styles du message box transparents
const getMessageBoxStyle = () => {
  const type = messageBox.type
  
  if (type === 'success') {
    return { 
      background: 'rgba(210, 180, 140, 0.15)',
      backdropFilter: 'blur(20px)',
      borderTop: '4px solid rgba(210, 180, 140, 0.8)', 
      borderBottom: '4px solid rgba(210, 180, 140, 0.6)',
      boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.2)'
    }
  }
  if (type === 'error') {
    return { 
      background: 'rgba(239, 68, 68, 0.15)',
      backdropFilter: 'blur(20px)',
      borderTop: '4px solid rgba(239, 68, 68, 0.8)', 
      borderBottom: '4px solid rgba(239, 68, 68, 0.6)',
      boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.2)'
    }
  }
  return { 
    background: 'rgba(210, 180, 140, 0.15)',
    backdropFilter: 'blur(20px)',
    borderTop: '4px solid rgba(210, 180, 140, 0.8)', 
    borderBottom: '4px solid rgba(210, 180, 140, 0.6)',
    boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.2)'
  }
}

const getMessageIconStyle = () => {
  const type = messageBox.type
  if (type === 'error') {
    return { background: 'rgba(239, 68, 68, 0.3)', backdropFilter: 'blur(5px)' }
  }
  return { background: 'rgba(210, 180, 140, 0.3)', backdropFilter: 'blur(5px)' }
}

const getButtonStyle = () => {
  const type = messageBox.type
  if (type === 'error') {
    return { background: 'rgba(239, 68, 68, 0.9)', color: 'white' }
  }
  return { background: 'rgba(210, 180, 140, 0.9)', color: 'white' }
}

// Gestion du message box
const showMessageBox = (type: string, title: string, text: string, redirectUrl: string | null = null) => {
  Object.assign(messageBox, { type, title, text, redirectUrl, show: true })
}

const closeMessageBox = () => {
  messageBox.show = false
  if (messageBox.redirectUrl) {
    window.location.href = messageBox.redirectUrl
  }
  messageBox.redirectUrl = null
}

// Switchers avec animation
const switchToLogin = () => {
  if (!isLoginMode.value) {
    isLoginMode.value = true
  }
}

const switchToRegister = () => {
  if (isLoginMode.value) {
    isLoginMode.value = false
  }
}

// Hooks pour l'animation
const onBeforeLeave = (el: Element) => {
  const container = el.closest('.overflow-hidden')
  if (container) {
    container.classList.add('no-scroll')
  }
}

const onAfterEnter = (el: Element) => {
  const container = el.closest('.overflow-hidden')
  if (container) {
    container.classList.remove('no-scroll')
  }
}

// Messages par rôle avec gestion de la casse
const getRoleSpecificMessage = (role: string, userName: string) => {
  const roleUpper = role.toUpperCase()
  const messages = {
    PARENT: { title: 'Bienvenue dans la famille Parent', text: `Cher parent ${userName}, nous sommes ravis de vous accueillir. Ensemble, nous allons accompagner vos enfants vers la réussite.`, url: '/HomeParent' },
    EDUCATEUR: { title: 'Bienvenue dans l\'équipe éducative', text: `Chère éducatrice ${userName}, votre passion et votre dévouement font la différence. Merci de nous rejoindre !`, url: '/HomeTeacher' },
    PSY: { title: 'Bienvenue parmi nos experts', text: `Cher psychologue ${userName}, votre expertise est précieuse. Ensemble, aidons les enfants à s\'épanouir.`, url: '/HomePsy' }
  }
  return messages[roleUpper as keyof typeof messages] || messages.PARENT
}

// Validation des formulaires
const validateLogin = () => {
  let isValid = true
  
  if (!loginForm.email) {
    loginEmailError.value = 'L\'email est requis'
    isValid = false
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(loginForm.email)) {
      loginEmailError.value = 'Email invalide'
      isValid = false
    } else {
      loginEmailError.value = ''
    }
  }
  
  if (!loginForm.password) {
    loginPasswordError.value = 'Le mot de passe est requis'
    isValid = false
  } else {
    loginPasswordError.value = ''
  }
  
  return isValid
}

const validateRegister = () => {
  if (!registerForm.nom.trim()) {
    nameError.value = 'Le nom est requis'
    return false
  }
  if (nameError.value) return false
  
  if (!registerForm.email.trim()) {
    emailError.value = 'L\'email est requis'
    return false
  }
  if (emailError.value) return false
  
  if (!registerForm.password) {
    passwordError.value = 'Le mot de passe est requis'
    return false
  }
  if (passwordError.value) return false
  
  if (!registerForm.confirmPassword) {
    confirmPasswordError.value = 'Confirmation requise'
    return false
  }
  if (confirmPasswordError.value) return false
  
  return true
}

// Handlers
const handleLogin = async () => {
  if (!validateLogin()) return
  
  isLoading.value = true
  
  try {
    const { data } = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: loginForm.email,
      password: loginForm.password
    })
    
    if (data.token) localStorage.setItem('token', data.token)
    if (data.user) localStorage.setItem('user', JSON.stringify(data.user))
    
    const user = data.user
    const roleMessages = getRoleSpecificMessage(user.role, user.nom || user.email)
    const normalizedType = `welcome-${user.role.toLowerCase()}`
    showMessageBox(normalizedType, roleMessages.title, roleMessages.text, roleMessages.url)
    
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || 'Échec de la connexion'
    showMessageBox('error', 'Erreur de connexion', message)
  } finally {
    isLoading.value = false
  }
}

const handleRegister = async () => {
  if (!validateRegister()) return
  
  isLoading.value = true
  
  try {
    await axios.post(`${API_BASE_URL}/auth/register`, {
      nom: registerForm.nom,
      email: registerForm.email.toLowerCase(),
      password: registerForm.password,
      role: registerForm.role
    })
    
    const roleMessages = {
      PARENT: 'Votre compte parent a été créé avec succès !',
      EDUCATEUR: 'Votre compte éducatrice a été créé avec succès !',
      PSY: 'Votre compte psychologue a été créé avec succès !'
    }
    
    showMessageBox('success', 'Inscription réussie', roleMessages[registerForm.role as keyof typeof roleMessages])
    
    // Reset form
    Object.assign(registerForm, { nom: '', email: '', password: '', confirmPassword: '', role: 'EDUCATEUR' })
    
    setTimeout(() => {
      closeMessageBox()
      isLoginMode.value = true
      loginForm.email = registerForm.email
      showMessageBox('info', 'Connexion', 'Vous pouvez maintenant vous connecter')
    }, 2000)
    
  } catch (error: any) {
    const errorMsg = error.response?.data?.message || error.message
    const isEmailError = typeof errorMsg === 'string' && errorMsg.toLowerCase().includes('email')
    showMessageBox('error', isEmailError ? 'Email déjà utilisé' : 'Erreur', isEmailError ? 'Cet email est déjà enregistré' : errorMsg || 'Inscription échouée')
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* Animation pour le message box */
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}

/* Overlay qui bloque le formulaire */
.message-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.3s ease-out;
}

.message-box-container {
  width: 100%;
  max-width: 420px;
  margin: 20px;
}

/* Message Box transparent stylé */
.message-box {
  background: rgba(210, 180, 140, 0.15);
  backdrop-filter: blur(20px);
  border-radius: 32px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  animation: slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.message-box.success {
  background: rgba(210, 180, 140, 0.15);
}

.message-box.error {
  background: rgba(239, 68, 68, 0.15);
}

@keyframes slideUp {
  from { transform: translateY(50px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

/* Effet de brillance */
.message-box-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent);
  animation: shine 3s infinite;
  pointer-events: none;
}

@keyframes shine {
  0% { left: -100%; }
  20%, 100% { left: 100%; }
}

/* Coins décoratifs */
.message-box-corner {
  position: absolute;
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  pointer-events: none;
}

.message-box-corner.top-left { top: 12px; left: 12px; border-right: none; border-bottom: none; border-radius: 4px 0 0 0; }
.message-box-corner.top-right { top: 12px; right: 12px; border-left: none; border-bottom: none; border-radius: 0 4px 0 0; }
.message-box-corner.bottom-left { bottom: 12px; left: 12px; border-right: none; border-top: none; border-radius: 0 0 0 4px; }
.message-box-corner.bottom-right { bottom: 12px; right: 12px; border-left: none; border-top: none; border-radius: 0 0 4px 0; }

.message-box-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 40px 32px;
  position: relative;
  z-index: 1;
  text-align: center;
}

.message-box-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  transition: all 0.3s ease;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.15);
  animation: pulse 2s infinite;
  background: rgba(210, 180, 140, 0.3);
  backdrop-filter: blur(5px);
}

.message-box.error .message-box-icon {
  background: rgba(239, 68, 68, 0.3);
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.message-box-icon svg {
  width: 48px;
  height: 48px;
  color: white;
  stroke-width: 1.8;
}

.message-box-title {
  font-weight: 800;
  font-size: 1.75rem;
  margin-bottom: 12px;
  color: white;
  letter-spacing: -0.01em;
  line-height: 1.3;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.message-box-text {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.95);
  line-height: 1.6;
  margin: 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.message-box-footer {
  padding: 0 32px 40px 32px;
  display: flex;
  justify-content: center;
}

.message-box-button {
  padding: 14px 36px;
  border-radius: 60px;
  font-weight: 700;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 0.5px;
  background: rgba(210, 180, 140, 0.9);
  color: white;
}

.message-box.error .message-box-button {
  background: rgba(239, 68, 68, 0.9);
}

.message-box-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  background: rgba(210, 180, 140, 1);
}

.message-box.error .message-box-button:hover {
  background: rgba(239, 68, 68, 1);
}

.message-box-button:active { transform: translateY(0); }

/* Bordure bicolore personnalisée */
.custom-border {
  padding: 3px;
  background: linear-gradient(135deg, #D2B48C 0%, #D2B48C 50%, #3E2C1F 50%, #3E2C1F 100%);
  border-radius: 40px;
  position: relative;
  height: 500px;
}

/* Animation Shatter - Effet de fragmentation */
.shatter-enter-active,
.shatter-leave-active {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  transition: all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  overflow: hidden;
}

.shatter-enter-from {
  opacity: 0;
  transform: translateX(100%) rotate(10deg) scale(0.8);
  filter: blur(8px);
}

.shatter-enter-to {
  opacity: 1;
  transform: translateX(0) rotate(0) scale(1);
  filter: blur(0);
}

.shatter-leave-from {
  opacity: 1;
  transform: translateX(0) rotate(0) scale(1);
  filter: blur(0);
}

.shatter-leave-to {
  opacity: 0;
  transform: translateX(-100%) rotate(-10deg) scale(0.8);
  filter: blur(8px);
}

/* Suppression du scroll pendant la transition */
.no-scroll {
  overflow: hidden !important;
}

/* Conteneur des forms en position relative pour l'animation */
.flex-grow {
  position: relative;
  overflow: hidden;
}

/* Design des inputs */
input::placeholder { color: #a3a3a3; transition: color 0.3s; }
input:focus::placeholder { color: #d1d5db; }

.animate-spin { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
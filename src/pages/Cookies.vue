<template>
  <LegalLayout :title="t('legal.cookiesTitre')" :subtitle="t('legal.cookiesSousTitre')">
    <h2>{{ t('legal.cookieQuoi') }}</h2>
    <p>{{ t('legal.cookieQuoiTexte') }}</p>

    <h2>{{ t('legal.cookiesUtilises') }}</h2>
    <ul>
      <li><strong>{{ t('legal.essentiels') }}</strong> : {{ t('legal.essentielsTexte') }}</li>
      <li><strong>{{ t('legal.preferences') }}</strong> : {{ t('legal.preferencesTexte') }}</li>
    </ul>
    <p>{{ t('legal.pasDePub') }}</p>

    <h2>{{ t('legal.gererCookies') }}</h2>
    <p>{{ t('legal.gererCookiesTexte') }}</p>
  </LegalLayout>
</template>

<script setup>
import LegalLayout from '../components/LegalLayout.vue'
import { t } from '../i18n'
</script>

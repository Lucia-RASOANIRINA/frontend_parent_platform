<template>
  <LegalLayout :title="t('legal.confidentialiteTitre')" :subtitle="t('legal.confidentialiteSousTitre')">
    <h2>{{ t('legal.donnees') }}</h2>
    <p>{{ t('legal.donneesTexte') }}</p>

    <h2>{{ t('legal.utilisation') }}</h2>
    <ul>
      <li>{{ t('legal.utilisation1') }}</li>
      <li>{{ t('legal.utilisation2') }}</li>
      <li>{{ t('legal.utilisation3') }}</li>
    </ul>

    <h2>{{ t('legal.partage') }}</h2>
    <p>{{ t('legal.partageTexte') }}</p>

    <h2>{{ t('legal.droits') }}</h2>
    <p>{{ t('legal.droitsTexte') }} <a href="mailto:luciarasoanirina8@gmail.com">luciarasoanirina8@gmail.com</a>.</p>
  </LegalLayout>
</template>

<script setup>
import LegalLayout from '../components/LegalLayout.vue'
import { t } from '../i18n'
</script>

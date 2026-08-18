<template>
  <LegalLayout :title="t('legal.mentionsTitre')" :subtitle="t('legal.mentionsSousTitre')">
    <h2>{{ t('legal.editeur') }}</h2>
    <p>{{ t('legal.editeurTexte') }}</p>
    <p>{{ t('legal.contact') }} <a href="mailto:luciarasoanirina8@gmail.com">luciarasoanirina8@gmail.com</a></p>

    <h2>{{ t('legal.hebergement') }}</h2>
    <p>{{ t('legal.hebergementTexte') }}</p>

    <h2>{{ t('legal.propriete') }}</h2>
    <p>{{ t('legal.proprieteTexte') }}</p>

    <h2>{{ t('legal.responsabilite') }}</h2>
    <p>{{ t('legal.responsabiliteTexte') }}</p>
  </LegalLayout>
</template>

<script setup>
import LegalLayout from '../components/LegalLayout.vue'
import { t } from '../i18n'
</script>

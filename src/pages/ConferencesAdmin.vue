<template>
  <EventsBoard
    conferences-only
    show-all
    :title="`${t('nav.conferences')} — ${t('nav.administration')}`"
    :subtitle="t('evenements.sousTitreConferencesGestion')"
  />
</template>

<script setup>
import EventsBoard from '../components/EventsBoard.vue'
import { t } from '../i18n'
</script>

<template>
  <EventsBoard
    conferences-only
    :title="t('nav.conferences')"
    :subtitle="t('evenements.sousTitreConferences')"
  />
</template>

<script setup>
import EventsBoard from '../components/EventsBoard.vue'
import { t } from '../i18n'
</script>

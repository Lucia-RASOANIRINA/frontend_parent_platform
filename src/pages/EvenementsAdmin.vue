<template>
  <EventsBoard
    :show-all="true"
    :title="t('evenements.gestion')"
    :subtitle="t('evenements.sousTitreGestion')"
  />
</template>

<script setup>
import EventsBoard from '../components/EventsBoard.vue'
import { t } from '../i18n'
</script>

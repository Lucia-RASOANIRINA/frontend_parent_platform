<template>
  <EventsBoard
    :title="t('evenements.titre')"
    :subtitle="t('evenements.sousTitrePsy')"
  />
</template>

<script setup>
import EventsBoard from '../components/EventsBoard.vue'
import { t } from '../i18n'
</script>

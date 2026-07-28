<template>
  <iframe
    v-if="embedUrl"
    :src="embedUrl"
    class="media-content"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen
  ></iframe>
  <video v-else controls :src="url" class="media-content"></video>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({ url: { type: String, default: '' } })

// Convertit un lien YouTube / Vimeo en URL embarquable ; sinon lecture directe via <video>.
const embedUrl = computed(() => {
  const u = props.url || ''
  let m = u.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/)
  if (m) return `https://www.youtube.com/embed/${m[1]}`
  m = u.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  if (m) return `https://player.vimeo.com/video/${m[1]}`
  return ''
})
</script>

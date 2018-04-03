<template>
  <q-page-sticky
    position="bottom-right"
    :offset="[xPos, yPos]"
  >
    <q-btn
      v-back-to-top.animate="{offset: 100, duration: 200}"
      class="animate-pop"
      round
      color="secondary"
      icon="bt-back-to-top"
    />
  </q-page-sticky>
</template>

<script>
export default {
  name: 'afsc-back-to-top',
  props: {
    xPos: Number,
    yPos: Number
  }
}
</script>

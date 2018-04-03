<template>
  <div v-touch-pan.horizontal.noMouse="handler">
    <slot/>
  </div>
</template>

<script>
export default {
  name: 'afsc-touch-pan',
  props: {
    handler: Function
  }
}
</script>

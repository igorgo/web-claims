<template>
  <q-item v-close-overlay @click.native="handler">
    <slot/>
  </q-item>
</template>

<script>
export default {
  name: 'afsc-action-menu-item',
  props: {
    handler: Function
  }
}
</script>

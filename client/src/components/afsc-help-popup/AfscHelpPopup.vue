<template>
  <div class="inline q-mx-xs">
    <q-icon color="blue" name="bt-help">
      <q-tooltip anchor="bottom middle" self="top middle" :delay="300" :offset="[10, 10]">
        <slot/>
      </q-tooltip>
    </q-icon>
  </div>

</template>

<script>
export default {
  name: 'afsc-help-popup'
}
</script>

<style scoped>

</style>

<template>
  <q-page padding>
    <q-btn
      :label="$route.params.id"
      @click="goBack"
    />
  </q-page>
</template>

<script>
export default {
  // name: 'PageName',
  methods: {
    goBack () {
      this.$store.commit('filters/blockListUpdate', true)
      this.$store.commit('claims/blockListUpdate', true)
      this.$router.back()
    }
  }
}
</script>

<style>
</style>

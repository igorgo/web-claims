export default {
  mounted: function () {
    this.$store.commit('filters/blockListUpdate', true)
    this.$store.commit('claims/blockListUpdate', true)
    this.requestRecord()
  }
}

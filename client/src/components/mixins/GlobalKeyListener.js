export default {
  created () {
    this.$routines.mapEvents(this, true)
  },
  beforeDestroy () {
    this.$routines.mapEvents(this, false)
  }
}

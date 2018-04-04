export default {
  computed: {
    unitOptions () {
      return this.$store.getters['staticData/unitsForSelect']
    }
  }
}

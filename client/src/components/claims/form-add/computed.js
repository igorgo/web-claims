export default {
  computed: {
    unitOptions () {
      return this.$store.getters['staticData/unitsForSelect']
    },
    typeMap () {
      const tm = new Map()
      this.$routines.CLAIM_TYPE_OPTIONS.forEach(i => {
        tm.set(i.value, i.label)
      })
      return tm
    },
    appsByUnit () {
      return this.$store.getters['staticData/appsByUnitOptions']
    },
    funcByUnit () {
      return this.$store.getters['staticData/funcByUnitOptions']
    }
  }
}

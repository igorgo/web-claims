export default {
  computed: {
    isFirstRecord () { return this.$store.getters['claims/isFirstRecord'] },
    isLastRecord () { return this.$store.getters['claims/isLastRecord'] },
    record () { return this.$store.state.claims.claimRecord },
    files () { return this.$store.state.claims.claimFiles },
    history () { return this.$store.state.claims.claimHistory },
    actionsMask () { return this.$store.state.claims.actionsMask },
    availableActions () { return this.$store.getters['claims/availableActions'] },
    fullNo () { return this.record.claimPrefix + '-' + this.record.claimNumber },
    id () { return parseInt(this.$route.params.id) }
  }
}

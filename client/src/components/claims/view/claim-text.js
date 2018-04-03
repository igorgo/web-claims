export default {
  methods: {
    drawClaimText (h) {
      if (!this.record.id) return
      return h('div', {
        staticClass: 'claim-text claim-comment content-selectable q-caption'
      }, [this.record.content])
    }
  }
}

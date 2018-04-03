import {QPagination} from 'quasar'

export default {
  methods: {
    _getPagination (h) {
      return h('div', {
        staticClass: 'row text-center justify-center claim-pages-wrapper items-center'
      }, [
        h(
          QPagination,
          {
            props: {
              input: true,
              value: this.currentClaimPage,
              max: this.claimListPages,
              min: 1
            },
            on: { change: this.goToPage },
            staticClass: 'col-auto'
          }
        )
      ])
    },
    async goToPage (val) {
      await this.$store.dispatch('claims/setCurrentPage', val)
      this.scrollToActiveRecord()
    }
  }
}

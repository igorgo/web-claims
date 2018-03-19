import {QInnerLoading, QSpinnerHourglass} from 'quasar'

export default {
  computed: {
    progress () {
      return this.$store.getters.restInProgress
    }
  },
  render (h) {
    return h(QInnerLoading, {
      props: { visible: this.progress }
    }, [h(QSpinnerHourglass, { props: { size: '50px', color: 'primary' } })])
  }
}

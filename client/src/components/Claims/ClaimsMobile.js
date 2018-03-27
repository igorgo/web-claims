import ClaimsMobileOptions from './ClaimsMobileOptions'
import ClaimsMobileList from './ClaimsMobileList'
import ClaimsMobilePagination from './ClaimsMobilePagination'
import {GlobalKeyListener} from '..'
import {QScrollArea, QPageSticky, QBtn} from 'quasar'

export default {
  name: 'claims-mobile',
  data () {
    return {
      keysMap: {
        'ArrowDown': this._onKeyArrowDown,
        'ArrowUp': this._onKeyArrowUp,
        'Insert': this.addClaim,
        'Enter': () => { this.viewClaim(null) }
      }
    }
  },
  mixins: [ClaimsMobileOptions, ClaimsMobileList, ClaimsMobilePagination, GlobalKeyListener],
  computed: {
    activeRecordIndex () { return this.$store.state.claims.activeRecordIndex },
    currentClaimPage () { return this.$store.state.claims.currentClaimPage },
    claimListPages () { return this.$store.state.claims.claimListPages },
    claimList () { return this.$store.state.claims.claimList }
  },
  render (h) {
    return h(
      'div', [
        h(QScrollArea, {
          staticClass: 'claim-list-body q-px-md q-pt-md',
          ref: 'scroll-target'
        }, [
          this._drawOptions(h),
          this._getList(h)
        ]),
        this._getPagination(h),
        h(
          QPageSticky,
          {
            props: {
              position: 'bottom-right',
              offset: [18, 18]
            }
          },
          [
            h(
              QBtn,
              {
                props: {
                  round: true,
                  color: 'primary',
                  icon: 'bt-add'
                },
                on: { click: this.addClaim }
              }
            )
          ]
        )
      ]
    )
  },
  methods: {
    _onKeyArrowDown () {
      this.$store.commit('claims/shiftActiveRecordIndex', 1)
      this.scrollToActiveRecord()
    },
    _onKeyArrowUp () {
      this.$store.commit('claims/shiftActiveRecordIndex', -1)
      this.scrollToActiveRecord()
    },
    addClaim () {
      this.$router.push('/claim/new')
    },
    viewClaim () {
      this.$router.push('/claim/view/' + this.$store.getters['claims/activeClaimRecord'].id)
    }
  },
  created: function () {
    void this.$store.dispatch('filters/getFiltersList')
  },
  mounted: async function () {
    await this.$store.dispatch('claims/sendClaimsRequest')
    this.scrollToActiveRecord()
  }
}

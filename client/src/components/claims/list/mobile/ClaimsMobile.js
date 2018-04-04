import ClaimsMobileOptions from './ClaimsMobileOptions'
import ClaimsMobileList from './ClaimsMobileList'
import ClaimsMobilePagination from './ClaimsMobilePagination'
import {GlobalKeyListener, AfscBackToTop, AfscTouchPan} from '../../../index'
import {QScrollArea, QPageSticky, QBtn} from 'quasar'

export default {
  name: 'claims-mobile',
  data () {
    return {
      keysMap: {
        'ArrowDown': this._onKeyArrowDown,
        'ArrowUp': this._onKeyArrowUp,
        'Insert': this.addClaim,
        'Enter': () => { this.viewClaim(null) },
        'Ctrl+ArrowLeft': this.toPrevPage,
        'Ctrl+ArrowRight': this.toNextPage
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
      AfscTouchPan, {props: {handler: this.onPanning}}, [
        h(QScrollArea, {
          staticClass: 'claim-list-body q-px-md q-pt-md',
          ref: 'scroll-target'
        }, [
          this._drawOptions(h),
          this._getList(h),
          h(
            AfscBackToTop,
            {
              props: {
                xPos: 68,
                yPos: 18
              }
            }
          )
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
    },
    onPanning (obj) {
      if (obj.isFinal) {
        if (obj.direction === 'left') {
          this.toNextPage()
        } else {
          this.toPrevPage()
        }
      }
    },
    toNextPage () {
      if (this.currentClaimPage !== this.claimListPages) this.goToPage(this.currentClaimPage + 1)
    },
    toPrevPage () {
      if (this.currentClaimPage !== 1) this.goToPage(this.currentClaimPage - 1)
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

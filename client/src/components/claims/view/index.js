import {QWindowResizeObservable, QScrollArea} from 'quasar'
import ClaimNavigator from './claim-navigator'
import ClaimFieldsInfo from './claim-fields-info'
import ClaimRequisites from './claim-requisites'
import ClaimText from './claim-text'
import ClaimFiles from './claim-files'
import ClaimHistory from './claim-history'
import ClaimActions from './claim-actions'
import methods from './methods'
import computed from './computed'
import hooks from './hooks'
import {AfscBackToTop, AfscTouchPan} from '../..'
export default {
  name: 'claim-view',
  data () {
    return {
      isNavButtonLabeled: true,
      tStatuses: [
        {color: 'light', icon: ''}, //            0
        {color: 'orange', icon: 'time-wait'}, //  1
        {color: 'indigo', icon: 'processing'}, // 2
        {color: 'green', icon: 'round-done'}, //  3
        {color: 'red', icon: 'round-cancel'} //   4
      ]
    }
  },
  props: {
    id: Number
  },
  mixins: [
    methods,
    computed,
    hooks,
    ClaimNavigator,
    ClaimFieldsInfo,
    ClaimRequisites,
    ClaimText,
    ClaimFiles,
    ClaimHistory,
    ClaimActions
  ],
  render (h) {
    const children = []
    children.push(h(QWindowResizeObservable, {on: {resize: this.navResized}}))
    if (this.$store.state.claims.claimList.length > 0) children.push(this.drawNavigator(h))
    children.push(h(QScrollArea, {staticClass: 'claim-scroll-area'}, [
      this.drawFieldsInfo(h),
      this.drawRequisites(h),
      this.drawClaimText(h),
      this.drawFiles(h),
      this.drawHistory(h),
      this.drawActions(h),
      h(
        AfscBackToTop,
        {
          props: {
            xPos: 18,
            yPos: 18
          }
        }
      )
    ]))
    return h(AfscTouchPan, { props: {handler: this.onPanning}, staticClass: 'q-pa-md' }, children)
  }
}

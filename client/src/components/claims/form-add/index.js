import computed from './computed'
import methods from './methods'
import Render from './render'

export default {
  name: 'claim-form-add',
  data () {
    return {
      stepIcons: {
        doneIcon: 'bt-round-done',
        activeIcon: 'bt-current-location'
      },
      cSend: 0,
      currentStep: '0',
      cType: '',
      cUnit: '',
      cRelFrom: '',
      cBldFrom: '',
      cContent: '',
      cApp: [],
      cFunc: [],
      claimId: null,
      cAuthor: -1,
      cPriority: 5,
      cInit: null,
      cRelTo: ''
    }
  },
  render (h) {
    return this.drawStepper(h)
  },
  mixins: [
    computed,
    methods,
    ...Render
  ]
}

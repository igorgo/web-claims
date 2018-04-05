import computed from './computed'
import Render from './render'

export default {
  name: 'claim-form-add',
  data () {
    return {
      stepIcons: {
        doneIcon: 'bt-round-done',
        activeIcon: 'bt-current-location'
      },
      currentStep: '0',
      cType: 'ДОРАБОТКА',
      cUnit: '',
      cApp: [],
      cFunc: []
    }
  },
  render (h) {
    return this.drawStepper(h)
  },
  mixins: [
    computed,
    ...Render
  ]
}

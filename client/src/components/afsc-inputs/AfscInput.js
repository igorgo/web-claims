import {QInput} from 'quasar'
import InputMixin from './input-mixin'

export default {
  name: 'afsc-input',
  mixins: [InputMixin],
  props: {
    type: String
  },
  render (h) {
    return h(
      QInput,
      {
        props: Object.assign(this._getProps(), {
          type: this.type || 'text'
        }),
        on: Object.assign(this._getHandlers(), {})
      }
    )
  }
}

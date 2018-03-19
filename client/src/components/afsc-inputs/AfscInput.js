import {QInput} from 'quasar'
import InputMixin from './input-mixin'

export default {
  name: 'afsc-input',
  mixins: [InputMixin],
  render (h) {
    return h(
      QInput,
      {
        props: Object.assign(this._getProps(), {}),
        on: Object.assign(this._getHandlers(), {})
      }
    )
  }
}

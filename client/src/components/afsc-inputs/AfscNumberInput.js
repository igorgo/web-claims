import {QInput} from 'quasar'
import InputMixin from './input-mixin'

export default {
  name: 'afsc-number-input',
  mixins: [InputMixin],
  props: {
    min: Number,
    max: Number,
    decimals: {
      type: Number,
      default: 0
    },
    step: {
      type: Number,
      default: 1
    },
    notNumericKeyboardToggle: Boolean
  },
  computed: {
    valid () {
      return this._mandatored &&
        (this.min ? (this.value >= this.min) : true) &&
        (this.max ? (this.value <= this.max) : true)
    }
  },
  render (h) {
    return h(
      QInput,
      {
        props: Object.assign(this._getProps(), {
          type: 'number',
          'numeric-keyboard-toggle': !this.notNumericKeyboardToggle,
          decimals: this.decimals
        }),
        attrs: {
          min: this.min,
          max: this.max,
          step: this.step
        },
        on: Object.assign(this._getHandlers(), {
          input: (val) => {
            this.$emit('input', val)
          }
        })
      }
    )
  }
}

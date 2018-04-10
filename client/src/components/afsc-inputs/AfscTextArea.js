import {QInput} from 'quasar'
import InputMixin from './input-mixin'

export default {
  name: 'afsc-text-area',
  mixins: [InputMixin],
  props: {
    minRows: {
      type: Number,
      default: 5
    },
    noFixedFont: Boolean,
    maxLength: Number
  },
  render (h) {
    return h(
      QInput,
      {
        props: Object.assign(this._getProps(), {
          type: 'textarea',
          'stack-label': this.maxLength ? `${this.label} ${this.value.length}/${this.maxLength}` : this.label
        }),
        'class': {
          'fixed-ta-content': !this.noFixedFont
        },
        attrs: {
          rows: this.minRows,
          maxlength: this.maxLength || false
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

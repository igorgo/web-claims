import {QSelect} from 'quasar'
import InputMixin from './input-mixin'

export default {
  name: 'afsc-select',
  props: {
    options: Array,
    multiple: Boolean,
    value: [String, Number, Array]
  },
  mixins: [InputMixin],
  render (h) {
    return h(
      QSelect,
      {
        props: Object.assign(this._getProps(), {
          value: this._value,
          multiple: this.multiple,
          options: this.options
        }),
        on: Object.assign(this._getHandlers(), {
          input: (val) => {
            const newValue = this.multiple && (typeof val === 'string')
              ? val.join(';')
              : val
            this.$emit('input', newValue)
          }
        })
      }
    )
  },
  computed: {
    _value () {
      return this.multiple
        ? this.value && (typeof this.value === 'string')
          ? this.value.split(';')
          : Array.isArray(this.value) ? this.value : []
        : this.value
    }
  }
}

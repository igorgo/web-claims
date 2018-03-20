import {QSelect} from 'quasar'
import InputMixin from './input-mixin'

export default {
  name: 'afsc-select',
  props: {
    options: Array,
    multiple: Boolean
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
            const newValue = this.multiple
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
        ? this.value ? this.value.split(';') : []
        : this.value
    }
  }
}

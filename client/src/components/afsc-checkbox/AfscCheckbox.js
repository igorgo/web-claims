import {QCheckbox} from 'quasar'

export default {
  name: 'afsc-checkbox',
  props: {
    value: [String, Number, Boolean],
    valKind: {
      type: String,
      default: 'number',
      validator: value => ['number', 'boolean', 'char'].includes(value)
    },
    label: String,
    disable: Boolean
  },
  render (h) {
    return h(
      QCheckbox,
      {
        props: {
          value: this.value,
          'true-value': this.valKind === 'number'
            ? 1
            : this.valKind === 'char'
              ? 'Y'
              : true,
          'false-value': this.valKind === 'number'
            ? 0
            : this.valKind === 'char'
              ? 'N'
              : false,
          'toggle-indeterminate': false,
          label: this.label,
          color: this.color || 'primary',
          'keep-color': true,
          disable: this.disable
        },
        on: {
          input: (val) => {
            this.$emit('input', val)
          }
        }
      }
    )
  }
}

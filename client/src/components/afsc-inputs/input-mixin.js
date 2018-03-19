export default {
  props: {
    label: String,
    value: String,
    mandatory: Boolean,
    disable: Boolean
  },
  computed: {
    _color () {
      return (this.mandatory && !this.value)
        ? 'yellow-11'
        : 'primary-8'
    },
    valid () {
      return this.mandatory ? !!this.value : true
    }
  },
  methods: {
    _getProps () {
      return {
        'stack-label': this.label,
        color: this._color,
        'inverted-light': true,
        value: this.value,
        disable: this.disable
      }
    },
    _getHandlers () {
      return {
        input: (val) => {
          this.$emit('input', val)
        },
        change: (val) => {
          this.$emit('change', val)
        }
      }
    }
  }
}

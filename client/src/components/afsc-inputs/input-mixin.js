export default {
  props: {
    label: String,
    value: [String, Number],
    mandatory: Boolean,
    disable: Boolean,
    nonClearable: Boolean,
    autofocus: Boolean,
    after: Array,
    error: Boolean,
    warning: Boolean
  },
  computed: {
    _color () {
      return (this.mandatory && !this.value)
        ? 'mand-color'
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
        disable: this.disable,
        autofocus: this.autofocus,
        after: this.after,
        clearable: !this.nonClearable,
        error: this.error,
        warning: this.warning
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

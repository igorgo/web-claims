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
      return this.valid
        ? 'primary-8'
        : 'mand-color'
    },
    _hasValue () {
      let b
      if (typeof this.value === 'string') {
        b = !!this.value && this.value.trim().length > 0
      } else if (typeof this.value === 'number') {
        b = this.value !== null && !isNaN(this.value)
      } else if (Array.isArray(this.value)) {
        b = this.value.length > 0
      } else {
        b = !!this.value
      }
      return b
    },
    _mandatored () {
      return this.mandatory ? this._hasValue() : true
    },
    valid () {
      return this._mandatored
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

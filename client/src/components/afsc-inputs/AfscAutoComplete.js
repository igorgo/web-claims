import {QInput, QAutocomplete} from 'quasar'
import InputMixin from './input-mixin'

export default {
  name: 'afsc-auto-complete',
  mixins: [InputMixin],
  props: {
    staticData: Array,
    maxResults: Number,
    minCharacters: Number,
    filter: Function,
    multiple: Boolean
  },
  render (h) {
    return h(
      QInput,
      {
        props: Object.assign(this._getProps(), {}),
        on: Object.assign(this._getHandlers(), {})
      },
      [this._getAutoComplete(h)]
    )
  },
  methods: {
    _getAutoComplete (h) {
      return h(
        QAutocomplete,
        {
          props: {
            'static-data': { field: 'value', list: this.staticData },
            'max-results': this.maxResults || 1000,
            'min-characters': this.minCharacters || 2,
            filter: this.filter || this.multiple ? this.multipleFilter : undefined
          },
          on: {
            selected: this._selected
          }
        }
      )
    },
    _selected (item) {
      let val = item.value
      if (this.value) {
        const tokens = this.value.split(';')
        tokens[tokens.length - 1] = item.value
        val = tokens.join(';')
      }
      this.$emit('input', val)
    },
    multipleFilter (what, { field, list }) {
      const tokens = what.split(';')
      const needle = tokens[tokens.length - 1].toLowerCase()
      return needle ? list.filter(item => item[field].toLowerCase().indexOf(needle) > -1) : []
    }
  }
}

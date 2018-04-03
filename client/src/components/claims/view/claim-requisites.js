export default {
  methods: {
    _drawRequisite (h, rows, title, value) {
      if (value) {
        rows.push(h('tr', [
          h('td', {staticClass: 'text-right text-weight-medium text-primary', attrs: {valign: 'top'}}, [title + ':']),
          h('td', {attrs: {valign: 'top'}}, [value])
        ]))
      }
    },
    drawRequisites (h) {
      if (!this.record.id) return
      const rows = []
      this._drawRequisite(h, rows, 'Застосунок', this.record.app)
      this._drawRequisite(h, rows, 'Розділ', this.record.unit)
      this._drawRequisite(h, rows, 'Дія', this.record.action)
      return h('table', [rows])
    }
  }
}

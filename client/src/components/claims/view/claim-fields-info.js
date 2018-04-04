export default {
  methods: {
    _drawFieldsList (h, fields) {
      const rows = fields.map(
        f => h(
          'tr', {}, [
            h('td', {
              staticClass: 'claim-fields-td claim-fields-dt-lbl'
            }, [f.label]),
            h('td', {
              staticClass: 'claim-fields-td claim-fields-dt-val'
            }, [f.value])
          ]
        )
      )
      return h('div', {staticClass: 'q-pa-xs col-xl-4 col-sm-6 col-12'}, [
        h('table', {
          staticClass: 'claim-fields-table',
          attrs: {
            cellspacing: '1px'
          }
        }, rows)
      ])
    },
    drawFieldsInfo (h) {
      if (!this.record.id) return
      return h('div', {staticClass: 'q-py-sm row justify-around', ref: 'FieldsInfo'}, [
        this._drawFieldsList(h, [
          { label: 'Тип рекламації', value: this.record.claimType },
          { label: 'Рекламація №', value: this.record.claimPrefix + '-' + this.record.claimNumber },
          { label: 'Пріоритет', value: this.record.priority },
          { label: 'Стан', value: this.record.claimState }
        ]),
        this._drawFieldsList(h, [
          { label: 'Зареєстровано', value: this.$routines.formatDateTime(this.record.registeredAt) },
          { label: 'Стан змінено', value: this.$routines.formatDateTime(this.record.changedAt) },
          { label: 'Відпрацювати до', value: this.$routines.formatDateTime(this.record.execTill) },
          { label: 'Стан хелпу', value: this.$routines.HELP_STATUS[this.record.helpSign] }
        ]),
        this._drawFieldsList(h, [
          { label: 'Автор', value: this.record.registeredByAgent },
          { label: 'Виконавець', value: this.record.executor },
          { label: 'Реліз виявлення', value: this.record.buildFrom },
          { label: 'Реліз виконання', value: this.record.buildToComb }
        ])
      ])
    }
  }
}

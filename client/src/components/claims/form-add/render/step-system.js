import {AfscAutoComplete, AfscSelect} from '../../../index'
import {QStep} from 'quasar'

export default {
  computed: {
    _cTypeRelate () {
      if (!this.cType) return ''
      const type = this.typeMap.get(this.cType)
      const rem = type === 'ЗАУВАЖЕННЯ' ? 'е ' : 'а '
      return rem + type.toLowerCase()
    }
  },
  methods: {
    drawStepSystem (h) {
      return h(QStep, {
        props: {
          name: '030',
          default: true,
          title: 'Система',
          subtitle: this.currentStep > '030' ? `${this.cUnit} - ${this.cApp.join(';')}${this.cFunc.length ? ` - ${this.cFunc.join(';')}` : ''}` : '',
          ...this.stepIcons
        }
      }, [
        h('div', { staticClass: 'q-mb-sm ts-8 text-italic' }, [`Вкажіть, будь ласка, місце в системі, з яким пов'язан${this._cTypeRelate}`]),
        h('div', {staticClass: 'q-mb-xs'}, [
          h(AfscAutoComplete, {
            props: {
              label: 'Розділ',
              mandatory: true,
              multiple: true,
              value: this.cUnit,
              staticData: this.unitOptions
            },
            on: {
              input: val => {
                this.cUnit = val
                this.cApp = []
                this.cFunc = []
                this.$store.dispatch('staticData/getAppsByUnits', val)
              }
            }
          })
        ]),
        h('div', {staticClass: 'q-mb-xs'}, [
          h(AfscSelect, {
            props: {
              label: 'Застосунок',
              mandatory: true,
              disable: !this.cUnit || this.appsByUnit.length === 0,
              multiple: true,
              options: this.appsByUnit,
              value: this.cApp
            },
            on: {
              input: val => {
                this.cApp = val
              }
            }
          })
        ]),
        this.cUnit && this.cUnit.split(';').length === 1 && this.funcByUnit.length
          ? h('div', {staticClass: 'q-mb-xs'}, [
            h(AfscSelect, {
              props: {
                label: 'Дія в розділі',
                multiple: true,
                options: this.funcByUnit,
                value: this.cFunc
              },
              on: {
                input: val => {
                  this.cFunc = val
                }
              }
            })
          ])
          : null,
        this.drawNavigator(h, {valid: this.testMode || (this.cUnit && this.cApp.length)})
      ])
    }
  }
}

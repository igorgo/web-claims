import {AfscAutoComplete, AfscSelect} from '../../../index'
import {QStep} from 'quasar'

export default {
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
        }),
        h(AfscSelect, {
          props: {
            label: 'Застосунок',
            mandatory: true,
            disable: !this.cUnit || this.appsByUnit.length === 0,
            multiple: true,
            options: this.appsByUnit,
            value: this.cApp
          },
          on: {input: val => { this.cApp = val }}
        }),
        h(AfscSelect, {
          props: {
            label: 'Дія в розділі',
            disable: !this.cUnit || this.funcByUnit.length === 0,
            multiple: true,
            options: this.funcByUnit,
            value: this.cFunc
          },
          on: {input: val => { this.cFunc = val }}
        }),
        this.drawNavigator(h)
      ])
    }
  }
}

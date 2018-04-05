import {QStepper, QStep, QStepperNavigation, QOptionGroup, QBtn} from 'quasar'
import {AfscAutoComplete, AfscSelect} from '../..'
import computed from './computed'

export default {
  name: 'claim-form-add',
  data () {
    return {
      currentStep: '0',
      cType: 'ДОРАБОТКА',
      cUnit: '',
      cApp: [],
      cFunc: []
    }
  },
  render (h) {
    const icons = {
      doneIcon: 'bt-round-done',
      activeIcon: 'bt-current-location'
    }
    return h(QStepper, {
      props: {
        color: 'primary',
        vertical: true,
        value: this.currentStep
      },
      ref: 'stepper',
      on: {input: val => { this.currentStep = val }}
    }, [
      h(QStep, {
        props: {
          name: '0',
          default: true,
          title: 'Тип',
          subtitle: this.currentStep > '0' ? this.typeMap.get(this.cType) : '',
          ...icons
        }
      }, [
        h(QOptionGroup, {
          props: {
            type: 'radio',
            keepColor: true,
            inline: true,
            value: this.cType,
            options: this.$routines.CLAIM_TYPE_OPTIONS
          },
          on: {
            change: val => {
              this.cType = val
            }
          }
        }),
        h(QStepperNavigation, [
          h(QBtn, {
            props: {
              color: 'primary',
              label: 'Далі'
            },
            on: {click: () => { this.$refs.stepper.next() }}
          })
        ])
      ]),
      h(QStep, {
        props: {
          name: '1',
          default: true,
          title: 'Система',
          ...icons
        }
      }, [
        h(AfscAutoComplete, {
          props: {
            label: 'Розділ',
            mandatory: true,
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
        h(QStepperNavigation, [
          h(QBtn, {
            props: {
              color: 'primary',
              label: 'Далі'
            },
            on: {click: () => { this.$refs.stepper.previous() }}
          })
        ])
      ])
    ])
  },
  mixins: [computed]
}

import {QStep, QOptionGroup} from 'quasar'

export default {
  methods: {
    drawStepType (h) {
      return h(QStep, {
        props: {
          name: '010',
          default: true,
          title: 'Тип',
          subtitle: this.currentStep > '010' ? this.typeMap.get(this.cType) : '',
          ...this.stepIcons
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
        this.drawNavigator(h, true)
      ])
    }
  }
}

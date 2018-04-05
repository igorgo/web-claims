import {QStepper} from 'quasar'

export default {
  methods: {
    drawStepper (h) {
      return h(QStepper, {
        props: {
          color: 'primary',
          vertical: true,
          value: this.currentStep
        },
        ref: 'stepper',
        on: {input: val => { this.currentStep = val }}
      }, [
        this.drawStepType(h),
        this.drawStepSystem(h),
        this.drawStepReleaseFrom(h)
      ])
    }
  }
}

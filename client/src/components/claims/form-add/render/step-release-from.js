import {QStep} from 'quasar'

export default {
  methods: {
    drawStepReleaseFrom (h) {
      return h(QStep, {
        props: {
          name: '040',
          default: true,
          title: 'Реліз, що використовується',
          subtitle: this.currentStep > '040' ? `+` : '',
          ...this.stepIcons
        }
      }, [
        this.drawNavigator(h, false, this.doAddClaim)
      ])
    }
  }
}

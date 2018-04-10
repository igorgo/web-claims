import {QStepperNavigation, QBtn} from 'quasar'

export default {
  methods: {
    drawNavigator (h, {valid = false, first = false, last = false, lastLabel = '', lastHandler = undefined}) {
      return h(QStepperNavigation, [
        !first
          ? h(QBtn, {
            props: {
              color: 'primary',
              label: 'Назад'
            },
            on: {
              click: () => {
                this.$refs.stepper.previous()
              }
            }
          })
          : null,
        !last
          ? h(QBtn, {
            props: {
              color: 'primary',
              label: 'Далі',
              disable: !valid
            },
            on: {
              click: () => {
                this.$refs.stepper.next()
              }
            }
          })
          : null,
        last
          ? h(QBtn, {
            props: {
              color: 'primary',
              label: lastLabel || 'Закінчити',
              disable: !valid
            },
            on: {
              click: lastHandler
            }
          })
          : null
      ])
    }
  }
}

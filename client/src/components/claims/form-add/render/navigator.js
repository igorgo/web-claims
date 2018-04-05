import {QStepperNavigation, QBtn} from 'quasar'

export default {
  methods: {
    drawNavigator (h, first = false, last = {label: '', handler: undefined}) {
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
        !last.handler
          ? h(QBtn, {
            props: {
              color: 'primary',
              label: 'Далі'
            },
            on: {
              click: () => {
                this.$refs.stepper.next()
              }
            }
          })
          : null,
        last.handler
          ? h(QBtn, {
            props: {
              color: 'primary',
              label: last.label || 'Закінчити'
            },
            on: {
              click: last.handler
            }
          })
          : null
      ])
    }
  }
}

import {QBtn} from 'quasar'

export default {
  methods: {
    drawNavigator (h) {
      const buttonWrapperAttrs = {
        staticClass: 'row justify-around'
      }
      const buttonAttrProps = {
        small: true,
        color: 'primary'
      }
      const buttonStaticClass = 'claim-nav-title'
      return h(
        'div', {
          staticClass: 'row justify-around claim-nav-wrapper'
        }, [
          h('div', buttonWrapperAttrs, [
            h(QBtn, {
              props: {
                icon: 'bt-previous',
                disable: this.isFirstRecord,
                label: this.getButtonLabel('Попередня'),
                ...buttonAttrProps
              },
              staticClass: buttonStaticClass,
              on: { click: this.goToPrevRecord }
            })
          ]),
          h('div', buttonWrapperAttrs, [
            h(QBtn, {
              props: {
                icon: 'bt-eject',
                label: this.getButtonLabel('До списку'),
                ...buttonAttrProps
              },
              staticClass: buttonStaticClass,
              on: { click: this.backToList }
            })
          ]),
          h('div', buttonWrapperAttrs, [
            h(QBtn, {
              props: {
                [this.isNavButtonLabeled ? 'icon-right' : 'icon']: 'bt-next',
                disable: this.isLastRecord,
                label: this.getButtonLabel('Наступна'),
                ...buttonAttrProps
              },
              staticClass: buttonStaticClass,
              on: { click: this.goToNextRecord }
            })
          ])
        ])
    }
  }
}

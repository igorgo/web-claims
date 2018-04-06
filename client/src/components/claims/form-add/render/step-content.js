import {QStep, QOptionGroup} from 'quasar'
import {AfscHelpPopup} from '../../..'

export default {
  computed: {
    _cTypeReleaseHelp () {
      if (!this.cType) return ''
      const type = this.typeMap.get(this.cType)
      return type === 'ЗАУВАЖЕННЯ'
        ? 'Опишіть, будь ласка, в чому полядоопрацювання.'
        : type === 'ДОРОБКА'
          ? 'яку ви використовуєте.'
          : 'в якій виявлена помилка'
    }
  },
  methods: {
    drawStepContent (h) {
      return h(QStep, {
        props: {
          name: '050',
          default: true,
          title: 'Тип',
          ...this.stepIcons
        }
      }, [
        h('div', { staticClass: 'q-mb-sm' }, [
          h('div', {
            staticClass: 'inline'
          }, [
            `Оберіть будь ласка, тип рекламації.`
          ])
        ]),
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
        this.drawNavigator(h, {first: true, valid: !!this.cType})
      ])
    }
  }
}

import {QStep} from 'quasar'
import {AfscSelect, AfscCheckbox, AfscNumberInput} from '../../..'

export default {
  computed: {
    _cTypeReleaseHelp () {
      if (!this.cType) return ''
      const type = this.typeMap.get(this.cType)
      return type === 'ЗАУВАЖЕННЯ'
        ? 'в якій виявлена неточність.'
        : type === 'ДОРОБКА'
          ? 'яку ви використовуєте.'
          : 'в якій виявлена помилка'
    },
    releasesOptions () {
      return this.$store.getters['staticData/releasesForSelect']('A.1.3')
    },
    buildsOptions () {
      return this.$store.getters['staticData/buildsForSelect']('A.1.3', this.cRelFrom)
    }
  },
  methods: {
    drawStepPmo (h) {
      return h(QStep, {
        props: {
          name: '045',
          default: true,
          title: 'Тілько для ПМО!',
          ...this.stepIcons
        }
      }, [
        h('div', { staticClass: 'row q-mb-xs' }, [
          h('div', { staticClass: 'col-12 q-px-xs' }, [
            h(AfscSelect, {
              props: {
                label: 'Ініціатыр',
                options: this.$store.getters['staticData/initiatorSelect'],
                value: this.cAuthor
              },
              on: {
                input: val => {
                  this.cAuthor = val
                }
              }
            })
          ])
        ]),
        h('div', { staticClass: 'row q-mb-xs items-center' }, [
          h('div', { staticClass: 'col-12 col-sm-4 q-px-xs q-mb-xs' }, [
            h(AfscSelect, {
              props: {
                label: 'Реліз виконання',
                options: this.releasesOptions,
                value: this.cRelTo
              },
              on: {
                input: val => {
                  this.cRelTo = val
                }
              }
            })
          ]),
          h('div', { staticClass: 'col-12 col-sm-4 q-px-xs q-mb-xs' }, [
            h(AfscNumberInput, {
              props: {
                min: 1,
                max: 10,
                label: 'Пріоритет',
                mandatory: true,
                value: this.cPriority
              },
              ref: 'prior',
              on: {
                input: val => {
                  this.cPriority = val
                }
              }
            })
          ]),
          h('div', { staticClass: 'col-12 col-sm-4 q-px-xs q-mb-xs' }, [
            h(AfscCheckbox, {
              props: {
                label: 'На розгляд',
                value: this.cSend
              },
              on: {
                input: val => {
                  this.cSend = val
                }
              }
            })
          ])
        ]),
        this.drawNavigator(h, { valid: this.testMode || (this.cPriority >= 1 && this.cPriority <= 10) })
        // this.drawNavigator(h, {valid: true})
      ])
    }
  }
}

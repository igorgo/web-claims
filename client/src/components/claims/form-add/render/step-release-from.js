import {QStep} from 'quasar'
import {AfscSelect} from '../../..'

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
    drawStepReleaseFrom (h) {
      return h(QStep, {
        props: {
          name: '040',
          default: true,
          title: 'Реліз',
          subtitle: this.currentStep > '040' ? this.cBldFrom : '',
          ...this.stepIcons
        }
      }, [
        h('div', { staticClass: 'q-mb-sm ts-8 text-italic' }, [
          `Вкажіть, будь ласка, реліз та збірку системи, ${this._cTypeReleaseHelp}`
        ]),
        h('div', { staticClass: 'row' }, [
          h('div', {staticClass: 'col-12 col-sm-6 q-px-xs q-mb-xs'}, [
            h(AfscSelect, {
              props: {
                label: 'Реліз',
                mandatory: true,
                options: this.releasesOptions,
                value: this.cRelFrom
              },
              on: {
                input: val => {
                  this.cBldFrom = ''
                  this.cRelFrom = val
                }
              }
            })
          ]),
          h('div', {staticClass: 'col-12 col-sm-6 q-px-xs q-mb-xs'}, [
            h(AfscSelect, {
              props: {
                label: 'Збірка',
                mandatory: true,
                disable: !this.cRelFrom,
                options: this.buildsOptions,
                value: this.cBldFrom
              },
              on: {
                input: val => {
                  this.cBldFrom = val
                }
              }
            })
          ])
        ]),
        this.drawNavigator(h, {valid: this.testMode || (this.cBldFrom && this.cRelFrom)})
      ])
    }
  }
}

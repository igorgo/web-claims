import {QStep, QUploader} from 'quasar'
import {AfscTextArea} from '../../..'

export default {
  computed: {
    _cTypePrompt () {
      if (!this.cType) return ''
      const type = this.typeMap.get(this.cType)
      return type === 'ДОРОБКА'
        ? 'Опишіть, будь ласка, для чого потрібно, та в чому полягає суть доопрацювання.'
        : type === 'ЗАУВАЖЕННЯ'
          ? 'Опишіть, будь ласка, неточність, яку Ви помітили. Якщо вона проявляється тільки при певних умовах, опишіть ці умови.'
          : `Опишіть, будь ласка, помилку яку Ви помітили, та умови, при яких вона проявляється.</br>
          Приведіть повний тект помилки, та стек визову, які з'являються в окні з помилкою</br>
          Якщо помилка призводить до невірного результату, чи невірної поведінки програми, напишіть результат, який, на Вашу думку, буде вірним.`
    }
  },
  methods: {
    drawStepContent (h) {
      return h(QStep, {
        props: {
          name: '050',
          default: true,
          title: 'Зміст',
          ...this.stepIcons
        }
      }, [
        h('div', { staticClass: 'q-mb-md' }, [
          h('div', {
            staticClass: 'ts-8 text-italic q-mb-sm',
            domProps: {
              innerHTML: this._cTypePrompt
            }
          }),
          h(AfscTextArea, {
            props: {
              label: 'Зміст',
              value: this.cContent,
              maxLength: 4000,
              mandatory: true
            },
            on: {
              input: val => {
                this.cContent = val
              }
            }
          })
        ]),
        h('div', { staticClass: 'q-mb-md' }, [
          h('div', {
            staticClass: 'ts-8 text-italic q-mb-xs',
            domProps: {
              innerHTML: 'При необхідності, додате файли до рекламації.<br/>Використовуйте архіви або стислі формати файлів (jpg або png замість bmp; docx замість doc, тощо.)'
            }
          }),
          h(QUploader, {
            props: {
              url: '',
              'url-factory': async file => 'api/files/upload/' + this.claimId + '/' + this.$routines.b64encode(file.name),
              // 'url-factory': async file => 'api/files/upload/' + (file.name),
              'hide-upload-button': true,
              'hide-upload-progress': true,
              multiple: true,
              'additional-fields': [
                {
                  name: 'sessionID',
                  value: this.$store.state.auth.sessionID
                }
              ],
              'auto-expand': true
            },
            ref: 'files',
            on: {
              finish: () => { this.$root.$emit('claim:add:files:upladed') }
            }
          })
        ]),
        this.drawNavigator(h, {
          valid: !!this.cContent,
          last: true,
          lastLabel: 'Відправити рекламацію',
          lastHandler: this.doAddClaim
        })
      ])
    }
  }
}

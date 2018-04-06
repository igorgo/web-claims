import {QStep, QOptionGroup} from 'quasar'
import {AfscHelpPopup} from '../../..'

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
        h('div', { staticClass: 'q-mb-sm' }, [
          h('div', {
            staticClass: 'inline'
          }, [
            `Оберіть будь ласка, тип рекламації.`
          ]),
          h(AfscHelpPopup, [
            h('div', {
              style: {fontSize: '0.8em'},
              domProps: {
                innerHTML: `
<ul class="ul-20">
  <li><strong>ДОРОБКА</strong> - необхідна розробка нового або доопрацювання існуючого функціоналу чи інтерфейсу.</li>
  <li><strong>ЗАУВАЖЕННЯ</strong> - некритичні помилки, наприклад, синтаксичні помилки інтерфейсу.</li>
  <li><strong>ПОМИЛКА</strong>
    <ul>
       <li>помилки системи, що призводять до виникнення вийняткових ситуацій;</li>
       <li>логічні помилки функціоналу, що призводять до формування невірних облікових даних;</li>
       <li>невідповідність функціоналу документації або контекстної довідці.</li>
    </ul>   
  </li>
</ul>
          `
              }
            })
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

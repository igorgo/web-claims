import {QPageSticky, QBtnDropdown, QList, QItemSide, QItemMain} from 'quasar'
import {AfscActionMenuItem} from '../..'
export default {
  methods: {
    drawActions (h) {
      return !this.actionsMask ? null : h(
        QPageSticky, {
          props: { position: 'top-right', offset: [5, -42] },
          staticClass: 'z-top'
        }, [
          h(QBtnDropdown, {
            props: { flat: true, rounded: true, icon: 'bt-menu', color: 'white' }
          }, [
            h(QList, { props: { link: true } }, [
              this.availableActions.map(item => h(
                AfscActionMenuItem, {props: {handler: () => { this.doAction(item.code) }}}, [
                  h(QItemSide, {props: {icon: item.icon}}),
                  h(QItemMain, {props: {label: item.label}})
                ]
              ))
            ])
          ])
        ]
      )
    }
  }
}

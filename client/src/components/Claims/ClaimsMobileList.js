import {QList, QItem, QCard, QCardMain, scroll} from 'quasar'

export default {
  computed: {
    scrollTarget () { return scroll.getScrollTarget(this.$refs['claims-filter-option'].$el) }
  },
  methods: {
    _getRows (h) {
      const rows = []
      this.$store.state.claims.claimList.forEach((claim, idx) => {
        const item = h(
          QItem,
          {
            props: {
              multiline: true
            },
            staticClass: `no-padding cursor-pointer`,
            'class': {
              'claim-list-active': idx === this.activeRecordIndex,
              'af-selectable': this.$q.platform.has.touch
            },
            nativeOn: {
              click: () => {
                this.onClaimClick(idx)
              }
            }
          },
          [
            h(
              QCard,
              {
                staticClass: `claim-list-card text-black claim-list-card-t${claim.claimType}`,
                props: { color: 'grey-1' }
              },
              [
                h(
                  QCardMain,
                  {
                    staticClass: 'q-pa-md'
                  },
                  [
                    claim.unit
                      ? claim.unit.replace(/;/g, ', ')
                      : 'Рекламація'
                  ]
                )
              ]
            )
          ]
        )
        rows.push(item)
      })
      return rows
    },
    _getList (h) {
      return h(QList, { props: { noBorder: true }, ref: 'list' }, this._getRows(h))
    },
    onClaimClick (idx) {
      // todo: onClaimClick
      this.$store.commit('claims/setActiveRecordIndex', idx)
      this.viewClaim()
    },
    scrollToActiveRecord () {
      if (this.scrollTarget) {
        if (this.activeRecordIndex) {
          // console.log(this.$refs['list'].$children[this.activeRecordIndex].$el.offsetTop)
          const activeCard = this.$refs['list'].$children[this.activeRecordIndex].$el
          let offset = activeCard ? activeCard.offsetTop : 0
          offset -= Math.floor(this.$refs['scroll-target'].$el.clientHeight / 2)
          offset += Math.floor(activeCard.clientHeight / 2)
          scroll.setScrollPosition(this.scrollTarget, offset)
        } else {
          scroll.setScrollPosition(this.scrollTarget, 0)
        }
      }
    }
  }
}

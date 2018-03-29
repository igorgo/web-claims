import {QList, QItem, QCard, QCardMain, scroll} from 'quasar'

export default {
  computed: {
    scrollTarget () {
      return scroll.getScrollTarget(this.$refs['claims-filter-option'].$el)
    }
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
            this._getRow(h, claim)
          ]
        )
        rows.push(item)
      })
      return rows
    },
    _getRow (h, claim) {
      return h(
        QCard,
        {
          staticClass: `claim-list-card text-black claim-list-card-t${claim.claimType}`,
          props: { color: 'grey-1' }
        },
        [
          h(
            QCardMain,
            {
              staticClass: 'q-pa-none'
            },
            [
              h(
                'div', {
                  staticClass: 'row justify-start'
                }, [
                  h('div', {
                    staticClass: 'col-sm-11 col-9'
                  }, [
                    claim.unit
                      ? claim.unit.replace(/;/g, ', ')
                      : 'Рекламація'
                  ]),
                  h('div', {
                    staticClass: 'col-sm-1 col-3'
                  }, [
                    h('div', { staticClass: 'float-right claim-row-priority-corner' }),
                    h('div', {staticClass: 'claim-row-priority text-white'}, [claim.priority])
                  ])
                ])
            ])
        ])
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

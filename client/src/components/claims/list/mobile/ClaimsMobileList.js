import {QList, QItem, QCard, QCardMain, QIcon, scroll, Platform} from 'quasar'

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
          props: {color: 'grey-1'}
        },
        [
          h('div', {staticClass: `float-right claim-row-priority-corner claim-row-priority-${claim.priority}`}),
          claim.hasDocs
            ? h(QIcon, {staticClass: 'claim-list-attach', props: {name: 'bt-attach'}})
            : null,
          h(
            QCardMain,
            {
              staticClass: 'q-pa-none claim-row-content'
            },
            [
              h(
                'div', {
                  staticClass: 'row justify-start'
                }, [
                  h('div', {
                    staticClass: 'col-sm-11 col-9 q-px-xs q-subheading'
                  }, [
                    h('span', {}, ['№']),
                    h('span', {staticClass: 'text-weight-bold q-pr-sm'}, [claim.numb]),
                    h('span', {}, [claim.unit ? claim.unit.replace(/;/g, ', ') : 'Рекламація'])
                  ]),
                  Platform.is.desktop
                    ? h('div', {staticClass: 'q-ma-sm'}, [
                      h('p', {staticClass: 'first-three-line'}, [claim.description])
                    ])
                    : null,
                  h('div', {
                    staticClass: 'col-sm-1 col-3'
                  }, [
                    h('div', {staticClass: 'claim-row-priority text-white q-caption'}, [claim.priority])
                  ])
                ]),
              h(
                'div', {
                  staticClass: 'row justify-start q-mr-lg'
                }, [
                  h('div', {staticClass: 'col row q-px-xs q-pb-xs items-center'}, [
                    h('small', {staticClass: 'col-sm-6 col-12 q-mt-xs text-grey'}, [
                      this.$routines.formatDate(claim.regDate),
                      h('cite', {staticClass: 'q-pl-xs'}, [claim.author])
                    ]),
                    h('small', {staticClass: 'col-sm-6 col-12 row q-mt-xs items-center'}, [
                      h('div', {staticClass: `col-auto q-pa-xs claim-row-status items-center row claim-row-tstatus-${claim.typicalStatus}`}, [
                        h(QIcon, {props: {name: `bt-${['', 'time-wait', 'processing', 'round-done', 'round-cancel'][claim.typicalStatus]}`}}),
                        h('span', {staticClass: 'q-pl-xs'}, [claim.status])
                      ]),
                      h('span', {staticClass: 'q-pl-xs'}, [claim.executor])
                    ])
                  ])
                ])
            ])
        ])
    },
    _getList (h) {
      return h(QList, {props: {noBorder: true}, ref: 'list'}, this._getRows(h))
    },
    onClaimClick (idx) {
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

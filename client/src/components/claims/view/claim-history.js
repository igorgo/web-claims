import {QIcon, QBtn} from 'quasar'
import {AfscTextArea} from '../..'

export default {
  methods: {
    drawHistory (h) {
      return !this.history.length ? null : h(
        'ul',
        { staticClass: 'claim-hist q-px-sm' },
        this.history.map((i, idx) => h(
          'li',
          { staticClass: `claim-hist-entry claim-hist-entry-with-icon claim-hist-entry-${idx % 2 === 0 ? 'right' : 'right'}` },
          [
            h('div', { staticClass: 'claim-hist-subtitle' }, [
              h('span', this.$routines.formatDateTime(i.date))
            ]),

            h('div', {
              staticClass: `claim-hist-dot claim-hist-dot text-${this.tStatuses[i.statusType].color}`
            }, [
              i.statusType ? h(QIcon, { props: { name: 'bt-' + this.tStatuses[i.statusType].icon } }) : null
            ]),

            h('div', { staticClass: 'claim-hist-content' }, [
              h('div', { staticClass: 'q-subheading claim-hist-title' }, [
                i.newStatus
                  ? h('span', { staticClass: `q-px-xs q-mr-sm claim-hist-status bg-${this.tStatuses[i.statusType].color} text-white` }, [i.newStatus])
                  : null,

                i.newExecutor
                  ? h('span', { staticClass: 'claim-hist-status' }, [i.newExecutor])
                  : null
              ]),

              i.comment
                ? this.editedNoteId === i.noteId
                  ? h('div', {}, [
                    h(AfscTextArea, {
                      props: {
                        label: 'Коментар',
                        value: this.editedNoteText,
                        maxLength: 4000,
                        mandatory: true
                      },
                      on: {input: (val) => { this.editedNoteText = val }}
                    }),
                    h('div', {staticClass: 'q-mt-sm'}, [
                      h(QBtn, {
                        staticClass: 'q-mr-xs',
                        style: {
                          'min-width': '120px'
                        },
                        props: {
                          label: 'OK',
                          color: 'primary',
                          outline: true,
                          dense: true
                        },
                        on: {
                          click: this.doEditComment
                        }
                      }),
                      h(QBtn, {
                        style: {
                          'min-width': '120px'
                        },
                        props: {
                          label: 'Скасування',
                          color: 'primary',
                          outline: true,
                          dense: true
                        },
                        on: {
                          click: () => {
                            this.editedNoteText = ''
                            this.editedNoteId = null
                            this.editedNoteHistIdx = null
                          }
                        }
                      })
                    ])
                  ])
                  : h('div', { staticClass: `claim-comment content-selectable` }, [
                    i.noteId
                      ? h(QIcon, {
                        props: { name: 'bt-edit', size: '16px' },
                        staticClass: 'float-right cursor-pointer',
                        nativeOn: {
                          click: () => {
                            this.editComment(i.noteId, i.comment, idx)
                          }
                        }
                      })
                      : null,
                    h('div', { staticClass: 'q-pb-sm' }, [i.comment]),
                    h('cite', { staticClass: 'claim-author' }, [i.who])
                  ])
                : null,

              !i.comment
                ? h('cite', { staticClass: 'claim-author' }, [i.who])
                : null
            ])
          ]
        ))
      )
    }
  }
}

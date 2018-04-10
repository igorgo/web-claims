import {QIcon} from 'quasar'

export default {
  methods: {
    drawFiles (h) {
      return !this.files.length ? null : h(
        'div', { staticClass: 'q-mt-sm' }, this.files.map((f, idx) => h(
          'div', { staticClass: 'items-center q-pt-xs' }, [
            h(QIcon, {
              props: { name: 'bt-attach-file', size: '20px' },
              staticClass: 'cursor-pointer',
              nativeOn: {
                click: () => {
                  this.downloadFile(f.id)
                }
              }
            }),
            h('span', {
              staticClass: 'q-px-sm cursor-pointer underline',
              on: {
                click: () => {
                  this.downloadFile(f.id)
                }
              }
            }, [
              `${f.path} (${this.$routines.hrFileSize(f.sizeBite)})`
            ]),
            f.own
              ? h(QIcon, {
                props: { name: 'bt-delete', size: '20px' },
                staticClass: 'cursor-pointer',
                nativeOn: {
                  click: () => {
                    this.deleteFile(idx)
                  }
                }
              })
              : null
          ]
        ))
      )
    }
  }
}

import {QIcon} from 'quasar'

export default {
  methods: {
    drawFiles (h) {
      return !this.files.length ? null : h(
        'div', {staticClass: 'claim-files-wrapper'}, this.files.map(f => h(
          'div', {staticClass: 'items-center'}, [
            h(QIcon, {
              props: {name: 'bt-download', size: '20px'},
              staticClass: 'cursor-pointer',
              nativeOn: {click: () => { this.downloadFile(f.id) }}
            }),
            h('span', {staticClass: 'q-px-sm'}, [`${f.path} (${this.$routines.hrFileSize(f.sizeBite)})`]),
            f.own
              ? h(QIcon, {
                props: {name: 'bt-delete', size: '20px'},
                staticClass: 'cursor-pointer',
                nativeOn: {click: () => { this.deleteFile(f.id) }}
              })
              : null
          ]
        ))
      )
    }
  }
}

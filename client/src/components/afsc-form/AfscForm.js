import {QTabs, QTab, QTabPane, QBtn} from 'quasar'
import GlobalKeyListener from '../mixins/GlobalKeyListener'

export default {
  name: 'afs-form',
  mixins: [GlobalKeyListener],
  data () {
    return {
      keysMap: {
        'Ctrl+Tab': this.nextTab,
        'Ctrl+Shift+Tab': this.prevTab
      },
      activeTabName: ''
    }
  },
  props: {
    title: String,
    tabs: Array,
    paneHeight: {
      type: String,
      default: '50px'
    },
    buttons: Array
  },
  computed: {
    activeTabIdx () {
      return this.activeTabName ? parseInt(this.activeTabName.slice(-1)) : 0
    }
  },
  render (h) {
    return h('div', {staticClass: 'form-container'}, [this._drawHeader(h), this._drawBody(h), this._drawFooter(h)])
  },
  methods: {
    _makeTabs (h) {
      if (!this.tabs) return []
      let tabs = []
      for (let i = 0; i < this.tabs.length; i++) {
        tabs.push(h(
          QTab,
          {
            slot: 'title',
            props: {
              name: 'tab-' + i,
              label: this.tabs[i],
              default: i === 0
            }
          }
        ))
      }
      return tabs
    },
    _makePanes (h) {
      if (!this.tabs) return []
      let panes = []
      for (let i = 0; i < this.tabs.length; i++) {
        const name = `tab-${i}`
        panes.push(
          h(
            QTabPane,
            {
              props: {
                name,
                'keep-alive': true
              },
              style: {
                'min-height': this.paneHeight || '50px'
              }
            },
            [this.$slots[name]]
          )
        )
      }
      return panes
    },
    _makeButtons (h) {
      if (!this.buttons) return []
      let buttons = []
      const btnCnt = this.buttons.length
      for (let i = 0; i < this.buttons.length; i++) {
        buttons.push(
          h(
            QBtn,
            {
              staticClass: 'col',
              'class': {
                'q-mr-xs': i === 0 && btnCnt > 1,
                'q-mx-xs': i > 0 && i < btnCnt - 1,
                'q-ml-xs': i === btnCnt - 1 && btnCnt > 1
              },
              props: {
                'no-caps': true,
                outline: true,
                label: this.buttons[i].label,
                icon: this.buttons[i].icon || null,
                disable: this.buttons[i].disable,
                size: 'md'
              },
              on: {
                click: this.buttons[i].handler || (() => {})
              }
            }
          )
        )
      }
      return buttons
    },
    _drawHeader (h) {
      return h('div', { staticClass: 'form-header row items-center' }, [this._drawHeaderTitle(h), this.$slots['header-actions']])
    },
    _drawBody (h) {
      return h(
        QTabs,
        {
          props: {
            'no-ripple': true,
            value: this.activeTabName
          },
          on: {
            input: (val) => {
              this.activeTabName = val
              this.$emit('tabchange', val)
            }
          },
          ref: 'tabs'
        },
        [
          ...this._makeTabs(h),
          ...this._makePanes(h)
        ]
      )
    },
    _drawFooter (h) {
      return h(
        'div',
        {
          staticClass: 'form-footer row items-stretch'
        },
        this._makeButtons(h)
      )
    },
    _drawHeaderTitle (h) {
      return h('div', { staticClass: 'q-toolbar-title' }, [this.title])
    },
    selectTab (idx) {
      this.$refs.tabs.selectTab(`tab-${idx}`)
    },
    nextTab () {
      if (!this.tabs) return
      const newTabIdx = (this.activeTabIdx === (this.tabs.length - 1) ? 0 : this.activeTabIdx + 1)
      this.selectTab(newTabIdx)
    },
    prevTab () {
      if (!this.tabs) return
      const newTabIdx = (this.activeTabIdx === 0 ? this.tabs.length - 1 : this.activeTabIdx - 1)
      this.selectTab(newTabIdx)
    }

  }
}

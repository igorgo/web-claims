import {AfscSelect} from '../../../index'
import {QBtn} from 'quasar'

export default {
  data () {
    return {
      sortList: this.$routines.SORT_OPTIONS.map((item) => {
        return { label: item.label, value: item.value }
      })
    }
  },
  methods: {
    _drawOptions (h) {
      return h(
        'div',
        {
          staticClass: 'row items-center justify-center'
        },
        [this._drowFilterOption(h), this._drowSortOption(h)]
      )
    },
    _drowFilterOption (h) {
      return h('div', { staticClass: 'col-md-6 col-12 row justify-center items-center' }, [
        h('div', { staticClass: 'col-auto' }, [
          h(
            AfscSelect,
            {
              ref: 'claims-filter-option',
              props: {
                label: 'Фільтр',
                nonClearable: true,
                options: this.filtersOptions,
                value: this.currentCondition
              },
              staticClass: 'claim-option-select',
              on: {
                input: (val) => {
                  this.$store.dispatch('claims/setCurrentCondition', val)
                }
              }
            }
          )
        ]),
        h('div', { staticClass: 'col-auto' }, [
          h(
            QBtn,
            {
              props: {
                round: true,
                color: 'primary',
                icon: 'bt-filter',
                outline: true
              },
              staticClass: 'on-right',
              on: {
                click: () => {
                  this.$router.push('/filters/cond')
                }
              }
            }
          )
        ])
      ])
    },
    _drowSortOption (h) {
      return h('div', { staticClass: 'col-md-6 col-12 justify-center row  items-center' }, [
        h('div', { staticClass: 'col-auto' }, [
          h(
            AfscSelect,
            {
              ref: 'sortSelect',
              props: {
                label: 'Сортування',
                nonClearable: true,
                options: this.sortList,
                value: this.currentClaimSort,
                before: [{
                  icon: 'sort',
                  handler: () => {
                    this.$refs.sortSelect.$el.blur()
                    setTimeout(
                      () => {
                        // console.log(1)
                        this.$router.push('/claim/user-sort')
                        // this.$router.back()
                      }, 50
                    )
                  }
                }]
              },
              staticClass: 'claim-option-select',
              on: {
                input: (val) => {
                  this.$store.dispatch('claims/setCurrentSort', val)
                }
              }
            }
          )
        ]),
        h('div', { staticClass: 'col-auto' }, [
          h(
            QBtn,
            {
              props: {
                round: true,
                color: 'primary',
                icon: this.sortIcon,
                outline: true,
                disable: this.currentClaimSort === 0 || this.currentClaimSort === 100
              },
              staticClass: 'on-right',
              on: {
                click: () => {
                  this.$store.dispatch('claims/sortToggle')
                }
              }
            }
          )
        ])
      ])
    }
  },
  computed: {
    sortIcon () {
      return this.isSortOrderDesc ? 'bt-sort-desc' : 'bt-sort-asc'
    },
    currentCondition () {
      return this.$store.getters['claims/currentCondition']
    },
    currentClaimSort () {
      return this.$store.getters['claims/currentClaimSort']
    },
    isSortOrderDesc () {
      return this.$store.getters['claims/isSortOrderDesc']
    },
    filtersOptions () {
      return this.$store.getters['filters/filtersOptions']
    }
  }
}

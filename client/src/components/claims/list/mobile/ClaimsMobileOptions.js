import {AfscSelect} from '../../../index'
import {QBtn} from 'quasar'

export default {
  data () {
    return {
      sortList: this.$routines.SORT_OPTIONS.map((item, ind) => {
        return { label: item.label, value: ind }
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
              on: { click: () => { this.$router.push('/filters/cond') } }
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
              props: {
                label: 'Сортування',
                nonClearable: true,
                options: this.sortList,
                value: this.currentClaimSort
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
                outline: true
              },
              staticClass: 'on-right',
              on: { click: () => { this.$store.dispatch('claims/sortToggle') } }
            }
          )
        ])
      ])
    },
    onNewFilterClick () {
      console.log('todo: invoke filter edit')
      // todo: invoke filter edit
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

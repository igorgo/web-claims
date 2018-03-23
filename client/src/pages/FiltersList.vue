<template>
  <q-page  class="q-pa-md">
    <div class="content relative-position">
      <div class="q-headline text-primary col q-px-xs"><span>Мої фільтри рекламацій</span></div>
      <q-list no-border>
        <afsc-filter-list-item
          v-for="(item, index) in filters" :key="index"
          :filterRec="item"
          :filterIndex="index"
        />
      </q-list>
      <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-btn round color="primary" @click="addFilter">
          <q-icon name="bt-add"/>
        </q-btn>
      </q-page-sticky>
    </div>
  </q-page>
</template>

<script>
import { AfscFilterListItem, GlobalKeyListener } from '../components'

export default {
  data () {
    return {
      keysMap: {
        'ArrowDown': this._onKeyArrowDown,
        'ArrowUp': this._onKeyArrowUp,
        'F2': this.editFilter,
        'Insert': this.addFilter
      }
    }
  },
  mixins: [GlobalKeyListener],
  components: {
    AfscFilterListItem
  },
  computed: {
    filters () {
      return this.$store.state.filters.filters
    },
    listIndex () {
      return this.$store.state.filters.listIndex
    }
  },
  methods: {
    addFilter () {
      // void this.$store.dispatch('getConditionFilter', { conditionId: null, from: 'filters' })
      this.$router.push('/filters/new/')
    },
    _onKeyArrowDown () {
      this.$store.commit('filters/filtersListScroll', 1)
    },
    _onKeyArrowUp () {
      this.$store.commit('filters/filtersListScroll', -1)
    },
    editFilter () {
      if ((this.listIndex >= 0) && (this.filters[this.listIndex].editable === 'Y')) {
        this.$router.push('/filters/edit/' + this.filters[this.listIndex].rn)
      }
    }
  },
  mounted: function () {
    void this.$store.dispatch('filters/getFiltersList')
  }
}
</script>

<style lang="stylus">
  @import '~variables'
  .af-active-line
    background-color $primary
</style>

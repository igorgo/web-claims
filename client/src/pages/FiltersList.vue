<template>
  <q-page  class="q-pa-md">
    <div class="content">
      <div class="q-headline text-primary col q-px-xs"><span>Мої фільтри рекламацій</span></div>
      <q-list no-border>
        <!-- cond-filter :class="{'afinasql-bg':index===listIndex}" v-for="(item, index) in filters" :key="index"
                     :filterRec="item" :filterIndex="index" /-->
      </q-list>
      <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-btn round color="primary" @click="addFilter">
          <q-icon name="add"/>
        </q-btn>
      </q-page-sticky>
    </div>
  </q-page>
</template>

<script>
// import CondFilter from './CondFilter.vue'
// import {AfEventsMapper} from '../base'

export default {
  data () {
    return {
      eventsMap: {
        'key:arrow:down': this.__onKeyArrowDown,
        'key:arrow:up': this.__onKeyArrowUp,
        'key:f2': this.__editFilter,
        'key:insert': this.addFilter
      }
    }
  },
  // mixins: [AfEventsMapper],
  components: {
    // CondFilter
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
      void this.$store.dispatch('getConditionFilter', { conditionId: null, from: 'filters' })
      this.$router.push('/filter')
    },
    __onKeyArrowDown () {
      void this.$store.dispatch('conditionListScroll', 1)
    },
    __onKeyArrowUp () {
      void this.$store.dispatch('conditionListScroll', -1)
    },
    __editFilter () {
      if ((this.listIndex >= 0) && (this.filters[this.listIndex]['EDITABLE'] === 'Y')) {
        void this.$store.dispatch('getConditionFilter', {
          socket: this.$socket,
          conditionId: this.filters[this.listIndex]['RN'],
          from: 'filters'
        })
        this.$router.push('/filter')
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

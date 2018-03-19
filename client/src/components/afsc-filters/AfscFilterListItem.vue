<template>
  <div :class="['filter-list-item', {'active': active}]"
       @click="filtersListScrollTo(filterIndex)"
  >
    <q-item>
      <q-item-main
        :label="filterRec.name"
        @click="console.log(2222)"
      />
      <div @click="editFilter(filterRec.rn)">
        <q-item-side
          :class="[ 'filter-list-icon', {'editable': editable}, 'qwexqwed']"
          :icon="iconEdit"
        />
      </div>
    </q-item>
  </div>
</template>

<script>
import {mapActions, mapState} from 'vuex'

export default {
  name: 'afsc-filter-list-item',
  data () {
    return {}
  },
  props: ['filterRec', 'filterIndex'],
  computed: {
    ...mapState({
      listIndex: state => state.filters.listIndex
    }),
    editable () {
      return this.$props.filterRec.editable === 'Y'
    },
    iconEdit () {
      return this.editable ? 'edit' : 'lock'
    },
    active () {
      return this.listIndex === this.filterIndex
    },
    iconClass () {
      return `af-${this.editable ? 'en' : 'dis'}abled-${(this.listIndex === this.filterIndex) ? '' : 'non'}active`
    }
  },
  methods: {
    ...mapActions('filters', [
      'filtersListScrollTo'
    ]),
    filtersListScrollTo2 (a) {
      console.log(a)
    },
    editFilter (rn) {
      if (!this.editable) return
      // void this.$store.dispatch('getConditionFilter', { socket: this.$socket, conditionId: rn, from: 'filters' })
      this.$router.push('/filters/edit/' + rn)
    }

  }
}
</script>

<style lang="stylus">

</style>

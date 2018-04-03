<template>
  <q-page>
    <claim-view
      :id="parseInt($route.params.id)"
    />
  </q-page>
</template>

<script>
import {ClaimView} from '../components'

export default {
  // name: 'PageName',
  components: {
    ClaimView
  },
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>

<style>
</style>

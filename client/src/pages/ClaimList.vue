<template>
  <div>
    <!--q-page padding v-if="$q.platform.is.mobile">
      Мобильный
    </q-page-->
    <q-page padding>
      <claims />
    </q-page>
    <!--q-page padding v-if="$q.platform.is.desktop">
      Десктоп
    </q-page-->
  </div>
</template>

<script>
import {Claims} from '../components'

export default {
  // name: 'PageName',
  mounted () {
    console.log(this.$q.platform.is)
  },
  components: {
    Claims
  }
}
</script>

<style>
</style>

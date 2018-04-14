<template>
  <div>
    <!--q-page padding v-if="$q.platform.is.mobile">
      Мобильный
    </q-page-->
    <q-page>
      <claims-mobile />
    </q-page>
    <!--q-page padding v-if="$q.platform.is.desktop">
      Десктоп
    </q-page-->
  </div>
</template>

<script>
import {ClaimsMobile} from '../../components/index'

export default {
  // name: 'PageName',
  mounted () {
    // console.log(this.$q.platform.is)
  },
  components: {
    ClaimsMobile
  }
}
</script>

<style>
</style>

<template>
  <q-page padding>
    <div>
    <q-btn
      label=" <- "
      @click="$router.back()"
    />
    </div>
    <div>
      <claim-form-add/>
    </div>
  </q-page>
</template>

<script>
import {ClaimFormAdd} from '../components'

export default {
  name: 'PageAddClaim',
  components: {
    ClaimFormAdd
  }
}
</script>

<style>
</style>

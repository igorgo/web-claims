<template>
  <q-page class="q-pa-md">
    <div class="q-mb-md">
      <div class="inline q-headline text-primary col q-px-xs"><span>Нова рекламація</span></div>
      <q-btn
      label="Скасування"
      icon="bt-round-cancel"
      outline
      dense
      color="primary"
      class="float-right"
      @click="onCancel"
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
  },
  methods: {
    onCancel () {
      this.$store.commit('filters/blockListUpdate', true)
      this.$router.back()
    }
  }
}
</script>

<style>
</style>

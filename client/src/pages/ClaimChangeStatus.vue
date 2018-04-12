<template>
  <q-page  class="page-form">
    <afsc-form
      title="Зміна статусу"
      pane-height="200px"
    >
      <div slot="form-body">
        <div class="row">
          <afsc-select
            label="Новий статус"
            mandatory
            class="col"
            :options="statusesOptions"
            v-model="cStatus"
          />
        </div>
      </div>
    </afsc-form>
  </q-page>
</template>

<script>
import GlobalKeyListener from '../components/mixins/GlobalKeyListener'
import {AfscForm, AfscSelect} from '../components'

export default {
  name: 'ClaimChangeStatus',
  data () {
    return {
      keysMap: {
        'Escape': () => {
          if (document.activeElement.tagName === 'BODY') this.$router.back()
        }
      },
      cStatus: '',
      statusesOptions: []
    }
  },
  mixins: [GlobalKeyListener],
  components: {
    AfscForm,
    AfscSelect
  },
  computed: {
    id: () => parseInt(this.$route.params.id)
  },
  async mounted () {
    if (this.id > 0) {
      await this.$request.post()
    }
  }
}
</script>

<style>
</style>

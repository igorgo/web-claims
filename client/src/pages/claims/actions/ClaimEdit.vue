<template>
  <q-page class="page-form">
    <claim-form-edit
      :id="parseInt($route.params.id)"
    />
  </q-page>
</template>

<script>
import GlobalKeyListener from '../../../components/mixins/GlobalKeyListener'
import {ClaimFormEdit} from '../../../components/index'

export default {
  name: 'ClaimEdit',
  data () {
    return {
      keysMap: {
        'Escape': () => {
          if (document.activeElement.tagName === 'BODY') this.$router.back()
        }
      }
    }
  },
  components: {
    ClaimFormEdit
  },
  mixins: [GlobalKeyListener],
  computed: {},
  methods: {},
  created () {
  }
}
</script>

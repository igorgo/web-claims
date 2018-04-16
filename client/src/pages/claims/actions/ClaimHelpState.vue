<template>
  <q-page class="page-form">
    <afsc-form
      :title="formTitle"
      pane-height="200px"
      :buttons="formButtons"
    >
      <div slot="form-body">
        <div class="row q-mb-xs">
          <afsc-select
            class="col"
            :label="stateLabel"
            mandatory
            v-model="status"
            :options="statuses"
          />
        </div>
        <div class="row" v-if="mode === $routines.FORM_CLAIM_HELP_MODE.NEED">
          <afsc-text-area
            class="col"
            label="Комментар"
            v-model="cNote"
            :max-length="4000"
          />
        </div>
      </div>
    </afsc-form>
  </q-page>
</template>

<script>
import GlobalKeyListener from '../../../components/mixins/GlobalKeyListener'
import {AfscForm, AfscSelect, AfscTextArea} from '../../../components/index'

export default {
  name: 'ClaimHelpState',
  data () {
    return {
      keysMap: {
        'Escape': () => {
          if (document.activeElement.tagName === 'BODY') this.$router.back()
        }
      },
      status: null,
      cNote: ''
    }
  },
  mixins: [GlobalKeyListener],
  components: {
    AfscForm,
    AfscSelect,
    AfscTextArea
  },
  computed: {
    formButtons () {
      return [
        {
          label: 'OK',
          handler: this.doHelpState,
          disable: !this.formValid
        },
        {
          label: 'Скасування',
          handler: () => {
            this.$router.back()
          }
        }
      ]
    },
    id () {
      return parseInt(this.$route.params.id)
    },
    mode () {
      return this.$route.params.mode
    },
    statuses () {
      return this.mode === this.$routines.FORM_CLAIM_HELP_MODE.NEED
        ? this.$routines.HELP_NEED_OPTIONS
        : this.$routines.HELP_STATUS_OPTIONS
    },
    formTitle () {
      return this.mode === this.$routines.FORM_CLAIM_HELP_MODE.NEED
        ? 'Зміна необхідності хелпа'
        : 'Зміна статусу хелпа'
    },
    stateLabel () {
      return this.mode === this.$routines.FORM_CLAIM_HELP_MODE.NEED
        ? 'Необхідність хелпа'
        : 'Статус хелпа'
    },
    record () {
      return this.$store.state.claims.claimRecord
    },
    formValid () {
      return !!this.status
    }
  },
  methods: {
    async doHelpState () {
      if (!this.formValid) return
      try {
        if (this.mode === this.$routines.FORM_CLAIM_HELP_MODE.NEED) {
          await this.$request.post('/claims/help-need', {
            sessionID: this.$store.state.auth.sessionID,
            id: this.id,
            status: this.status,
            note: this.cNote
          })
        } else {
          await this.$request.post('/claims/help-status', {
            sessionID: this.$store.state.auth.sessionID,
            id: this.id,
            status: this.status
          })
        }
        this.$store.commit('claims/blockRecordUpdate', false)
        this.$store.commit('claims/blockListUpdate', false)
        this.$router.back()
      } catch (e) {
        console.log(e)
      }
    }
  },
  mounted () {
    this.status = this.mode === this.$routines.FORM_CLAIM_HELP_MODE.NEED
      ? this.record.helpSign < 20 ? this.record.helpSign : null
      : this.record.helpSign > 20 ? this.record.helpSign : null
  }
}
</script>

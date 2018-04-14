<template>
  <q-page class="page-form">
    <afsc-form
      title="Повернення"
      pane-height="200px"
      :buttons="formButtons"
    >
      <div slot="form-body">
        <div class="row q-mb-xs">
          <div class="text-italic q-mb-sm" v-html="returnMessage"></div>
        </div>
        <div class="row q-mb-xs">
          <afsc-select
            class="col"
            label="Тип комментара"
            mandatory
            :options="$routines.NOTES_HEADER_OPTIONS"
            v-model="cNoteHeader"
          />
        </div>
        <div class="row">
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
  name: 'ClaimChangeStatus',
  data () {
    return {
      keysMap: {
        'Escape': () => {
          if (document.activeElement.tagName === 'BODY') this.$router.back()
        }
      },
      returnMessage: '',
      cNoteHeader: this.$routines.DEFAULT_HEADER,
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
          handler: this.doReturn,
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
    record () {
      return this.$store.state.claims.claimRecord
    },
    formValid () {
      return !!this.cNoteHeader && !!this.returnMessage
    }
  },
  methods: {
    async getRetMessage () {
      if (this.id > 0) {
        const resp = await this.$request.post('/claims/return-message', {
          sessionID: this.$store.state.auth.sessionID,
          id: this.id
        })
        this.returnMessage = resp.data.message.replace('\r\n', '<br/>')
        console.log(this.returnMessage)
      }
    },
    async doReturn () {
      if (!this.formValid) return
      try {
        await this.$request.post('/claims/return', {
          sessionID: this.$store.state.auth.sessionID,
          id: this.id,
          cNoteHeader: this.cNoteHeader,
          cNote: this.cNote
        })
        this.$store.commit('claims/blockRecordUpdate', false)
        this.$store.commit('claims/blockListUpdate', false)
        this.$router.back()
      } catch (e) {
        console.log(e)
      }
    }
  },
  mounted () {
    // console.log(this.$route.params.id)
    this.getRetMessage()
  }
}
</script>

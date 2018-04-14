<template>
  <q-page class="page-form">
    <afsc-form
      title="Зміна статусу"
      pane-height="316px"
      :buttons="formButtons"
    >
      <div slot="form-body">
        <div class="row q-mb-xs">
          <afsc-select
            label="Новий статус"
            mandatory
            class="col"
            :options="statusesOptions"
            v-model="cStatus"
            @input="onStatusChanged"
          />
        </div>
        <div class="row q-mb-xs" v-if="needExecutors">
          <afsc-select
            label="Виконавець"
            mandatory
            class="col"
            :options="executors"
            v-model="cSend"
          />
        </div>
        <div class="row q-mb-xs" v-if="needRelease">
          <div
            class="col-12 col-sm-6"
          >
            <afsc-select
              label="Реліз виконання"
              mandatory
              :options="releasesOptions"
              v-model="cRelTo"
              @input="onRelToChanged"
            />
          </div>
          <div class="col-12 col-sm-6 q-pl-xs" v-if="needBuild">
            <afsc-select
              label="Збірка"
              mandatory
              :options="buildOptions"
              v-model="cBldTo"
            />
          </div>
          <div class="col-12 col-sm-6 q-pl-xs" v-if="!needBuild">
            <afsc-number-input
              label="Пріоритет"
              mandatory
              v-model="cPriority"
              :min="1"
              :max="10"
            />
          </div>
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
import {AfscForm, AfscSelect, AfscNumberInput, AfscTextArea} from '../../../components/index'

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
      statusesOptions: [],
      statuses: {},
      cSend: '',
      executors: [],
      cRelTo: '',
      cBldTo: '',
      cPriority: 5,
      cNoteHeader: this.$routines.DEFAULT_HEADER,
      cNote: ''
    }
  },
  mixins: [GlobalKeyListener],
  components: {
    AfscForm,
    AfscSelect,
    AfscNumberInput,
    AfscTextArea
  },
  computed: {
    formButtons () {
      return [
        {
          label: 'OK',
          handler: this.doChangeStatus,
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
    needRelease () {
      return this.cStatus && this.statuses[this.cStatus].statType > 0
    },
    needBuild () {
      return this.cStatus && this.statuses[this.cStatus].statType === 2
    },
    needExecutors () {
      return this.executors.length > 0
    },
    record () {
      return this.$store.state.claims.claimRecord
    },
    releasesOptions () {
      return this.$store.getters['staticData/releasesForSelect']('A.1.3')
    },
    buildOptions () {
      return this.$store.getters['staticData/buildsForSelect']('A.1.3', this.cRelTo)
    },
    formValid () {
      return !!this.cStatus &&
        (!this.needExecutors || !!this.cSend) &&
        (!this.needRelease || !!this.cRelTo) &&
        (!this.needBuild || !!this.cBldTo) &&
        (this.cPriority >= 1 && this.cPriority <= 10) &&
        !!this.cNoteHeader
    }
  },
  methods: {
    async getStatuses () {
      if (this.id > 0) {
        this.cRelTo = this.record.relTo
        this.cBldTo = this.record.buildTo
        this.cPriority = this.record.priority
        const resp = await
          this.$request.post('/claims/next-statuses', {
            sessionID: this.$store.state.auth.sessionID,
            id: this.id
          })
        this.statusesOptions = resp.data.map(p => ({ label: p.statCode, value: p.statId }))
        if (this.statusesOptions.length === 1) {
          this.cStatus = this.statusesOptions[0].value
          this.onStatusChanged(this.cStatus)
        }
        resp.data.forEach(p => {
          this.statuses[p.statId] = { statCode: p.statCode, statType: p.statType }
        })
      }
    },
    onRelToChanged () {
      this.cBldTo = ''
    },
    async onStatusChanged (val) {
      if (val) {
        this.executors = []
        const resp = await
          this.$request.post('/claims/next-execs', {
            sessionID: this.$store.state.auth.sessionID,
            id: this.id,
            pointId: val
          })
        this.executors = resp.data
        this.cNoteHeader = this.needBuild ? this.$routines.DEFAULT_HEADER_INST : this.$routines.DEFAULT_HEADER
      }
    },
    async doChangeStatus () {
      if (!this.formValid) return
      try {
        await this.$request.post('/claims/change-status', {
          sessionID: this.$store.state.auth.sessionID,
          cId: this.id,
          cType: this.record.claimType,
          cStatus: this.statuses[this.cStatus].statCode,
          cSendTo: this.cSend,
          cNoteHeader: this.cNoteHeader,
          cNote: this.cNote,
          cPriority: this.cPriority,
          cRelTo: this.cRelTo,
          cBldTo: this.cBldTo
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
    this.getStatuses()
  }
}
</script>

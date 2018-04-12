<template>
    <afsc-form
      title="Виправлення рекламації"
      :tabs="tabs"
      pane-height="200px"
      :buttons="formButtons"
    >
      <div slot="tab-0">
        <div class="q-mb-xs">
          <afsc-auto-complete
            label="Розділ"
            mandatory
            multiple
            v-model="cUnit"
            :static-data="$store.getters['staticData/unitsForSelect']"
            @input="onUnitChanged"
          />
        </div>
        <div class="q-mb-xs">
          <afsc-select
            label = "Застосунок"
            mandatory
            :disable="!cUnit || appsByUnit.length === 0"
            multiple
            :options="appsByUnit"
            v-model="cApp"
          />
        </div>
        <div v-if="cUnit && cUnit.split(';').length === 1 && funcByUnit.length" class="q-mb-xs">
          <afsc-select
            label="Дія в розділі"
            multiple
            :options="funcByUnit"
            v-model="cFunc"
          />
        </div>
      </div>
      <div slot="tab-1">
        <div class="row">
          <div class="col-12 col-sm-6 q-px-xs q-mb-xs">
            <afsc-select
              label="Реліз"
              mandatory
              :options="releasesOptions"
              v-model="cRelFrom"
              @input="onRelFromChanged"
            />
          </div>
          <div class="col-12 col-sm-6 q-px-xs q-mb-xs">
            <afsc-select
              label="Збірка"
              mandatory
              :disable="!cRelFrom"
              :options="buildsOptions"
              v-model="cBldFrom"
            />
          </div>
        </div>
      </div>
      <div slot="tab-2">
        <div class="q-mb-xs">
          <afsc-select
            label="Реліз виконання"
            :options="releasesOptions"
            v-model="cRelTo"
          />
        </div>
      </div>
      <div slot="tab-3">
        <div class="q-mb-xs">
          <afsc-text-area
            label="Зміст"
            mandatory
            v-model="cContent"
            :max-length="4000"
          />
        </div>
      </div>
    </afsc-form>
</template>

<script>
import {AfscForm, AfscAutoComplete, AfscSelect, AfscTextArea} from '../..'
export default {
  name: 'claim-form-edit',
  components: {
    AfscForm,
    AfscAutoComplete,
    AfscSelect,
    AfscTextArea
  },
  props: {
    id: Number
  },
  data () {
    return {
      cContent: '',
      cRelFrom: null,
      cBldFrom: null,
      cRelTo: null,
      cApp: [],
      cUnit: null,
      cFunc: [],
      formButtons: [
        {
          label: 'OK',
          handler: this.doEdit
        },
        {
          label: 'Скасування',
          handler: () => { this.$router.back() }
        }
      ]
    }
  },
  computed: {
    tabs () {
      return [
        {title: 'Система', alert: !(this.cUnit && this.cApp.length)},
        {title: 'Реліз', alert: !(this.cRelFrom && this.cBldFrom)},
        {title: 'Виконання', hide: !this.$store.state.auth.isPmo},
        {title: 'Зміст', alert: !(this.cContent)}
      ]
    },
    record () { return this.$store.state.claims.claimRecord },
    appsByUnit () {
      return this.$store.getters['staticData/appsByUnitOptions']
    },
    funcByUnit () {
      return this.$store.getters['staticData/funcByUnitOptions']
    },
    releasesOptions () {
      return this.$store.getters['staticData/releasesForSelect']('A.1.3')
    },
    buildsOptions () {
      return this.$store.getters['staticData/buildsForSelect']('A.1.3', this.cRelFrom)
    }
  },
  methods: {
    onUnitChanged (val) {
      this.cApp = []
      this.cFunc = []
      this.$store.dispatch('staticData/getAppsByUnits', {units: val})
    },
    onRelFromChanged () {
      this.cBldFrom = null
    },
    doEdit () {
      try {
        this.$request.post('/claims/edit', {
          sessionID: this.$store.state.auth.sessionID,
          cId: this.id,
          cContent: this.cContent,
          cRelFrom: this.cRelFrom,
          cBldFrom: this.cBldFrom,
          cRelTo: this.cRelTo,
          cApp: this.cApp.join(';'),
          cUnit: this.cUnit,
          cFunc: this.cFunc.join(';')
        })
        this.$store.commit('claims/blockRecordUpdate', false)
        this.$router.back()
      } catch (e) {
        console.log(e)
      }
    }
  },
  async mounted () {
    if (this.id !== this.record.id) {
      this.$store.commit('claims/blockRecordUpdate', false)
      await this.$store.dispatch('claims/getClaimRecord', this.id)
    }
    this.cContent = this.record.content
    this.cRelFrom = this.record.relFrom
    this.cBldFrom = this.record.buildFrom
    this.cRelTo = this.record.relTo
    this.cUnit = this.record.unit
    this.$store.dispatch('staticData/getAppsByUnits', {units: this.cUnit, immediate: true})
    this.cApp = this.record.app ? this.record.app.split(';') : []
    this.cFunc = this.record.action ? this.record.action.split(';') : []
  }
}
</script>

<style scoped>

</style>

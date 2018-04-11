<template>
  <q-page class="page-form">
    <afsc-form :title="actionTitle" :tabs="tabs" pane-height="200px" :buttons="formButtons" btn-min-width="90px">
      <div slot="header-actions" v-if="isEditMode">
        <span>{{'«' + filter.name + '»'}}</span>
        <q-btn round flat outline icon="bt-edit" @click="renameFilter"></q-btn>
        <q-btn round flat outline icon="bt-delete" @click="deleteFilter"></q-btn>
      </div>
      <div slot="tab-0">
        <div class="row q-pb-xs">
          <afsc-input class="col" label="Номер" v-model="filter.claimNumb" autofocus/>
        </div>
        <div class="row q-py-xs">
          <afsc-select class="col" label="Тип" v-model="filter.claimType" :options="$routines.CLAIM_TYPE_OPTIONS"
                       multiple/>
        </div>
        <div class="row q-pt-xs">
          <afsc-select class="col" label="Поточний стан" v-model="filter.claimStatus" :options="statusOptions"
                       multiple/>
        </div>
      </div>
      <div slot="tab-1">
        <div class="row q-pb-xs">
          <afsc-auto-complete
            class="col"
            label="Застосунок"
            v-model="filter.claimApp"
            multiple
            :static-data="appsOptions"
          />
        </div>
        <div class="row q-pt-xs">
          <afsc-auto-complete
            class="col"
            label="Розділ"
            v-model="filter.claimUnit"
            multiple
            :static-data="unitOptions"
          />
        </div>
      </div>
      <div slot="tab-2">
        <div class="row q-pb-xs">
          <afsc-select
            label="Версія"
            v-model="filter.claimVersion"
            :options="versionOptions"
            @input="versionChange"
            multiple
            class="col"
          />
        </div>
        <div class="row q-py-xs">
          <afsc-select
            label="Реліз"
            v-model="filter.claimRelease"
            :options="releasesOptions"
            @input="releaseChange"
            :disable="releaseDisabled"
            multiple
            class="col"
          />
        </div>
        <div class="row q-pt-xs">
          <afsc-select
            label="Збірка"
            v-model="filter.claimBuild"
            :options="buildsOptions"
            :disable="buildDisabled"
            multiple
            class="col"
          />
        </div>
      </div>
      <div slot="tab-3">
        <div class="row q-pb-sm">
          <afsc-select
            label="Виконавець"
            v-model="filter.claimExecutor"
            :options="personsOptions"
            class="col-md-8 col-12"
            :disable="filter.imExecutor === 1"
          />
          <afsc-checkbox
            label="Я - виконавець"
            v-model="filter.imExecutor"
            class="col-md-4 q-pl-sm q-pt-xs col-12"
            @input="imExecutorChange"
          />
        </div>
        <div class="row q-pt-sm ">
          <afsc-select
            label="Автор"
            v-model="filter.claimAuthor"
            :options="personsOptions"
            class="col-md-8 col-12"
            :disable="filter.imInitiator === 1"
          />
          <afsc-checkbox
            label="Я - автор"
            v-model="filter.imInitiator"
            class="col-md-4 q-pl-sm  q-pt-xs col-12"
            @input="imAuthorChange"
          />
        </div>
      </div>
      <div slot="tab-4">
        <div class="row q-py-xs">
          <afsc-input class="col" label="Зміст" v-model="filter.claimContent"/>
        </div>
      </div>
    </afsc-form>
  </q-page>
</template>

<script>
import GlobalKeyListener from '../components/mixins/GlobalKeyListener'
import {AfscForm, AfscInput, AfscSelect, AfscAutoComplete, AfscCheckbox} from '../components'

function isOneValue (val) {
  return val && (val.split(';')).length === 1
}

export default {
  name: 'FilterEdit',
  data () {
    return {
      keysMap: {
        'Escape': () => {
          if (document.activeElement.tagName === 'BODY') this.$router.back()
        }
      },
      // tabCount: 5,
      // activeTabName: '',
      tabs: [
        {title: 'Реквізити'},
        {title: 'Система'},
        {title: 'Реліз'},
        {title: 'Персони'},
        {title: 'Зміст'}
      ],
      filter: {
        rn: null,
        name: '',
        ...this.$store.state.filters.emptyFilter
      }
    }
  },
  components: {
    AfscForm,
    AfscInput,
    AfscAutoComplete,
    AfscSelect,
    AfscCheckbox
  },
  mixins: [GlobalKeyListener],
  computed:
    {
      formButtons () {
        const commonButtons = [
          {
            label: 'Очистити',
            handler: this.clearFilter
          },
          {
            label: 'Скасування',
            handler: () => {
              this.$router.back()
            }
          }
        ]
        const editButtons = [
          {
            label: 'OK',
            handler: this.saveFilter
          }
        ]
        const condButtons = [
          {
            label: 'Застосувати',
            handler: this.applyFilter
          },
          {
            label: 'Зберегти та застосувати',
            handler: this.saveAndApplyFilter
          }
        ]
        return this.isCondMode
          ? [...condButtons, ...commonButtons]
          : [...editButtons, ...commonButtons]
      },
      actionTitle () {
        return `${this.isEditMode ? 'Редагування' : 'Додавання'} фільтра`
      },
      isEditMode () {
        return this.$route.params.mode === 'edit'
      },
      isAddMode () {
        return this.$route.params.mode === 'new'
      },
      isCondMode () {
        return this.$route.params.mode === 'cond'
      },
      statusOptions () {
        return this.$store.getters['staticData/statusesForSelect']
      },
      appsOptions () {
        return this.$store.getters['staticData/appsForSelect']
      },
      unitOptions () {
        return this.$store.getters['staticData/unitsForSelect']
      },
      versionOptions () {
        return this.$store.getters['staticData/versionsForSelect']
      },
      releasesOptions () {
        return this.$store.getters['staticData/releasesForSelect'](this.filter.claimVersion)
      },
      buildsOptions () {
        return this.$store.getters['staticData/buildsForSelect'](this.filter.claimVersion, this.filter.claimRelease)
      },
      personsOptions () {
        return this.$store.getters['staticData/personsForSelect']
      },
      releaseDisabled () {
        return !isOneValue(this.filter.claimVersion)
      },
      buildDisabled () {
        return !isOneValue(this.filter.claimRelease)
      },
      sessionID () {
        return this.$store.state.auth.sessionID
      }
    },
  methods: {
    async deleteFilter () {
      const name = this.filter.name
      try {
        await this.$q.dialog({
          title: 'Видалення',
          message: `Ви дійсно бажаєте видалити фільтр «${name}»?`,
          cancel: {
            label: 'Ні',
            color: 'positive'
          },
          ok: {
            label: 'Так',
            color: 'negative'
          },
          color: 'secondary'
        })
        await this.$request.post(
          '/filters/delete',
          {
            sessionID: this.sessionID,
            rn: this.filter.rn
          }
        )
        this.$store.commit('filters/blockListUpdate', false)
        this.$router.back()
      } catch (e) {
      }
    },
    async saveFilter () {
      try {
        if (this.isAddMode) {
          const name = await this.promptFilterName()
          if (!this.checkNewFilterName(name)) {
            this.saveFilter()
            return
          }
          this.filter.name = name
        }
        void await this.postSave()
        this.$store.commit('filters/blockListUpdate', false)
        this.$router.back()
      } catch (e) {
      }
    },
    async saveAndApplyFilter () {
      try {
        const name = await this.promptFilterName()
        if (!this.checkNewFilterName(name)) return
        this.filter.name = name
        const newRn = await this.postSave()
        this.$store.dispatch('auth/setUserDataEntry', {key: 'LAST_COND', type: 'N', value: newRn})
        this.$store.commit('claims/blockListUpdate', false)
        this.$router.back()
      } catch (e) {
      }
    },
    async applyFilter () {
      try {
        await this.postSave()
        this.$store.dispatch('auth/setUserDataEntry', {key: 'LAST_COND', type: 'N', value: null})
        this.$store.commit('claims/blockListUpdate', false)
        this.$router.back()
      } catch (e) {
      }
    },
    async postSave () {
      try {
        const res = await this.$request.post(
          '/filters/save',
          {
            sessionID: this.sessionID,
            filter: this.filter
          }
        )
        if (this.isAddMode) this.$store.commit('filters/setNewFilterRn', res.data.rn)
        return res.data.rn
      } catch (e) {
      }
    },
    clearFilter () {
      this.filter = Object.assign(this.filter, this.$store.state.filters.emptyFilter)
    },
    versionChange (val) {
      if (!isOneValue(this.filter.claimVersion)) {
        this.filter.claimRelease = ''
        this.filter.claimBuild = ''
      }
    },
    releaseChange (val) {
      if (!isOneValue(this.filter.claimRelease)) {
        this.filter.claimBuild = ''
      }
    },
    imExecutorChange (val) {
      if (val) {
        this.filter.claimExecutor = ''
      }
    },
    imAuthorChange (val) {
      if (val) {
        this.filter.claimAuthor = ''
      }
    },
    async getEditedFilter () {
      try {
        const res = await this.$request.get(
          'filters/get-one',
          {
            sessionID: this.sessionID,
            rn: this.isEditMode ? this.$route.params.id : null
          }
        )
        this.filter = res.data
      } catch (e) {
        this.$router.back()
      }
    },
    checkNewFilterName (name) {
      if (!name) {
        this.$q.notify({
          message: 'Назва фільтра не може бути порожньою',
          type: 'negative'
        })
        return false
      }
      if (name !== this.filter.name && this.$store.getters['filters/filtersNames'].includes(name)) {
        this.$q.notify({
          message: `Назва «${name}» вже використовується для іншого фільтра.`,
          type: 'negative'
        })
        return false
      }
      return true
    },
    async renameFilter () {
      try {
        const name = await this.promptFilterName()
        if (this.checkNewFilterName(name)) {
          this.filter.name = name
        } else {
          this.renameFilter()
        }
      } catch (e) {
      }
    },
    async promptFilterName () {
      return this.$q.dialog({
        title: `Назва фільтру`,
        message: 'Введідь, будь ласка, назву фільтра:',
        prompt: {
          model: this.filter.name,
          type: 'text'
        },
        cancel: true
      })
    }
  },
  created () {
    if (!this.isAddMode) this.getEditedFilter()
  }
}
</script>

<style>
</style>

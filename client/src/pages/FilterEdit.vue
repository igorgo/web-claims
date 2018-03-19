<template>
  <q-page class="filter-edit-form">
    <afsc-form :title="actionTitle" :tabs="tabs" paneHeight="300px" :buttons="buttons">
      <div slot="header-actions" v-if="isEditMode">
        <span>{{'«' + filter.name + '»'}}</span>
        <q-btn round flat outline icon="edit" @click="renameFilter"></q-btn>
        <q-btn round flat outline icon="delete" @click="deleteFilter"></q-btn>
      </div>
      <div slot="tab-0">
        <div class="row q-pb-xs"><afsc-input class="col" label="Номер" v-model="filter.claimNumb" mandatory /></div>
        <div class="row q-py-xs"><afsc-select class="col" label="Тип" v-model="filter.claimType" :options="$routines.CLAIM_TYPE_OPTIONS" multiple /></div>
        <div class="row q-pt-xs"><afsc-select class="col" label="Поточний стан" v-model="filter.claimStatus" :options="statusOptions" multiple /></div>
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
      <div slot="tab-5">
        <div class="row q-py-xs"><afsc-input class="col" label="Номер" v-model="filter.claimContent" /></div>
      </div>
    </afsc-form>
  </q-page>
</template>

<script>
import GlobalKeyListener from '../components/mixins/GlobalKeyListener'
import {AfscForm, AfscInput, AfscSelect, AfscAutoComplete} from '../components'

export default {
  name: 'FilterEdit',
  data () {
    return {
      eventsMap: {},
      tabCount: 5,
      activeTabName: '',
      tabs: [
        'Реквізити',
        'Система',
        'Реліз',
        'Персони',
        'Зміст'
      ],
      buttons: [
        {
          label: 'OK'
        },
        {
          label: 'Очистити'
        },
        {
          label: 'Скасування',
          handler: () => {
            this.$router.back()
          }
        }
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
    AfscSelect
  },
  mixins: [GlobalKeyListener],
  computed:
    {
      actionTitle () {
        return `${this.isEditMode ? 'Редагування' : 'Додавання'} фільтра`
      },
      isEditMode () {
        return this.$route.params.mode === 'edit'
      },
      isAddMode () {
        return this.$route.params.mode === 'new'
      },
      statusOptions () {
        return this.$store.state.staticData.claimStatuses.map(i => ({ label: i, value: i }))
      },
      appsOptions () {
        return this.$store.state.staticData.appList.map(i => ({ label: i, value: i }))
      },
      unitOptions () {
        return this.$store.state.staticData.unitList.map(i => ({ label: i, value: i }))
      }
    },
  methods: {
    async getEditedFilter () {
      try {
        const res = await this.$request.get(
          'filters/get-one',
          {
            sessionID: this.$store.state.auth.sessionID,
            rn: this.$route.params.id
          }
        )
        this.filter = res.data
      } catch (e) {
        this.$router.back()
      }
    },
    async renameFilter () {
      try {
        const name = await this.promptFilterName()
        if (!name) {
          this.$q.notify({
            message: 'Назва фільтра не може бути порожньою',
            type: 'negative'
          })
          this.renameFilter()
          return
        }
        if (name !== this.filter.name) {
          if (this.$store.getters['filters/filtersNames'].includes(name)) {
            this.$q.notify({
              message: `Назва «${name}» вже використовується для іншого фільтра.`,
              type: 'negative'
            })
            this.renameFilter()
          } else {
            this.filter.name = name
          }
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
    },
    deleteFilter () {
      // todo: confirm and delete
      console.log('delete')
    }
  },
  created () {
    if (this.isEditMode) this.getEditedFilter()
  }
}
</script>

<style>
</style>

<template>
  <q-page class="filter-edit-form">
    <div>
      <div class="form-header row items-center">
        <div class="q-toolbar-title"><span>{{actionTitle}} фільтру </span><span v-if="isEditMode">dsfsdf</span></div>
        <div>
          <q-btn v-if="isEditMode" round flat outline icon="edit"></q-btn>
          <q-btn v-if="isEditMode" round flat outline icon="delete"></q-btn>
        </div>
      </div>
      <q-tabs no-ripple v-model="activeTabName" ref="tabs">
        <q-tab default alert slot="title" name="tab-1" label="Реквізити"/>
        <q-tab slot="title" name="tab-2" label="Система"/>
        <q-tab slot="title" alert name="tab-3" label="Реліз"/>
        <q-tab slot="title" name="tab-4" label="Персони"/>
        <q-tab slot="title" name="tab-5" label="Зміст"/>

        <q-tab-pane name="tab-1">
          id: {{$route.params.id}}
        </q-tab-pane>
        <q-tab-pane name="tab-2">
          mode: {{$route.params.mode}}
        </q-tab-pane>
        <q-tab-pane name="tab-3"></q-tab-pane>
        <q-tab-pane name="tab-4"></q-tab-pane>
        <q-tab-pane name="tab-5"></q-tab-pane>
      </q-tabs>
      <div class="form-footer row">
          <q-btn size="lg" no-caps outline label="OK" class="col q-mr-xs"/>
          <q-btn size="lg" no-caps outline label="Очистити" class="col q-mx-xs" @click="$router.back()"/>
          <q-btn size="lg" no-caps outline label="Скасування" class="col q-ml-xs" @click="$router.back()"/>
      </div>
    </div>
  </q-page>
</template>

<script>
import GlobalKeyListener from '../components/mixins/GlobalKeyListener'

export default {
  name: 'FilterEdit',
  data () {
    return {
      eventsMap: {
        'Ctrl+Tab': this.nextTab,
        'Ctrl+Shift+Tab': this.prevTab
      },
      tabCount: 5,
      activeTabName: ''
    }
  },
  mixins: [GlobalKeyListener],
  computed: {
    actionTitle () { return this.$route.params.mode === 'edit' ? 'Редагування' : 'Додавання' },
    isEditMode () { return this.$route.params.mode === 'edit' },
    isAddMode () { return this.$route.params.mode === 'new' },
    activeTab () {
      return parseInt(this.activeTabName ? this.activeTabName.slice(-1) : 1)
    }
  },
  methods: {
    nextTab () {
      // this.activeTabName =
      console.log(`tab-${this.activeTab === 5 ? 1 : this.activeTab + 1}`)
      this.$refs.tabs.selectTab(`tab-${this.activeTab === 5 ? 1 : this.activeTab + 1}`)
    },
    prevTab () {
      // this.activeTabName = 'tab-' + this.activeTab === 1 ? 5 : this.activeTab - 1
      console.log('tab-' + this.activeTab === 1 ? 5 : this.activeTab - 1)
      this.$refs.tabs.selectTab(`tab-${this.activeTab === 1 ? 5 : this.activeTab - 1}`)
    }
  }
}
</script>

<style>
</style>

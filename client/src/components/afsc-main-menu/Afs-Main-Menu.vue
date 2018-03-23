<template>
  <q-list
    no-border
    link
    inset-delimiter
  >
    <q-list-header><img style="max-width: 80%;opacity: 0.8;" src="~assets/afina_sql_col.svg"></q-list-header>
    <q-list-header class="text-center af-header-title" v-if="authorized">
      <q-icon style="font-size: 2em" name="bt-user"/>
      {{userFullName}}
    </q-list-header>
    <q-item v-if="!authorized" to="/login">
      <q-item-side icon="bt-sign-in"/>
      <q-item-main label="Вхід"/>
    </q-item>
    <q-item to="/main">
      <q-item-side icon="bt-home"/>
      <q-item-main label="Головна"/>
    </q-item>
    <q-item v-if="authorized" to="/filters">
      <q-item-side icon="bt-filter"/>
      <q-item-main label="Управління фільтрами"/>
    </q-item>
    <q-item v-if="authorized" to="/claims">
      <q-item-side icon="bt-issue"/>
      <q-item-main label="Рекламаціїї"/>
    </q-item>
    <q-item v-if="authorized" @click.native="logoff">
      <q-item-side icon="bt-sign-out"/>
      <q-item-main label="Вихід"/>
    </q-item>
  </q-list>
</template>

<script>
import {mapState} from 'vuex'

export default {
  name: 'afs-main-menu',
  computed: {
    ...mapState({
      authorized: state => state.auth.authorized,
      userFullName: state => state.auth.userFullName
    })
  },
  methods: {
    async logoff () {
      void await this.$store.dispatch('auth/logoff')
      this.$router.replace('/main')
    }
  }
}
</script>

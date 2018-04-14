<template>
  <q-page class="flex flex-center">
    <div style="max-width: 600px" class="relative-position">
      <div class="q-display-1 q-display-1-opacity">Вхід до системи</div>
      <div class="row q-my-sm">
        <afsc-input
          v-model="user"
          label="Ім'я користувача"
          class="col"
          mandatory
          autofocus
        />
      </div>
      <div class="row q-my-sm">
        <afsc-input
          type="password"
          v-model="pass"
          label="Пароль"
          class="col"
          mandatory
        />
      </div>
      <q-btn
        label="Вхід"
        color="primary"
        no-ripple
        style="width: 100%"
        @click="logon"
      />
    </div>
  </q-page>
</template>

<script>
import { GlobalKeyListener, AfscInput } from '../../components/index'

export default {
  name: 'LogOn',
  mixins: [GlobalKeyListener],
  components: {
    AfscInput
  },
  data () {
    return {
      user: '',
      pass: '',
      reqPending: false,
      keysMap: {
        'Enter': this.logon
      }
    }
  },
  methods: {
    async logon () {
      try {
        await this.$store.dispatch('auth/logon', { user: this.user, pass: this.pass })
        await this.$store.dispatch('auth/loadUserData')
        this.$router.back()
      } catch (e) {
      }
    }
  }
}
</script>

<style>
</style>

<template>
  <q-page class="flex flex-center">
    <div style="max-width: 600px">
      <!-- content -->
      <div class="q-display-1 q-display-1-opacity">Вхід до системи</div>
      <div class="row q-my-sm">
        <q-input
          type="text"
          v-model="user"
          stack-label="Ім'я користувача"
          class="col"
        />
      </div>
      <div class="row q-my-sm">
        <q-input
          type="password"
          v-model="pass"
          stack-label="Пароль"
          class="col"
        />
      </div>
      <q-btn
        label="Вхід"
        color="primary"
        style="width: 100%"
        @click="logon"
        :disable="reqPending"
      />
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'LogOn',
  data () {
    return {
      user: '',
      pass: '',
      reqPending: false
    }
  },
  methods: {
    async logon () {
      try {
        this.reqPending = true
        await this.$store.dispatch('auth/logon', { user: this.user, pass: this.pass })
        this.reqPending = false
        this.$router.back()
      } catch (e) {
        this.reqPending = false
      }
    }
  }
}
</script>

<style>
</style>

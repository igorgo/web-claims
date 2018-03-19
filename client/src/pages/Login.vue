<template>
  <q-page class="flex flex-center">
    <div style="max-width: 600px" class="relative-position">
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
        no-ripple
        style="width: 100%"
        @click="logon"
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
        await this.$store.dispatch('auth/logon', { user: this.user, pass: this.pass })
        this.$router.back()
      } catch (e) {
      }
    }
  }
}
</script>

<style>
</style>

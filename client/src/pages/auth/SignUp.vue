<template>
  <q-page class="flex flex-center">
    <div class="auth-content relative-position">
      <div class="q-display-1 q-display-1-opacity">Реєстрація в системі</div>
      <div class="row q-my-sm">
        <afsc-input
          v-model="userName"
          label="Ім'я користувача"
          class="col-12"
          mandatory
          autofocus
        />
      </div>
      <div class="row q-my-sm">
        <afsc-input
          v-model="eMail"
          type="email"
          label="Електронна адреса"
          class="col-12"
          mandatory
        />
      </div>
      <div class="row q-my-sm">
        <afsc-input
          v-model="lastName"
          label="Призвище"
          class="col-12"
          mandatory
        />
        <afsc-input
          v-model="firstName"
          label="Ім'я"
          class="col-12"
          mandatory
        />
        <afsc-input
          v-model="surName"
          label="По-батькові"
          class="col-12"
        />
      </div>
      <div class="row q-my-sm">
        <afsc-input
          v-model="employer"
          label="Відділ центрального офісу, або назва ДП"
          class="col-12"
          mandatory
        />
      </div>
      <q-btn
        label="Відправити заявку"
        :disable="!formValid"
        color="primary"
        no-ripple
        style="width: 100%"
        @click="sendApply"
      />
    </div>
  </q-page>
</template>

<script>
import {AfscInput} from '../../components'

export default {
  name: 'PageSignUp',
  components: {
    AfscInput
  },
  data () {
    return {
      userName: '',
      eMail: '',
      firstName: '',
      lastName: '',
      surName: '',
      employer: ''
    }
  },
  computed: {
    formValid () {
      return !!this.userName && !!this.eMail && !!this.firstName && !!this.lastName && !!this.employer
    }
  },
  methods: {
    sendApply () {}
  }
}
</script>

<style>
</style>

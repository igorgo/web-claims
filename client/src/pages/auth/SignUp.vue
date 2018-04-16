<template>
  <q-page class="flex flex-center">
    <div class="auth-content">
      <div v-if="checkError !== 0">
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
      <div class="auth-apply-error" v-if="checkError === 1">
        Користувач із вказаним ім'ям вже зареєстрований
      </div>
      <div class="auth-apply-error" v-if="checkError === 2">
        Користувач із вказаною електронною адресою вже зареєстрований
      </div>
      <div class="auth-apply-error" v-if="checkError === 3">
        Користувач із вказаним ім'ям та електронною адресою вже зареєстрований.<br/>
      </div>
      <div class="auth-apply-error" v-if="checkError === 4">
        Непередбачена помилка при відправленні заявки. Повторіть спробу пізніше.<br/>
      </div>
      <div class="q-headline q-headline-opacity text-justify" v-if="checkError === 0">
        <p>Дякуємо. Ваша заявка буде оброблена адміністраторами системи.</p>
        <p>Після обробки ви отримаєте електронний лист, з підтвердженням реєстрацію, та паролем для входу в систему.</p>
        <p>Термін розглядання заявки - до 2 робочих днів.</p>
      </div>
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
      employer: '',
      checkError: -1
    }
  },
  computed: {
    formValid () {
      return !!this.userName && !!this.eMail && !!this.firstName && !!this.lastName && !!this.employer
    }
  },
  methods: {
    async sendApply () {
      this.checkError = -1
      try {
        const res = await this.$request.post('/auth/send-reply', {
          userName: this.userName,
          eMail: this.eMail,
          firstName: this.firstName,
          lastName: this.lastName,
          surName: this.surName,
          employer: this.employer
        })
        this.checkError = res.data.check
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style>
</style>

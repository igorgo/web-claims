<template>
  <q-page class="page-form">
    <afsc-form
      title="Додавання файлів"
      pane-height="200px"
      :buttons="formButtons"
    >
      <div slot="form-body">
        <div class="row q-mb-xs">
          <q-uploader
            url=""
            :url-factory="makeUrl"
            hide-upload-button
            hide-upload-progress
            multiple
            auto-expand
            :additional-fields="[{
                  name: 'sessionID',
                  value: this.$store.state.auth.sessionID
                }]"
            @finish="onUploadFinish"
            ref="uploader"
            class="col"
          />
        </div>
      </div>
    </afsc-form>
  </q-page>
</template>

<script>
import GlobalKeyListener from '../../../components/mixins/GlobalKeyListener'
import {AfscForm} from '../../../components/index'
import { Loading, QSpinnerHourglass } from 'quasar'
export default {
  name: 'ClaimAttach',
  data () {
    return {
      keysMap: {
        'Escape': () => {
          if (document.activeElement.tagName === 'BODY') this.$router.back()
        }
      },
      fMounted: false
    }
  },
  mixins: [GlobalKeyListener],
  components: {
    AfscForm
  },
  computed: {
    formButtons () {
      return [
        {
          label: 'OK',
          handler: this.doAttach,
          disable: !this.formValid
        },
        {
          label: 'Скасування',
          handler: () => {
            this.$router.back()
          }
        }
      ]
    },
    id () {
      return parseInt(this.$route.params.id)
    },
    tt () { return this.$refs.hasOwnProperty('uploader') },
    tt2 () { return this.$refs.uploader.files.length },
    formValid () {
      return this.fMounted && !!this.$refs.uploader.files.length
    }
  },
  methods: {
    onUploadFinish () {
      this.$root.$emit('claim:attach:files:upladed')
    },
    async makeUrl (file) {
      return 'api/files/upload/' + this.id + '/' + this.$routines.b64encode(file.name)
    },
    async doAttach () {
      if (!this.formValid) return
      this.$store.commit('setRestProgress')
      Loading.show({
        spinner: QSpinnerHourglass,
        delay: 50
      })
      this.$root.$once('claim:attach:files:upladed', () => {
        this.$store.commit('claims/blockRecordUpdate', false)
        this.$store.commit('claims/blockListUpdate', false)
        this.$store.commit('unsetRestProgress')
        Loading.hide()
        this.$router.back()
      })
      this.$refs.uploader.upload()
    }
  },
  mounted () {
    this.fMounted = true
  }
}
</script>

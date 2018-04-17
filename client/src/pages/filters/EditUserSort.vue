<template>
  <q-page class="page-form">
    <afsc-form
      title="Персональне сортування"
      pane-height="200px"
      :buttons="formButtons"
    >
      <div slot="form-body">
        <div class="row q-pb-sm items-center" v-for="(sort, idx) in sorts" :key="`sort-${idx}`">
          <div class="col-5">
            <afsc-select
              v-model="sorts[idx].field"
              :options="fieldOptions"
              label="Поле"
            />
          </div>
          <div class="col-5 q-px-xs">
            <afsc-select
              class="col-4"
              v-model="sorts[idx].order"
              non-clearable
              :options="orderOptions"
              label="Порядок"
            />
          </div>
          <div class="col-1 text-center">
            <q-btn
              icon="add"
              dense
              outline
              color="primary"
              @click="onAddRow(idx)"
            />
          </div>
          <div class="col-1 text-center">
            <q-btn
              :disable="sorts.length < 2"
              icon="clear"
              dense
              outline
              color="negative"
              @click="onRemoveRow(idx)"
            />
          </div>
        </div>
      </div>
    </afsc-form>
  </q-page>
</template>

<script>
import GlobalKeyListener from '../../components/mixins/GlobalKeyListener'
import {AfscForm, AfscSelect} from '../../components/index'
import {QBtn} from 'quasar'

export default {
  name: 'EditUserSort',
  data () {
    return {
      keysMap: {
        'Escape': () => {
          if (document.activeElement.tagName === 'BODY') this.$router.back()
        }
      },
      sorts: [
        {
          field: '',
          order: 'ASC'
        }
      ],
      orderOptions: [
        {
          label: 'за зростанням',
          value: 'ASC'
        },
        {
          label: 'за зменшенням',
          value: 'DESC'
        }
      ],
      fieldOptions: [
        {
          label: 'Автор',
          value: 'INITIATOR'
        },
        {
          label: 'Виконавець',
          value: 'EXECUTOR'
        },
        {
          label: 'Дата зміни',
          value: 'CHANGE_DATE'
        },
        {
          label: 'Дата реєстрації',
          value: 'REG_DATE'
        },
        {
          label: 'Номер',
          value: 'EVENT_NUMB'
        },
        {
          label: 'Поточний стан',
          value: 'EVNSTAT_CODE'
        },
        {
          label: 'Пріоритет',
          value: 'PRIORITY'
        },
        {
          label: 'Реліз виконання',
          value: 'RELEASE_TO'
        },
        {
          label: 'Тип',
          value: 'EVENT_TYPE'
        }
      ],
      formButtons: [
        {
          label: 'OK',
          handler: this.saveUserSort
        },
        {
          label: 'Скасування',
          handler: () => {
            this.$router.back()
          }
        }
      ]
    }
  },
  mixins: [GlobalKeyListener],
  components: {
    AfscForm,
    AfscSelect,
    QBtn
  },
  computed: {
    userClaimSort () {
      return this.$store.getters['claims/userClaimSort']
    }
  },
  methods: {
    saveUserSort () {
      const parts = []
      this.sorts.forEach(s => {
        if (s.field) parts.push(s.field + ' ' + s.order)
      })
      this.$store.dispatch('auth/setUserDataEntry', {key: 'USER_SORT', type: 'S', value: parts.join(',')})
      this.$store.dispatch('claims/setCurrentSort', 100)
      this.$router.back()
    },
    onRemoveRow (idx) {
      if (this.sorts.length < 2) return
      this.sorts.splice(idx, 1)
    },
    onAddRow (idx) {
      this.sorts.splice(idx + 1, 0, { field: '', order: 'ASC' })
    }
  },
  mounted () {
    const sortParts = this.userClaimSort.split(',')
    if (sortParts.length) {
      this.sorts = sortParts.map(p => {
        const parts = p.split(' ')
        return parts.length === 2 ? { field: parts[0], order: parts[1] } : { field: '', order: 'ASC' }
      })
    }
  }
}
</script>

<style>
</style>

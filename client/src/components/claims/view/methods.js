import {scroll} from 'quasar'

export default {
  methods: {
    requestRecord () {
      this.$store.dispatch('claims/getClaimRecord', this.id)
    },
    async goToPrevRecord () {
      const newId = await this.$store.dispatch('claims/viewPrevClaim')
      if (newId) {
        this.$router.replace('/claim/view/' + newId)
        this.requestRecord()
      }
    },
    async goToNextRecord () {
      const newId = await this.$store.dispatch('claims/viewNextClaim')
      if (newId) {
        this.$router.replace('/claim/view/' + newId)
        this.requestRecord()
      }
    },
    backToList () {
      this.$router.back()
    },
    navResized (size) {
      this.isNavButtonLabeled = size.width > 500
    },
    getButtonLabel (title) {
      return this.isNavButtonLabeled ? title : ''
    },
    async downloadFile (id) {
      const res = await this.$request.down('/files/get-one', {
        sessionID: this.$store.state.auth.sessionID,
        id
      })
      this.$routines.saveFile(res.data, Buffer.from(res.headers['x-file-name'], 'base64').toString('utf8'), res.headers['content-type'])
    },
    async deleteFile (idx) {
      const file = this.$store.state.claims.claimFiles[idx]
      try {
        await this.$q.dialog({
          title: 'Видалення',
          message: `Ви дійсно бажаєте видалити файл «${file.path}»?`,
          cancel: {
            label: 'Ні',
            color: 'positive'
          },
          ok: {
            label: 'Так',
            color: 'negative'
          },
          color: 'secondary'
        })
        await this.$request.post(
          '/files/delete',
          {
            sessionID: this.$store.state.auth.sessionID,
            id: file.id
          }
        )
        this.$store.commit('claims/deleteFile', idx)
      } catch (e) {
      }
    },
    editComment (id) {
      // todo: editComment
      console.log('todo: editComment')
    },
    async doAction (actionCode) {
      switch (actionCode) {
        case 'delete':
          try {
            await this.$q.dialog({
              title: 'Видалення',
              message: `Ви дійсно бажаєте видалити рекламацію «${this.fullNo}»?`,
              cancel: {
                label: 'Ні',
                color: 'positive'
              },
              ok: {
                label: 'Так',
                color: 'negative'
              },
              color: 'secondary'
            })
            await this.$request.post('/claims/delete', {
              sessionID: this.$store.state.auth.sessionID,
              id: this.id
            })
            this.$store.commit('claims/blockListUpdate', false)
            this.$router.back()
          } catch (e) {}
          break
        case 'edit':
          this.$router.push('/claim/edit/' + this.id)
          break
        case 'status':
          this.$router.push('/claim/change-status/' + this.id)
          break
        case 'return':
          this.$router.push('/claim/return/' + this.id)
          break
        case 'assign':
          this.$router.push('/claim/send-to/' + this.id)
          break
        case 'attach':
          this.$router.push('/claim/attach/' + this.id)
          break
        case 'annul':
          await this.$q.dialog({
            title: 'Анулювання',
            message: `Ви дійсно бажаєте анулювати рекламацію «${this.fullNo}»?`,
            cancel: {
              label: 'Ні',
              color: 'positive'
            },
            ok: {
              label: 'Так',
              color: 'negative'
            },
            color: 'secondary'
          })
          await this.$request.post('/claims/anull', {
            sessionID: this.$store.state.auth.sessionID,
            id: this.id
          })
          this.$store.commit('claims/blockRecordUpdate', false)
          this.$store.commit('claims/blockListUpdate', false)
          this.requestRecord()
          break
        case 'comment':
          this.$router.push('/claim/comment/' + this.id)
          break
        case 'prioritize':
          this.setNewPriority()
          break
        case 'setHelpNeed':
          // todo: this.$router.push('/claim/setHelpNeed/' + this.id)
          break
        case 'setHelpStatus':
          // todo: this.$router.push('/claim/setHelpStatus/' + this.id)
          break
        default: console.log(`todo: doAction( ${actionCode} )`)
      }
      // todo: doAction
    },
    async promptNewPriority () {
      return this.$q.dialog({
        title: `Зміна пріоритета`,
        message: 'Введідь, будь ласка, пріоритет (1-10):',
        prompt: {
          model: this.newPriority,
          type: 'number'
        },
        cancel: true
      })
    },
    async setNewPriority () {
      try {
        this.newPriority = this.record.priority
        const priority = await this.promptNewPriority()
        if (priority > 0 && priority < 11) {
          if (this.record.priority !== priority) {
            try {
              await this.$request.post('/claims/set-priority', {
                sessionID: this.$store.state.auth.sessionID,
                id: this.id,
                priority
              })
              this.$store.commit('claims/blockRecordUpdate', false)
              this.$store.commit('claims/blockListUpdate', false)
              this.requestRecord()
            } catch (e) {
              console.log(e)
            }
            console.log(priority)
          }
        } else {
          this.setNewPriority()
        }
      } catch (e) {
      }
    },
    onPanning (obj) {
      if (obj.isFinal) {
        if (obj.direction === 'left') this.goToNextRecord()
        else this.goToPrevRecord()
      }
    },
    onScrollDown () {
      this.__scroll(true)
    },
    onScrollUp () {
      this.__scroll(false)
    },
    __scroll (down) {
      const target = scroll.getScrollTarget(this.$refs['FieldsInfo'])
      if (target) {
        scroll.setScrollPosition(target, scroll.getScrollPosition(target) + (down ? 50 : -50))
      }
    }
  }
}

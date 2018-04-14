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
      // todo: doAction
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
          // todo: this.$router.push('/claim/assign/' + this.id)
          break
        case 'annul':
          // todo: this.$router.push('/claim/annul/' + this.id)
          break
        case 'comment':
          // todo: this.$router.push('/claim/comment/' + this.id)
          break
        case 'attach':
          // todo: this.$router.push('/claim/attach/' + this.id)
          break
        case 'prioritize':
          // todo: this.$router.push('/claim/prioritize/' + this.id)
          break
        case 'setHelpNeed':
          // todo: this.$router.push('/claim/setHelpNeed/' + this.id)
          break
        case 'setHelpStatus':
          // todo: this.$router.push('/claim/setHelpStatus/' + this.id)
          break
        default: console.log(`todo: doAction( ${actionCode} )`)
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

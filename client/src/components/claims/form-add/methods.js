export default {
  methods: {
    async doAddClaim () {
      // todo: 'doAddClaim'
      console.log('doAddClaim')
      console.log(this.$refs.files)
      try {
        const res = await this.$request.post('/claims/add', {
          sessionID: this.$store.state.auth.sessionID,
          cType: this.cType,
          cPriority: this.cPriority,
          cSend: this.cSend ? 1 : 0,
          cInit: this.cAuthor >= 0 ? this.$store.state.staticData.personList[this.cAuthor].value : null,
          cApp: this.cApp.join(';'),
          cUnit: this.cUnit,
          cFunc: this.cFunc.join(';'),
          cContent: this.cContent,
          cRelFrom: this.cRelFrom,
          cBldFrom: this.cBldFrom,
          cRelTo: this.cRelTo
        })
        this.claimId = res.data.id
        this.$store.commit('claims/blockListUpdate', false)
        const uploader = this.$refs.files
        if (uploader.files.length) {
          this.$root.$once('claim:add:files:upladed', () => {
            this.$router.replace('/claim/view/' + this.claimId)
          })
          this.$refs.files.upload()
        } else {
          this.$router.replace('/claim/view/' + this.claimId)
        }
      } catch (e) {
        console.error(e)
      }
    }
  }
}

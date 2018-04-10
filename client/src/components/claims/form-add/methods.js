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
          cInit: this.cAuthor >= 0 ? this.$store.state.staticDicts.allPersons[this.cAuthor].code : null,
          cApp: this.cApps.join(';'),
          cUnit: this.cUnit,
          cFunc: this.cFunc.join(';'),
          cContent: this.cContent,
          cRelFrom: this.cRelFrom,
          cBldFrom: this.cBldFrom,
          cRelTo: this.cRelTo
        })
        this.claimId = res.data
        this.$router.replace('/claim/view/' + this.claimId)
        // this.$refs.files.upload()
      } catch (e) {
      }
    }
  }
}

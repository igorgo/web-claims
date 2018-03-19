<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import keyMapper from './plugins/routines/keyMapper'

export default {
  name: 'App',
  methods: {
    globalKeyListener (event) {
      // event.preventDefault()
      if (event.metaKey) return
      let shortcutCode = ''
      if (event.ctrlKey) shortcutCode += 'Ctrl+'
      if (event.shiftKey) shortcutCode += 'Shift+'
      if (event.altKey) shortcutCode += 'Alt+'
      shortcutCode += event.key

      if (keyMapper.includes(shortcutCode)) {
        // console.log('match ' + shortcutCode)
        this.$root.$emit('globalKey:' + shortcutCode)
      } else {
        // console.log('miss ' + shortcutCode)
      }
      // event.preventDefault()
      // this.$q.events.$emit(keyMapper[event.keyCode][modifiers])
    }
  },
  created () {
    window.addEventListener('keydown', this.globalKeyListener)
  },
  beforeDestroy () {
    window.removeEventListener('keydown', this.globalKeyListener)
  }
}
</script>

<style>
</style>

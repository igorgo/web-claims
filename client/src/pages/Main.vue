<template>
  <q-page class="q-pa-md">
    <div>
      <div class="row relative-position q-mb-sm">
        <div class="q-headline text-primary col q-px-xs"><span>Поточні релізи</span></div>
        <div class="text-primary col q-px-xs"><q-btn v-if="releasesLoaded" class="float-right" flat size="md" round icon="autorenew" @click="loadCurReleases(true)"/></div>
      </div>
      <div class="row relative-position overflow-hidden q-pa-sm">
        <div class="q-px-xs col-md col-sm-12">
          <transition
            appear
            enter-active-class="animated bounceInLeft"
            leave-active-class="animated bounceOutLeft"
          >
            <afs-release-card v-show="releasesLoaded" :rtype="'stable'"></afs-release-card>
          </transition>
        </div>
        <div class="q-px-xs col-md col-sm-12">
          <transition
            appear
            enter-active-class="animated bounceInRight"
            leave-active-class="animated bounceOutRight"
          >
            <afs-release-card v-show="releasesLoaded" :rtype="'beta'"></afs-release-card>
          </transition>
        </div>
        <!--af-load-cover :progress="isActionInProgress"/-->
      </div>
    </div>
  </q-page>
</template>

<style>
</style>

<script>
import {AfsReleaseCard} from '../components'

export default {
  name: 'MainPage',
  components: {
    AfsReleaseCard
  },
  methods: {
    loadCurReleases (force = false) {
      this.$store.dispatch('main/getCurrentReleases', force)
    }
  },
  computed: {
    releasesLoaded () {
      return this.$store.state.main.releasesLoaded
    }
  },
  created () {
    this.loadCurReleases()
  }
}
</script>

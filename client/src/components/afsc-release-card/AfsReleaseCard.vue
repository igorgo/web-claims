<template>
  <q-card>
    <q-card-title
      :class="'text-' + rColor"
    >
      <div>{{rtype === 'stable' ? 'Стабільниий' : 'Бета'}}</div>
      <div slot="subtitle" class="overflow-hidden">
        <!--transition
        appear
        :enter-active-class="`animated bounceIn`"
        :leave-active-class="`animated bounceOut`"
        -->
          <div
            class="text-dark"
          >
            {{rData['releaseName']}} (розпочато {{rData['releaseDate']}})
          </div>
        <!--/transition-->
      </div>
    </q-card-title>
    <q-card-main class="overflow-hidden">
      <!--transition
        appear
        :enter-active-class="`animated bounceIn${bounceDir}`"
        :leave-active-class="`animated bounceOut${bounceDir}`"
      -->
        <div class="text-dark">
          <table style="margin-bottom: 10px;">
            <tr>
              <td class="text-bold">Відкритих рекламацій:</td>
              <td class="text-right q-pl-sm">{{rData['openedIssues']}}</td>
            </tr>
            <tr>
              <td class="text-bold">Закрито рекламацій:</td>
              <td class="text-right q-pl-sm">{{rData['closedIssues']}}</td>
            </tr>
          </table>
          <div v-if="rData.lastBuildNumber">
            <p>Остання збірка: {{rData['lastBuildNumber']}} від {{rData['lastBuildDate']}}</p>
            <p><a :href="rtype === 'stable' ? stableUrl : betaUrl" target="_blank">Завантажити з Google диску</a></p>
          </div>
          <div v-else>Збірка не здійснювалась</div>
        </div>
      <!--/transition-->
    </q-card-main>
  </q-card>
</template>

<script>
const STABLE_DOWNLOAD_URL = 'https://drive.google.com/drive/folders/0B0TYk3GHDWmebTVVdC1zRVJOWVk'
const BETA_DOWNLOAD_URL = 'https://drive.google.com/drive/folders/0B0TYk3GHDWmeQWhUdmJSalV5WGc'

export default {
  name: 'afs-release-card',
  props: {
    rtype: {
      type: String
    }
  },
  data () {
    return {
      stableUrl: STABLE_DOWNLOAD_URL,
      betaUrl: BETA_DOWNLOAD_URL
    }
  },
  computed: {
    rData () {
      return this.$store.state.main[`${this.rtype}Release`]
    },
    bounceDir () {
      return this.rtype !== 'beta' ? 'Left' : 'Right'
    },
    loaded () {
      return this.$store.state.main.releasesLoaded
    },
    rColor () {
      return this.rtype !== 'beta' ? 'green' : 'amber'
    }
  }
}
</script>

<style>
</style>

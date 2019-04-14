<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'App',
  computed: {
    ...mapGetters([
      'token'
    ])
  },
  mounted() {
    if (this.token) {
      this.$socket.init(this.token)
    }
  }
}
</script>

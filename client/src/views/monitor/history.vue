<template>
  <div class="app-container">
    <div style="margin-bottom: 8px">
      <monitor-selector
        :selected="monitor_id"
        @on-select="onMonitorChange"/>
    </div>
  </div>
</template>

<script>
import { geResponses } from '@/api/response'

import MonitorSelector from '@/components/Monitor/MonitorSelector'

export default {
  components: {
    MonitorSelector
  },
  data() {
    return {
      loading: false,
      monitor_id: null,
      type: null,
      start_date: null,
      end_date: null,
      page: 1,
      per_page: 40,
      total: 0,
      data: []
    }
  },
  mounted() {
    if (this.$route.query.id) {
      this.monitor_id = this.$route.query.id
      this.getData(true)
    }
  },
  methods: {
    onMonitorChange(id) {
      this.monitor_id = id
      this.getData(true)
    },
    getData(force = false) {
      this.loading = true
      geResponses({
        page: this.page,
        per_page: this.per_page,
        monitor_ids: this.monitor_id,
        type: this.type,
        start_date: this.start_date,
        end_date: this.end_date
      }).then(res => {
        this.loading = false
        this.total = res.data.total
        this.data = res.data.data
      }).catch(err => {
        this.loading = false
        console.log(err)
      })
    }
  }
}
</script>

<style>

</style>

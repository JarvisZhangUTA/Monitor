<template>
  <el-dropdown>
    <el-button size="mini">
      {{ selected ? selected : 'Pick up a monitor' }}
      <i class="el-icon-arrow-down el-icon--right"/>
    </el-button>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item
        v-for="monitor in monitors"
        :key="monitor.monitor_id"
        @click.native="onSelect(monitor.monitor_id)">
        {{ monitor.monitor_id }}
      </el-dropdown-item>
      <el-dropdown-item
        v-if="monitors.length < total"
        @click.native="getData">
        Load More
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { getMonitorList } from '@/api/monitor'

export default {
  props: {
    selected: { type: [Number, String], default: null }
  },
  data() {
    return {
      page: 0,
      total: 0,
      monitors: []
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      getMonitorList({
        page: this.page + 1,
        per_page: 20
      }).then(res => {
        this.page = this.page + 1
        this.monitors = res.data.data
        this.total = res.data.total
        if (!this.selected && this.monitors.length > 0) { this.onSelect(this.monitors[0].monitor_id) }
      }).catch(err => {
        console.log(err)
      })
    },
    onSelect(id) {
      this.$emit('on-select', id)
    }
  }
}
</script>

<style>

</style>

<template>
  <el-dialog
    :visible.sync="visible"
    title="Create a Monitor"
  >
    <el-form ref="form" :model="monitor" label-width="80px">
      <el-form-item label="ID">
        <el-input
          v-model="monitor.monitor_id"
          size="mini"/>
      </el-form-item>
      <el-form-item label="SECRET">
        <el-input
          v-model="monitor.secret"
          size="mini"/>
      </el-form-item>
      <el-form-item>
        <el-button
          size="mini"
          type="success"
          @click="confirm">
          Confirm
        </el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>

import { linkMonitor } from '@/api/monitor'

export default {
  data() {
    return {
      loading: false,
      visible: false,
      monitor: {
        monitor_id: '',
        secret: ''
      }
    }
  },
  methods: {
    show() {
      this.visible = true
    },
    confirm() {
      if (!this.monitor.monitor_id) {
        this.$message('ID Required')
        return
      }
      if (!this.monitor.secret) {
        this.$message('Secret Required')
        return
      }

      this.loading = true
      linkMonitor(this.monitor).then(res => {
        this.loading = false
        this.monitor = { monitor_id: '', secret: '' }
        this.visible = false
        this.$emit('on-link', res.data)
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style>

</style>

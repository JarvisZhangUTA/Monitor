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
      <el-form-item label="Serial Num">
        <el-input
          v-model="monitor.serial_num"
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

import { createMonitor } from '@/api/monitor'

export default {
  data() {
    return {
      loading: false,
      visible: false,
      monitor: {
        monitor_id: '',
        serial_num: ''
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
      if (!this.monitor.serial_num) {
        this.$message('Serial Num Required')
        return
      }

      this.loading = true
      createMonitor(this.monitor).then(res => {
        this.loading = false
        this.monitor = { monitor_id: '', serial_num: '' }
        this.visible = false
        this.$emit('on-create', res.data)
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style>

</style>

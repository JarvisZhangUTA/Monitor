<template>
  <el-dialog
    :visible.sync="visible"
    title="Create a Command"
  >
    <el-form ref="form" :model="command" label-width="80px">
      <el-form-item label="Name">
        <el-input
          v-model="command.name"
          size="mini"/>
      </el-form-item>
      <el-form-item label="Command">
        <el-input
          v-model="command.command"
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

import { createCommand } from '@/api/command'

export default {
  data() {
    return {
      loading: false,
      visible: false,
      command: {
        user_id: '',
        name: '',
        command: ''
      }
    }
  },
  methods: {
    show(user_id) {
      this.visible = true
      this.command.user_id = user_id
    },
    confirm() {
      if (!this.command.name) {
        this.$message('Name Required')
        return
      }
      if (!this.command.command) {
        this.$message('Command Required')
        return
      }

      this.loading = true
      createCommand(this.command).then(res => {
        this.loading = false
        this.command = { name: '', command: '' }
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

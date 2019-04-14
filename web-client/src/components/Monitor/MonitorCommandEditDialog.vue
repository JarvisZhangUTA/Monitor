<template>
  <el-dialog
    v-if="monitor"
    :visible.sync="visible"
    title="Edit Command"
  >

    <div style="margin-bottom: 8px">
      <el-popover
        v-if="user_commands.length > 0"
        ref="MyCommandsPopover"
        placement="bottom"
        title="My Commands"
        width="200"
        trigger="click">
        <div
          v-for="command in user_commands"
          :key="command._id"
          class="pointer"
          @click="addCommand(command)">
          <div class="fs-large fc-primary">
            {{ command.name }}
          </div>
          <div class="fs-regular fc-regular">
            {{ command.command }}
          </div>
        </div>
        <el-button slot="reference" size="mini">
          My Commands
        </el-button>
      </el-popover>

      <el-popover
        v-if="all_commands.length > 0"
        ref="PublicCommandsPopover"
        placement="bottom"
        title="Public Commands"
        width="200"
        trigger="click">
        <div
          v-for="command in all_commands"
          :key="command._id"
          class="pointer"
          @click="addCommand(command)">
          <div class="fs-large fc-primary">
            {{ command.name }}
          </div>
          <div class="fs-regular fc-regular">
            {{ command.command }}
          </div>
        </div>
        <el-button slot="reference" size="mini">
          Public Commands
        </el-button>
      </el-popover>
    </div>

    <table
      class="normal-table">
      <thead>
        <tr>
          <th> Name </th>
          <th> Command </th>
          <th/>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(command, idx) in monitor.config.COMMANDS" :key="idx">
          <td>
            <input v-model="command.name" class="input-no-border" placeholder="Name">
          </td>
          <td>
            <input v-model="command.command" class="input-no-border" placeholder="Command">
          </td>
          <td style="text-align: center">
            <i
              class="pointer el-icon-error color-red"
              @click="delCommand(idx)"
            />
          </td>
        </tr>

        <tr>
          <td>
            <input v-model="new_command.name" class="input-no-border" placeholder="Name">
          </td>
          <td>
            <input v-model="new_command.command" class="input-no-border" placeholder="Command">
          </td>
          <td style="text-align: center">
            <i
              class="pointer el-icon-circle-plus color-green"
              @click="addCommand(null)"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </el-dialog>
</template>

<script>
import { getCommands } from '@/api/command'

export default {
  data() {
    return {
      all_commands: [],
      user_commands: [],
      loading: false,
      visible: false,
      monitor: null,
      new_command: { name: '', command: '' }
    }
  },
  mounted() {
    getCommands().then(res => {
      this.all_commands = res.data
    })
    if (this.$store.state.user._id) {
      getCommands({ user_id: this.$store.state.user._id }).then(res => {
        this.user_commands = res.data
      })
    }
  },
  methods: {
    show(monitor) {
      if (!monitor) {
        return
      }
      if (!monitor.config) {
        monitor.config = {}
      }
      if (!monitor.config.COMMANDS) {
        monitor.config.COMMANDS = []
      }
      this.monitor = JSON.parse(JSON.stringify(monitor))
      this.visible = true
    },
    addCommand(command) {
      if (!command) {
        command = this.new_command
      }

      if (!command.name) {
        return this.$message.error('Name Required')
      }

      if (!command.command) {
        return this.$message.error('Command Required')
      }

      if (this.$refs.MyCommandsPopover) {
        this.$refs.MyCommandsPopover.doClose()
      }

      if (this.$refs.PublicCommandsPopover) {
        this.$refs.PublicCommandsPopover.doClose()
      }

      this.monitor.config.COMMANDS.push(command)

      this.$emit('on-confirm', this.monitor)
    },
    delCommand(idx) {
      if (!this.monitor.config.COMMANDS[idx]) {
        return
      }
      this.monitor.config.COMMANDS.splice(idx, 1)
      this.$emit('on-confirm', this.monitor)
    }
  }
}
</script>

<style>

</style>

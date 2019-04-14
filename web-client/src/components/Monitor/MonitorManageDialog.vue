<template>
  <el-dialog
    :visible.sync="visible"
    @close="close">
    <div class="message-section">
      <component
        v-for="(message, idx) in messages"
        :key="idx"
        :is="messageMap[message.type]"
        :message="message"
        style="margin-bottom: 4px"/>
    </div>
    <div>
      <el-input v-model="command" placeholder="Command" class="input-with-select">
        <command-selector slot="prepend" @on-select="onCommandSelect"/>
        <el-button slot="append" icon="el-icon-check" @click="sendCommand"/>
      </el-input>
    </div>
  </el-dialog>
</template>

<script>
import CommandSelector from '@/components/Command/CommandSelector'
import ResponseMessage from '@/components/Message/ResponseMessage'
import CommandResponseMessage from '@/components/Message/CommandResponseMessage'

export default {
  components: {
    CommandSelector,
    ResponseMessage,
    CommandResponseMessage
  },
  data() {
    return {
      command: '',
      visible: false,
      monitor_id: null,
      messages: [],
      messageMap: {
        command_response: 'CommandResponseMessage',
        response: 'ResponseMessage'
      }
    }
  },
  methods: {
    show(monitor_id) {
      this.monitor_id = monitor_id
      this.visible = true
      this.$socket.subscribe(this)
    },
    close() {
      this.$socket.unsubscribe(this)
      this.monitor_id = null
      this.messages = []
    },
    onCommandSelect(command) {
      this.command = command
    },
    sendCommand() {
      if (!this.command) { return }
      this.$socket.sendMessage({ type: 'command', data: this.command, send_to: this.monitor_id })
      this.command = ''
    },
    onMessage(message) {
      this.messages.push(message)
      this.scrollBottom()
    },
    scrollBottom() {
      const messageSection = this.$el.querySelector('.message-section')
      if (messageSection) {
        messageSection.scrollTop = messageSection.scrollHeight
      }
    }
  }
}
</script>

<style scoped>
  .message-section {
    height: 500px;
    margin-bottom: 8px;
    overflow-y: auto;
    border: 1px solid #F6F6F6;
    border-radius: 8px;
    padding: 8px;
  }
</style>

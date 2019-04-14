<template>
  <el-alert
    :closable="false"
    type="success">
    <div class="cursor-pointer" @click="showFullMessage">
      {{ message.data.type }} Invertor: {{ message.data.device_address }} <span class="fw-bolder"> Show Full Message </span>
    </div>
    <transition name="el-zoom-in-top">
      <div v-if="show_full_message" class="response-card">
        <div v-html="jsonPretty(message.data)"/>
      </div>
    </transition>
    <div class="fs-small">
      Monitor ID {{ message.monitor_id }} Date {{ message.data.date.substring(0, 10) }} {{ message.data.date.substr(12, 18) }}
    </div>
  </el-alert>
</template>

<script>
import Pretty from 'json-pretty-html'

export default {
  props: {
    message: { type: Object, default: () => {} }
  },
  data() {
    return {
      show_full_message: false
    }
  },
  methods: {
    showFullMessage() {
      this.show_full_message = !this.show_full_message
    },
    jsonPretty(json) {
      return Pretty(json)
    }
  }
}
</script>

<style scoped>
.response-card {
  background: #303133;
  color: #FFF;
  word-break: break-all;
  font-size: 14px;
  line-height: 25px;
  max-height: 200px;
  overflow-y: auto;
  padding: 8px;
  margin: 4px 0;
  border-radius: 4px;
}
</style>

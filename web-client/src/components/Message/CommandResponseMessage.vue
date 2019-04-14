<template>
  <el-alert
    :closable="false"
    type="info">
    <div>
      {{ message.data }}
    </div>
    <div class="fs-small">
      Monitor ID {{ message.monitor_id }}
    </div>
  </el-alert>
</template>

<script>
export default {
  props: {
    message: { type: Object, default: () => {} }
  }
}
</script>

<style>

</style>

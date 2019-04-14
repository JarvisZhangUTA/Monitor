<template>
  <el-dropdown
    trigger="click"
    @command="(command) => $emit('on-select', command)">
    <a class="cursor-pointer">
      Select Template <i class="el-icon-caret-bottom"/>
    </a>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item
        v-for="command in user_commands"
        :key="command._id"
        :command="command.command">
        <div> {{ command.name }} </div>
        <div class="color-blue fs-small"> {{ command.command }} </div>
      </el-dropdown-item>
      <el-dropdown-item
        v-for="command in all_commands"
        :key="command._id"
        :command="command.command">
        <div> {{ command.name }} </div>
        <div class="color-blue fs-small"> {{ command.command }} </div>
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { getCommands } from '@/api/command'

export default {
  data() {
    return {
      all_commands: [],
      user_commands: []
    }
  },
  mounted() {
    this.getCommands()
  },
  methods: {
    getCommands() {
      getCommands().then(res => {
        this.all_commands = res.data
      })
      if (this.$store.state.user._id) {
        getCommands({ user_id: this.$store.state.user._id }).then(res => {
          this.user_commands = res.data
        })
      }
    }
  }
}
</script>

<style>

</style>

<template>
  <div class="app-container">
    <div style="margin-bottom: 8px">
      <el-select
        v-model="user_id"
        :remote-method="getUsers"
        :loading="user_loading"
        filterable
        remote
        reserve-keyword
        placeholder="Find By User"
        size="mini"
        class="commands-search-input"
        @change="getData">
        <el-option
          label="-"
          value=""
        />
        <el-option
          v-for="user in users"
          :key="user._id"
          :label="user.email"
          :value="user._id"/>
      </el-select>

      <div style="float: right; padding: 2px 0;">
        <el-button
          size="mini"
          type="success"
          @click="() => $refs.CommandCreateDialog.show(-1)">
          Add a Command
        </el-button>
      </div>
    </div>

    <el-table
      v-loading="loading"
      :data="commands"
      element-loading-text="loading"
      border
      fit
      highlight-current-row>
      <!-- INDEX -->
      <el-table-column
        :index="1"
        type="index"/>
      <!-- Name -->
      <el-table-column
        prop="name"
        label="Name"/>
      <!-- Command -->
      <el-table-column
        prop="command"
        label="Command"/>
      <!-- Options -->
      <el-table-column
        width="100px"
        label="Options">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            @click="deleteCommand(scope.row)">
            DELETE
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <command-create-dialog
      ref="CommandCreateDialog"
      @on-create="onCommandCreate"
    />
  </div>
</template>

<script>
import { getCommands, deleteCommand } from '@/api/command'
import { getUserList } from '@/api/user'

import CommandCreateDialog from '@/components/Command/CommandCreateDialog'

export default {
  components: {
    CommandCreateDialog
  },
  data() {
    return {
      user_id: '',
      user_loading: false,
      users: [],

      loading: false,
      commands: []
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      getCommands({
        user_id: this.user_id
      }).then(res => {
        this.commands = res.data
      })
    },
    onCommandCreate(command) {
      this.commands.unshift(command)
    },
    getUsers(keyword) {
      if (!keyword) {
        return
      }
      this.user_loading = true
      getUserList({
        email: keyword
      }).then(res => {
        this.user_loading = false
        this.users = res.data.data

        console.log(this.users)
      })
    },
    deleteCommand(command) {
      if (!command) {
        return
      }
      deleteCommand(command._id).then(res => {
        const index = this.commands.findIndex(item => item._id === command._id)
        if (index > -1) {
          this.commands.splice(index, 1)
        }
      })
    }
  }
}
</script>

<style scoped>
  .commands-search-input {
    width: 200px;
    padding: 2px 0;
  }
</style>

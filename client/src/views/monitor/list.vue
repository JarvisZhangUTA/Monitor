<template>
  <div class="app-container">
    <div style="margin-bottom: 8px">
      <div style="float: right; padding: 2px 0;">
        <el-button
          size="mini"
          type="success"
          @click="() => $refs.MonitorLinkDialog.show()">
          Add a Montior
        </el-button>
      </div>

      <el-pagination
        :current-page="page"
        :page-size="per_page"
        :total="total"
        background
        layout="prev, pager, next, total"
        style="display: inline-block"
        @current-change="pageChange"
      />

      <el-pagination
        :page-size="per_page"
        :page-sizes="[20, 40, 100, 200]"
        layout="sizes"
        style="float: right; display: inline-block"
        @size-change="perPageChange"
      />
    </div>

    <el-table
      v-loading="loading"
      :data="monitors"
      element-loading-text="loading"
      border
      fit
      highlight-current-row>

      <!-- INDEX -->
      <el-table-column
        align="center"
        type="index">
        <template slot-scope="scope">
          <svg-icon
            :class="online_monitors.indexOf(scope.row.monitor_id) > -1 ? 'color-green' : ''"
            icon-class="circle"
            class="right-float"/>
        </template>
      </el-table-column>
      <!-- ID -->
      <el-table-column
        label="ID">
        <template slot-scope="scope">
          <el-tooltip :content="scope.row._id" placement="right">
            <span> {{ scope.row.monitor_id }} </span>
          </el-tooltip>
        </template>
      </el-table-column>
      <!-- MAC -->
      <el-table-column
        prop="mac"
        label="Mac"/>
      <!-- SECRET -->
      <el-table-column
        prop="secret"
        label="Secret"/>
      <!-- CONFIG -->
      <el-table-column
        label="CONFIG">
        <el-table-column
          label="EN_485">
          <template slot-scope="scope">
            <input
              v-model="monitors[scope.$index].config.EN_485"
              placeholder="EN_485"
              type="number"
              style="max-width: 96px"
              class="input-no-border"
              @change="updateMonitor(scope.row)">
          </template>
        </el-table-column>
        <el-table-column
          label="BAUD_RATE">
          <template slot-scope="scope">
            <input
              v-model="monitors[scope.$index].config.BAUD_RATE"
              placeholder="BAUD_RATE"
              type="number"
              style="max-width: 96px"
              class="input-no-border"
              @change="updateMonitor(scope.row)">
          </template>
        </el-table-column>
        <el-table-column
          label="SERIAL_CYC">
          <template slot-scope="scope">
            <input
              v-model="monitors[scope.$index].config.SERIAL_CYC"
              placeholder="SERIAL_CYC"
              type="number"
              style="max-width: 96px"
              class="input-no-border"
              @change="updateMonitor(scope.row)">
          </template>
        </el-table-column>
        <el-table-column
          label="SERIAL_WAIT">
          <template slot-scope="scope">
            <input
              v-model="monitors[scope.$index].config.SERIAL_WAIT"
              placeholder="SERIAL_WAIT"
              type="number"
              style="max-width: 96px"
              class="input-no-border"
              @change="updateMonitor(scope.row)">
          </template>
        </el-table-column>
        <el-table-column
          width="120"
          align="center"
          label="COMMANDS">
          <template slot-scope="scope">
            <i
              class="el-icon-more pointer"
              @click="editMonitorCommands(scope.row)"/>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        align="center">
        <template slot-scope="scope">
          <router-link :to="`/monitor/history?id=${scope.row.monitor_id}`">
            History
          </router-link>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        width="60">
        <template slot-scope="scope">
          <i
            class="el-icon-error color-red pointer"
            @click="unlinkMonitor(scope.row)"/>
        </template>
      </el-table-column>
    </el-table>

    <monitor-link-dialog
      ref="MonitorLinkDialog"
      @on-link="onMonitorLink"/>
    <monitor-command-edit-dialog
      ref="MonitorCommandEditDialog"
      @on-confirm="updateMonitor"/>
  </div>
</template>

<script>

import MonitorLinkDialog from '@/components/Monitor/MonitorLinkDialog'
import MonitorCommandEditDialog from '@/components/Monitor/MonitorCommandEditDialog'

import { getMonitorList, updateMonitor, unlinkMonitor } from '@/api/monitor'

export default {
  components: {
    MonitorLinkDialog,
    MonitorCommandEditDialog
  },
  data() {
    return {
      loading: false,
      online_monitors: [],
      monitors: [],
      page: 1,
      per_page: 40,
      total: 0
    }
  },
  mounted() {
    this.getData()
    this.$socket.subscribe(this)
    this.$socket.sendMessage({ type: 'monitors' })
  },
  beforeDestory() {
    this.$socket.unsubscibe(this)
  },
  methods: {
    onMessage(message) {
      switch (message.type) {
        case 'monitors':
          this.online_monitors = message.data
          break
      }
    },
    getData() {
      this.loading = true
      getMonitorList({
        page: this.page,
        per_page: this.per_page
      }).then(res => {
        this.loading = false
        this.monitors = res.data.data
        this.total = res.data.total
      }).catch(err => {
        console.log(err)
      })
    },
    pageChange(page) {
      this.page = page
      this.getData()
    },
    perPageChange(per_page) {
      this.per_page = per_page
      this.getData()
    },
    onMonitorLink(monitor) {
      this.monitors.unshift(monitor)
    },
    unlinkMonitor(monitor) {
      const index = this.monitors.findIndex(item => item.monitor_id === monitor.monitor_id)
      unlinkMonitor(monitor).then(res => {
        this.monitors.splice(index, 1)
        this.$message('Monitor Removed')
      }).catch(err => {
        console.log(err)
      })
    },
    editMonitorCommands(monitor) {
      this.$refs.MonitorCommandEditDialog.show(monitor)
    },
    updateMonitor(monitor) {
      if (monitor.config) {
        if (!monitor.config.EN_485) {
          monitor.config.EN_485 = 4
          return this.$message.error('EN_485 Required')
        }
        if (!monitor.config.BAUD_RATE) {
          monitor.config.BAUD_RATE = 8600
          return this.$message.error('BAUD_RATE Required')
        }
        if (!monitor.config.SERIAL_CYC) {
          monitor.config.SERIAL_CYC = 20
          return this.$message.error('SERIAL_CYC Required')
        }
        if (!monitor.config.SERIAL_WAIT) {
          monitor.config.SERIAL_WAIT = 1
          return this.$message.error('SERIAL_WAIT Required')
        }
      }

      updateMonitor(monitor.monitor_id, monitor).then(res => {
        const index = this.monitors.findIndex(item => +item.monitor_id === +res.data.monitor_id)
        if (index === -1) {
          this.monitors.push(res.data)
        } else {
          this.monitors.splice(index, 1, res.data)
        }
        this.$message({ message: res.data.monitor_id + ' updated.', type: 'success' })
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style>

</style>

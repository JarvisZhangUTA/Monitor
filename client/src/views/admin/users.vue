<template>
  <div class="app-container">
    <div style="margin-bottom: 8px">
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
      :data="users"
      element-loading-text="loading"
      border
      fit
      highlight-current-row>
      <!-- INDEX -->
      <el-table-column
        :index="1"
        type="index">
      </el-table-column>
      <!-- EMAIL -->
      <el-table-column
        prop="email"
        label="Email"/>
      <!-- ROLE -->
      <el-table-column
        prop="role"
        label="Role"/>
      <!-- PEWRMISSION -->
      <el-table-column
        label="Permission">
        <el-table-column
          label="Send Request">
          <template slot-scope="scope">
            {{ scope.row.permission.can_send_request ? 'True' : 'False' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="can_upgrade"
          label="Upgrade">
          <template slot-scope="scope">
            {{ scope.row.permission.can_upgrade ? 'True' : 'False' }}
          </template>
        </el-table-column>
      </el-table-column>
      <!-- MONITORS -->
      <el-table-column
        align="center"
        width="88"
        label="Monitors">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            class="el-icon-more"
            @click="showMonitors(scope.row)"/>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>

import { getUserList } from '@/api/user'

export default {
  data() {
    return {
      loading: false,
      users: [],
      page: 1,
      per_page: 40,
      total: 0,
      email: ''
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      this.loading = true
      getUserList({
        page: this.page,
        per_page: this.per_page,
        email: this.email
      }).then(res => {
        this.loading = false
        this.users = res.data.data
        this.total = res.data.total
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
    showMonitors(user) {

    }
  }
}
</script>

<style>
</style>

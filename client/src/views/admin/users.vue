<template>
  <div class="app-container">
    <div style="margin-bottom: 8px">
      <el-input
        v-model="email"
        size="mini"
        placeholder="Find email"
        class="admin-users-input"
        @change="getData"
      />

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
        type="index"/>
      <!-- EMAIL -->
      <el-table-column
        label="Email">
        <template slot-scope="scope">
          <el-tooltip :content="scope.row._id" placement="right">
            <span> {{ scope.row.email }} </span>
          </el-tooltip>
        </template>
      </el-table-column>
      <!-- ROLE -->
      <el-table-column
        label="Role">
        <template slot-scope="scope">
          <el-popover popper-class="pointer no-padding">
            <div
              style="padding: 4px 8px;"
              class="fs-regular"
              @click="roleChange('admin', scope.row)">
              Admin
            </div>
            <div
              style="padding: 4px 8px;"
              class="fs-regular"
              @click="roleChange('user', scope.row)">
              User
            </div>
            <div slot="reference" class="pointer">
              {{ scope.row.role.toUpperCase() }}
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <!-- PEWRMISSION -->
      <el-table-column
        label="Permission">
        <el-table-column
          label="Send Request">
          <template slot-scope="scope">
            <el-popover popper-class="pointer no-padding">
              <div
                style="padding: 4px 8px;"
                class="color-green fs-regular"
                @click="canSendRequestChange(true, scope.row)">
                True
              </div>
              <div
                style="padding: 4px 8px;"
                class=" color-red fs-regular"
                @click="canSendRequestChange(false, scope.row)">
                False
              </div>
              <div
                slot="reference"
                :class="scope.row.permission.can_send_request ? 'color-green' : 'color-red'"
                class="pointer">
                {{ scope.row.permission.can_send_request ? 'True' : 'False' }}
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          prop="can_upgrade"
          label="Upgrade">
          <template slot-scope="scope">
            <el-popover popper-class="pointer no-padding">
              <div
                style="padding: 4px 8px;"
                class="color-green fs-regular"
                @click="canUpgradeChange(true, scope.row)">
                True
              </div>
              <div
                style="padding: 4px 8px;"
                class="color-red fs-regular"
                @click="canUpgradeChange(false, scope.row)">
                False
              </div>
              <div
                slot="reference"
                :class="scope.row.permission.can_upgrade ? 'color-green' : 'color-red'"
                class="pointer">
                {{ scope.row.permission.can_upgrade ? 'True' : 'False' }}
              </div>
            </el-popover>
          </template>
        </el-table-column>
      </el-table-column>
      <!-- MONITORS -->
      <el-table-column
        align="center"
        width="88"
        label="Monitors">
        <template slot-scope="scope">
          <router-link
            :to="`/admin/monitors?user_id=${scope.row._id}`"
            class="el-icon-more"/>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>

import { getUserList, updateUser } from '@/api/user'

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
    console.log(this.$config)
    console.log(this.$socket)
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
    roleChange(val, user) {
      if (!user) {
        return
      }
      user.role = val
      this.updateUser(user)
    },
    canSendRequestChange(val, user) {
      if (!user) {
        return
      }
      if (!user.permission) {
        user.permission = {}
      }
      user.permission.can_send_request = val
      this.updateUser(user)
    },
    canUpgradeChange(val, user) {
      if (!user) {
        return
      }
      if (!user.permission) {
        user.permission = {}
      }
      user.permission.can_upgrade = val
      this.updateUser(user)
    },
    updateUser(user) {
      updateUser(user._id, user).then(res => {
        this.$message({ message: res.data.email + ' updated.', type: 'success' })
      })
    }
  }
}
</script>

<style scoped>
  .admin-users-input {
    width: 108px;
    float: right;
    padding: 2px 0;
  }
</style>

<template>
  <div class="app-container">
    <div style="margin-bottom: 8px">
      <monitor-selector
        :selected="monitor_id"
        @on-select="onMonitorChange"/>

      <response-field-selector
        ref="ResponseFieldSelector"
        :fields="fields"
        @on-change="fieldsChange"/>

      <el-pagination
        :current-page="page"
        :page-size="per_page"
        :total="total"
        background
        layout="prev, pager, next, total"
        style="float: right; display: inline-block; vertical-align: top;"
        @current-change="pageChange"/>

      <el-pagination
        :page-size="per_page"
        :page-sizes="[20, 40, 100, 200]"
        layout="sizes"
        style="float: right; display: inline-block; vertical-align: top;"
        @size-change="perPageChange"/>
    </div>

    <el-table
      v-loading="loading"
      :data="data"
      element-loading-text="loading"
      border
      fit
      highlight-current-row>

      <el-table-column
        v-for="(field, idx) in fields"
        :key="idx"
        :label="field.display_name">
        <template slot-scope="scope">
          {{ scope.row[field.field_name] }}
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
import { geResponses } from '@/api/response'

import MonitorSelector from '@/components/Monitor/MonitorSelector'
import ResponseFieldSelector from '@/components/Response/ResponseFieldSelector'

export default {
  components: {
    MonitorSelector,
    ResponseFieldSelector
  },
  data() {
    return {
      loading: false,
      monitor_id: null,
      type: null,
      start_date: null,
      end_date: null,
      page: 1,
      per_page: 40,
      total: 0,
      fields: [],
      data: []
    }
  },
  mounted() {
    if (this.$route.query.id) {
      this.monitor_id = this.$route.query.id
      this.getData(true)
    }
    this.$refs.ResponseFieldSelector.selectDefault()
  },
  methods: {
    onMonitorChange(id) {
      this.monitor_id = id
      this.getData(true)
    },
    pageChange(page) {
      this.page = page
      this.getData()
    },
    perPageChange(per_page) {
      this.per_page = per_page
      this.getData(true)
    },
    fieldsChange(fields) {
      this.fields = fields
    },
    getData(force = false) {
      this.loading = true
      geResponses({
        page: this.page,
        per_page: this.per_page,
        monitor_ids: this.monitor_id,
        type: this.type,
        start_date: this.start_date,
        end_date: this.end_date
      }).then(res => {
        this.loading = false
        this.total = res.data.total
        this.data = res.data.data
      }).catch(err => {
        this.loading = false
        console.log(err)
      })
    }
  }
}
</script>

<style>

</style>

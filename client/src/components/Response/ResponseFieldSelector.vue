<template>
  <el-popover
    placement="bottom"
    trigger="click">

    <div style="height: 400px; overflow-y: auto;">
      <div v-for="field in all_fields" :key="field.field_name">
        <el-checkbox
          :value="fields.findIndex(item => item.field_name === field.field_name) > -1"
          @change="onChange(field)">
          {{ field.display_name }}
        </el-checkbox>
      </div>
    </div>

    <el-button
      slot="reference"
      size="mini">
      {{ fields.length > 0 ? fields.length + ' Fields' : 'Select Fields' }}
    </el-button>
  </el-popover>
</template>

<script>
export default {
  props: {
    fields: { type: Array, default: () => [] }
  },
  data() {
    return {
      all_fields: all_fields
    }
  },
  methods: {
    selectDefault() {
      this.$emit('on-change', default_fields.slice())
    },
    onChange(field) {
      const fields = this.fields.slice()
      const index = fields.findIndex(item => item.field_name === field.field_name)
      if (index === -1) {
        fields.push(field)
      } else {
        fields.splice(index, 1)
      }
      this.$emit('on-change', fields)
    }
  }
}

const default_fields = [
  { field_name: 'monitor_id', display_name: 'Monitor ID' },
  { field_name: 'date', display_name: 'Date' },
  { field_name: 'type', display_name: 'Type' },
  { field_name: 'device_address', display_name: 'Device Addr' },
  { field_name: 'function_code', display_name: 'Function Code' },
  { field_name: 'upv1', display_name: 'UPV1' },
  { field_name: 'lpv1', display_name: 'LPV1' },
  { field_name: 'upv2', display_name: 'UPV2' },
  { field_name: 'lpv2', display_name: 'LPV2' },
  { field_name: 'upv3', display_name: 'UPV3' },
  { field_name: 'lpv3', display_name: 'LPV3' }
]

const all_fields = [
  { field_name: 'monitor_id', display_name: 'Monitor ID' },
  { field_name: 'date', display_name: 'Date' },
  { field_name: 'type', display_name: 'Type' },
  { field_name: 'device_address', display_name: 'Device Addr' },
  { field_name: 'function_code', display_name: 'Function Code' },
  { field_name: 'register_count', display_name: 'Register Code' },
  { field_name: 'device', display_name: 'Device' },
  { field_name: 'lcd_bootloader', display_name: 'LCD BootLoader' },
  { field_name: 'arc_version', display_name: 'ARC Ver' },
  { field_name: 'arc_enable_status', display_name: 'ARC Enable' },
  { field_name: 'arc_dipswitch_status', display_name: 'ARC Dipswitch' },
  { field_name: 'pv_input_config', display_name: 'PV Input' },
  { field_name: 'register_number', display_name: 'Register Num' },
  { field_name: 'pro_ver', display_name: 'Pro Ver' },
  { field_name: 'minor_ver', display_name: 'Minor Ver' },
  { field_name: 'sn', display_name: 'SN' },
  { field_name: 'model', display_name: 'Model' },
  { field_name: 'rw_reg_sum', display_name: 'RW Reg Sum' },
  { field_name: 'rw_reg_add', display_name: 'RW Reg Add' },
  { field_name: 't_yield', display_name: 'T Yield' },
  { field_name: 'd_yield', display_name: 'D Yield' },
  { field_name: 'eff', display_name: 'EFF' },
  { field_name: 'pf', display_name: 'PF' },
  { field_name: 'pmax', display_name: 'PMax' },
  { field_name: 'run_time', display_name: 'Run Time' },
  { field_name: 'pac', display_name: 'PAC' },
  { field_name: 'sac', display_name: 'SAC' },
  { field_name: 'uab', display_name: 'UAB' },
  { field_name: 'ubc', display_name: 'UBC' },
  { field_name: 'uca', display_name: 'UCA' },
  { field_name: 'la', display_name: 'LA' },
  { field_name: 'lb', display_name: 'LB' },
  { field_name: 'lc', display_name: 'LC' },
  { field_name: 'upv1', display_name: 'UPV1' },
  { field_name: 'lpv1', display_name: 'LPV1' },
  { field_name: 'upv2', display_name: 'UPV2' },
  { field_name: 'lpv2', display_name: 'LPV2' },
  { field_name: 'upv3', display_name: 'UPV3' },
  { field_name: 'lpv3', display_name: 'LPV3' },
  { field_name: 'freq', display_name: 'FREQ' },
  { field_name: 'tmod', display_name: 'Tmod' },
  { field_name: 'tamb', display_name: 'Tamb' },
  { field_name: 'tcoil', display_name: 'TCoil' },
  { field_name: 'mode', display_name: 'Mode' },
  { field_name: 'last_error_time', display_name: 'Last Err' },
  { field_name: 'pfault', display_name: 'PFault' },
  { field_name: 'warn', display_name: 'WARN' },
  { field_name: 'fault0', display_name: 'Fault0' },
  { field_name: 'fault1', display_name: 'Fault1' },
  { field_name: 'fault2', display_name: 'Fault2' },
  { field_name: 'fault3', display_name: 'Fault3' },
  { field_name: 'fault4', display_name: 'Fault4' },
  { field_name: 'qac', display_name: 'QAC' },
  { field_name: 'pid_box_enable', display_name: 'PID ENABLE' },
  { field_name: 'pid_box_voltage', display_name: 'PID Voltage' },
  { field_name: 'pid_box_current', display_name: 'PID Current' },
  { field_name: 'pid_box_reserved', display_name: 'PID Reversed' },
  { field_name: 'majer_ver', display_name: 'Majer Ver' },
  { field_name: 'pv_detection', display_name: 'PV Detection' },
  { field_name: 'bus_capacitance', display_name: 'BUS Cap' },
  { field_name: 'ac_capacitance', display_name: 'AC Cap' },
  { field_name: 'pdc', display_name: 'PDC' }
]

</script>

<style>

</style>

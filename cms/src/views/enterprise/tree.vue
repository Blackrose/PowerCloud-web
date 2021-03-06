<style lang="scss">
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    // justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
  .el-tree-node__content{
    margin: 6px 0;
  }
  .tree-level-1 {
    font-weight:bold;
    font-size:20px;
    line-height: 30px;
  }
  .tree-level-2 {
    font-weight:bold;
    font-size:18px;
  }
  .tree-level-3 {
    font-weight:bold;
    font-size:16px;
  }
  .tree-item-btn-bar {
    padding-left: 30px;
  }
  .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
    background-color: #03A9F4;
    color: #fff;
    .tree-item-btn-bar .el-button{
      color: #fff;
    }
  }
  .el-tree {
    margin-right: 40px;
  }
  .table-caption {
    font-size: 24px;
    text-align: center;
    margin: 20px;
  }
</style>

<template>
  <div class="app-container">
    <el-alert v-if="emptyText"
      :title="emptyText"
      type="warning"
      center
      show-icon>
    </el-alert>
    <el-row justify="space-between">
      <el-col :span="7" min-width="400">
        <el-tree
        v-loading="loading"
        element-loading-text="加载中"
        empty-text=""
        :data="treeData"
        default-expand-all
        :expand-on-click-node="false"
        :highlight-current="true"
        @node-click="showDetail">
        <span :class="['custom-tree-node','tree-level-'+node.level]" slot-scope="{ node, data }">
          <span v-if="node.level == 1"><svg-icon icon-class="enterprise"></svg-icon>&nbsp;&nbsp;企业 - {{node.data.company}}</span>
          <span v-else-if="node.level == 2"><svg-icon icon-class="substation"></svg-icon>&nbsp;&nbsp;{{node.data.type}} - {{node.data.substation}}</span>
          <span v-else-if="node.level == 3"><svg-icon icon-class="cabinet"></svg-icon>&nbsp;&nbsp;柜 - {{node.data.cabinettype | cabinetTypeFilter}}</span>
          <span v-else-if="node.level == 4">电表 - {{node.data.circuitname}}</span>
          <span class="tree-item-btn-bar">
           <el-button size="mini" type="text">详情>></el-button>
          </span>
        </span>
      </el-tree>
      </el-col>

      <el-col :span="17" v-if="moduleName">
        <div class="table-caption">详细信息</div>
        <cms-grid
          :moduleName = "moduleName"
          :column = "column"
          :subTable = "subTable"
          :treeRoute = "treeRoute"
        >
        </cms-grid>
      </el-col>
    </el-row>
  </div>
</template>

<script>

import Grid from "@/components/grid/grid"
import tableConfig from '@/views/_config/table'
import { fetchList, fetchTreeList } from '@/api/api'

export default {
  components: {
    "cms-grid": Grid,
  },
  data() {
    return {
      loading: true,
      emptyText: '',
      filterText: '',
      treeData: null,
      levelArr: ['企业','变电所', '柜','电表'],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      moduleName: "",
      column: null,
      subTable: null,
      treeRoute: {
        params: null,
        query: null,
      },
      deviceTypeOptions: null
    }
  },
  created () {
    fetchTreeList().then( response => {
      this.loading = false
      if(response.ok) {
        this.treeData = response.data || []
      }
      else {
        this.treeData = []
        this.emptyText = response.data || "暂无数据"
      }
    })
    fetchList("typeDevice").then( response => {
      let list = response.data.items || [];
        let options = [];
        list.forEach( (o,i) => {
          options.push({value: o.id, label: o.typedevicename})
        })
        this.deviceTypeOptions = options
    })
  },
  filters: {
    cabinetTypeFilter (value) {
      let arr = ["进线柜", "电容柜", "馈电柜"]
      return arr[+value]
    }
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    showDetail(data, node) {
      // console.log(data)
      let path
      let level = node.level
      this.moduleName = ""
      //先把moduleName设为空，用于更新右边的表格
      this.$nextTick( () => {
        if(level == 1) {
          this.setTableConfig("customer")
          this.treeRoute = {
            params: {id: data.id},
            // query: {id: data.id},
            path: "/Enterprise/customer"    //进入子列表时要用
          }
        }
        //只显示当前点击的变电所，所以加了query参数用于table过滤
        else if(level == 2) {
          this.setTableConfig("electricitySubstation")
          let parentId = node.parent.data.id;
          this.treeRoute = {
            params: {companyid: parentId, id: data.id},
            // query: {id: data.id},
            path: "/Enterprise/customer/"+parentId+"/electricitySubstation"
          }
        }
        else if(level == 3) {
          let arr = ["electricitySubstation_incoming", "electricitySubstation_capacitor", "electricitySubstation_low"]

          this.setTableConfig(arr[data.cabinettype])

          let parentId = node.parent.data.id;
          this.treeRoute = {
            params: {
              companyid: node.parent.parent.data.id,
              electricitysubstationid: node.parent.data.id,
              id: data.id
            },
            // query: {id: data.id},
            path: `/Enterprise/customer/${node.parent.parent.data.id}/electricitySubstation/${node.parent.data.id}/electricitySubstation_cabinets`
          }
        }
        else if(level == 4) {
          this.setTableConfig("deviceElecMeter")
          //如果是电表，要关联设备类型表
          this.column.forEach( (o,i) => {
            if(o.key == "typedeviceid") {
              o.options = this.deviceTypeOptions;
              //强制更新，使得grid组件内的表单提交验证规则computed参数跟着更新！
              this.$set(this.column, i, o)
            }
          })

          let parentId = node.parent.data.id;
          this.treeRoute = {
            params: {
              companyid: node.parent.parent.parent.data.id,
              electricitysubstationid: node.parent.parent.data.id,
              cabinetid: node.parent.data.id,
              cabinettype: node.data.cabinettype,
              id: data.id
            },
            // query: {id:data.id},
            path: `/Enterprise/customer/${node.parent.parent.parent.data.id}/electricitySubstation/${node.parent.parent.data.id}/electricitySubstation_cabinets/${node.parent.data.id}/deviceElecMeter/${node.data.cabinettype}`
          }
        }
      })
    },
    setTableConfig(moduleName) {
      this.moduleName = moduleName
      this.column = tableConfig[moduleName].column
      if(tableConfig[moduleName].subTable) {
        this.subTable = tableConfig[moduleName].subTable
      }
      else {
        this.subTable = null
      }
    },
  }
}
</script>



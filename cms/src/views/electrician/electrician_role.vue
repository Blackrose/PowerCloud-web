<template>
    <cms-grid
      :moduleName = "moduleName"
      :isSubTable = "true"
      :column = "column"
      :connectModule = "connectModule"
    >
  </cms-grid>

</template>

<script type="text/javascript">

import Grid from "@/components/grid/grid"
import tableConfig from "@/views/_config/table"

export default {
	components: {
		"cms-grid": Grid
  },
	data () {
		return {
      moduleName: "electrician_role",
			column: tableConfig["electrician_role"].column,
      connectModule: [{
        moduleName: "electrician",  //相关联的模块名
        myKey: "userid",         //本模块中关联的数据库字段
        connectKey: "id",           //关联的模块中的对应数据库字段
        displayKey: "name",         //显示在前端的字段
      },
      {
        moduleName: "role",  //相关联的模块名
        myKey: "roleid",         //本模块中关联的数据库字段
        connectKey: "id",           //关联的模块中的对应数据库字段
        displayKey: "rolename",         //显示在前端的字段
      }]
		}
	}
}

</script>
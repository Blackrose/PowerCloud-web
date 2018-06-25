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
      moduleName: "deviceGateway_instructions",
      column: tableConfig["deviceGateway_instructions"].column,
      //与管理域 变电所 相关联
      connectModule: [{
        moduleName: "deviceGateway",
        myKey: "gatewayid",
        connectKey: "gatewayid",
        displayKey: "gatewayname",
      },
      {
        moduleName: "deviceElecMeter",
        myKey: "deviceid",
        connectKey: "id",
        displayKey: "circuitname",
        searchKey: "gatewayid"
      }]
    }

	}
}

</script>
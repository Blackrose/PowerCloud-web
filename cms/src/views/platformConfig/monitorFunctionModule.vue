<template>
	<cms-grid
    :moduleName = "moduleName"
    :column = "column"
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
      moduleName: "functionModule",
			column: tableConfig["functionName"].column
		}
	}
}

</script>
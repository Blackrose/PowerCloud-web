<template>
	<monitor-box
		:title = "title"
		:titleIcon = "titleIcon"
	>
		asdasd
	</monitor-box>
</template>

<script type="text/javascript">
	import MonitorBox from '@/views/monitor/component/box.vue'
	export default {
		components: {
	    'monitor-box': MonitorBox,
	  },
	  data () {
    	return {
    		title: "变电站数据监控",
    		titleIcon: "el-icon-tickets",
    	}
  	}
	}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
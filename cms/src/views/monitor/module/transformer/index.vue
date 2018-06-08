<template>
	<monitor-box
    type="transformer"
		:title = "title"
		:titleIcon = "titleIcon"
		:paramValue = "paramValue"
		@box-close = "handleClose"
		@box-full-screen = "handleFullScreen"
		@box-select-bar-change = "handleSelectBarChange"
	>
		<el-row ref="videoWrapperEle">
			<el-col :span="22" :offset="1">

			</el-col>
		</el-row>

	</monitor-box>
</template>

<script type="text/javascript">


	import MonitorBox from '@/views/monitor/component/box.vue'
	import {fetchList} from '@/api/api' ;

	export default {
		components: {
	    'monitor-box': MonitorBox,
	  },
	  props: {
	  	moduleIndex: {
	    	type: Number,
	      default: function () {
	        return 0
	      }
	    },
	    paramValue: {
	    	type: String,
	      default: function () {
	        return ''
	      }
	    },
	    boxHeight: {
        type: String,
        default: function () {
          return ""
        }
      }
	  },
	  data () {
    	return {
    		videoId: 0,
    		title: "变压器信息",
    		titleIcon: "transformer",

    	}
  	},
  	computed: {
  		videoHeight: function() {
  			if(this.boxHeight){
  				return `calc(${this.boxHeight} - 0.4rem - 70px)`;
  			}
  			else {
  				return "auto";
  			}
  		},
  		videoWidth: function() {
  			if(this.boxHeight){
  				let h = +(this.boxHeight).match(/[0-9]+/)[0];
  				return `calc(${h*4/3}vh - ${0.4*4/3}rem - ${70*4/3}px)`;
  			}
  			else {
  				return "auto";
  			}
  		},
  	},
  	created () {
  		//变电站视频的ID,从config里的paramValue参数中解析获取
			let param = JSON.parse(this.paramValue);
			//触发watch事件，init
			this.videoId =  param.videoid;
  	},
  	watch: {
  		//监听变电所ID选择的切换,注销旧的MQTT事件。生成新的数据
  		videoId: function(newValue, oldValue) {
  			this.init();
  		}
  	},
  	methods: {
  		init () {
  			let param = {
  				page: 1,
					limit: 1,
					search: {"id":this.videoId}
  			}
  			fetchList("electricitySubstation_video",param).then( res => {
  				if(res.data && res.data.items) {

  				}
  			})
  		},
  		handleSelectBarChange (value) {
  			this.videoId = value[2];
  		},
      handleClose () {
      	this.$emit("module-close",this.moduleIndex);
      },
      handleFullScreen () {
      	this.$emit("module-full-screen",this.moduleIndex);
      },
  	}
  }

</script>

<style rel="stylesheet/scss" lang="scss" scoped>
	.video-title {
		line-height: 0.22rem;
	}
	.video-player {
		background: #000;
		max-width: 100%;
		margin: 0 auto;
		position: relative;
		margin-top: 0.1rem;
	}


</style>
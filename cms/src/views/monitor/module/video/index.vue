<template>
	<monitor-box
		type="video"
		:title = "title"
		:titleIcon = "titleIcon"
		:paramValue = "paramValue"
		@box-close = "handleClose"
		@box-full-screen = "handleFullScreen"
		@box-select-bar-change = "handleSelectBarChange"
	>
		<el-row ref="videoWrapperEle">
			<el-col :span="22" :offset="1">
			  <video-player  class="video-player vjs-custom-skin"
					:style = "{maxHeight:videoHeight, width: videoWidth}"
					:playsinline="true"
					:options="playerOptions"
      	>
      	</video-player>
			</el-col>
		</el-row>

	</monitor-box>
</template>

<script type="text/javascript">

	import { videoPlayer } from 'vue-video-player';
	import 'videojs-contrib-hls';
	import 'video.js/dist/video-js.css'

	import MonitorBox from '@/views/monitor/component/box.vue'
	import {fetchList} from '@/api/api' ;

	export default {
		components: {
			videoPlayer,
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
    		videoUrl: "",
    		title: "变电所监控视频",
    		titleIcon: "video",
    		playerOptions: {
	        autoplay: true, //如果true,浏览器准备好时开始回放。
	        muted: false, // 默认情况下将会消除任何音频。
	        loop: false, // 导致视频一结束就重新开始。
	        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
	        language: 'zh-CN',
	        aspectRatio: '4:3', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
	        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
	        sources: [{
	          type: "application/x-mpegURL",
          	src: '',
	        }],
	        // width: document.documentElement.clientWidth,
	        notSupportedMessage: '此视频暂无法播放 或 此变电所下暂无视频', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
	       // controlBar: {
	       //   timeDivider: false,
	       //   durationDisplay: false,
	       //   remainingTimeDisplay: false,
	       //   fullscreenToggle: true  //全屏按钮
	       // }
	      }
    	}
  	},
  	computed: {
  		videoHeight: function() {
  			if(this.boxHeight){
  				return `calc(${this.boxHeight} - 0.25rem - 50px)`;
  			}
  			else {
  				return "auto";
  			}
  		},
  		videoWidth: function() {
  			if(this.boxHeight){
  				let h = +(this.boxHeight).match(/[0-9]+/)[0];
  				return `calc(${h*4/3}vh - ${0.25*4/3}rem - ${50*4/3}px)`;
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
  					// console.log(res.data.items[0].url)
  					if(this.videoId) {
  						this.playerOptions.sources[0].src = res.data.items[0].url
  					}
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
<style type="text/css">
	.video-js.vjs-fluid {
    position: absolute !important;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
	}
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
	.video-title {
		line-height: 0.22rem;
	}
	.video-player {
		width: 100%;
		background: #000;
		max-width: 100%;
		margin: 0 auto;
		position: relative;
	}


</style>
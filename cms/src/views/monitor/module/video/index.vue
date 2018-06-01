<template>
	<monitor-box ref="boxEle"
		:title = "title"
		:titleIcon = "titleIcon"
		@boxClose = "handleClose"
		@boxFullScreen = "handleFullScreen"
	>
		<el-row class="video-title">{{stationName}}</el-row>
		<el-row ref="videoWrapperEle">
			<el-col :span="20" :offset="2">
				<!-- <video id="video" ref="videoEle">
			  	<source src="http://hls.open.ys7.com/openlive/f0aa5ad188aa49ab9e6d17eadbadfad5.m3u8">
			  </video> -->
			  <video-player  class="video-player vjs-custom-skin"
			  	id="video"
					ref="videoEle"
					:playsinline="true"
					:options="playerOptions"
      	>
      </video-player>
			</el-col>
			<el-col :span="24">
			</el-col>
		</el-row>
	</monitor-box>
</template>

<script type="text/javascript">
	import { videoPlayer } from 'vue-video-player';
	import 'videojs-contrib-hls';
	import 'video.js/dist/video-js.css'

	import MonitorBox from '@/views/monitor/component/box.vue'
	import {getStationData, initMqttConnection, mqttSubscribe} from '@/api/api_monitor' ;

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
	    }
	  },
	  data () {
    	return {
    		title: "变电所监控视频",
    		titleIcon: "el-icon-tickets",
    		stationName: "S-变电所",
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
          	// src: 'http://hls.open.ys7.com/openlive/f0aa5ad188aa49ab9e6d17eadbadfad5.m3u8',
	        }],
	        // width: document.documentElement.clientWidth,
	        notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
	       controlBar: {
	         timeDivider: false,
	         durationDisplay: true,
	         remainingTimeDisplay: false,
	         fullscreenToggle: true  //全屏按钮
	       }
	      }

    	}
  	},
  	created () {
  	},
  	mounted () {
  		let height = this.$refs.boxEle.$el.clientHeight;
  		// let width = this.$refs.boxEle.$el.clientHeight;
  		console.log(height);
  		this.$refs.videoWrapperEle.$el.style.height = `calc(${height}px - 0.4rem - 0.25rem)`;
  	},
  	methods: {
      handleClose () {
      	this.$emit("moduleClose",this.moduleIndex);
      },
      handleFullScreen () {
      	this.$emit("moduleFullScreen",this.moduleIndex);
      },
  	}
  }

</script>

<style rel="stylesheet/scss" lang="scss" scoped>
	.video-title {
		line-height: 0.22rem;
	}
	#video {
		background: #000;
		width: 100%;
	}
</style>
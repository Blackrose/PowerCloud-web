<template>
	<monitor-box
		:title = "title"
		:titleIcon = "titleIcon"
		:paramValue = "paramValue"
		@box-close = "handleClose"
		@box-full-screen = "handleFullScreen"
		@box-select-bar-change = "handleSelectBarChange"
	>
		<ul v-if="data.length" ref="dataListEle"
				:class="[monitor.fullScreenIndex == moduleIndex ? 'is-full-screen' : '', 'data-list']" >
			<li v-for="(o, index) in data">
        <span class="name" :style="{ minWidth: nameMinWidth}">{{o.name}}</span>
        <div class="value-box">
        	<p class="value-u">
        		<span>{{o.Uab | filterNumber}}</span>
	        	<span>{{o.Uac | filterNumber}}</span>
	        	<span>{{o.Ubc | filterNumber}}</span>
	        </p>
	        <p class="value-i">
        		<span>{{o.Ia | filterNumber}}</span>
	        	<span>{{o.Ib | filterNumber}}</span>
	        	<span>{{o.Ic | filterNumber}}</span>
	        </p>
        </div>
			</li>
		</ul>
		<!-- loading -->
		<div v-else class="loading">
			<svg-icon class="loading-icon" icon-class="loading"></svg-icon>
			<p>loading...</p>
		</div>
	</monitor-box>
</template>

<script type="text/javascript">
	import { mapGetters } from 'vuex'

	import MonitorBox from '@/views/monitor/component/box.vue'
	import {getStationData, initMqttConnection, mqttSubscribe, mqttUnsubscribe, mqttDisconnect} from '@/api/api_monitor' ;

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
	  },
	  data () {
    	return {
    		stationId: 0,
    		title: "变电所数据监控",
    		titleIcon: "list",
    		data: [],
    		client: null,
    		MQTT_TOPIC: "/systemStatus",
    	}
  	},
  	computed: {
  		...mapGetters([
      'monitor'
    	]),
  		//每一个柜名称的span的最小宽度，用于自适应小屏幕时折行
  		nameMinWidth () {
  			let w_arr = [];
  			this.data.forEach( (o) => {
  				w_arr.push(o.name.length);
  			})
  			let max_length = (w_arr.sort())[w_arr.length - 1]
  			return max_length * 12 + "px";
  		}
  	},
  	created () {
  		//变电站的的ID,从config里的paramValue参数中解析获取
			let param = JSON.parse(this.paramValue);
			//这里给stationId赋值，就自动触发了watch函数中的init函数，所以不用单独init
			this.stationId =  param.electricitysubstationid;
  	},
  	watch: {
  		//监听变电所ID选择的切换,注销旧的MQTT事件。生成新的数据
  		stationId: function(newValue, oldValue) {
  			if(this.client) {
  				mqttUnsubscribe(this.client, this.MQTT_TOPIC+"/"+oldValue)
  			}
  			this.init();
  		}
  	},
  	filters: {
  		filterNumber(n) {
  			return (+n == n) ? n : "-"
  		}
  	},
  	methods: {
  		handleSelectBarChange (value) {
  			this.stationId = value[1];
  		},
  		init() {
  			let self = this;
  			self.data = [];
  			getStationData(self.stationId).then(response => {
	  			if(response.data){
	  				try {
	  					let resData = JSON.parse(response.data);
	  					self.data = self.generateData(resData);

	  				}
	  				catch(e) {
	  					console.error("Error: in getStationData", e)
	  				}

	  			}
	  		})

	  		//注册MQTT事件
	  		if(!self.client) {
	  			initMqttConnection(function(client) {
		        self.client = client;
		        mqttSubscribe(self.client, self.MQTT_TOPIC+"/"+self.stationId);
		      }, self.handleMqttStatus);
	  		}
	  		else {
	  			mqttSubscribe(self.client, self.MQTT_TOPIC+"/"+self.stationId);
	  		}



  		},
  		generateData (resData) {
  			let data = [];
	  		resData.forEach( (d, i) => {
	  			if(d.cabinet) {
	  				data.push(d.cabinet)
	  			}
	  			if(d.distributing && Array.isArray(d.distributing)) {
	  				d.distributing.forEach( (_d, i) => {
	  					data = data.concat(_d);
	  				})
	  			}
				})
				return data;
	  	},
	  	handleMqttStatus (msg) {
        console.log("==== handle Mqtt TABLE station data ====");
        try {
          // console.log(msg.payloadString);
          let data = JSON.parse(msg.payloadString);
          this.data = this.generateData(data);
          //高亮动画
          if(this.$refs.dataListEle) {
          	this.$refs.dataListEle.classList.add("highlight");
          }
					setTimeout( () => {
						if(this.$refs.dataListEle) {
							this.$refs.dataListEle.classList.remove("highlight");
						}
					}, 1200)
        } catch(e){
        	console.error("Error: error in table handleMqttStatus", e);
        }
      },
      handleClose () {
      	/*注销MQTT订阅*/
      	if(this.client) {
      		mqttUnsubscribe(this.client, this.MQTT_TOPIC+"/"+this.stationId)
      	}
      	this.$emit("module-close",this.moduleIndex);
      },
      handleFullScreen () {
      	this.$emit("module-full-screen",this.moduleIndex);
      }
  	}

	}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
	.loading {
		height: 100%;
		text-align: center;
		padding-top: 40%;
		color: #00bcd4;
		.loading-icon {
			animation: loadingAnimation 1s linear infinite;
			font-size: 30px;
		}
		@keyframes loadingAnimation {
			0% {
				transform: rotate(0);
			}
			100% {
				transform: rotate(360deg);
			}
		}
	}
	.data-list {
		height: 100%;
		overflow-y: overlay;
		margin: 0;
		padding: 0 0.1rem;
		font-size: 12px;
			li {
				display: flex;
				justify-content: space-between;
				flex-wrap: wrap;
				line-height: 40px;
				align-items: center;
				margin-bottom: 0.04rem;
				.name {
					display: inline-block;
					margin-left: 0.066667rem;
					font-size: inherit;
					text-align: left;
					position: relative;
				}

				.name:before {
					display: inline-block;
					content: '';
					width: 10px;
					height: 10px;
					border-radius: 50%;
					background: #F56C6C;
					margin-left: -0.133333rem;
					margin-right: 0.066667rem;
				}

				.value-box {
					& > p {
						// max-width: 55%;
						display: flex;
						justify-content: space-between;
						margin: 0.02rem 0;

						& > span {
							padding: 0.035rem 0;
							line-height: 1;
							display: inline-block;
							border-radius: 3px;
							text-align: center;
							margin: 0 0.02rem;
							width: 0.25rem;
							min-width: 30px;
						}
					}
					p.value-u > span {
						color: #333;
						background: rgba(178, 235, 242, 0.8);
					}
					p.value-i > span {
						color: #000;
						background: rgba(77, 208, 225, 0.8);
					}


				}
			}
	}

	.data-list.highlight {
		p.value-u  > span,
		p.value-i  > span{
			animation: dataUpdateAnimation 1s ease;
		}
	}
	@keyframes dataUpdateAnimation {
		0% {
			filter: brightness(1)
		}
		30% {
			filter: brightness(1.3)
		}
		100% {
			filter: brightness(1)
		}
	}

	.data-list::-webkit-scrollbar {/*滚动条整体样式*/
	    width: 10px;     /*高宽分别对应横竖滚动条的尺寸*/
	    height: 4px;
	}
	.data-list::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
	    border-radius: 5px;
	    background: rgba(255,255,255,0.7);
	}
	.data-list::-webkit-scrollbar-track {/*滚动条里面轨道*/
	    border-radius: 5px;
	    background: rgba(255,255,255,0.1);
	}

	.station-name {
		bottom: 0.133333rem;
		left: 0;
		right: 0;
		p {
			text-align: center;
		}
	}

	.is-full-screen {
		font-size: 16px;

		li {
			.value-box {
				& > p {
					& > span {
						padding: 0.05rem 0;
						width: 0.35rem;
					}
				}
			}
		}
	}

</style>
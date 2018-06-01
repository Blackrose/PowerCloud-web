<template>
	<monitor-box ref="boxEle"
		:title = "title"
		:titleIcon = "titleIcon"
		@boxClose = "handleClose"
		@boxFullScreen = "handleFullScreen"
	>
		<ul v-if="data" class="data-list" ref="dataListEle">
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
        <!-- <span class="duty">${o.duty}</span> -->
        <!-- <span class="status">在岗状态：<i class="fa ${o.status == 0 ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i></span> -->
			</li>
		</ul>
		<el-row>
			<el-col :span="24">{{stationName}}</p></el-col>
		</el-row>
		<!-- <div class="station-name"><p></div> -->
	</monitor-box>
</template>

<script type="text/javascript">
	import MonitorBox from '@/views/monitor/component/box.vue'
	import {getStationData, initMqttConnection, mqttSubscribe} from '@/api/api_monitor' ;

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
	    }
	  },
	  data () {
    	return {
    		title: "变电所数据监控",
    		titleIcon: "el-icon-tickets",
    		stationName: "S-变电所",
    		data: [],
    		stationStatusClient: null,
    		MQTT_TOPIC: "/systemStatus/1",
    	}
  	},
  	mounted () {

  		let height = this.$refs.boxEle.$el.clientHeight;
  		console.log(height);
  		this.$refs.dataListEle.style.height = `calc(${height}px - 0.4rem - 0.25rem)`;
	    // this.$refs.dataListEle.style.height = height*0.8 + "px";

	  /*  // 首先在Virtual DOM渲染数据时，设置下背景图的高度．
	    this.clientHeight.height = `${document.documentElement.clientHeight}px`;
	    // 然后监听window的resize事件．在浏览器窗口变化时再设置下背景图高度．
	    let self = this;
	    window.onresize = function temp() {
	    	this.$refs.dataListEle.style.height = height*0.8 + "px";
	        // that.clientHeight = `${document.documentElement.clientHeight}px`;
	    };*/

  	},
  	created () {
  		let self = this;
  		getStationData(1).then(response => {
  			if(response.data){

  				try {
  					let resData = JSON.parse(response.data);
  					console.log(resData)
  					self.generateData(resData);
  				}
  				catch(e) {
  					console.error("Error: in getStationData", e)
  				}

  			}
  		})

  		initMqttConnection(function(client) {
        self.stationStatusClient = client;
        mqttSubscribe(self.stationStatusClient, self.MQTT_TOPIC);
      }, self.handleMqttStatus);
  	},
  	computed: {
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
  	filters: {
  		filterNumber(n) {
  			return (+n == n) ? n : "-"
  		}
  	},
  	methods: {
  		generateData (resData) {
  			this.data = [];
	  		resData.forEach( (d, i) => {
	  			if(d.cabinet) {
	  				this.data.push(d.cabinet)
	  			}
	  			if(d.distributing && Array.isArray(d.distributing)) {
	  				d.distributing.forEach( (_d, i) => {
	  					this.data = this.data.concat(_d)
	  				})

	  			}
				})
				// console.log(this.data)
	  	},
	  	handleMqttStatus (msg) {
        console.log("==== handle Mqtt station data ====");
        try {
          // console.log(msg.payloadString);
          let data = JSON.parse(msg.payloadString);
          this.generateData(data);
          //高亮动画
          this.$refs.dataListEle.classList.add("highlight");
					setTimeout( () => {
						this.$refs.dataListEle.classList.remove("highlight");
					}, 1200)
        } catch(e){
        	console.error("Error: error in table handleMqttStatus", e);
        }
      },
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

	.data-list {
		overflow-y: scroll;
		// max-height: calc(100vh - 320px);
		margin: 0;
		padding: 0 0.1rem;
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
					font-size: 12px;
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

</style>
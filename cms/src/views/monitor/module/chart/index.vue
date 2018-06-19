<template>
	<monitor-box
    type="chart"
		:title = "title"
		:titleIcon = "titleIcon"
		:paramValue = "paramValue"
    @box-chart-setting = "handleChartSetting"
		@box-close = "handleClose"
		@box-full-screen = "handleFullScreen"
		@box-select-bar-change = "handleSelectBarChange"
	>
    <el-row>
      <chart class="chart" :options="chartOptions" theme="macarons"
      :style = "{height:chartHeight}" auto-resize ></chart>
    </el-row>
    <el-row class="title-bar">
      <p>asdasdas</p>
    </el-row>
	</monitor-box>
</template>

<script type="text/javascript">

  import ECharts from 'vue-echarts/components/ECharts.vue'

  import 'echarts'
  import 'echarts/theme/macarons'

	import MonitorBox from '@/views/monitor/component/box.vue'
	import {getChartData} from '@/api/api_monitor' ;

	export default {
		components: {
	    'monitor-box': MonitorBox,
      'chart': ECharts
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
      let data = []

    for (let i = 0; i <= 360; i++) {
        let t = i / 180 * Math.PI
        let r = Math.sin(2 * t) * Math.cos(2 * t)
        data.push([r, i])
    }

    	return {
    		chartId: 0,
    		title: "变电所数据曲线",
    		titleIcon: "chart",
        chartOptions: {
          title: {
            text: '极坐标双数值轴'
          },
          legend: {
            data: ['line']
          },
          polar: {
            center: ['50%', '54%']
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross'
            }
          },
          angleAxis: {
            type: 'value',
            startAngle: 0
          },
          radiusAxis: {
            min: 0
          },
          series: [
            {
              coordinateSystem: 'polar',
              name: 'line',
              type: 'line',
              showSymbol: false,
              data: data
            }
          ],
          animationDuration: 2000
        },
      }
  	},
  	computed: {
  		chartHeight: function() {
  			if(this.boxHeight){
  				return `calc(${this.boxHeight} - 0.6rem)`;
  			}
  			else {
  				return "auto";
  			}
  		},
  		chartWidth: function() {
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
			this.chartId =  param.chartid;
  	},
  	watch: {
  		//监听变电所ID选择的切换,注销旧的MQTT事件。生成新的数据
  		chartId: function(newValue, oldValue) {
  			this.init();
  		}
  	},
  	methods: {
  		init () {
  			let param = {
  				page: 1,
					limit: 1,
					search: {"id":this.chartId}
  			}
  			// fetchList("electricitySubstation_chart",param).then( res => {
  			// 	if(res.data && res.data.items) {

  			// 	}
  			// })
  		},
      /*曲线显示配置*/
      handleChartSetting (value) {
        console.log(value);
      },
  		handleSelectBarChange (value) {
  			this.chartId = value[2];
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
	.chart {
    width: 100%;
    height: 100%;
  }

  .title-bar {
    margin-top: 0.1rem;
    line-height: 0.2rem;
    font-size: 16px;
    p {
      margin: 0;
    }
  }

</style>
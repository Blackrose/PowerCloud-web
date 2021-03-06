<template>
	<monitor-box
    type="chart"
		:title = "title"
		:titleIcon = "titleIcon"
		:paramValue = "paramValue"
    :chartSetting = "chartSetting"
    @box-chart-setting = "handleChartSetting"
		@box-close = "handleClose"
		@box-full-screen = "handleFullScreen"
		@box-select-bar-change = "handleSelectBarChange"
	>

      <el-row v-if="!isLoading">
        <chart v-if="chartOptions && chartOptions.series[0].data.length"
          class="chart" :options="chartOptions" theme="macarons"
          :style = "{height:chartHeight}" auto-resize >
        </chart>
        <el-col v-else class="tip" :style = "{height:chartHeight,lineHeight:chartHeight}">暂无数据</el-col>
      </el-row>
      <!-- loading -->
      <el-row v-else>
        <el-col class="loading" :style = "{height:chartHeight}">
          <svg-icon class="loading-icon" icon-class="loading"></svg-icon>
          <p>loading...</p>
        </el-col>
      </el-row>
      <!-- 名称 -->
      <el-row class="title-bar">
          <p>{{chartTitle}}</p>
      </el-row>

	</monitor-box>
</template>

<script type="text/javascript">
  import { mapGetters } from 'vuex'
  const ECharts = r => require.ensure([], () => r(require('vue-echarts/components/ECharts.vue')))
  // import ECharts from

  import 'echarts/theme/macarons'

	import MonitorBox from '@/views/monitor/component/box.vue'
	import {getChartData, initMqttConnection, mqttSubscribe, mqttUnsubscribe, mqttDisconnect} from '@/api/api_monitor' ;

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
    	return {
    		isLoading: true,  //是否正在请求数据曲线
    		title: "变电所数据曲线",
    		titleIcon: "chart",
        chartSetting : {
          time: {
            type: 1,            // 0 : interval, 1: real-time
            start: Date.now(),  //timestamp
            end: Date.now(),    //timestamp
            duration: 1,        //hours
          },
          value: {
            //曲线模块里，popover菜单里的级联选项
            stationid: 0, //mqtt时用到
            circuitid: 0,
            parameter: "activepower"
          }
        },
        chartOptions: null,
        chartTitle: "",
        client: null,
        MQTT_TOPIC: "/systemStatus",
        YAXIS_MAP : {
          "Ua/Ub/Uc":"Ua/Ub/Uc",
          "Ia/Ib/Ic":"Ia/Ib/Ic",
          "Uab/Uac/Ubc":"Uab/Uac/Ubc",
          "activepower": "有功功率",
          "reactivepower": "无功功率",
          "powerfactor": "功率因数"
        }
      }

  	},
  	computed: {
      ...mapGetters([
      'monitor'
      ]),
  		chartHeight: function() {
  			if(this.boxHeight){
  				return `calc(${this.boxHeight} - 0.65rem)`;
  			}
  			else {
  				return "auto";
  			}
  		}
  	},
  	created () {
  		//变电站视频的ID,从config里的paramValue参数中解析获取
			let param = JSON.parse(this.paramValue);
      this.stationId = param.electricitysubstationid;
			//init
			this.chartSetting.value.circuitid =  param.circuitid ;
      this.init();
  	},
    watch: {
      //监听变电所ID选择的切换,注销旧的MQTT事件。生成新的数据
      'chartSetting.value.stationid': function(newValue, oldValue) {
        if(this.client) {
          mqttUnsubscribe(this.client, this.MQTT_TOPIC+"/"+oldValue)
        }
      },
      //监听曲线  实时  还是  时段
      'chartSetting.time.type': function(newValue, oldValue) {
        if(newValue == 0 && this.client) {
          mqttUnsubscribe(this.client, this.MQTT_TOPIC+"/"+oldValue)
        }
      }
    },
  	methods: {
  		init () {
        this.isLoading = true;
        this.chartTitle = "";
  			getChartData(this.chartSetting).then( res => {
          this.isLoading = false;
          this.chartOptions = this.generateChartOptions(res.data);
          this.chartTitle = this.generateChartTitle()
        })

        // 实时
        let self = this;
        if(this.chartSetting && this.chartSetting.time.type == 1) {
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
        }
  		},
      /*生成Echarts图的options参数*/
      generateChartOptions(data) {

        let options = {
          title: {
            text: "",
            show: false
          },
          legend: {
            data: [],
            textStyle: {
              color: "#fff"
            }
          },
          tooltip: {
            trigger: 'axis'
          },
          grid: {
            left: 60,
            right: 40,
            bottom:20
          },
          xAxis: {
            type: 'category',
            data: [],
            name: '时间',
            axisLine: {
              lineStyle: {
                color: "#fff"
              }
            }
          },
          yAxis: {
            type: 'value',
            axisLine: {
              lineStyle: {
                color: "#fff"
              }
            }
          },
          series: []
        };
        //要显示的曲线类型，Ua Ia等
        let category = this.chartSetting.value.parameter;
        //纵坐标名称
        options.yAxis.name = this.YAXIS_MAP[category];
        //如果是下面的类型，要三种曲线都显示在图上
        if(category == "Ia/Ib/Ic" || category == "Ua/Ub/Uc" || category == "Uab/Uac/Ubc") {
          let lineColor = ["#00bcd4","#ffd03f","#d87a80"];//蓝色 黄色 红色
          let categoryArr = category.split("/");
          categoryArr.forEach( (o,i) => {
            options.series.push({
              data: [],
              name: o,
              type: 'line',
              smooth: true,
              lineStyle: {
                color: lineColor[i]
              }
            })
          })
          //图例 和 曲线 颜色对应
          options.color = lineColor;
          options.legend.data = categoryArr;
        }
        else {
          options.series.push({
            data: [],
            name: this.YAXIS_MAP[category],
            type: 'line',
            smooth: true
          })
          options.legend.data = [this.YAXIS_MAP[category]];
        }
        //收到的数据
        if(Array.isArray(data)) {
          data.forEach( (d,i) => {
            //X轴
            options.xAxis.data.push(this.dateFormat(d.datatime));
            //Y轴
            if(category == "Ia/Ib/Ic" || category == "Ua/Ub/Uc" || category == "Uab/Uac/Ubc") {
              let categoryArr = category.split("/");
              categoryArr.forEach( (o,j) => {
                options.series[j].data.push(+d[o])
              })
            }
            else {
              if(d[category]) {
                options.series[0].data.push(+d[category])
              }
            }

          })
          if(data[0]) {
            options.title.text = data[0].name;  //回路名称
          }
        }
        return options;
      },
      /*生成图的名称*/
      generateChartTitle() {
        let title = "";
        if(this.chartSetting) {
          let circuitname = "";
          //找到选择的回路ID对应的名称
          this.monitor.selectOptions.forEach( (company,i) => {
            if(company.children && Array.isArray(company.children)) {
              company.children.forEach( (station,j) => {
                if(station.id == this.chartSetting.value.stationid
                  && station.children && station.children.circuit
                  && Array.isArray(station.children.circuit)) {
                  station.children.circuit.forEach( (circuit,k) => {
                    if(circuit.id == this.chartSetting.value.circuitid) {
                      circuitname = circuit.circuitname;
                      return;
                    }
                  })
                }
                if(circuitname) return;
              })
            }
            if(circuitname) return;
          })
          // title += this.chartOptions.title.text
          title = circuitname + "（" + (this.chartSetting.time.type == 0 ? "时段" : "实时") + "）";
        }
        return title
      },
      dateFormat (timestamp) {
        let time = new Date(+timestamp);
        return [time.getHours(),time.getMinutes(),time.getSeconds()].join(":");
      },
      handleMqttStatus (msg) {
        if(!this.chartOptions) return
        console.log("==== handle Mqtt CHART station data ====");
        try {
          /*[{"distributing":[[{"Ia":"-","name":"S1办公楼A座","Ib":"-","Ic":"-","id":2,"Ua":"-","Ub":"-","Uc":"-","status":0},{"Ia":66.1,"name":"S1办公楼B座","Ib":60.7,"Ic":76.7,"id":3,"Ua":234.0,"Ub":235.0,"Uc":235.0,"status":0},{"Ia":1.0,"name":"S1换热站","Ib":1.1,"Ic":0.8,"id":4,"Ua":234.0,"Ub":235.0,"Uc":235.0,"status":0},{"Ia":21.1,"name":"S1办公楼C座","Ib":21.1,"Ic":29.7,"id":5,"Ua":234.0,"Ub":235.0,"Uc":235.0,"status":0}]],"vm":{"Ua":234.0,"Ub":235.0,"Uc":235.0},"time":1529481311944,"cabinet":{"Ua":234.0,"Ub":235.0,"Uc":235.0,"powerfactor":0.07,"Uac":406.0,"transformid":1,"Uab":406.0,"Ubc":407.0,"Ia":182.6,"temperature":50,"name":"S变电站进线柜总表","Ib":166.5,"Ic":198.2,"id":1,"activepower":121687.5,"reactivepower":-15112.5,"status":0}}]*/
          // console.log(msg.payloadString);
          let data = JSON.parse(msg.payloadString);
          let xArr = this.chartOptions.xAxis.data;

          //横坐标，当前时间
          xArr.shift();
          xArr.push(this.dateFormat(Date.now()));
          //纵坐标，要显示的类型
          let category = this.chartSetting.value.parameter;
          let dataArr = generateData(data);

          dataArr.forEach( (circuit, i) => {
            if(circuit.id == this.chartSetting.value.circuitid) {
              if(category == "Ia/Ib/Ic" || category == "Ua/Ub/Uc" || category == "Uab/Uac/Ubc") {
                let categoryArr = category.split("/");
                categoryArr.forEach( (o, j) => {
                  let yArr = this.chartOptions.series[j].data;
                  yArr.shift();
                  yArr.push(circuit[o]);
                  this.chartOptions.series[j].data = yArr;
                })
              }
              else {
                let yArr = this.chartOptions.series[0].data;
                yArr.shift();
                yArr.push(circuit[category]);
                this.chartOptions.series[0].data = yArr;
              }
              return
            }
          })

          this.chartOptions.xAxis.data = xArr;


        } catch(e){
          console.error("Error: error in table handleMqttStatus", e);
        }

        //将MQTT的格式转换成数组，方便遍历查找对应的回路信息
        function generateData (resData) {
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
        }
      },
      /*曲线显示配置*/
      handleChartSetting (value) {
        this.chartSetting = value;
        this.init();
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
  .loading {
    font-size: 14px;
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

  .tip {
    font-size: 14px;
    width: 100%;
    text-align: center;
  }

	.chart {
    width: 98%;
    height: 100%;
    margin: 0 auto;
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
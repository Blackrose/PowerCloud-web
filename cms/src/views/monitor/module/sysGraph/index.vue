<template>
	<monitor-box
    :title = "title"
    :titleIcon = "titleIcon"
    :paramValue = "paramValue"
    :selectOption = "selectOption"
    type = "sysGraph"
    @box-close = "handleClose"
    @box-full-screen = "handleFullScreen"
    @box-select-bar-change = "handleSelectBarChange"
  >
    <el-row ref="videoWrapperEle">
      <el-col :span="svgHeightRadio">
        <div :id="'svg-wrapper-'+moduleIndex" class="svg"
             v-html="svg"
             :style="{height:svgHeight}">
        </div>
      </el-col>
      <el-col :span="24-svgHeightRadio">
        <p>回路信息：</p>
      </el-col>
    </el-row>

  </monitor-box>
</template>

<script type="text/javascript">

	import MonitorBox from '@/views/monitor/component/box.vue'
  import {fetchList} from '@/api/api' ;
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
      boxHeight: {
        type: String,
        default: function () {
          return ""
        }
      },
      selectOption: {
        type: Array,
        default: function () {
          return []
        }
      },
	  },
	  data () {
    	return {
        stationId: 0,
    		title: "变电所系统图",
    		titleIcon: "el-icon-news",
        svg: "",
        stationStatusClient: null,
        MQTT_TOPIC: "/systemStatus",
        currentStatus: null,

    	}
  	},
  	computed: {
  	   svgHeight () {
  			if(this.boxHeight){
  				return `calc(${this.boxHeight} - 0.1rem - 38px)`;
  			}
  			else {
  				return "auto";
  			}
  		},
      svgHeightRadio  () {
        let radio = 18;
        try {
          if(this.svg){
            let tmpEle = document.createElement("div");
            tmpEle.innerHTML = this.svg
            let viewBox = tmpEle.querySelector("svg").getAttribute("viewBox").split(",")
            // console.log(viewBox);
          }

        } catch(e) {
          console.error("Error:error in get svgHeightRadio",e)
        }
        return radio
      }
  	},
  	created () {
      //变电站的的ID,从config里的paramValue参数中解析获取
      let param = JSON.parse(this.paramValue);
      //这里给stationId赋值，就自动触发了watch函数中的init函数，所以不用单独init
      this.stationId =  param.electricitySubstationid;
    },
    watch: {
      //监听变电所ID选择的切换,注销旧的MQTT事件。生成新的数据
      stationId: function(newValue, oldValue) {
        if(this.stationStatusClient) {
          mqttUnsubscribe(this.stationStatusClient, this.MQTT_TOPIC+"/"+oldValue)
        }
        this.init();
      }
    },
  	methods: {
      handleSelectBarChange (value) {
        this.stationId = value[1];
      },
      init() {

        let self = this;
        console.log(self.stationId)
        let param = {
          page: 1,
          limit: 1,
          search: {"id":self.stationId}
        }
        fetchList("electricitySubstation", param).then(response => {
          if(response.data){
            try {
              self.svg = response.data.items[0].diagram;

              //注册MQTT事件
              if(!self.stationStatusClient) {
                initMqttConnection(function(client) {
                  self.stationStatusClient = client;
                  mqttSubscribe(self.stationStatusClient, self.MQTT_TOPIC+"/"+self.stationId);
                }, self.handleMqttStatus);
              }
              else {
                mqttSubscribe(self.stationStatusClient, self.MQTT_TOPIC+"/"+self.stationId);
              }

              //绑定点击事件
              self.$nextTick( () => {
                self.bindEvent();
              })
            }
            catch(e) {
              console.error("Error: in getStationData", e)
            }

          }
        })


      },
      handleMqttStatus (msg) {
        //判断是哪个变电站 TODO
        console.log("==== handle Mqtt system graph status ====");
        try {
          var topic = msg.destinationName;
          // console.log(msg.payloadString);
          var data = JSON.parse(msg.payloadString);
          this.currentStatus = data;
          this.setSysData(data, "电力系统图");
        } catch(e){console.error("Error: error in onMessageArrived", e)}
      },
      handleClose () {
      	this.$emit("module-close",this.moduleIndex);
      },
      handleFullScreen () {
      	this.$emit("module-full-screen",this.moduleIndex);
      },
      setSysData (data,title) {
        /*if(title) {
          document.querySelector(".s-t-title tspan").innerHTML = title;
        }*/

        let svgRootEle = document.querySelector("#svg-wrapper-"+this.moduleIndex);

        var groupEle = svgRootEle.querySelectorAll(".s-group");
        var vmEle = svgRootEle.querySelectorAll(".s-t-vm tspan");
        var cabinetEle = svgRootEle.querySelectorAll(".s-t-cabinet");
        var circuitEle = svgRootEle.querySelectorAll(".s-t-circuit");
        //所有电表
        var rectEle = svgRootEle.querySelectorAll(".s-rect");

        data.forEach( (item,i) => {
          var info1 = "";
          for( var o in item.vm) {
            info1 +=  `${o}: ${toFixed((item.vm)[o], 2)}  `;
          }
          vmEle[i].innerHTML = info1;

          //进线柜信息
          var cab_nodes = cabinetEle[i].childNodes;
          cab_nodes[0].innerHTML = "Uab: "+ toFixed(item.cabinet.Uab, 2);
          cab_nodes[1].innerHTML = "Ubc: "+ toFixed(item.cabinet.Ubc, 2);
          cab_nodes[2].innerHTML = "Uac: "+ toFixed(item.cabinet.Uac, 2);
          cab_nodes[3].innerHTML = "Ia: "+ toFixed(item.cabinet.Ia, 2);
          cab_nodes[4].innerHTML = "Ib: "+ toFixed(item.cabinet.Ib, 2);
          cab_nodes[5].innerHTML = "Ic: "+ toFixed(item.cabinet.Ic, 2);

          cab_nodes[6].innerHTML = "";
          // cab_nodes[6].innerHTML = "cosφ: "+ item.cabinet.cosφ;
          //进线柜 电表颜色
          setColor(svgRootEle.querySelectorAll(".s-cab-rect")[i],item.cabinet.status);

          /*//电容柜 电表颜色
          item.capacity.forEach( (ca, ca_i) => {
            var caEle = groupEle[i].querySelectorAll(".s-cap-rect")[ca_i];
            setColor(caEle,item.cabinet.status);
          })*/

          //配电柜信息
          var distributing = item.distributing
          distributing.forEach( (d,d_i) => {
            d.forEach( (c,c_i) => {
              var _i = i*data.length*d.length + d_i*d.length + c_i;
                var circuit_nodes= circuitEle[_i].childNodes;
              circuit_nodes[0].innerHTML = "Ia: "+ toFixed(c.Ia, 2);
              circuit_nodes[1].innerHTML = "Ib: "+ toFixed(c.Ib, 2);
              circuit_nodes[2].innerHTML = "Ic: "+ toFixed(c.Ic, 2);

              var cirEle = svgRootEle.querySelectorAll(".s-rect")[_i];
              setColor(cirEle,c.status);

            })
          })
        })

        function setColor(ele,status) {
          ele.setAttribute("fill",status == 0 ? "#e53935" : "#4caf50");
        }

        function toFixed(v,num) {
          if(+v == v) {
            return (+v).toFixed(num);
          }
          else {
            return v
          }
        }
      },
      bindEvent () {
        let svgRootEle = document.querySelector("#svg-wrapper-"+this.moduleIndex);
        let circuitEle = svgRootEle.querySelectorAll(".s-circuit");

        console.log(circuitEle)
        circuitEle.forEach( (ele, i) => {
          ele.removeEventListener("click", this.handleCircuitClick);
          ele.addEventListener("click", this.handleCircuitClick);
        })
      },
      handleCircuitClick (e) {
        let targetEle = e.target;
        let textEle = targetEle.querySelectorAll(".s-t-circuit");
        console.log(this.currentStatus)
      }
  	}
  }

</script>
<style type="text/css">
  .s-circuit {
    cursor: pointer;
  }
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
	.svg {
    width: 100%;
    position: relative;
    top: -15px;
  }



</style>
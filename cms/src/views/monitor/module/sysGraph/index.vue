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
    <el-row class="svg-wrapper">
      <el-col :xs="14" :sm="14" :md="14" :lg="16" :xl="16"
        :style="{height:svgHeight}">
        <div :id="'svg-wrapper-'+moduleIndex" class="svg" v-html="svg"></div>
      </el-col>
      <!-- 当前回路信息 -->
      <el-col :xs="10" :sm="10" :md="10" :lg="8" :xl="8"
        v-if="showCircuitData"
        class="info-box"
        :style="{height:infoBoxHeight}">
        <p class="name">
          <svg-icon icon-class="circuit"></svg-icon>&nbsp;
          {{showCircuitData.name}}
        </p>
        <div class="value-box">
          <p class="value-u">
            <span>电压</span>
            <span>{{showCircuitData.Uab | filterNumber}}</span>
            <span>{{showCircuitData.Uac | filterNumber}}</span>
            <span>{{showCircuitData.Ubc | filterNumber}}</span>
          </p>
          <p class="value-i">
            <span>电流</span>
            <span>{{showCircuitData.Ia | filterNumber}}</span>
            <span>{{showCircuitData.Ib | filterNumber}}</span>
            <span>{{showCircuitData.Ic | filterNumber}}</span>
          </p>
        </div>
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
    		titleIcon: "struct",
        svg: "",
        stationStatusClient: null,
        MQTT_TOPIC: "/systemStatus",
        currentStatus: null, //MQTT实时收到的当前回路信息
        currentCircuitIndex: 0, //当前显示的回路的信息
        /*showCircuitData: {
          name: "回路信息",
          Uab: "-",
          Ubc: "-",
          Uac: "-",
          Ia: "-",
          Ib: "-",
          Ic: "-"
        }*/
    	}
  	},
  	computed: {
  	  svgHeight () {
        return this.boxHeight ? `calc(${this.boxHeight} - 0.15rem - 38px)` : "auto";
  		},
      infoBoxHeight () {
        return this.boxHeight ? `calc(${this.boxHeight} - 0.25rem - 45px)` : "auto";
      },
      //所有回路的信息汇总成数组
      circuitStatus () {
        let arr = [];
        if(this.currentStatus) {
          this.currentStatus.forEach( (o) => {
            if(o.distributing && Array.isArray(o.distributing)) {
              //遍历配线柜
              o.distributing.forEach( (d) => {
                if(Array.isArray(d)) {
                  //遍历配线柜中的回路
                  d.forEach( (c) => {
                    arr.push(c)
                  })
                }
              } )
            }
          })
        }
        return arr
      },
      showCircuitData () {
        if(this.currentStatus) {
          return this.circuitStatus[this.currentCircuitIndex]
        }
        else {
          return {
            name: "回路信息",
            Uab: "-",
            Ubc: "-",
            Uac: "-",
            Ia: "-",
            Ib: "-",
            Ic: "-"
          }
        }
      }
  	},
    filters: {
      filterNumber(n) {
        return (+n == n) ? n : "-"
      }
    },
  	created () {
      console.log("~~~~~~~~")
      //变电站的的ID,从config里的paramValue参数中解析获取
      let param = JSON.parse(this.paramValue);
      //这里给stationId赋值，就自动触发了watch函数中的init函数，所以不用单独init
      this.stationId =  param.electricitysubstationid;
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
              this.currentStatus = null;
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
        console.log("==== handle Mqtt SVG status ====");
        try {
          var topic = msg.destinationName;
          // console.log(msg.payloadString);
          var data = JSON.parse(msg.payloadString);
          this.currentStatus = data;
          this.setSysData(data, "电力系统图");
        } catch(e){/*console.error("Error: error in onMessageArrived", e)*/}
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
              // circuit_nodes[0].innerHTML = "Ia: "+ toFixed(c.Ia, 2);
              // circuit_nodes[1].innerHTML = "Ib: "+ toFixed(c.Ib, 2);
              // circuit_nodes[2].innerHTML = "Ic: "+ toFixed(c.Ic, 2);
                circuit_nodes[0].innerHTML = "";
                circuit_nodes[1].innerHTML = "";
                circuit_nodes[2].innerHTML = "";

              var cirEle = svgRootEle.querySelectorAll(".s-rect")[_i];
              setColor(cirEle,c.status);

            })
          })
        })

        function setColor(ele,status) {
          ele.setAttribute("fill",status == 0 ? "#e53935" : "#4caf50");
        }

        function toFixed(v,num) {
          return (+v == v) ? (+v).toFixed(num) : v;
        }
      },
      bindEvent () {
        let svgRootEle = document.querySelector("#svg-wrapper-"+this.moduleIndex);
        let circuitEle = svgRootEle.querySelectorAll(".s-circuit");

        // console.log(circuitEle)
        circuitEle.forEach( (ele, i) => {
          ele.setAttribute("data-i", i);
          ele.removeEventListener("click", this.handleCircuitClick);
          ele.addEventListener("click", this.handleCircuitClick);
        })
      },
      handleCircuitClick (e) {
        let targetEle = e.target;
        this.currentCircuitIndex = +targetEle.getAttribute("data-i");
        // this.showCircuitData = this.circuitStatus[this.currentCircuitIndex];
        // console.log(this.showCircuitData);
        // console.log(this.circuitStatus[index])
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
  .svg-wrapper {
    & > .el-col {
      height: 100%;
    }

    .svg {
      height: 100%;
      width: 100%;
      position: relative;
      top: -10px;
    }
  }

  .svg-wrapper::-webkit-scrollbar {/*滚动条整体样式*/
      width: 10px;     /*高宽分别对应横竖滚动条的尺寸*/
      height: 4px;
  }
  .svg-wrapper::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
      border-radius: 5px;
      background: rgba(255,255,255,0.7);
  }
  .svg-wrapper::-webkit-scrollbar-track {/*滚动条里面轨道*/
      border-radius: 5px;
      background: rgba(255,255,255,0.1);
  }


  .info-box {
    overflow:overlay;
    // min-width: 120px;
    padding-left: 0.1rem;
    // padding: 0.1rem 0 0 0.1rem;
    // background: rgba(255,255,255,0.2);
    text-align: left;
    .name {
      font-size: 16px;
    }

  }

  .info-box::-webkit-scrollbar {/*滚动条整体样式*/
      width: 10px;     /*高宽分别对应横竖滚动条的尺寸*/
      height: 4px;
  }
  .info-box::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
      border-radius: 5px;
      background: rgba(255,255,255,0.7);
  }
  .info-box::-webkit-scrollbar-track {/*滚动条里面轨道*/
      border-radius: 5px;
      background: rgba(255,255,255,0);
  }

  .value-box {
    & > p {
      // max-width: 55%;
      display: flex;
      justify-content: flex-start;
      margin: 0.02rem 0;
      flex-wrap: wrap;

      & > span {
        padding: 0.035rem 0;
        line-height: 1;
        display: inline-block;
        border-radius: 3px;
        text-align: center;
        margin: 0.02rem;
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

    p.value-u > span:first-child,
    p.value-i > span:first-child {
      color: #fff;
      background: transparent;
    }


  }


</style>
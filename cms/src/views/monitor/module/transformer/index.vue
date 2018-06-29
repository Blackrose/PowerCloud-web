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
    <div :class="[monitor.fullScreenIndex == moduleIndex ? 'is-full-screen' : '', 'wrapper']" v-if="data" ref="infoBoxEle">
  		<el-row>
        <el-col class="line">
          <svg-icon class="icon"  icon-class="load"></svg-icon>
          <span>电流载荷：{{data.currentload||"-"}}</span>
        </el-col>
        <!-- <el-col class="sub-line">电流载荷：{{data.currentload||"-"}}</el-col> -->

       <!--  <el-col class="line temperature-wrapper">
          <svg-icon class="icon"  icon-class="temperature"></svg-icon>
          <span>温度&nbsp;&nbsp;&nbsp;{{data.temperature||"-"}} ℃</span>
        </el-col> -->
  		</el-row>
      <el-row>
        <el-col class="line">
          <svg-icon class="icon"  icon-class="flash"></svg-icon>
          <span>功率信息</span>
        </el-col>
        <el-col class="sub-line">功率因数：{{data.powerfactor||"-"}}</el-col>
        <el-col class="sub-line">
          <span>有功功率：{{data.activepower||"-"}}</span>
          <span>无功功率：{{data.reactivepower||"-"}}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="line">
          <svg-icon class="icon"  icon-class="current"></svg-icon>
          <span>电压电流信息</span>
        </el-col>
        <el-col class="sub-line current">
          <span><i>Ia</i>:&nbsp;<b>{{data.Ia||"-"}}</b></span>
          <span><i>Ib</i>:&nbsp;<b>{{data.Ib||"-"}}</b></span>
          <span><i>Ic</i>:&nbsp;<b>{{data.Ic||"-"}}</b></span>
        </el-col>
        <el-col class="sub-line current">
          <span><i>Ua</i>:&nbsp;<b>{{data.Ua||"-"}}</b></span>
          <span><i>Ub</i>:&nbsp;<b>{{data.Ub||"-"}}</b></span>
          <span><i>Uc</i>:&nbsp;<b>{{data.Uc||"-"}}</b></span>
        </el-col>
        <el-col class="sub-line current">
          <span><i>Uab</i>:&nbsp;<b>{{data.Uab}}</b></span>
          <span><i>Ubc</i>:&nbsp;<b>{{data.Ubc}}</b></span>
          <span><i>Uac</i>:&nbsp;<b>{{data.Uac}}</b></span>
        </el-col>
      </el-row>
    </div>
    <el-row v-else class="tip"><el-col>暂无数据</el-col></el-row>
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
	    }
	  },
	  data () {
    	return {
        stationId: 0,
    		transformerId: 0,
    		title: "变压器信息",
    		titleIcon: "transformer",
        data: null, // 变压器信息
        client: null,
        MQTT_TOPIC: "/systemStatus",
        // transformerImg,
    	}
  	},
    computed: {
      ...mapGetters([
      'monitor'
      ])
    },
  	created () {
  		//变电站视频的ID,从config里的paramValue参数中解析获取
			let param = JSON.parse(this.paramValue);
			//触发watch事件，init
      this.stationId = param.electricitysubstationid;
			this.transformerId =  param.transformerid;
  	},
  	watch: {
  		//监听变电所ID选择的切换,注销旧的MQTT事件。生成新的数据
  		transformerId: function(newValue, oldValue) {
        if(this.client) {
          mqttUnsubscribe(this.client, this.MQTT_TOPIC+"/"+oldValue)
        }
  			this.init();
  		}
  	},
  	methods: {
  		init () {
        let self = this;
        self.data = null;

        getStationData(this.stationId).then( res => {
          if(res.ok) {
            this.data = this.generateTransformerData(JSON.parse(res.data));
          }
        })

        //注册MQTT事件
        if(!self.client) {
          initMqttConnection(function(client) {
            self.client = client;
            mqttSubscribe(self.client, self.MQTT_TOPIC+"/"+self.transformerId);
          }, self.handleMqttStatus);
        }
        else {
          mqttSubscribe(self.client, self.MQTT_TOPIC+"/"+self.transformerId);
        }

  		},
      handleMqttStatus (msg) {
        console.log("==== handle Mqtt TRANSFORMER station data ====");
        try {
          let sysData = JSON.parse(msg.payloadString);
          this.data = this.generateTransformerData(sysData);

          //高亮动画
          if(this.$refs.infoBoxEle) {
            this.$refs.infoBoxEle.classList.add("highlight");
          }
          setTimeout( () => {
            if(this.$refs.infoBoxEle) {
              this.$refs.infoBoxEle.classList.remove("highlight");
            }
          }, 600)

        } catch(e){
          console.error("Error: error in transformer handleMqttStatus", e);
        }
      },
  		handleSelectBarChange (value) {
        this.stationId = value[1];
  			this.transformerId = value[2];
  		},
      handleClose () {
        /*注销MQTT订阅*/
        if(this.client) {
          mqttUnsubscribe(this.client, this.MQTT_TOPIC+"/"+this.transformerId)
        }
      	this.$emit("module-close",this.moduleIndex);
      },
      handleFullScreen () {
      	this.$emit("module-full-screen",this.moduleIndex);
      },
      generateTransformerData (sysDataArr) {
        let data = null;
        if(Array.isArray(sysDataArr)) {
          sysDataArr.forEach( (d, i) => {
            if(d.cabinet && d.cabinet.transformid == this.transformerId) {
              data = {
                "id": d.cabinet.transformid,
                // "temperature": d.cabinet.temperature,
                "currentload": d.cabinet.currentload,
                "powerfactor": d.cabinet.powerfactor,
                "activepower": d.cabinet.activepower,
                "reactivepower": d.cabinet.reactivepower,
                "Ia": d.cabinet.Ia,
                "Ib": d.cabinet.Ib,
                "Ic": d.cabinet.Ic,
                "Ua": d.vm.Ua,
                "Ub": d.vm.Ub,
                "Uc": d.vm.Uc,
                "Uab": d.cabinet.Uab,
                "Ubc": d.cabinet.Ubc,
                "Uac": d.cabinet.Uac
              }
              return
            }
          })
          return data || this.data;
        }
      }
  	}
  }

</script>

<style rel="stylesheet/scss" lang="scss" scoped>

  $color_danger:#F56C6C;
  $color_warning:#E6A23C;
  $color_success:#00c853;

  .wrapper {
    height: 100%;
    overflow: overlay;
  }
  .wrapper::-webkit-scrollbar {/*滚动条整体样式*/
      width: 10px;     /*高宽分别对应横竖滚动条的尺寸*/
      height: 4px;
  }
  .wrapper::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
      border-radius: 5px;
      background: rgba(255,255,255,0.7);
  }
  .wrapper::-webkit-scrollbar-track {/*滚动条里面轨道*/
      border-radius: 5px;
      background: rgba(255,255,255,0.1);
  }
  .el-row {
    margin: 10px;
    margin-bottom: 20px;
    .el-col {
      padding-left: 10%;
    }
    .icon {
      margin-right: 1%;
      font-size: 28px;
      margin-left: -10%;
    }

    .transformer {
      font-size: 200px;
    }

    .line {
      font-weight: bold;
      color: #b3edff;
      font-size: 16px;
      display: flex;
      align-items: center;
      padding-bottom: 0.08rem;
    }

    .line.temperature-wrapper {
      font-size: 26px;
      padding-top: 0.133333rem;
      color: $color_warning;

      // font-weight: 100;
    }

    .sub-line {
      padding-left: 11%;
      font-size: 14px;
      margin: 0.05rem 0;
      text-align: left;
      display: flex;

      span {
        margin-right: 0.133333rem;
      }
      // justify-content: space-between;
    }

    .sub-line.current {
      span {
        width: 30%;
        display: inline-block;
        i {
          display: inline-block;
          width: 30px;
          font-style: normal;
          // margin-right: 5px;
        }
        b {

          display: inline-block;
          min-width: 35px;
          font-weight: normal;
        }
      }
    }

  }

  /* 全屏 */
  .is-full-screen {
    .el-row {
      margin-bottom: 40px;
      .line {
        font-size: 20px;
      }
      .line.temperature-wrapper {
        margin-top: 20px;
        font-size: 30px;
      }
      .sub-line {
        font-size: 18px;
        transition:textShadow .5s ease;
      }
    }
  }

  .wrapper.highlight {
    .sub-line {
      text-shadow:0 0 0.1em rgba(255,193,7,0.8),
                -0 -0 0.1em rgba(255,193,7,0.8);
    }

  }

  .tip {
    margin: 0;
    font-size: 14px;
    width: 100%;
    height: 100%;
    display: flex;
    align-items:center;
    .el-col {
      padding: 0;
    }
  }

</style>
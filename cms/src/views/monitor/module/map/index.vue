<template>
	<monitor-box
		:title = "title"
		:titleIcon = "titleIcon"
    @box-close = "handleClose"
    @box-full-screen = "handleFullScreen"
	>
		<div :id="getMapId()" class="allmap" :style="{height:mapHeight}"></div>
    <!-- 员工信息 -->
    <transition name="el-fade-in-linear">
      <div id="user-box" v-show="visibleUserInfo">
        <a href="javascript:void(0)" id="x-btn" @click="visibleUserInfo=false"><svg-icon icon-class="x"></svg-icon></a>
        <div id="user-info" v-if="staffDetail">
          <p class="name">员工编号：{{staffDetail.id||"-"}}</p>
          <p class="name">员工姓名：{{staffDetail.name||""}}</p>
          <p class="name">所属公司：{{staffDetail.sccompanyname||"-"}}</p>
          <p class="name">当前职称：{{staffDetail.positionaltitle||"-"}}</p>
          <p class="name">办公电话：{{staffDetail.tel||"-"}}</p>
          <p class="name">移动电话：{{staffDetail.phone||"-"}}</p>
          <p class="status">在岗状态：<i :class="[staffDetail.status == 0 ? 'el-icon-success success' : 'el-icon-warning warning']"></i></p>
        </div>
      </div>
    </transition>
    <div class="btn-bar">
      <el-switch class="tag-switch"
        v-model="isTagsOn"
        inactive-color="#999"
        active-text="标签">
      </el-switch>
    </div>
	</monitor-box>
</template>

<script type="text/javascript">
	import MonitorBox from '@/views/monitor/component/box.vue';
	import {mapStyle} from '@/views/monitor/lib/mapStyle.js';
  //把百度地图的两个开源库合成一个了
  import {BMapLib} from '@/views/monitor/lib/bMapLib_RichMarker_MarkerManager.js';
  //坐标转换
  const coorConvert = require('@/views/monitor/lib/coor-convert.js');
  import {getMapPoint, getStaffDetail, initMqttConnection, mqttSubscribe, mqttUnsubscribe} from '@/api/api_monitor' ;


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
      boxHeight: {
        type: String,
        default: function () {
          return ""
        }
      }
    },
	  data () {
    	return {
    		title: "位置显示",
    		titleIcon: "position",
    		map: null,
        isTagsOn: false,
        mapMgrArr: [],
        totalPoint: [],
        client: null, //mqtt客户端
        MQTT_TOPIC: "/stationStatus",
        visibleUserInfo: false,
        staffDetail: null, //员工信息
    	}
  	},
    watch: {
      isTagsOn (newValue, oldValue) {
        let mapRootEle = document.querySelector("#"+this.getMapId());
        //全开
        if(newValue) {
          mapRootEle.querySelectorAll(".p-tag").forEach( (ele, i) => {
            ele.classList.add("on");
          })
        }
        else {
          mapRootEle.querySelectorAll(".p-tag").forEach( (ele, i) => {
            ele.classList.remove("on");
          })
        }
      }
    },
    computed: {
      mapHeight () {
        return this.boxHeight ? `calc(${this.boxHeight} - 2px)` : "auto";
      }
    },
  	mounted () {
  		// 百度地图API功能
	    // 地图不可点
  		let mapOpts = {enableMapClick:false}
	    this.map = new BMap.Map("allmap-"+this.moduleIndex, mapOpts);    // 创建Map实例

	    this.map.setMapStyle({
	      styleJson:mapStyle
	    });

	    this.map.centerAndZoom(new BMap.Point(123.4, 41.8), 14);  // 初始化地图,设置中心点坐标和地图级别
	    this.map.setCurrentCity("沈阳");          // 设置地图显示的城市 此项是必须设置的
	    this.map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
	    this.map.disableDoubleClickZoom();        //禁用双击放大


	    var ctrlOpts = {offset: new BMap.Size(20, 70)}
	    this.map.addControl(new BMap.NavigationControl(ctrlOpts));   //缩放按钮

      let self = this;
	    this.renderPoint().then(function() {
	      self.bindEvent();
        //订阅MQTT主题
	      initMqttConnection(function(client) {
	        self.client = client;
	        mqttSubscribe(self.client, self.MQTT_TOPIC);
	      }, self.handleMqttStatus);

	    });

  	},
  	created () {


  	},
  	methods: {
      getMapId () {
        return "allmap-"+this.moduleIndex;
      },
  		renderPoint () {
        let markersArr = [];
        let pointsArr = [];
        for(let i = 0 ; i < 3 ;i++) {
          this.mapMgrArr.push(new BMapLib.MarkerManager(this.map,{borderPadding: 10,maxZoom: 21, trackMarkers: true}));
          markersArr.push([]);
          pointsArr.push([]);
        }

        let self = this;
        return new Promise(function(resolve,reject){
          Promise.all([
            getMapPoint(1),
            getMapPoint(2),
            getMapPoint(3)
          ]).then(function(res_arr){
            res_arr.forEach( (res, i) => {
              if(res.ok && res.data) {
                let _data = typeof(res_arr[0].data) == "string" ?
                            JSON.parse(res.data) : res.data;
                _data.forEach( (o,_i) => {
                  try {
                    if(o.pos) {
                      let pos = JSON.parse(o.pos);
                      let convertor = coorConvert.coorConvert.wgs2bd(pos.longitude, pos.latitude);
                      pointsArr[i].push(new BMap.Point(convertor[0], convertor[1]));
                      let html;
                      //企业
                      if(i == 0) {
                        html = "<div class='p p-company' data-id='"+o.id+"' data-pos='"+convertor.join("|")+"'><span class='p-tag'>"+o.tag+"</span></div>";
                      }
                      //变电站
                      else if(i == 1) {
                        html = "<div class='p p-station s-0-0' data-id='"+o.id+"' data-pos='"+convertor.join("|")+"'><span class='p-tag'>"+o.tag+"</span></div>";
                      }
                      //员工
                      else if(i == 2) {
                        html = "<div class='p p-staff' data-id='"+o.id+"' data-pos='"+convertor.join("|")+"'><span class='p-tag'>"+o.tag+"</span></div>";
                      }
                      var marker = new BMapLib.RichMarker(html, pointsArr[i][_i]);
                      markersArr[i].push(marker);
                    }
                  }
                  catch(e) {console.error(e)}
                })
                self.mapMgrArr[i].addMarkers(markersArr[i],1,20)
                self.mapMgrArr[i].showMarkers();
              }
            })

            self.totalPoint = (pointsArr[0].concat(pointsArr[1])).concat(pointsArr[2])
            self.map.setViewport(self.totalPoint);

            resolve();

          })
        });
  		},
      bindEvent () {
        let mapRootEle = document.querySelector("#"+this.getMapId());
        // tagEvent;
        let pointEles = mapRootEle.querySelectorAll(".p-staff, .p-company, .p-station");
        pointEles.forEach( (ele, i) => {
          ele.addEventListener("mouseenter", handleMouseEnter);
          ele.addEventListener("mouseleave", handleMouseLeave);
        })
        //点击员工头像
        let staffEles = mapRootEle.querySelectorAll(".p-staff");
        staffEles.forEach( (ele, i) => {
          ele.addEventListener("click", handleStaffClick);
        })

        //点击变电站
        let stationEles = mapRootEle.querySelectorAll(".p-station");
        stationEles.forEach( (ele, i) => {
          ele.addEventListener("click", handleStationClick);
        })

        let self = this;

        function handleMouseEnter(e) {
          e.target.querySelectorAll(".p-tag").forEach( (ele, i) => {
            ele.classList.add("on");
          })
        }

        function handleMouseLeave(e) {
          e.target.querySelectorAll(".p-tag").forEach( (ele, i) => {
            ele.classList.remove("on");
          })
        }

        function handleStaffClick(event) {
          let staffid;
          if(event.target.nodeName.toUpperCase() == "SPAN") {
            let parent = event.target.parentNode;
            staffid = parent.getAttribute("data-id");
          }
          else {
            staffid = event.target.getAttribute("data-id");
          }

          getStaffDetail(staffid).then( res => {
            self.staffDetail = JSON.parse(res.data);
            self.visibleUserInfo = true;
          })
        }

        function handleStationClick(e) {
          let stationid;
          if(event.target.nodeName.toUpperCase() == "SPAN") {
            let parent = event.target.parentNode;
            stationid = parent.getAttribute("data-id");
          }
          else {
            stationid = event.target.getAttribute("data-id");
          }
          //存储此时点击的变电站ID
          self.$store.dispatch('setMonitorStationIndex',stationid);
        }
      },
      handleMqttStatus (msg) {
        console.log("==== handle Mqtt MAP station status ====");
        try {
          let mapRootEle = document.querySelector("#"+this.getMapId());
          // console.log(msg.payloadString);
          mapRootEle.querySelectorAll(".p-station").forEach( (ele, i) => {
            ele.setAttribute("class", "p p-station s-0-0");
          })
          let data = JSON.parse(msg.payloadString)
          /*let data = [
            {
                companyId: 1, //企业Id
                id: 1,        // 变电站id
                statusA: 0,   // 正常（0）、处理中（1）、报警（2）
                statusB: 1    // 正常（0）、过载（1）、重载（2）
            },
            {
                companyId: 2, //企业Id
                id: 5,
                statusA: 1,
                statusB: 2
            }
          ];*/
          let statusAText = ["正常", "处理中", "报警"];
          let statusBText = ["载荷正常", "过载", "重载"];
          //告警提示的HTML
          let html = [];

          data.forEach(function(o,i) {
            o.statusA = o.statusA || 0;
            o.statusB = o.statusB || 0;
            let stationEles = mapRootEle.querySelectorAll(".p-station[data-id]");
            stationEles.forEach( (ele, i) => {
              if(ele.getAttribute("data-id") == o.id) {
                ele.classList.remove('s-0-0');
                ele.classList.add(['s', o.statusA, o.statusB].join("-"));
                //告警提示
                let name = ele.querySelector(".p-tag").innerHTML;
                html.push(`<p><i class='el-icon-caret-right'></i>${name}：${statusAText[+o.statusA]} - ${statusBText[+o.statusB]}</p>`);
              }
            })
          });
          //更新右上角告警TIP的内容
          this.$emit("station-alert",html);
          /*this.$notify({
            title: '告警',
            dangerouslyUseHTMLString: true,
            message: html.join(""),
            type: 'warning',
            position: 'top-left',
            offset: 50,
            duration: 0
          });*/

        }catch(e) {console.error(e)}
      },
      handleClose () {
        /*注销MQTT订阅*/
        if(this.client) {
          mqttUnsubscribe(this.client, this.MQTT_TOPIC)
        }
        this.$emit("module-close",this.moduleIndex);
      },
      handleFullScreen () {
        this.$emit("module-full-screen",this.moduleIndex);
      },
  	}
	}
</script>

<style type="text/css">
	.BMap_cpyCtrl {
    display: none;
	}
	.anchorBL {
    display: none;
	}
  .p {
    position: relative;
  }
  .p.here {
    animation: pointHere 2s ease!important;
  }
  @keyframes pointHere {
    0% {
      transform: scale(1);
    }
    30% {
      transform: scale(2);
      filter: brightness(1.3);
      box-shadow: 0 0 20px rgba(255,246,105,0.6);
    }
    100% {
      transform: scale(1);
    }
  }

  .p-company {
    display: inline-block;
    width: 55px;
    height: 55px;
    line-height: 55px;
    border-radius: 50%;
    background: url(../../assets/p-company.png);
    background-size: cover;
    border:5px rgba(255,255,255,0.3) solid;
    background-clip: content-box;
    border-radius: 50%;
    /*animation: pCompany 2s ease infinite;*/
  }

  .p-station {
    display: inline-block;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background-image: url(../../assets/p-station.png);
    background-color: #00c853;
    background-size: cover;
    border-radius: 50%;
    border: 5px #00c853 solid;
    animation: pStation 2s ease infinite;
  }
  @keyframes pStation {
    0% {
      box-shadow: 0 0 10px rgba(255,246,105,0.2);
    }
    40% {
      box-shadow: 0 0 50px rgba(255,246,105,1);
    }
    100% {
      box-shadow: 0 0 10px rgba(255,246,105,0.2);
    }
  }
  .p-station.s-0-0 {
    animation: none;
  }
  .p-station.s-0-1,.p-station.s-0-2 {
    background-color: #00c853;
  }
  .p-station.s-1-0,.p-station.s-1-1,.p-station.s-1-2 {
    background-color: #F1C40F;
  }
  .p-station.s-2-0,.p-station.s-2-1,.p-station.s-2-2 {
    background-color: #ff5722;
  }
  .p-station.s-0-0,.p-station.s-1-0,.p-station.s-2-0 {
    border-color: #00c853;
  }
  .p-station.s-0-1,.p-station.s-1-1,.p-station.s-2-1 {
    border-color: #F1C40F;
  }
  .p-station.s-0-2,.p-station.s-1-2,.p-station.s-2-2 {
    border-color: #ff5722;
  }



  .p-staff {
    display: inline-block;
    width: 20px;
    height: 20px;
    background: url(../../assets/staff-pic.png);
    background-size: cover;
    border-radius: 50%;
  }

  .p-tag {
    font-size: 16px;
    position: absolute;
    left: calc(100% + 3px);
    top: -3px;
    background: rgba(255,255,255,.8);
    padding: 7px;
    z-index: 100;
    /*display: none;*/
    box-shadow: 0 0 30px rgba(0,0,0,0.8);
    /*display: block;*/
    transform: translate3d(0,0,0) scale(0);  /*translate3d 解决渲染被切片的问题*/
    transition: transform .2s ease;
    transform-origin: 0 50%;
    border-radius: 3px;
    margin-left: 7px;
    white-space: nowrap;
  }
  .p-tag:after {
    content: '';
    width: 0px;
    height: 0px;
    border: 4px #fff solid;
    border-color: transparent transparent rgba(255,255,255,.9) rgba(255,255,255,.8)   ;
    position: absolute;
    top: 7px;
    left: -4px;
    transform: rotate(45deg);
    background: transparent;
  }
  .p-tag.on{
    transform: translate3d(0,0,0) scale(1);
    /*display: block;*/
  }
  .p-company .p-tag {
    margin-left: 12px;
    height: inherit;
    line-height: 40px;
    top: -8px;
    border-radius: 8px;
  }
  .p-company .p-tag:after {
    top: 25px;
  }
  .p-station .p-tag:after {
    top: 10px;
  }



  #user-box {
    padding: 0.1rem;
    /*border: 1px rgb(90,161,249) solid;*/
    border-radius: 0.04rem;
    background: rgba(255,255,255,0.9);
    position: absolute;
    left: 0.1rem;
    bottom: 40px;
    color: #333;
  }


  #user-info > p {
    text-align: left;
    font-weight: bold;
    font-size: 12px;
  }

  #x-btn {
    position: absolute;
    right: 10px;
    top: 10px;
  }

  .tag-switch  .el-switch__label span {
    color: #eee;
    font-weight: bold;
  }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
  .box-card {
    overflow:hidden;
  }
	.allmap {
    // border-radius: 5px;
    overflow: hidden;
		width: 100%;
		height: auto; //todo
		background: #fff;
		position: absolute;
		top: 0;
		left: 0;
	}

  .btn-bar {
    height: 35px;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 0 20px;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    flex-direction: row-reverse;
  }

  .success {
    color: green;
  }
  .warning {
    color: orange;
  }



</style>
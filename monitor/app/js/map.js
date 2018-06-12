	import {mapStyle} from './lib/mapStyle.js';
  //把百度地图的两个开源库合成一个了
  import {BMapLib} from './lib/bMapLib_RichMarker_MarkerManager.js';
  var api = require('./api.js');
  var coorConvert = require('./lib/coor-convert.js');
  var pop = require('./pop.js');

  var map;
	var mapMgr1;
	var mapMgr2;
	var mapMgr3;

  var totalPoint = [];

  var stationStatusClient;
  const MQTT_TOPIC = "/stationStatus";

	function init() {
    // 百度地图API功能
    //地图不可点
    var mapOpts = {enableMapClick:false}
    map = new BMap.Map("allmap", mapOpts);    // 创建Map实例

    map.setMapStyle({
      styleJson:mapStyle
    });

    // var mapStyle={  style : "midnight" }
    // map.setMapStyle(mapStyle);

    map.centerAndZoom(new BMap.Point(123.4, 41.8), 14);  // 初始化地图,设置中心点坐标和地图级别
    map.setCurrentCity("沈阳");          // 设置地图显示的城市 此项是必须设置的
    map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
    map.disableDoubleClickZoom();        //禁用双击放大
    var h = $(window).height() - 270;
    var ctrlOpts = {offset: new BMap.Size(20, h)}
    map.addControl(new BMap.NavigationControl(ctrlOpts));   //缩放按钮

    renderPoint().then(function() {
      bindEvent();

      api.initMqttConnection(function(client) {
        stationStatusClient = client;
        var topic = MQTT_TOPIC;
        api.mqttSubscribe(stationStatusClient, topic);
      }, handleMqttStatus);

    });

 //    var pt = new BMap.Point(116.417, 39.909);
	// var myIcon = new BMap.Icon("http://lbsyun.baidu.com/jsdemo/img/fox.gif", new BMap.Size(300,157));
	// var marker2 = new BMap.Marker(pt,{icon:myIcon});  // 创建标注
	// map.addOverlay(marker2);              // 将标注添加到地图中
  }


  function renderPoint() {
  	mapMgr1 = new BMapLib.MarkerManager(map,{borderPadding: 10,maxZoom: 21, trackMarkers: true});
  	mapMgr2 = new BMapLib.MarkerManager(map,{borderPadding: 10,maxZoom: 21, trackMarkers: true});
  	mapMgr3 = new BMapLib.MarkerManager(map,{borderPadding: 10,maxZoom: 21, trackMarkers: true});

  	var markers1 = [];
  	var markers2 = [];
  	var markers3 = [];

  	var points1 = [];
  	var points2 = [];
  	var points3 = [];
    return new Promise(function(resolve,reject){
      //企业
      Promise.all([api.getMapPoint(1),api.getMapPoint(2),api.getMapPoint(3)])
      .then(function(res_arr){

        if(res_arr[0].ok){
          res_arr[0].data.forEach( (o,i) => {
            try {
              var pos = JSON.parse(o.pos);
              var convertor = coorConvert.wgs2bd(pos.longitude, pos.latitude);

              points1.push(new BMap.Point(convertor[0], convertor[1]));
              var html = "<div class='p p-company' data-id='"+o.id+"' data-pos='"+convertor.join("|")+"'><span class='p-tag'>企业："+o.tag+"</span></div>";
              var marker = new BMapLib.RichMarker(html, points1[i]);
              markers1.push(marker);
            }
            catch(e) {}
          })
          mapMgr1.addMarkers(markers1,1,20)
          mapMgr1.showMarkers();
        }

        if(res_arr[1].ok){
          res_arr[1].data.forEach( (o,i) => {
            try {
              var pos = JSON.parse(o.pos);
              var convertor = coorConvert.wgs2bd(pos.longitude, pos.latitude);
              points2.push(new BMap.Point(convertor[0], convertor[1]));
              var html = "<div class='p p-station s-0-0' data-id='"+o.id+"' data-pos='"+convertor.join("|")+"'><span class='p-tag'>变电站："+o.tag+"</span></div>";
              markers2.push(new BMapLib.RichMarker(html, points2[i]));
            }
            catch(e) {}
          })
          mapMgr2.addMarkers(markers2,1,20)
          mapMgr2.showMarkers();
        }


        if(res_arr[2].ok){
          res_arr[2].data.forEach( (o,i) => {
            //有些员工可能没有坐标
            try {
              var pos = JSON.parse(o.pos);
              var convertor = coorConvert.wgs2bd(pos.longitude, pos.latitude);
              points3.push(new BMap.Point(convertor[0], convertor[1]));
              var html = "<div class='p p-staff' data-id='"+o.id+"' data-pos='"+convertor.join("|")+"'><span class='p-tag'>员工："+o.tag+"</span></div>";
              var marker = new BMapLib.RichMarker(html, points3[i]);
              markers3.push(marker);
            }
            catch(e) {}
          })
          mapMgr3.addMarkers(markers3,1,20)
          mapMgr3.showMarkers();
        }

        totalPoint = (points1.concat(points2)).concat(points3)
        console.log(totalPoint)
        map.setViewport(totalPoint);

        resolve();

      })
    });
  }

  function bindEvent() {
    $(".p-staff").on('click', handleStaffClick);
    $(".p-company").on('click', handleCompanyClick);
    $(".p-station").on('click', handleStationClick);

    $(".p-staff").on('touchstart', handleStaffClick);
    $(".p-company").on('touchstart', handleCompanyClick);
    $(".p-station").on('touchstart', handleStationClick);

    // tagEvent;
    $(".p-staff, .p-company, .p-station")
    .on('mouseenter', function(event) {
      if(!$("#tag-toggle").hasClass('toggle-off')){
        return
      }
      $(this).find(".p-tag").addClass('on');
    })
    .on('mouseleave', function(event) {
      if(!$("#tag-toggle").hasClass('toggle-off')){
        return
      }
      $(this).find(".p-tag").removeClass('on')
    });

  }

  //type=0 on , type=1 off
  function toggleTag(type) {
    if(type == 0) {
      $(".p-tag").addClass('on');
    }
    else if(type == 1){
      $(".p-tag").removeClass('on')
    }
  }

  function handleStaffClick(event) {
    event.preventDefault();

    var _this = $(this);

    _this.find(".p-tag").removeClass('on');

    pop.clearPop();
    pointClickAnimation(_this);

    setTimeout(function() {
      api.getStaffDetail(_this.attr("data-id"))
      .then(function(r) {
        if(r.ok) {
          pop.popStaffDetail(r.data);
        }
        else {
          alert(r.data);
        }
      })
    },500);


    // map.centerAndZoom(new BMap.Point(pos[0], pos[1]), 16);

    // var style =_this.parent()[0].style;

  }

  function handleCompanyClick(event) {
    event.preventDefault();

    var _this = $(this)
    _this.find(".p-tag").removeClass('on');

    pop.clearPop();
    pointClickAnimation(_this);

    setTimeout(function() {
      api.getCompanyDetail(_this.attr("data-id"))
      .then(function(r) {
        if(r.ok) {
          pop.popCompanyDetail(r.data);
        }
        else {
          alert(r.data);
        }
      })
    },500);
  }

  function handleStationClick(event) {
    event.preventDefault();

    var _this = $(this)
    _this.find(".p-tag").removeClass('on');

    pop.clearPop();
    pointClickAnimation(_this);

    setTimeout(function() {
      api.getStationDetail(_this.attr("data-id"))
      .then(function(r) {
        if(r.ok) {
          pop.popStationDetail(r.data);
        }
        else {
          alert(r.data);
        }
      })
    },500);
  }

  //点击坐标点的动画：放大并移到窗口正中 ，动画时长2s
  function pointClickAnimation(pointJQ) {
    var pos = pointJQ.attr("data-pos").split("|");
    map.panTo(new BMap.Point(pos[0], pos[1]));//定位到所点击的位置

    pointJQ.addClass('here');
    setTimeout(function() {pointJQ.removeClass('here');},2100);
  }

  //显示隐藏坐标点
  //pointType: 1->企业 2->变电站 3->人员
  //operation: 0->关闭 1->显示
  function togglePoints(pointType,operation) {
  	if(pointType == 1) {
  		operation == 0 ? mapMgr1.hide() : mapMgr1.show();
  	}
  	else if(pointType == 2) {
  		operation == 0 ? mapMgr2.hide() : mapMgr2.show();
  	}
  	else if(pointType == 3) {
  		operation == 0 ? mapMgr3.hide() : mapMgr3.show();
  	}
  }

  //监听 变电站状态变化函数
  function handleMqttStatus(msg) {
    console.log("==== handle Mqtt station status ====");
    try {
      console.log(msg.payloadString);

      var stationJQs = $(".p-station");
      stationJQs.attr({"class":"p p-station s-0-0"});
      let data = JSON.parse(msg.payloadString)
      /*msg = [
        {
            companyId: 1, //企业Id
            id: 1,        // 变电站id
            statusA: 0,   // 正常（0）、处理中（1）、报警（2）
            statusB: 1    // 正常（0）、过载（1）、重载（2）
        },
        {
            companyId: 2, //企业Id
            id: 3,
            statusA: 1,
            statusB: 2
        }
      ];*/
      var statusAText = ["正常", "处理中", "报警"];
      var statusBText = ["载荷正常", "过载", "重载"];
      var html = [];
      data.forEach(function(o,i) {
        o.statusA = o.statusA || 0;
        o.statusB = o.statusB || 0;
        var stationJQ = $(".p-station[data-id="+o.id+"]");
        if(stationJQ.length) {
          stationJQ.removeClass('s-0-0').addClass(['s', o.statusA, o.statusB].join("-"));
          var name = ((stationJQ.find(".p-tag").html()).split("："))[1]
          html.push("<p><i class='fa fa-exclamation-circle'></i>"+name+"："+statusAText[+o.statusA]+" - "+statusBText[+o.statusB]+"</p>");
        }
      });
      //更新左上角TIP的内容
      var tipJQ = $("#status-tip .content");
      if(html.length){
        tipJQ.html(html.join(""));
      }
      else {
        tipJQ.html('<p style="text-align: center;">目前没有告警信息</p>');
      }
      $("#status-tip").show();

    }catch(e) {console.error(e)}
  }

  function refresh() {
    if(totalPoint.length) map.setViewport(totalPoint);
  }

  export {
    init,
    togglePoints,
    toggleTag,
    refresh
  };


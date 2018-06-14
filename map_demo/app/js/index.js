require("../css/reset.css");
require("../css/style.css");
//把百度地图的两个开源库合成一个了
import {BMapLib} from '../lib/bMapLib_RichMarker_MarkerManager.js';
const coorConvert = require('../lib/coor-convert.js');

let isDebug = process.env.NODE_ENV == "development";
let map;
let mapMgr;

const HOST = "http://202.118.26.74:8080/PowerCloud";
const POSITION_PATH = "/api/customer/getPositionInfo";
const STAFF_DETAIL_PATH = "/api/electrician/profile";

const userBoxEle = document.querySelector("#user-box");

function initMap() {
  //地图不可点
  var mapOpts = {enableMapClick:false}
  map = new BMap.Map("allmap", mapOpts);    // 创建Map实例

  map.centerAndZoom(new BMap.Point(123.4, 41.8), 14);  // 初始化地图,设置中心点坐标和地图级别
  map.setCurrentCity("沈阳");          // 设置地图显示的城市 此项是必须设置的
  map.enableScrollWheelZoom(false);     //开启鼠标滚轮缩放
  map.disableDoubleClickZoom();        //禁用双击放大
  var h = 70;
  var ctrlOpts = {offset: new BMap.Size(20, h)}
  map.addControl(new BMap.NavigationControl(ctrlOpts));   //缩放按钮
}


function request(url) {
  fetch(url, {
    method: "POST",
    credentials: 'include',
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then(response => response.json())
  .then(function(data) {
    if (data.ok) {
      renderMapPoint(data)
    }
    else {
      alert("数据请求错误：" + data.data);
    }
  }, function(e) {
    alert("数据请求错误：" + e);
  });
}

function renderMapPoint(data) {
  try{
    var obj = typeof(data) == "string" ? JSON.parse(data) : data;
    if(obj.ok == true) {
      var res = JSON.parse(obj.data)
      var electrician_arr = res.filter(function(o) {
        return o.type == "electrician"
      });
      console.log(electrician_arr)
      mapMgr = new BMapLib.MarkerManager(map,{borderPadding: 10,maxZoom: 21, trackMarkers: true});
      var markers = [];
      var points = [];

      electrician_arr.forEach( (o,i) => {
        //有些员工可能没有坐标
        try {
          var pos = JSON.parse(o.location);
          var convertor = coorConvert.wgs2bd(pos.longitude, pos.latitude);
          points.push(new BMap.Point(convertor[0], convertor[1]));
          var html = "<div class='p p-staff' data-id='"+o.id+"' data-pos='"+convertor.join("|")+"'><span class='p-tag'>"+o.name+"</span></div>";
          var marker = new BMapLib.RichMarker(html, points[i]);
          markers.push(marker);
        }
        catch(e) {}
      })
      mapMgr.addMarkers(markers,1,20)
      mapMgr.showMarkers();

      map.setViewport(points);

      bindEvent();
    }

  }
  catch(e) {
    console.log(e);
    alert("数据解析错误！")
  }
}

/*员工点击*/
function bindEvent(argument) {
  let staffEles = document.querySelectorAll(".p-staff");
  staffEles.forEach((ele, i) => {
    ele.addEventListener("touchstart", handleStaffClick)
  })

  document.querySelector("#x-btn").addEventListener("touchstart", function() {
    userBoxEle.classList.remove("show");
  })
}

/*请求员工信息*/
function handleStaffClick(e) {
  let userid = e.target.getAttribute("data-id");
  fetch(HOST + STAFF_DETAIL_PATH + `?id=${userid}`, {
    method: "POST",
    credentials: 'include',
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then(response => response.json())
  .then(function(data) {
    if (data.ok) {
      let userInfo = JSON.parse(data.data);
      var html = `
        <p class="name">员工编号：${userInfo.id||"-"}</p>
        <p class="name">员工姓名：${userInfo.name||""}</p>
        <p class="name">所属公司：${userInfo.sccompanyname||"-"}</p>
        <p class="name">当前职称：${userInfo.positionaltitle||"-"}</p>
        <p class="name">办公电话：${userInfo.tel||"-"}</p>
        <p class="name">移动电话：${userInfo.phone||"-"}</p>
        <p class="status">在岗状态：<i class="fa ${userInfo.status == 0 ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i></p>
        `
      document.querySelector("#user-info").innerHTML = html;
      userBoxEle.classList.add("show");
    }
    else {
      alert("员工信息请求错误：" + data.data);
    }
  }, function(e) {
    alert("员工信息请求错误：" + e);
  });
}

//type=0 on , type=1 off
function toggleTag(type) {
  if(type == 0) {
    document.querySelectorAll(".p-tag").forEach(function(o,i) {
      o.classList.add('on');
    })
  }
  else if(type == 1){
    document.querySelectorAll(".p-tag").forEach(function(o,i) {
      o.classList.remove('on');
    })
    userBoxEle.classList.remove("show");
  }
}

window.onload = function() {

  console.log(process.env.NODE_ENV);

  initMap();

  if(isDebug) {
    request(HOST+POSITION_PATH+"?id=10&token=FA500B47D72BC3FEC8DA05F6C522BFC5&account=lipan")
  }
  else {
    document.addEventListener("message", function(msg) {
      var data = msg.data
      try {
        var d = JSON.parse(msg.data);

        if(d.key = "app" && d.url){
          request(d.url)
        }
      } catch(e) {
        alert(e)
      }
    })
  }

  //标签显示 隐藏
  document.querySelector("#tag-toggle").addEventListener("touchstart", function(event) {
    let ele = event.target.parentNode
    if(ele.classList.contains('toggle-off')) {
      ele.classList.remove('toggle-off');
      ele.classList.remove('toggle-on');
      ele.classList.add('toggle-on')
      toggleTag(0)
    }
    else {
      ele.classList.remove('toggle-off');
      ele.classList.add('toggle-off');
      ele.classList.remove('toggle-on');
      toggleTag(1)
    }
  })
}



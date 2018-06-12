import request from '@/utils/request'

import {Paho} from '@/views/monitor/lib/mqttws31'

//是否是本地测试
let isLocal = /-local$/.test(process.env.NODE_ENV);

let MQTT_HOST = "202.118.26.74";
const MQTT_PORT = 8083;

let API_URL = {};

let API_MAP = {
  //获取页面配置
  getConfig: "/monitor/getConfig",
  setConfig: "/monitor/setConfig",
  // getConfig: "/electricitysubstation/getSubstaionData",
  mapPoint: "/electricitysubstation/getMapPoint",
  stationData: "/electricitysubstation/getSubstationData",
  getStationList: "/electricitysubstation/getSubstationData",
  getSelectOptions: "/monitor/getSelectOptions"
}
if(isLocal) {

  API_URL = {
    //获取页面配置
    getConfig: "/monitor/config.json",
    setConfig: "/success.json",
    mapPoint: ["/monitor/mapPoint1.json", "/monitor/mapPoint2.json", "/monitor/mapPoint3.json"],
    stationData: "/monitor/stationData.json",
    getStationList: "/monitor/stationData.json",
    getSelectOptions: "/monitor/getSelectOptions.json"

  }
}
//后台接口
else {
  API_URL = Object.assign({}, API_MAP)
}

/*获取页面配置*/
export function getConfig(id) {
  return request({
    url: API_URL["getConfig"],
    method: 'get'
  })
}

export function setConfig(data) {
  return request({
    url: API_URL["setConfig"],
    method: 'post',
    data: data
  })
}

export function getSelectOptions() {
  return request({
    url: API_URL["getSelectOptions"],
    method: 'get'
  })
}

export function getStationList(id) {
  return request({
    url: isLocal ? API_URL["getStationList"] : API_URL["getStationList"],
    method: 'get',
    params: {electricianid:id}
  })
}

export function getMapPoint(type) {
  return request({
    url: isLocal ? API_URL["mapPoint"][+type-1] : API_URL["mapPoint"],
    method: 'post',
    params: {type:type}
  })
}

export function getStationData(id) {
  return request({
    url: isLocal ? API_URL["stationData"] : API_URL["stationData"],
    method: 'post',
    params: {id:id}
  })
}



/*MQTT相关*/

export function initMqttConnection(callback, onMessageArrived) {
  var client = new Paho.MQTT.Client(MQTT_HOST, Number(MQTT_PORT), "webClient_"+Date.now());//建立客户端实例
  client.connect({onSuccess:onConnect});//连接服务器并注册连接成功处理事件
  function onConnect() {
      console.log("mqtt onConnected");
      callback(client);
  }
  client.onConnectionLost = onConnectionLost;//注册连接断开处理事件
  client.onMessageArrived = onMessageArrived;//注册消息接收处理事件
  function onConnectionLost(responseObject) {
      if (responseObject.errorCode !== 0) {
          console.log("onConnectionLost:"+responseObject.errorMessage);
          console.log("连接已断开");
          alert("Error：mqtt连接已断开");
       }
  }
}

export function mqttSubscribe(client,topic) {
  if(client) {
    console.log(topic)
    client.subscribe(topic);//订阅主题
  }
}

export function mqttUnsubscribe(client,topic) {
  if(client) {
    console.log("mqtt Unsubscribe:",topic)
    client.unsubscribe(topic);//订阅主题
  }
}

export function mqttDisconnect(client) {
  if(client) {
    console.log("disconnect")
    client.disconnect();//订阅主题
  }
}

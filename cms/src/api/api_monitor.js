import request from '@/utils/request'

import {Paho} from '@/views/monitor/lib/mqttws31'

//是否是本地测试
let isLocal = /-local$/.test(process.env.NODE_ENV);

let MQTT_HOST = "202.118.26.74";
const MQTT_PORT = 8083;

let API_URL = {};

let API_MAP = {
  //获取页面配置
  getConfig: "getConfig",
  mapPoint: "/electricitysubstation/getMapPoint",
}
if(isLocal) {
  API_URL = {
    //获取页面配置
    getConfig: "/monitor/config.json",
    mapPoint: ["/monitor/mapPoint1.json", "/monitor/mapPoint2.json", "/monitor/mapPoint3.json"]


  }
}
//后台接口
else {
  API_URL = Object.assign({}, API_MAP)
}

export function getConfig(id) {
  return request({
    url: isLocal ? API_URL["getConfig"] : "/monitor/"+API_URL["getConfig"],
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



/*MQTT相关*/

export function initMqttConnection(callback, onMessageArrived) {
console.log(Paho)
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

export function mqttDisconnect(client) {
  if(client) {
    console.log("disconnect")
    client.disconnect();//订阅主题
  }
}

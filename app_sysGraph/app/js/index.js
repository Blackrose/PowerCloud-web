
let isDebug = process.env.NODE_ENV == "development";


const HOST = "http://202.118.26.74:8080/PowerCloud";
const PATH = "/api/electricitysubstation/getSubstationInfo";

const mainEle = document.querySelector("#main");
//MQTT
const MQTT_HOST = "202.118.26.74";
const MQTT_PORT = 8083;
const MQTT_TOPIC = "/systemStatus";
let stationId = 0;
let client;


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

      //SVG图展示
      let res = JSON.parse(data.data);
      mainEle.innerHTML = res.diagram;

      let window_w = document.documentElement.clientWidth;
      let window_h = document.documentElement.clientHeight;

      let svgRootDom = document.querySelectorAll("svg")[0];

      let viewBoxVal = svgRootDom.getAttribute("viewBox");
      let viewBoxWidth = viewBoxVal.split(",")[2];
      let viewBoxHeight = viewBoxVal.split(",")[3];

      // 因为之前已经设置了viewbox
      // 所以该SVG图已经根据屏幕大小适配，相当于已经产生过了一次 拉伸/缩小
      let radio_before = (window_w/viewBoxWidth).toFixed(4)

      // 此时再做一个旋转，SVG图的高，要适配当前屏幕的宽
      //对于特别长的SCG图，SVG图的宽 要适配当前屏幕的高，所以要取两者radio的最小值
      // 因此还有一次 拉伸/缩小
      let radio = (window_w/viewBoxHeight).toFixed(4)
      let radio2 = (window_h/viewBoxWidth).toFixed(4)

      //因此最终的拉伸或者缩小，抵消掉第一次的变形
      let radio_final = Math.min(radio,radio2) / radio_before

      svgRootDom.style.transform = "rotate(90deg) scale("+radio_final+")"

      //MQTT
      if(!client) {
        initMqttConnection(function(_client) {
          client = _client;
          mqttSubscribe(client, MQTT_TOPIC+"/"+stationId);
        }, handleMqttStatus);
      }
      else {
        mqttSubscribe(client, MQTT_TOPIC+"/"+stationId);
      }

    }
    else {
      alert("数据请求错误：" + data.data);
    }
  }, function(e) {
    alert("数据请求错误：" + e);
  });
}



function initMqttConnection(callback, onMessageArrived) {
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

function mqttSubscribe(client,topic) {
  if(client) {
    console.log(topic)
    client.subscribe(topic);//订阅主题
  }
}

function mqttDisconnect(client) {
  if(client) {
    console.log("disconnect")
    client.disconnect();//订阅主题
  }
}


function handleMqttStatus(msg) {
  //判断是哪个变电站 TODO
  console.log("==== handle Mqtt SVG status ====");
  try {
    var topic = msg.destinationName;
    // console.log(msg.payloadString);
    var data = JSON.parse(msg.payloadString);
    setSysData(data, "电力系统图");
  } catch(e){/*console.error("Error: error in onMessageArrived", e)*/}
}


function setSysData(data,title) {

  if(!mainEle.innerHTML) return

  if(title) {
    document.querySelector(".s-t-title tspan").innerHTML = title;
  }

  let svgRootEle = mainEle;

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
/*        circuit_nodes[0].innerHTML = "Ia: "+ toFixed(c.Ia, 2);
        circuit_nodes[1].innerHTML = "Ib: "+ toFixed(c.Ib, 2);
        circuit_nodes[2].innerHTML = "Ic: "+ toFixed(c.Ic, 2);*/
          circuit_nodes[0].innerHTML = "";
          circuit_nodes[1].innerHTML = "";
          circuit_nodes[2].innerHTML = "";

        var cirEle = svgRootEle.querySelectorAll(".s-rect")[_i];
        setColor(cirEle,c.status);

      })
    })
  })

  function setColor(ele,status) {
    let green = "#4caf50";
    let red = "#F56C6C"
    ele.setAttribute("fill",status == 0 ?  red : green);   //0正常 1异常
  }

  function toFixed(v,num) {
    return (+v == v) ? (+v).toFixed(num) : v;
  }
}


window.onload = function() {

  console.log(process.env.NODE_ENV);


  if(isDebug) {
    stationId = 1;
    request(HOST+PATH+"?id="+stationId+"&token=FA500B47D72BC3FEC8DA05F6C522BFC5&account=lipan")

  }
  else {
    document.addEventListener("message", function(msg) {
      var data = msg.data
      try {
        var d = JSON.parse(msg.data);

        if(d.key = "app" && d.url){

          stationId = d.stationId;
          //SVG图
          request(d.url)

        }
      } catch(e) {
        alert(e)
      }
    })
  }

}



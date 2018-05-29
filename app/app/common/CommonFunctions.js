/**
 * 函数
 *
 * @author bovenson
 * @email szhkai@qq.com
 */


'use strict';
import React from 'react';
import {
    AsyncStorage,
    Alert,
} from 'react-native';
import {UserInfoManager} from "./StorageManager";
import init from "react_native_mqtt";
import {EMQ_SERVER_IP_ADDRESS} from "../constants/GlobalVars";
import PushNotification from "react-native-push-notification";
import {getElectricianDomains} from "./NetworkRequests";
import {guid, isUndefinedOrNull} from "../utils/Utils";
import StorageUtil from "../utils/StorageUtil";

/**
 * 程序启动任务
 * @returns {Promise<void>}
 */
export async function appStartTasks() {
    console.log("程序启动");

    /******** 机器唯一标识码 ********/
    await StorageUtil.get('APP_CODE').then((app_code) => {
        if (!app_code) {    // 如果不存在APP_CODE则生成, 并保存
            app_code = guid();
            StorageUtil.save('APP_CODE', app_code).then(() => {
                global.APP_CODE = app_code;
            });
        } else {
            global.APP_CODE = app_code;
        }
    });

    /******** 加载本地用户信息 ********/
    await UserInfoManager.loadUserData();
}


/**
 * 订阅预警信息
 */
export function subscribeAlert(msgArriveCallBackFunction) {
    init({
        size: 10000,
        storageBackend: AsyncStorage,
        defaultExpires: 1000 * 3600 * 24,
        enableCache: true,
        sync : {
        },
    });

    PushNotification.configure({
        onNotification: function(notification) {
            msgArriveCallBackFunction(notification);
        },
    });

    function MQTTClient(id) {
        this.id = id;
        this.client = null;

        this.createClient = () => {
            this.client =  new Paho.MQTT.Client(EMQ_SERVER_IP_ADDRESS, 8083, "/mobile_alert/" + Math.random().toString());
        };

        this.onConnected = () => {
            try {
                console.log("订阅主题");
                this.client.subscribe('/Alert/' + this.id.toString());
            } catch (e) {
                console.log("订阅主题失败: " + e);
            }
        };
        this.onMessageArrived = (message) => {
            try {
                PushNotification.cancelAllLocalNotifications();
                let msgJson = JSON.parse(message.payloadString);
                if (parseInt(msgJson.status) === 2) {
                } else if(parseInt(msgJson.status) === 1) {
                    PushNotification.localNotification({
                        id: msgJson.worktaskID,
                        title: "警告",
                        message: msgJson.msg,
                        workTaskID: msgJson.worktaskID,
                        status: msgJson.status,
                        actions: [],
                        soundName: 'alert.mp3',
                        repeatType: 'minute',
                    });
                }
            } catch (e) {
                console.log(e);
            }
        };
        this.onConnectionLost = () => {
            this.connect();
        };

        this.connect = () => {
            if (isUndefinedOrNull(this.client)) {
                this.createClient();
            }
            this.client.connect({onSuccess: this.onConnected});
        };

        this.init = () => {
            if (isUndefinedOrNull(this.client)) {
                this.createClient();
            }
            this.client.onMessageArrived = this.onMessageArrived;
            this.client.onConnectionLost = this.onConnectionLost;
            this.connect();
        };

        this.init();

        setInterval(() => {
            if (!this.client.isConnected()) {
                try {
                    this.connect();
                } catch (error) {}
            }
        }, 5000);
    }

    let clients = [];
    // 获取管理域列表
    getElectricianDomains(global.LOGIN_UER_ID, (responseRes) => {
        for (let i=0; i < responseRes.length; i++) {
            let domainJson = responseRes[i];
            let client = new MQTTClient(domainJson.magdomainid);
            clients.push(client);
        }
    }, (error) => {
        console.log("获取用户管理域错误:" + error);
    });
}

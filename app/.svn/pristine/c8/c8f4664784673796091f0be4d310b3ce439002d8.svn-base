/**
 * 程序启动界面
 *
 * @author bovenson
 * @email szhkai@qq.com
 */
'use strict';

import React, { Component } from 'react';
import { Text,
    View,
    StatusBar,
    StyleSheet,
    AsyncStorage,
    SafeAreaView,
    Image,
} from 'react-native';
import {MUtils, NavigationUtils} from "../utils/Utils";
import {appStartTasks} from "../common/CommonFunctions";
import {LOCATION_UPLOAD_URL} from "../constants/GlobalVars";

export class Greeting extends Component {
    constructor(props) {
        super(props);

        this.state = {
            initialPosition: 'unknown',
            lastPosition: 'unknown',
            watchID: (null: ?number),
        };
    }

    judgeLogin() {
        // 判断是否登录 设置计时器 跳转到主界面/登录界面
        if (global.isLogin) {
            NavigationUtils.navToScreenNeverBack(this.props, 'Main');
        } else {
            NavigationUtils.navToScreenNeverBack(this.props, 'Login');
        }
    }

    componentDidMount() {
        console.log("Greeting mounted");
        appStartTasks().then(setTimeout(() => {
            this.judgeLogin();  // 判断是否登录
        }, 2000));    // 程序启动任务

        navigator.geolocation.getCurrentPosition(
            (initialPosition) => {
                this.setState({initialPosition});
            },
            (error) => console.log(error.message)
        );

        this.state.watchID = navigator.geolocation.watchPosition((lastPosition) => {
            this.uploadLocation(lastPosition.coords.longitude, lastPosition.coords.latitude);
        });
    }

    uploadLocation(longitude, latitude) {
        try {
            MUtils.fetchData(LOCATION_UPLOAD_URL, MUtils.packFormData({
                id: global.LOGIN_UER_ID,
                longitude: longitude,
                latitude: latitude,
            }), (responseJson) => {}, (error) => {
                console.log("上传位置信息失败:" + error);
            });
        } catch (error) {
            console.log("上传位置信息代码异常:" + error);
        }
    }

    render() {
        return(
            <SafeAreaView style={{flex:5, backgroundColor: 'white',
                paddingBottom: '20%', paddingTop: '20%',
                flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                <Image
                    style={{width: 120, height: 120, maxWidth: 120, maxHeight: 120, marginTop: 50}}
                    source={require("../statics/media/img/logo.png")}
                />
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    text: {
        fontSize: 25,
        marginTop: 5,
        textAlign: 'center',
        color: 'black',
    }
});
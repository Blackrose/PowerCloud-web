/**
 * 变电站系统图
 * 路径:
 *  - 监控Tab页 -> 企业 -> 变电站列表 -> 隐藏菜单 -> 系统图
 *  - 工单详情页 -> 系统图
 */


'use strict';

import React, {Component} from 'react';
import {
    Alert,
    Text,
    WebView,
    SafeAreaView,
    ActivityIndicator,
} from 'react-native';
import {getSubstationInfo} from "../../../common/NetworkRequests";
import GlobalStyles from "../../../constants/GlobalStyles";

export class SystemStructureScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.navigation.state.params.id,
            data: null,
        };
        this.fetchData();
    }

    static navigationOptions = () => {
        return {
            title: "系统图",
            headerStyle: {
                backgroundColor: '#444',
                height: 40,
            },
            headerTintColor: 'white',
            headerTitleStyle: {
                textAlign: 'center',
                flex: 1,
            },
            headerRight: <Text>
            </Text>,
        }
    };

    /**
     * 获取变电所详情
     */
    fetchData() {
        try {
            getSubstationInfo(this.state.id, (data) => {
                this.setState({data: data});
            }, (error) => {
                Alert.alert("获取变电所系统图失败", error);
            });
        } catch (error) {
            console.log(error);
        }
    }

    generateHtmlSource() {
        try {
            if (this.state.data) {
                    let jsCode = 'let window_w = document.documentElement.clientWidth; let window_h = document.documentElement.clientHeight; let svgRootDom = document.querySelector("#my-svg"); let viewBoxVal = svgRootDom.getAttribute("viewBox"); let viewBoxWidth = viewBoxVal.split(",")[2]; let viewBoxHeight = viewBoxVal.split(",")[3]; let radio_before = (window_w/viewBoxWidth).toFixed(2); let radio = (window_w/viewBoxHeight).toFixed(2); let radio_final = radio / radio_before; svgRootDom.style.transform = "rotate(90deg) scale("+radio_final+")";';
                let html = "<html><body style='background-color: #000; opacity: 0.8'>" + this.state.data.diagram.toString() +
                    "</body><script>" + jsCode + "</script></html>";
                return <WebView source={{html: html}}/>
            } else {
                return <ActivityIndicator style={{marginTop: '50%'}}/>
            }
        } catch (error) {
            return null;
        }
    }

    render() {
        return (
            <SafeAreaView style={[GlobalStyles.safeContainer]}>
                {this.generateHtmlSource()}
            </SafeAreaView>
        )
    }
}
/**
 * 变电站实时数据展示
 * 路径:
 *  - 监控Tab页 -> 企业 -> 变电站列表 -> 隐藏菜单 -> 数据
 *  - 工单详情页 -> 数据
 */

'use strict';

import React, {Component} from 'react';
import {
    SafeAreaView,
    View,
    Text,
    ScrollView,
    AsyncStorage,
    Alert,
    ActivityIndicator,
} from 'react-native';
import GlobalStyles, {GlobalColors} from "../../../constants/GlobalStyles";
import {EMQ_SERVER_IP_ADDRESS} from "../../../constants/GlobalVars";
import init from 'react_native_mqtt';
import {fetchSubstationLastStatus} from "../../../common/NetworkRequests";


export class SubstationStatusScreen extends Component {
    /**
     * 初始化
     * 需要传入参数变电所id及变电所名称title
     * @param props
     */
    constructor(props) {
        super(props);

        init({
            size: 10000,
            storageBackend: AsyncStorage,
            defaultExpires: 1000 * 3600 * 24,
            enableCache: true,
            sync: {},
        });

        this.state = {
            client: new Paho.MQTT.Client(EMQ_SERVER_IP_ADDRESS, 8083, "mobile_client" + Math.random().toString()),
            data: this.props.navigation.state.params.data,
            circuits: []
        };
        this.initMqttClient();
        this.fetchData();
    }

    static navigationOptions = () => {
        return {
            title: "数据",
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

    componentWillUnmount() {
        try {
            this.mounted = false;
            this.state.client.disconnect();
        } catch (error) {
            console.log(error);
        }
    }

    onConnected() {
        try {
            // console.log("订阅主题");
            this.state.client.subscribe('/systemStatus/' + this.state.data.id);
        } catch (e) {
            console.log("订阅主题失败: " + e);
            Alert.alert("警告", "数据订阅失败!")
        }
    }

    setData(msgJson) {
        try {
            let circuits = [];
            if (msgJson[0]["cabinet"]) {
                circuits.push(msgJson[0]["cabinet"]);
            }
            for (let i = 0; i < msgJson[0]['distributing'][0].length; ++i) {
                circuits.push(msgJson[0]['distributing'][0][i]);
            }
            // console.log(circuits);
            if (this.mounted) {
                this.setState({circuits: circuits});
            }
        } catch (e) {
            console.log(e);
        }
    }

    onMessageArrived(message) {
        let msgJson = JSON.parse(message.payloadString);
        this.setData(msgJson);
    }

    fetchData() {
        try {
            fetchSubstationLastStatus(this.state.data.id, (msgJson) => {
                msgJson = JSON.parse(msgJson);
                this.setData(msgJson);
            }, (error) => {
                Alert.alert('警告', error);
            });
        } catch (e) {
            Alert.alert('警告', '请求数据失败');
            console.log(e);
        }
    }

    initMqttClient() {
        try {
            if (this.state.client && !this.state.client.isConnected()) {
                console.log("初始化Mqtt");
                this.state.client.onMessageArrived = this.onMessageArrived.bind(this);
                this.state.client.connect({onSuccess: this.onConnected.bind(this)});
                this.state.client.onConnectionLost = () => {
                    if (this.state.mounted && this.state.client && !this.state.client.isConnected()) {
                        this.state.client.connect({onSuccess: this.onConnected.bind(this)});
                    }
                };
            }
        } catch (e) {
            console.log("初始化Mqtt: " + e);
        }
    }

    componentDidMount() {
        this.mounted = true;
        if (this.state.client && !this.state.client.isConnected()) {
            this.initMqttClient();
        }
    }

    render() {
        return (
            <SafeAreaView style={GlobalStyles.safeContainer}>
                <ScrollView>
                    <SingleSubstationStatusScreen
                        title={this.state.data.title}
                        circuits={this.state.circuits}
                    />
                </ScrollView>
            </SafeAreaView>
        )
    }
}

class SingleSubstationStatusScreen extends Component {  // 单个变电所显示
    static getColor(status) {
        if (status === 0 || status === '0') {
            return {backgroundColor: GlobalColors.success};
        } else {
            return {backgroundColor: GlobalColors.danger};
        }
    }

    static generator_circuits(circuitData) {
        try {
            let res = [];
            if (!circuitData || circuitData.length === 0) {
                return <ActivityIndicator style={{marginTop: 100}}/>;
            }
            for (let i = 0; i < circuitData.length; ++i) {
                let item = circuitData[i];
                let bkColor = SingleSubstationStatusScreen.getColor(item['status']);
                let itemView = <View style={[GlobalStyles.infoRowViewWithBottomBorder]} key={i}>
                    <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                        <View style={[{width: 10, height: 10, borderRadius: 5,}, bkColor]}
                        />
                        <Text
                            style={[GlobalStyles.infoRowText, {paddingLeft: 8, paddingRight: 8}]}>{item['name']}</Text>
                    </View>

                    <View style={{flexDirection: 'column', flex: 1,}}>
                        <View style={{flexDirection: 'row', flex: 1}}>
                            <Text style={[GlobalStyles.infoRowText, {textAlign: 'center', flex: 1}]}>V</Text>
                            <Text
                                style={[GlobalStyles.infoRowText, {textAlign: 'center', flex: 2}]}>{item['Uab']}</Text>
                            <Text
                                style={[GlobalStyles.infoRowText, {textAlign: 'center', flex: 2}]}>{item['Uac']}</Text>
                            <Text
                                style={[GlobalStyles.infoRowText, {textAlign: 'center', flex: 2}]}>{item['Ubc']}</Text>
                        </View>
                        <View style={{flexDirection: 'row', flex: 1}}>
                            <Text style={[GlobalStyles.infoRowText, {textAlign: 'center', flex: 1}]}>I</Text>
                            <Text style={[GlobalStyles.infoRowText, {textAlign: 'center', flex: 2}]}>{item['Ia']}</Text>
                            <Text style={[GlobalStyles.infoRowText, {textAlign: 'center', flex: 2}]}>{item['Ib']}</Text>
                            <Text style={[GlobalStyles.infoRowText, {textAlign: 'center', flex: 2}]}>{item['Ic']}</Text>
                        </View>
                    </View>
                </View>;
                res.push(itemView);
            }
            return res;
        } catch (error) {
            console.log(error);
        }
    }

    render() {
        return (
            <SafeAreaView style={[GlobalStyles.safeContainer]}>
                <View style={[GlobalStyles.infoRowViewWithBottomBorder]}>
                    <Text style={[GlobalStyles.infoRowText, {
                        textAlign: 'center',
                        flex: 1,
                        fontSize: 18,
                        fontWeight: '500'
                    }]}>{this.props.title}</Text>
                </View>
                <View style={{flex: 1}}>
                    {SingleSubstationStatusScreen.generator_circuits(this.props.circuits)}
                </View>
            </SafeAreaView>
        )
    }
}

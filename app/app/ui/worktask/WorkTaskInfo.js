/**
 * 预警工单信息页面
 *
 * 路径:
 *  - 工单列表 -> 点击列表项
 *
 */


'use strict';

import React, { Component } from 'react';
import {
    Alert,
    View,
    Text,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from "react-native-vector-icons/Ionicons";
import Entypo from "react-native-vector-icons/Entypo";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import GlobalStyles, {GlobalBtnStyles, GlobalColors} from "../../constants/GlobalStyles";
import {fetchWorkTaskDetail, workTaskReceiveRequest, workTaskReturnRequest} from "../../common/NetworkRequests";
import {WORK_TASK_PROCESSING, WORK_TASK_UNPROCESSED} from "../../constants/GlobalVars";
import {formatDate, isUndefinedOrNull} from "../../utils/Utils";


export class WorkTaskAlertScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.navigation.state.params.id,
            status: this.props.navigation.state.params.status,
            onGoBack: this.props.navigation.state.params.onGoBack,
            workTaskDetail: null,
            mounted: false,
        };
        this.fetchData();
    }

    static navigationOptions = () => {
        return {
            title: "预警",
            headerStyle: {
                backgroundColor: GlobalColors.black,
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
     * 获取工单详情
     */
    fetchData() {
        try {
            fetchWorkTaskDetail(this.state.id, this.state.status, (data) => {
                if (this.state.mounted) {
                    this.setState({workTaskDetail: data});
                }
            }, (error) => {
                Alert.alert("获取工单信息失败", error);
            });
        } catch (error) {
            console.log(error);
        }
    }

    componentDidMount() {
        this.setState({mounted: true});
    }

    componentWillUnmount() {
        this.setState({mounted: false});
    }

    receiveWorkTask() {
        Alert.alert("工单", "确定接受该工单吗?", [
            {
                text: '确定',
                onPress: () => {
                    try {
                        workTaskReceiveRequest(global.LOGIN_UER_ID, this.state.workTaskDetail.id, () => {
                            Alert.alert("提示", "成功接受工单!", [
                                { text: '确定', }
                            ]);
                            if (this.state.onGoBack) {
                                this.state.onGoBack();
                            }
                            this.fetchData();
                        }, (error) => {
                            Alert.alert("警告", error, [
                                { text: '确定', }
                            ]);
                            if (this.state.onGoBack) {
                                this.state.onGoBack();
                            }
                            this.props.navigation.goBack();
                        });
                    } catch (error) {
                        Alert.alert("警告", error);
                    }
                }
            }, { text: '取消', },
        ]);
    }

    returnWorkTask() {
        if (this.state.workTaskDetail.electricianID && this.state.workTaskDetail.electricianID !== global.LOGIN_UER_ID) {  // 如果工单接收人不是当前用户
            return;
        }

        Alert.alert("工单", "确定退回该工单吗?", [
            {
                text: '确定',
                onPress: () => {
                    try {
                        workTaskReturnRequest(global.LOGIN_UER_ID, this.state.workTaskDetail.id, () => {
                            Alert.alert("提示", "成功退回工单!", [{
                                text: '确定',
                            }]);
                        }, (error) => {
                            Alert.alert("警告", error);
                        });

                        this.props.navigation.goBack();
                        this.state.onGoBack();
                    } catch (error) {
                        Alert.alert("警告", error);
                    }
                }
            }, { text: '取消', },
        ]);
    }

    processWorkTask() {
        if (this.state.workTaskDetail.electricianID && this.state.workTaskDetail.electricianID !== global.LOGIN_UER_ID) {  // 如果工单接收人不是当前用户
            return;
        }
        this.props.navigation.navigate("WorkTaskProcessDetailScreen", {workTaskID: this.state.workTaskDetail.id, status: '2', onGoBack: this.onGoBack.bind(this)});
    }

    workTaskProcessDetail() {
        this.props.navigation.navigate("WorkTaskProcessDetailScreen", {workTaskID: this.state.workTaskDetail.id, status: '3', onGoBack: this.onGoBack.bind(this)});
    }

    onGoBack() {
        this.props.navigation.goBack();
        if (this.state.onGoBack) {
            this.state.onGoBack();
        }
    };

    static generateInfoItem(name, value) {  // 生成信息展示项
        return <View style={[GlobalStyles.infoRowView]}>
            <Ionicons name={'ios-card-outline'} size={20}/>
            <Text style={[GlobalStyles.infoRowText, styles.tipText]}>{name}</Text>
            <Text style={[GlobalStyles.infoRowText]}>{value}</Text>
        </View>;
    }

    render() {
        let workTask = this.state.workTaskDetail;
        let status = '';    // 当前工单状态文字描述
        let btn1 = null;    // 第一个按钮
        let btn2 = null;    // 第二个按钮

        if (isUndefinedOrNull(workTask)) {   // 如果还没有从网络加载数据
            this.fetchData();
            return <SafeAreaView style={[GlobalStyles.safeContainer]}>
                <ActivityIndicator style={{marginTop: 100}}/>
            </SafeAreaView>;
        }

        try {
            if (workTask.status === WORK_TASK_UNPROCESSED) {
                status = "待处理";

                btn1 = <TouchableOpacity
                    onPress={() => this.receiveWorkTask()}
                    style={[GlobalBtnStyles.greenSolidBtn, {marginTop: 15}]}>
                    <Text style={[GlobalBtnStyles.greenSolidBtnText, {color: 'white'}]}>接受工单</Text>
                </TouchableOpacity>;
            } else if (workTask.status === WORK_TASK_PROCESSING) {
                status = "处理中";

                if (workTask.electricianID === global.LOGIN_UER_ID) {
                    btn1 = <TouchableOpacity
                        onPress={() => this.processWorkTask()}
                        style={[GlobalBtnStyles.greenSolidBtn, {marginTop: 15}]}>
                        <Text style={[GlobalBtnStyles.greenSolidBtnText, {color: 'white'}]}>处理工单</Text>
                    </TouchableOpacity>;

                    btn2 = <TouchableOpacity
                        onPress={() => this.returnWorkTask()}
                        style={[GlobalBtnStyles.greenHollowBtn, {marginTop: 15}]}>
                        <Text style={[GlobalBtnStyles.greenHollowBtnText, {color: GlobalColors.green}]}>退回工单</Text>
                    </TouchableOpacity>;
                }
            } else {
                status = "已完成";
                btn1 = <TouchableOpacity
                    onPress={() => this.workTaskProcessDetail()}
                    style={[GlobalBtnStyles.greenHollowBtn, {marginTop: 15, borderColor: GlobalColors.blue,
                        backgroundColor: GlobalColors.bgColorBlue}]}>
                    <Text style={[GlobalBtnStyles.greenHollowBtnText, {color: GlobalColors.blue}]}>处理详情</Text>
                </TouchableOpacity>;
            }
        } catch (error) {
            console.log(error);
        }

        return(

            <SafeAreaView style={[GlobalStyles.safeContainer]}>
                <ScrollView style={{backgroundColor: '#eee', flex: 1}}>
                    <View style={{backgroundColor: 'white', padding: 12}}>
                        <View style={[GlobalStyles.infoRowView]}>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <MaterialCommunityIcons name={'home-circle'} size={50}/>
                                <Text style={{fontSize: 22, marginLeft: 10, color: 'black'}}>{workTask.subStationName}</Text>
                            </View>
                        </View>
                        {WorkTaskAlertScreen.generateInfoItem('工单号', workTask.id)}
                        {WorkTaskAlertScreen.generateInfoItem('类型', '预警工单')}
                        {WorkTaskAlertScreen.generateInfoItem('状态', status)}
                        {workTask.hasOwnProperty('name') ? WorkTaskAlertScreen.generateInfoItem('处理人', workTask.name) : null}
                        {WorkTaskAlertScreen.generateInfoItem('生成时间',formatDate(workTask.startTime))}
                        {workTask.hasOwnProperty('accepttime') ? WorkTaskAlertScreen.generateInfoItem('接受时间', formatDate(workTask.acceptTime)) : null}
                        {workTask.hasOwnProperty('finishedtime') ? WorkTaskAlertScreen.generateInfoItem('完成时间', formatDate(workTask.finishedtime)) : null}
                        {WorkTaskAlertScreen.generateInfoItem('预警内容', workTask.description)}
                    </View>

                    <View style={{flexDirection: 'row', justifyContent: 'space-around',
                        padding: 12,
                        marginTop: 10, backgroundColor: 'white'}}>
                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate("SubstationStatusScreen",
                                {data: {
                                        id : workTask.electricitySubstationID,
                                        title: workTask.subStationName,
                                    }})}
                            style={[styles.btnMenu]}>

                            <View style={[styles.iconContainer]}>
                                <FontAwesome name={'bar-chart-o'} size={20} color={GlobalColors.blue}/>
                            </View>
                            <Text style={[styles.btnText]}>数据</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {this.props.navigation.navigate('SystemStructureScreen', {id: workTask.electricitySubstationID})}}
                            style={[styles.btnMenu]}>
                            <View style={[styles.iconContainer]}>
                                <MaterialIcons name={'settings-input-component'} size={20} color={GlobalColors.danger}/>
                            </View>
                            <Text style={[styles.btnText]}>系统图</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {this.props.navigation.navigate("VideoMonitoringScreen", {id: workTask.electricitySubstationID})}}
                            style={[styles.btnMenu]}>
                            <View style={[styles.iconContainer]}>
                                <Ionicons name={'ios-videocam'} size={20} color={GlobalColors.success}/>
                            </View>
                            <Text style={[styles.btnText]}>视频</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate("CompanyInfoScreen", {id: workTask.companyID})}
                            style={[styles.btnMenu]}>
                            <View style={[styles.iconContainer]}>
                                <Entypo name={'info'} size={20} color={GlobalColors.warning}/>
                            </View>
                            <Text style={[styles.btnText]}>信息</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{padding: 12, marginTop: 20,}}>
                        {btn1}
                        {btn2}
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    btnText: {
        color: '#444',
        textAlign: 'center',
        fontSize: 15,
    },
    tipText: {
        marginLeft: 5,
        width: 90,
        color: '#444',
    },
    btnMenu: {
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
    },
    noneDisplay: {
        display: 'none',
    }
});
/**
 * 监控Tab页
 *
 * @author bovenson
 * @email szhkai@qq.com
 */
'use strict';

import React, {Component} from 'react';
import {
    SafeAreaView,
    ScrollView,
    Alert,
    StatusBar,
} from 'react-native';
import PushNotification from "react-native-push-notification";
import GlobalStyles from "../../constants/GlobalStyles";
import {PageHeader} from "../components/PageHeader";
import {MonitorList} from "../components/ListItems";
import {subscribeAlert} from "../../common/CommonFunctions";
import {getMonitorList} from "../../common/NetworkRequests";

export class MonitorScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            customerList: [],
        };
        this.fetchData();
    }

    onItemPressed(item) {
        this.props.navigation.navigate('CustomerDetail', {data: item});
    }

    fetchData() {
        getMonitorList((res) => {
            if (this.mounted) {
                this.setState({customerList: res});
            }
        }, (error) => {
            Alert.alert("警告", error);
        });
    }

    onAlertMsgArrive(notification) {
        PushNotification.cancelLocalNotifications({id: notification.id});
        let psData = {
            id: notification.workTaskID,
            substationID: notification.id,
            status: notification.status
        };
        this.props.navigation.navigate('WorkTaskAlertScreen', psData);
    }

    componentDidMount() {
        this.mounted = true;
        try {
            subscribeAlert(this.onAlertMsgArrive.bind(this));               // 订阅预警
        } catch (error) {
            console.log(error);
        }
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    render() {
        return (
            <SafeAreaView style={[GlobalStyles.safeContainer]}>
                <StatusBar
                    backgroundColor="#444"
                />
                <PageHeader title={'电云'}/>
                <ScrollView>
                    <MonitorList
                        onRefresh={this.fetchData.bind(this)}
                        onItemPressed={this.onItemPressed.bind(this)}
                        data={this.state.customerList}/>
                </ScrollView>
            </SafeAreaView>
        )
    }
}
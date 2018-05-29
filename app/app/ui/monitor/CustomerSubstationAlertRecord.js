/**
 * 企业报警记录
 * 路径:
 *  - 监控Tab页 -> 企业 -> 历史工单
 *
 * @author bovenson
 * @email szhkai@qq.com
 */


'use strict';
import React, {Component} from 'react';
import {
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    Alert,
} from 'react-native';
import {WorkTaskList} from "../components/ListItems";
import {fetchCompanyWorkTaskList} from "../../common/NetworkRequests";
import GlobalStyles from "../../constants/GlobalStyles";

export class CustomerSubstationAlertScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            companyID: this.props.navigation.state.params.companyID,
            dataSource: [],
        };
    }

    fetchData() {
        fetchCompanyWorkTaskList(this.state.companyID, (data) => {
            this.setState({dataSource: data});
        }, (error) => {
            Alert.alert("警告", error);
        });
    }

    componentDidMount() {
        this.fetchData();
    }

    onItemPressed(item) {
        try {
            this.props.navigation.navigate("WorkTaskAlertScreen", {
                id: item.id,
                status: item.status,
                onGoBack: this.fetchData.bind(this)
            });
        } catch (e) {
            console.log(e);
        }
    }

    static navigationOptions = () => {
        return {
            title: '报警记录',
            headerStyle: {
                backgroundColor: '#444',
                height: 40,
            },
            headerTintColor: 'white',
            headerTitleStyle: {
                textAlign: 'center',
                flex: 1,
            },
            headerRight: <TouchableOpacity>
            </TouchableOpacity>,
        }
    };

    render() {
        return (
            <SafeAreaView style={[GlobalStyles.safeContainer]}>
                <ScrollView>
                    <WorkTaskList data={this.state.dataSource} onItemPressed={this.onItemPressed.bind(this)}/>
                </ScrollView>
            </SafeAreaView>
        )
    }
}
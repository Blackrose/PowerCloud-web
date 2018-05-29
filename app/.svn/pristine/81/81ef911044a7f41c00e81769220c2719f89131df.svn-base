/**
 * 工单Tab页
 *
 * @author bovenson
 * @email szhkai@qq.com
 */


'use strict';

import React, {Component} from 'react';
import {
    SafeAreaView,
    } from 'react-native';
import GlobalStyles from "../../constants/GlobalStyles";
import {PageHeader} from "../components/PageHeader";
import {WorkTaskList} from "../components/ListItems";
import {fetchWorkTaskList} from "../../common/NetworkRequests";

export class WorkTaskScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dataSource: [],
        };
    }

    onGoBack() {
        this.fetchData();
    }

    fetchData() {
        fetchWorkTaskList((data) => {
            this.setState({dataSource: data});
        });
    }

    componentDidMount() {
        this.fetchData();
    }

    onItemPressed(item) {
        try {
            console.log(item);
            let psData = {id: item.id,
                status: item.status,
                substationID: item.electricitysubstationid,
                onGoBack: this.onGoBack.bind(this)};
            this.props.navigation.navigate("WorkTaskAlertScreen", psData);
        } catch (e) {
            console.log(e);
        }
    }

    render() {
        return (
            <SafeAreaView style={[GlobalStyles.safeContainer]}>
                <PageHeader title={'工单'} />
                <WorkTaskList
                    data={this.state.dataSource}
                    onRefresh={this.fetchData.bind(this)}
                    onItemPressed={this.onItemPressed.bind(this)} />
            </SafeAreaView>
        )
    }
}
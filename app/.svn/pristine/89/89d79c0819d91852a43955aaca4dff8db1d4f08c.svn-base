/**
 * 监控Tab页 -> 企业 -> 服务报告
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
    } from 'react-native';
import {ServiceRecordList} from "../../components/ListItems";
import GlobalStyles from "../../../constants/GlobalStyles";
import {MUtils} from "../../../utils/Utils";
import {API_PRO_SERVICE_LIST_URL, SERVER_ADDRESS} from "../../../constants/GlobalVars";

export class ServiceRecordScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            companyID: this.props.navigation.state.params.id,
            tableData: []
        };
    }

    static navigationOptions = () => {  // static navigationOptions = ({navigation}) => {
        // const {params} = navigation.state;
        return {
            title: "服务报告",
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

    fetchData() {
        MUtils.fetchData(API_PRO_SERVICE_LIST_URL, MUtils.packFormData({
            id: global.LOGIN_UER_ID,
        }), (responseJson) => {
            this.setState({tableData: JSON.parse(responseJson.data)});
        }, (error) => {
            console.log(error);
        })
    }

    onItemPressed(item) {
        let fileUrl = SERVER_ADDRESS + item.reportpath;
        this.props.navigation.navigate('PDFViewer', {pdfFileUri: fileUrl, title: item.servicename})
    }

    componentDidMount() {
        this.fetchData();
    }

    render() {
        return (
            <SafeAreaView style={[GlobalStyles.safeContainer]}>
                <ScrollView>
                    <ServiceRecordList
                        onItemPressed={this.onItemPressed.bind(this)}
                        data={this.state.tableData}
                    />
                </ScrollView>
            </SafeAreaView>
        )
    }
}
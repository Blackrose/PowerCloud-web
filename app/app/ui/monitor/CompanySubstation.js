/**
 * 客户变电所列表
 * 路径：
 *  - 监控Tab页 -> 企业 -> 变电站列表
 *
 * @author bovenson
 * @email szhkai@qq.com
 */

'use strict';
import React, {Component} from 'react';
import {
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    Alert,
    StyleSheet,
    ScrollView,
} from 'react-native';
import GlobalStyles from "../../constants/GlobalStyles";
import Ionicons from "react-native-vector-icons/Ionicons";
import Modal from 'react-native-modalbox';
import {NavigationUtils} from "../../utils/Utils";
import {SubstationSwipeList} from "../components/ListItems";
import {fetchSubstationList} from "../../common/NetworkRequests";
import {StatisticScreen} from "./customer/StatisticAnalysis";

export class CustomerDetailScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            companyInfo: this.props.navigation.state.params.data,
            isDisabled: false,
            modalIsOpen: false,
            substationList: [],
        };
    }

    static navigationOptions = ({navigation}) => {
        const {params} = navigation.state;

        return {
            title: params.data.company,
            headerStyle: {
                backgroundColor: '#444',
                height: 40,
            },
            headerTintColor: 'white',
            headerTitleStyle: {
                textAlign: 'center',
                flex: 1,
            },
            headerRight: <TouchableOpacity
                style={{marginRight: 15}}
                onPress={params.customerMenuTrigger}>
                <Ionicons
                    name={'ios-add'}
                    size={30}
                    style={{color: 'white',}}
                />
            </TouchableOpacity>,
        }
    };

    customerMenuTrigger() {
        this.refs.menuModal.open();
        this.setState({modalIsOpen: !this.state.modalIsOpen});
    }

    componentWillMount() {
        this.props.navigation.setParams({customerMenuTrigger: this.customerMenuTrigger.bind(this),});
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData() {
        fetchSubstationList(this.state.companyInfo.id, (responseData) => {
            this.setState({substationList: responseData});
        }, (error) => {
            Alert.alert("获取数据失败", error);
        });
    }

    render() {
        return (
            <SafeAreaView style={[GlobalStyles.safeContainer]}>
                <ScrollView>
                    <SubstationSwipeList parentNavigation={this.props.navigation} data={this.state.substationList}/>
                </ScrollView>

                <Modal style={[styles.menuModal]}
                       isOpen={this.state.modalIsOpen}
                       position={"top"} ref={"menuModal"}
                       animationDuration={0}
                       backdropColor={'white'}
                       backdropOpacity={0}
                       isDisabled={this.state.isDisabled}>
                    <View style={{width: '100%', height: '100%'}}>
                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate("CustomerSubstationAlertScreen", {companyID: this.state.companyInfo.id})}
                            style={[styles.menuModalItem, styles.menuModalItemBorder]}>
                            <Text style={[styles.menuModalText]}>历史工单</Text>
                        </TouchableOpacity>
                        {/*<TouchableOpacity*/}
                            {/*onPress={() => NavigationUtils.navTo(this.props, "StatisticScreen")}*/}
                            {/*style={[styles.menuModalItem, styles.menuModalItemBorder]}>*/}
                            {/*<Text style={[styles.menuModalText]}>用电分析</Text>*/}
                        {/*</TouchableOpacity>*/}
                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate("CompanyInfoScreen", {id: this.state.companyInfo.id})}
                            style={[styles.menuModalItem, styles.menuModalItemBorder]}>
                            <Text style={[styles.menuModalText]}>企业信息</Text>
                        </TouchableOpacity>
                        {/*<TouchableOpacity*/}
                            {/*onPress={() => this.props.navigation.navigate("ServiceRecordScreen", {id: this.state.companyInfo.id})}*/}
                            {/*style={[styles.menuModalItem]}>*/}
                            {/*<Text style={[styles.menuModalText]}>服务报告</Text>*/}
                        {/*</TouchableOpacity>*/}
                    </View>
                </Modal>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    menuModal: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 90,
        height: 80,
        position: 'absolute',
        right: 140,
        backgroundColor: '#444',
    }, menuModalText: {
        fontSize: 17,
        fontWeight: "400",
        color: 'white',
        textAlign: 'center'
    }, menuModalItem: {
        padding: 8,
        flex: 1,
    }, menuModalItemBorder: {
        borderBottomWidth: 0.3,
        borderColor: 'black',
    }, infoItemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    }
});
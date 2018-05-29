/**
 * 监控Tab页 -> 企业 -> 企业信息
 */
'use strict';

import React, {Component} from 'react';
import {
    View,
    Text,
    Alert,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    TouchableOpacity,
} from 'react-native';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import GlobalStyles, {GlobalColors} from "../../../constants/GlobalStyles";
import {fetchCompanyInfo} from "../../../common/NetworkRequests";
import moment from "moment/moment";

/**
 * 企业信息
 * 当行传入参数:
 *  - id : 企业id
 */
export class CompanyInfoScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            companyID: this.props.navigation.state.params.id,
            companyInfo: {},
        };
        this.fetchData();
    }

    static navigationOptions = ({navigation}) => {
        const {params} = navigation.state;

        return {
            title: "企业信息",
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
            </TouchableOpacity>,
        }
    };

    fetchData() {
        console.log(this.state.companyID);
        fetchCompanyInfo(this.state.companyID, (data) => {
            this.setState({companyInfo: data});
        }, (error) => {
            Alert.alert("警告", error)
        });
    }

    componentDidMount() {
    }

    render() {
        return (
            <SafeAreaView style={[GlobalStyles.safeContainer, {backgroundColor: GlobalColors.bgColor}]}>
                <ScrollView>
                    <View style={{backgroundColor: 'white', padding: 12}}>
                        <View style={[GlobalStyles.infoRowView]}>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <MaterialCommunityIcons name={'home-circle'} size={50}/>
                                <Text style={{
                                    fontSize: 22,
                                    marginLeft: 10,
                                    color: 'black'
                                }}>{this.state.companyInfo.company}</Text>
                            </View>
                        </View>
                        <View style={[GlobalStyles.infoRowView]}>
                            <Ionicons name={'ios-card-outline'} size={20}/>
                            <Text style={[GlobalStyles.infoRowText, styles.tipText]}>地址</Text>
                            <Text style={[GlobalStyles.infoRowText]}>{this.state.companyInfo.address}</Text>
                        </View>
                        <View style={[GlobalStyles.infoRowView]}>
                            <Ionicons name={'ios-card-outline'} size={20}/>
                            <Text style={[GlobalStyles.infoRowText, styles.tipText]}>负责人</Text>
                            <Text style={[GlobalStyles.infoRowText]}>{this.state.companyInfo.bizOwnerName}</Text>
                        </View>
                        <View style={[GlobalStyles.infoRowView]}>
                            <Ionicons name={'ios-card-outline'} size={20}/>
                            <Text style={[GlobalStyles.infoRowText, styles.tipText]}>电话</Text>
                            <Text style={[GlobalStyles.infoRowText]}>{this.state.companyInfo.bizOwnerPhone}</Text>
                        </View>
                        <View style={[GlobalStyles.infoRowView]}>
                            <Ionicons name={'ios-card-outline'} size={20}/>
                            <Text style={[GlobalStyles.infoRowText, styles.tipText]}>变电站数量</Text>
                            <Text style={[GlobalStyles.infoRowText]}>{this.state.companyInfo.num}</Text>
                        </View>
                        <View style={[GlobalStyles.infoRowView]}>
                            <Ionicons name={'ios-card-outline'} size={20}/>
                            <Text style={[GlobalStyles.infoRowText, styles.tipText]}>服务有效期</Text>
                            <Text
                                style={[GlobalStyles.infoRowText]}>{moment(this.state.companyInfo.endTime).format('YYYY-MM-DD HH:mm')}</Text>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    text: {
        fontSize: 18,
        marginBottom: 8,
    },
    tipText: {
        marginLeft: 5,
        width: 90,
        color: '#444',
    },
    bigBtnText: {
        fontSize: 18,
        color: 'white',
        textAlign: 'center',
    },
});
/**
 * 用户信息展示
 *
 * 路径:
 *  - 用户Tab页 -> 点击个人信息栏
 *  - 位置Tab页 -> 电工
 *
 * @author bovenson
 * @email szhkai@qq.com
 */
'use strict';
import React, {Component} from 'react';
import {CachedImage} from 'react-native-img-cache';
import Ionicons from "react-native-vector-icons/Ionicons";
import moment from 'moment';
import {
    Text,
    SafeAreaView,
    View,
    TouchableOpacity,
    ScrollView,
    StyleSheet, Alert,
} from 'react-native';
import {
    LOGIN_USER_INFO_KEY, SERVER_ADDRESS
} from "../../constants/GlobalVars";
import {isUndefinedOrNull, NavigationUtils} from "../../utils/Utils";
import GlobalStyles, {GlobalBtnStyles} from "../../constants/GlobalStyles";
import StorageUtil from "../../utils/StorageUtil";
import {fetchUserProfile} from "../../common/NetworkRequests";

export class UserProfileScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            profile: {},
            id: this.props.navigation.state.params.id,
        };
        this.fetchData();
    }

    static navigationOptions = () => {    // 头部导航栏
        return {
            title: "个人信息",
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

    fetchData() {   // 请求用户信息
        let id = isUndefinedOrNull(this.state.id) ? global.LOGIN_UER_ID : this.state.id;
        fetchUserProfile(id, (res) => {
            if (this.mounted) {
                this.setState({profile: res});
            }
        }, (error) => {
            Alert.alert('警告', error);
        });
    }

    logout() {  // 退出登录
        StorageUtil.delete(LOGIN_USER_INFO_KEY).then(() => {
            global.isLogin = false;
            global.LOGIN_UER_ID = null;
            global.LOGIN_USER_INFO = null;
            NavigationUtils.navToScreenNeverBack(this.props, 'Greeting');
        });
    }

    componentDidMount() {
        this.mounted = true;
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    render() {
        let imgUri = SERVER_ADDRESS + this.state.profile.pic;
        return (
            <SafeAreaView style={{backgroundColor: '#eee', flex: 1}}>
                <ScrollView>
                    <View style={{backgroundColor: 'white', padding: 12}}>
                        <View style={[GlobalStyles.infoRowView]}>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <CachedImage source={{uri: imgUri}} style={[styles.avatar]}/>
                                <Text
                                    style={{
                                        fontSize: 22,
                                        marginLeft: 10,
                                        color: 'black'
                                    }}>{this.state.profile.name}</Text>
                            </View>
                        </View>
                        <View style={[GlobalStyles.infoRowView]}>
                            <Ionicons name={'ios-card-outline'} size={20}/>
                            <Text style={[GlobalStyles.infoRowText, styles.tipText]}>地址</Text>
                            <Text style={[GlobalStyles.infoRowText]}>{this.state.profile.address}</Text>
                        </View>
                        <View style={[GlobalStyles.infoRowView]}>
                            <Ionicons name={'ios-card-outline'} size={20}/>
                            <Text style={[GlobalStyles.infoRowText, styles.tipText]}>出生日期</Text>
                            <Text
                                style={[GlobalStyles.infoRowText]}>{moment(this.state.profile.birthday).format('YYYY-MM-DD')}</Text>
                        </View>
                        <View style={[GlobalStyles.infoRowView]}>
                            <Ionicons name={'ios-card-outline'} size={20}/>
                            <Text style={[GlobalStyles.infoRowText, styles.tipText]}>职业资格等级</Text>
                            <Text style={[GlobalStyles.infoRowText]}>{this.state.profile.ecnum}</Text>
                        </View>
                        <View style={[GlobalStyles.infoRowView]}>
                            <Ionicons name={'ios-card-outline'} size={20}/>
                            <Text style={[GlobalStyles.infoRowText, styles.tipText]}>单位</Text>
                            <Text style={[GlobalStyles.infoRowText]}>{this.state.profile.sccompanyname}</Text>
                        </View>
                        <View style={[GlobalStyles.infoRowView]}>
                            <Ionicons name={'ios-card-outline'} size={20}/>
                            <Text style={[GlobalStyles.infoRowText, styles.tipText]}>联系电话</Text>
                            <Text style={[GlobalStyles.infoRowText]}>{this.state.profile.tel}</Text>
                        </View>
                    </View>

                    <View style={{padding: 12, marginTop: 20}}>
                        <TouchableOpacity
                            onPress={() => this.logout()}
                            style={[GlobalBtnStyles.greenSolidBtn]}>
                            <Text style={[GlobalBtnStyles.greenSolidBtnText]}>退出登录</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    tipText: {
        marginLeft: 5,
        width: 120,
        color: '#444',
    },
});
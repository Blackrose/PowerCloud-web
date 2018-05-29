/**
 * 登录界面
 *
 * @author bovenson
 * @email szhkai@qq.com
 */


'use strict';

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    SafeAreaView,
    View,
    Image,
    TouchableOpacity,
    Alert,
} from 'react-native';
import GlobalStyles from "../constants/GlobalStyles";
import {NavigationUtils, parseToJSON} from "../utils/Utils";
import {login} from "../common/NetworkRequests";
import {UserInfoManager} from "../common/StorageManager";

export class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            account: '',
            password: '',
        }
    }

    actionLogin() {
        login(this.state.account, this.state.password, (responseJson) => {
            // 保存返回的职工信息
            let userInfo = parseToJSON(responseJson.data);
            UserInfoManager.saveUserData(userInfo);
            UserInfoManager.loadUserInfoWithData(userInfo);
            // 转到主界面
            NavigationUtils.navToScreenNeverBack(this.props, 'Main');
        }, (msg) => {
            Alert.alert("登录失败", msg);
        });
    }
    cancelLogin() {
        this.setState({account: "", password: ""});
    }

    componentDidMount() {
    }

    render() {
        return (
            <SafeAreaView style={[GlobalStyles.safeContainer,
                {justifyContent: 'space-between', paddingBottom: 30, paddingTop: 30}]}>
                <View style={{flexDirection: 'row'}}>
                    <View style={[{flex: 1, justifyContent: 'center', alignItems: 'center'}]}>
                        <View>
                            <Text style={[styles.tipText]}>实时监控</Text>
                            <Text style={[styles.tipText]}>精细管理</Text>
                            <Text style={[styles.tipText]}>专业服务</Text>
                        </View>
                    </View>
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <Image
                            style={[styles.img]}
                            source={require("../statics/media/img/logo.png")}
                        />
                    </View>
                </View>


                <View style={{padding: 25}}>
                    <View style={[styles.inputRow, styles.border]}>
                        <Text style={{fontSize: 20, flex: 2, textAlign: 'center'}}>用户名</Text>
                        <TextInput
                            underlineColorAndroid='transparent'
                            style={[GlobalStyles.textInput, {flex: 5, height: 30,}]}
                            placeholder="输入用户名"
                            onChangeText={(text) => this.setState({account: text})}
                            value={this.state.account}
                        />
                    </View>
                    <View style={[styles.inputRow, styles.border, {marginTop: 10}]}>
                        <Text style={{fontSize: 20, flex: 2, textAlign: 'center'}}>密码</Text>
                        <TextInput
                            secureTextEntry={true}
                            underlineColorAndroid='transparent'
                            style={[GlobalStyles.textInput, {flex: 5, height: 30}]}
                            placeholder="输入密码"
                            onChangeText={(text) => this.setState({password: text})}
                            value={this.state.password}
                        />
                    </View>
                    <View style={[{flexDirection: 'row', justifyContent: 'center', paddingTop: 30}]}>
                        <TouchableOpacity
                            onPress={this.cancelLogin.bind(this)}
                            style={[styles.actionButton, {backgroundColor: 'grey', marginRight: 50,}]}>
                            <Text style={{color: 'white'}}>取消</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.actionButton, {backgroundColor: 'green'}]}
                                          onPress={this.actionLogin.bind(this)}>
                            <Text style={{color: 'white'}}>登录</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[{marginTop: 50}]}>
                        <Text style={[{textAlign: 'center'}, GlobalStyles.borderRadius]}>PowerCloud版权所有
                            Copyright©2018</Text>
                    </View>
                </View>
            </SafeAreaView>
        )
    }
}


const styles = StyleSheet.create({
    tipText: {
        fontSize: 22,
        color: '#555',
        fontWeight: 'bold',
        padding: 8,
        textAlign: 'center',
    },
    img: {
        width: 90,
        height: 90,
        maxWidth: 90,
        maxHeight: 90,
        flex: 1,
    },
    loginField: {
        flex: 1,
        flexDirection: 'column',
    },
    inputRow: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    actionButton: {
        paddingLeft: 40,
        paddingRight: 40,
        paddingTop: 8,
        paddingBottom: 8,
        borderRadius: 3,
    },
});
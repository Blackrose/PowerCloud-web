/**
 * 工具类
 *
 * @author bovenson
 * @email szhkai@qq.com
 */
'use strict';


import React from 'react';
import Toast from "react-native-easy-toast";
import {NavigationActions} from "react-navigation";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
} from 'react-native';
import GlobalStyles from "../constants/GlobalStyles";
import moment from "moment/moment";

export const MUtils = {
    fetchData: (url, data, successCallBack, errorCallback) => {
        // console.log('请求参数:' + JSON.stringify(data));
        fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            body: data
        }).then((response) => response.json())
            .then((responseJson) => {
                successCallBack(responseJson);
            }).catch((error) => {
                console.log(error);
                errorCallback(error);
        });
    },
    packFormData: (dataDict) => {
        if (arguments.length === 0) {
            return null;
        } else {
            try {
                let formData = new FormData();
                if (global.TOKEN) {
                    formData.append('token', global.TOKEN);
                }
                if (global.LOGIN_USER_INFO) {
                    formData.append('account', global.LOGIN_USER_INFO.phone);
                }
                for (let key in dataDict) {
                    if (dataDict.hasOwnProperty(key)) {
                        formData.append(key, dataDict[key]);
                    }
                }
                return formData;
            } catch (e) {
                return null;
            }
        }
    },
    getToast: () => {
        return <Toast
            ref="toast"
            positionValue={200}
            fadeInDuration={750}
            fadeOutDuration={1000}
            opacity={0.6}
        />;
    },
    noneBackNavigate: (navigataion, routeName) => {
        // 不可返回导航
        const resetAction = NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({
                    routeName: routeName,
                })
            ]
        });

        navigataion.dispatch(resetAction);
    },
    getCurrentYearMonth: () => {    // 获取当前年月 返回格式如: 2018-01
        let today = new Date();
        return today.getFullYear() + "-" + parseInt(today.getMonth()+1);
    },
    tableUtil: {
        generateHeader: (header) => {
            return(
                <View style={[GlobalStyles.tableRow]}>
                    { header.map(function (title) {
                        return <Text key={title} style={[GlobalStyles.tableCell]}>{title}</Text>
                    }) }
                </View>
            )
        },
        /**
         *  生成列表项
         * @param instance          对象实例
         * @param data              数据
         * @param generateRow       生成Row的函数
         * @param rowPressHandler   Row点击事件处理函数
         * @param onFreshHandler    刷新事件处理函数
         * @returns {*}
         */
        generateRows: (instance, data, generateRow, rowPressHandler, onFreshHandler) => {
            return(
                <FlatList
                    keyExtractor={(item, index) => index}
                    data={data}
                    style={{flex: 1}}
                    renderItem={({item}) => {
                        return (
                            <TouchableOpacity onPress={rowPressHandler.bind(instance, item)}>
                                {generateRow(item)}
                            </TouchableOpacity>
                        )
                    }}
                    onRefresh={onFreshHandler}
                    refreshing={false}
                />
            )
        }
    }
};

export const NavigationUtils = {
    navToScreenNeverBack: (props, screenName) => {
        // 不可返回导航
        const resetAction = NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({
                    routeName: screenName,
                })
            ]
        });
        props.navigation.dispatch(resetAction);
    },
    navTo: (props, screenName, data) => {
        props.navigation.navigate(screenName, {data: data})
    },
};

export function parseToJSON(obj) {
    if (typeof obj === typeof "") {
        return JSON.parse(obj)
    } else {
        return obj
    }
}

export function isUndefinedOrNull(obj) {
    return typeof(obj)  === 'undefined' || obj === null;
}

/**
 * 格式化时间
 * @param stamp         时间戳
 * @param withoutTime   false、undefined: 有时、分、秒; true: 截止到day
 * @returns {string}
 */
export function formatDate(stamp, withoutTime) {
    return isUndefinedOrNull(withoutTime) || !withoutTime ? moment(stamp).format('YYYY-MM-DD HH:mm') : moment(stamp).format('YYYY-MM-DD');
}

/**
 * 生成UUID码
 */
export function guid() {
    /**
     * @return {string}
     */
    function S4() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    }
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}
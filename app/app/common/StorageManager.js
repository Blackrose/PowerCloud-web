/**
 * 本地储存管理
 *
 * @author bovenson
 * @email szhkai@qq.com
 */


'use strict';

import {getCompanyAndElectricianPositions, getCustomerList, getUserCertificatePics} from "./NetworkRequests";
import {
    AsyncStorage,
    Alert,
} from "react-native";
import {
    KEY_COMPANY_ELECTRICIAN_POSITION, KEY_USER_CERTIFICATE, LOGIN_USER_INFO_KEY,
    MAIN_SCREEN_COMPANY_LIST_KEY
} from "../constants/GlobalVars";
import StorageUtil from "../utils/StorageUtil";

/**
 * 用户登录
 * @param userInfo  用户信息
 */
export function setUserLogin(userInfo) {
    try {
        if (userInfo && userInfo.hasOwnProperty('id')) {
            global.isLogin = true;
            global.LOGIN_UER_ID = userInfo.id;
            global.LOGIN_USER_INFO = userInfo;
            if (userInfo.hasOwnProperty('token')) {
                global.TOKEN = userInfo.token;
            }
        }
    } catch (error) {
        console.log("加载用户信息失败: " + error + "  " + userInfo.toString())
    }
}

/**
 * 用户注销
 */
export function setUserLogout() {
    StorageUtil.delete(LOGIN_USER_INFO_KEY).catch();
    global.isLogin = false;
    global.LOGIN_UER_ID = null;
    global.LOGIN_USER_INFO = null;
    global.TOKEN = null;
}

export const UserInfoManager = {
    isLogin: () => {    // 是否登录
        return getDataFromAsyncStorage(LOGIN_USER_INFO_KEY) != null;
    },
    loadUserInfoWithData: (userInfo) => {
        setUserLogin(userInfo);
    },
    loadUserData: async () => {   // 加载本地保存的用户信息
        StorageUtil.get(LOGIN_USER_INFO_KEY).then((userInfo) => {
            console.log('加载本地保存的用户信息:' + JSON.stringify(userInfo));
            UserInfoManager.loadUserInfoWithData(userInfo);
        });
    },
    saveUserData: (userInfo) => {   // 保存用户数据到本地
        // console.log('保存用户信息:' + JSON.stringify(userInfo));
        StorageUtil.save(LOGIN_USER_INFO_KEY, userInfo).catch((error) => {
            console.log("保存数据出错: " + error)
        });
    },
    logout: () => {     // 删除用户保存的本地信息,用户注销用
        setUserLogout();
    },
    getUserCertificatePics: (successCF, errorCF) => { // 获取用户证书
        getUserCertificatePics(global.LOGIN_UER_ID, (responseResult) => {
            StorageUtil.save(KEY_USER_CERTIFICATE, responseResult).catch();
            successCF(responseResult);
        }, (error) => {
            let localStorage = StorageUtil.get(KEY_USER_CERTIFICATE);
            if (localStorage) {
                successCF(localStorage);
            } else {
                errorCF("获取数据失败");
            }
        })
    },
};

/**
 * 监控客户列表
 * @type {{getWithUpdate: function()}}
 */
export const CustomerList = {
    getWithUpdate: (successCF, errorCF) => {
        getCustomerList((customerList) => {
            try {
                if (customerList) {
                    StorageUtil.save(MAIN_SCREEN_COMPANY_LIST_KEY, customerList).catch();
                    successCF(customerList);
                } else {
                    customerList = StorageUtil.get(MAIN_SCREEN_COMPANY_LIST_KEY);
                    if (customerList) {
                        successCF(customerList);
                    } else if (errorCF) {
                        errorCF("获取数据失败");
                    }
                }
            } catch (error) {
                if (errorCF) {
                    errorCF("网络请求失败");
                }
            }
        }, (error) => {
            let localStorage = StorageUtil.get(MAIN_SCREEN_COMPANY_LIST_KEY);
            if (localStorage) {
                successCF(localStorage);
            } else if (errorCF) {
                errorCF(error);
            }
        });
    },
    getData: () => {
        return StorageUtil.get(MAIN_SCREEN_COMPANY_LIST_KEY);
    }
};

/**
 * 企业、电工位置工具
 * @type {{}}
 */
export const ElectricianPositionUtil = {
    getPositions: (successCF, errorCF) => {
        getCompanyAndElectricianPositions(global.LOGIN_UER_ID, (responseResult) => {
            StorageUtil.save(KEY_COMPANY_ELECTRICIAN_POSITION, responseResult).catch();
            successCF(responseResult);
        }, (error) => {
            let localStorage = StorageUtil.get(KEY_COMPANY_ELECTRICIAN_POSITION);
            if (localStorage) {
                successCF(localStorage);
            } else {
                errorCF("获取数据失败");
            }
        })
    }
};

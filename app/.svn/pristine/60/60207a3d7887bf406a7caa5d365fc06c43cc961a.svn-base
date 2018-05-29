/**
 * 网络请求
 *
 * @author bovenson
 * @email szhkai@qq.com
 */


'use strict';
import React from 'react';
import {MUtils, parseToJSON} from "../utils/Utils";
import {
    API_COMPANY_ELECTRICIAN_POSITION,
    API_GET_COMPANY_INFO,
    API_GET_ELECTRICIAN_DOMAINS,
    API_GET_ELECTRICIAN_PIC,
    API_GET_MONITOR_LIST,
    API_GET_SUBSTATION_AND_TRANSFORMER,
    API_GET_SUBSTATION_INFO,
    API_GET_SUBSTATION_LAST_STATUS,
    API_SUBSTATION_VIDEO,
    API_V2_URL_WORKTASK_LIST,
    API_WORK_TASK_DETAIL,
    API_WORK_TASK_RECEIVE,
    API_WORK_TASK_RETURN,
    API_WORK_TASK_SAVE,
    ELECTRICIAN_PROFILE_URL,
    LOGIN_URL,
    MAIN_SCREEN_COMPANY_LIST_URL,
    WORK_TASK_LIST_URL
} from "../constants/GlobalVars";

/**
 * 获取企业列表
 *
 * @returns {null}
 */
export function getCustomerList(callBackFunction, errorCF) {
    try {
        MUtils.fetchData(MAIN_SCREEN_COMPANY_LIST_URL, MUtils.packFormData({
            id: global.LOGIN_UER_ID,
        }), (responseJson) => {
            let data = responseJson.data;
            for (let i=0; i < data.length; ++i) {
                data[i] = JSON.parse(data[i]);
                data[i]['key'] = data[i].id;
            }
            callBackFunction(data);
        }, (error) => {
            errorCF("网络请求失败");
        });
    } catch (error) {
        errorCF("获取数据失败")
    }
}

/**
 * 获取工单列表
 * @param callBackFunction  回调函数
 */
export function fetchWorkTaskList(callBackFunction) {
    try {
        MUtils.fetchData(WORK_TASK_LIST_URL, MUtils.packFormData({
            id: global.LOGIN_UER_ID,
        }), (responseJson) => {
            let data = JSON.parse(responseJson.data);
            // console.log("工单列表: " + JSON.stringify(data));
            callBackFunction(data);
        }, (error) => {
            console.log("获取企业列表网络请求失败" + error);
            callBackFunction(null);
        });
    } catch (error) {
        error.stackTrace();
        console.log(error);
        callBackFunction(null)
    }
}

/**
 * 登录
 * @param account       账号
 * @param password      密码
 * @param successCF     成功后回调函数
 * @param errorCF       失败后回调函数
 */
export function login(account, password, successCF, errorCF) {
    try {
        MUtils.fetchData(`${LOGIN_URL}`, MUtils.packFormData({
            account: account,
            password: password,
            code: global.APP_CODE,
        }), (responseJson) => {
            responseJson = parseToJSON(responseJson);
            if (responseJson.ok === true) {
                successCF(responseJson);
            } else {
                errorCF(responseJson.data);
            }
        }, (error) => {
            errorCF("网络连接异常");
            console.log(error);
        });
    } catch (error) {
        errorCF("网络连接异常");
        console.log(error);
    }
}

/**
 * 获取网络请求数据通用函数
 * @param url           请求地址
 * @param data          请求数据
 * @param successCF     成功后回调函数
 * @param errorCF       失败后回调函数
 */
export function fetchData(url, data, successCF, errorCF) {
    try {
        MUtils.fetchData(url, data, (responseJson) => {
            responseJson = parseToJSON(responseJson);
            if (responseJson.ok === true) {
                try {
                    successCF(JSON.parse(responseJson.data));
                } catch (error) {
                    successCF(responseJson.data);
                }
            } else {
                errorCF(responseJson.data);
            }
        }, (error) => {
            errorCF("网络连接异常");
            console.log(error);
        });
    } catch (error) {
        errorCF("网络连接异常");
        console.log(error);
    }
}

/**
 * 获取企业下所有变电所列表
 * @param companyID     企业ID
 * @param successCF     成功后回调函数
 * @param errorCF       失败后回调函数
 */
export function fetchSubstationList(companyID, successCF, errorCF) {
    let formData = MUtils.packFormData({
        id: companyID,
    });
    fetchData(API_GET_SUBSTATION_AND_TRANSFORMER, formData, successCF, errorCF);
}

/**
 * 获取工单详情
 * @param workTaskID        工单ID
 * @param workTaskStatus    工单状态
 * @param successCF         成功后回调函数
 * @param errorCF           失败后回调函数
 */
export function fetchWorkTaskDetail(workTaskID, workTaskStatus, successCF, errorCF) {
    let formData = MUtils.packFormData({
        id: workTaskID,
        status: workTaskStatus,
    });
    fetchData(API_WORK_TASK_DETAIL, formData, successCF, errorCF);
}

/**
 * 获取企业信息
 * @param companyID 企业ID
 * @param successCF
 * @param errorCF
 */
export function fetchCompanyInfo(companyID, successCF, errorCF) {
    let formData = MUtils.packFormData({
        id: companyID,
    });
    fetchData(API_GET_COMPANY_INFO, formData, successCF, errorCF)
}

/**
 * 接受工单
 * @param electricianID 电工id
 * @param workTaskID    工单id
 * @param successCF
 * @param errorCF
 */
export function workTaskReceiveRequest(electricianID, workTaskID, successCF, errorCF) {
    let formData = MUtils.packFormData({
        id: electricianID,
        workTaskId: workTaskID,
    });
    console.log(formData);
    fetchData(API_WORK_TASK_RECEIVE, formData, successCF, errorCF);
}

/**
 * 退回工单
 * @param electricianID 电工id
 * @param workTaskID    工单id
 * @param successCF
 * @param errorCF
 */
export function workTaskReturnRequest(electricianID, workTaskID, successCF, errorCF) {
    let formData = MUtils.packFormData({
        id: electricianID,
        workTaskId: workTaskID,
        reason: '未定义',
    });
    fetchData(API_WORK_TASK_RETURN, formData, successCF, errorCF);
}

/**
 * 保存工单
 * @param formData
 * @param successCF
 * @param errorCF
 */
export function saveWorkTaskRequest(formData, successCF, errorCF) {
    console.log(formData);
    fetchData(API_WORK_TASK_SAVE, formData, successCF, errorCF);
}

/**
 * 获取位置
 * @param id
 * @param successCF
 * @param errorCF
 */
export function getCompanyAndElectricianPositions(id, successCF, errorCF) {
    let formData = MUtils.packFormData({
        id: id,
    });
    fetchData(API_COMPANY_ELECTRICIAN_POSITION, formData, successCF, errorCF);
}

/**
 * 获取用户证书图片
 * @param id    用户ID
 * @param successCF
 * @param errorCF
 */
export function getUserCertificatePics(id, successCF, errorCF) {
    let formData = MUtils.packFormData({
        id: id,
    });
    fetchData(API_GET_ELECTRICIAN_PIC, formData, successCF, errorCF);
}

/**
 * 获取变电站视频地址
 * @param id
 * @param successCF
 * @param errorCF
 */
export function getSubstationVideo(id, successCF, errorCF) {
    let formData = MUtils.packFormData({
        id: id,
    });
    fetchData(API_SUBSTATION_VIDEO, formData, successCF, errorCF);
}

/**
 * 获取电工信息
 * @param id        电工ID
 * @param successCF 成功后回调函数
 * @param errorCF   错误后回调函数
 */
export function getElectricianInfo(id, successCF, errorCF) {
    let formData = MUtils.packFormData({
        id: id,
    });
    fetchData(ELECTRICIAN_PROFILE_URL, formData, successCF, errorCF);
}

/**
 * 获取电工所属管理域列表, 用于订阅报警信息等
 * @param id            电工ID
 * @param successCF     成功后回调函数
 * @param errorCF       失败后回调函数
 */
export function getElectricianDomains(id, successCF, errorCF) {
    let formData = MUtils.packFormData({
        id: id,
    });
    fetchData(API_GET_ELECTRICIAN_DOMAINS, formData, successCF, errorCF);
}

/**
 * 获取变电所信息
 * @param id            变电所ID
 * @param successCF     成功后回调函数
 * @param errorCF       失败后回调函数
 */
export function getSubstationInfo(id, successCF, errorCF) {
    let formData = MUtils.packFormData({
        id: id,
    });
    fetchData(API_GET_SUBSTATION_INFO, formData, successCF, errorCF);
}

/**
 * 获取监控列表
 * @param successCF
 * @param errorCF
 */
export function getMonitorList(successCF, errorCF) {
    let formData = MUtils.packFormData({
        id: global.LOGIN_UER_ID,
    });
    fetchData(API_GET_MONITOR_LIST, formData, successCF, errorCF);
}

/**
 * 获取企业工单列表
 * @param companyID     企业id
 * @param successCF     成功回调函数
 * @param errorCF       失败回调函数
 */
export function fetchCompanyWorkTaskList(companyID, successCF, errorCF) {
    let formData = MUtils.packFormData({
        id: global.LOGIN_UER_ID,
        companyID: companyID,
    });
    fetchData(WORK_TASK_LIST_URL, formData, successCF, errorCF);
}

/**
 * 获取电工详细信息
 * @param id            电工ID
 * @param successCF     成功回调函数
 * @param errorCF       失败回调函数
 */
export function fetchUserProfile(id, successCF, errorCF) {
    let formData = MUtils.packFormData({
        id: id,
    });
    fetchData(ELECTRICIAN_PROFILE_URL, formData, successCF, errorCF);
}

/**
 * 获取电站上一条数据信息
 * @param id            变电所ID
 * @param successCF     成功回调函数
 * @param errorCF       失败后回调函数
 */
export function fetchSubstationLastStatus(id, successCF, errorCF) {
    let formData = MUtils.packFormData({
        id: id,
    });
    fetchData(API_GET_SUBSTATION_LAST_STATUS, formData, successCF, errorCF);
}
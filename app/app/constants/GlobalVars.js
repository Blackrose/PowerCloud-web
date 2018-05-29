/**
 * 全局变量
 *  - 服务器地址
 *  - 请求地址
 *  - 本地存储数据Key值
 *  - 工单状态定义
 *
 * @author bovenson
 * @email szhkai@qq.com
 */
'use strict';

// 服务器设置
// export const SERVER_ADDRESS = "http://localhost:8082";
// export const SERVER_ADDRESS = "http://202.118.26.129:8080";
// export const EMQ_SERVER_IP_ADDRESS = "202.118.26.129";
export const SERVER_IP = "202.118.26.9";
export const SERVER_ADDRESS = `http://${SERVER_IP}:8088/PowerCloud`;
// export const EMQ_SERVER_IP_ADDRESS = `${SERVER_IP}`;
export const EMQ_SERVER_IP_ADDRESS = "202.118.26.74";

export const DEBUG_MODE = true;

// 请求地址
export const SERVER_IMG_WORKTASK = `http://${SERVER_IP}:8080/upload/img/worktask/`; // 工单处理图片请求地址
export const SERVER_IMG_ELECTRICIAN = `http://${SERVER_IP}:8080/upload/img/electrician/`; // 电工图片请求地址
export const SERVER_IMG_CUSTOMER = `http://${SERVER_IP}:8080/upload/img/customer/`;          // 企业请求地址

export const LOGIN_URL = `${SERVER_ADDRESS}/api/user/login`;
export const MAIN_SCREEN_COMPANY_LIST_URL = `${SERVER_ADDRESS}/api/electrician/company/list`;
export const WORK_TASK_LIST_URL = `${SERVER_ADDRESS}/api/electrician/worktask/list`;
export const ELECTRICIAN_PROFILE_URL = `${SERVER_ADDRESS}/api/electrician/profile`;
export const LOCATION_UPLOAD_URL = `${SERVER_ADDRESS}/api/electrician/position/update`;
export const GET_ELECTRICIAN_POSITION = `${SERVER_ADDRESS}/api/electrician/position/get`;
export const GET_ELECTRICIAN_LIST_URL = `${SERVER_ADDRESS}/api/electrician/list`;
export const API_WORK_TASK_RECEIVE = `${SERVER_ADDRESS}/api/worktask/receive`;
export const API_WORK_TASK_RETURN = `${SERVER_ADDRESS}/api/worktask/return`;
export const API_WORK_TASK_PICTURE_UPLOAD_URL = `${SERVER_ADDRESS}/api/worktask/picture/upload`;
export const API_WORK_TASK_RETURN_REASON = `${SERVER_ADDRESS}/api/worktask/return/reason`;
export const API_WORK_TASK_ACCIDENT_REASON = `${SERVER_ADDRESS}/api/worktask/accident/reason`;
export const API_WORK_TASK_PROCESS_METHOD = `${SERVER_ADDRESS}/api/worktask/process/method`;
export const API_WORK_TASK_SAVE = `${SERVER_ADDRESS}/api/worktask/save`;
export const API_WORK_TASK_SUBMIT = `${SERVER_ADDRESS}/api/worktask/submit`;
export const API_WORK_TASK_DETAIL = `${SERVER_ADDRESS}/api/electrician/worktask/workdetail`;
export const API_PRO_SERVICE_LIST_URL = `${SERVER_ADDRESS}/api/service/list`;
export const API_GET_SUBSTATION_AND_TRANSFORMER = `${SERVER_ADDRESS}/api/monitor/getSubstatioinAndTransformer`;
export const API_GET_COMPANY_INFO = `${SERVER_ADDRESS}/api/monitor/getCustomerInfo`;
export const API_COMPANY_ELECTRICIAN_POSITION = `${SERVER_ADDRESS}/api/customer/getPositionInfo`;
export const API_GET_ELECTRICIAN_PIC = `${SERVER_ADDRESS}/api/electrician/getElectricianPic`;
export const API_SUBSTATION_VIDEO = `${SERVER_ADDRESS}/api/electricitysubstation/getSubstationVideo`;
export const API_GET_ELECTRICIAN_DOMAINS = `${SERVER_ADDRESS}/api/electrician/getMagDomain`;
export const API_GET_SUBSTATION_INFO = `${SERVER_ADDRESS}/api/electricitysubstation/getSubstationInfo`; // 获取变电所信息
export const API_GET_MONITOR_LIST = `${SERVER_ADDRESS}/api/monitor/getMonitorList`;

export const MAP_URL = `${SERVER_ADDRESS}/map_demo/index.html`;

/** 变电所 **/
// 获取变电所上一条状态数据
export const API_GET_SUBSTATION_LAST_STATUS = `${SERVER_ADDRESS}/api/electricitysubstation/getSubstationData`;

// Api v2
export const API_V2_URL_WORKTASK_LIST = `${SERVER_ADDRESS}/api/v2/worktask/list`;

// AsyncStorage
export const LOGIN_USER_INFO_KEY = 'KEY_LOGIN_USER_INFO';   // 用户信息
export const MAIN_SCREEN_COMPANY_LIST_KEY = 'MAIN_SCREEN_COMPANY_LIST';
export const WORK_TASK_LIST_KEY = 'WORK_TASK_LIST_KEY';
export const ELECTRICIAN_PROFILE_KEY = 'ELECTRICIAN_PROFILE_KEY';
export const KEY_COMPANY_ELECTRICIAN_POSITION = 'KEY_COMPANY_ELECTRICIAN_POSITION';
export const KEY_USER_CERTIFICATE = 'KEY_USER_CERTIFICATE';


// 工单状态定义
export const WORK_TASK_UNPROCESSED = '1';   // 未处理
export const WORK_TASK_PROCESSING = '2';    // 处理中
export const WORK_TASK_FINISHED = '3';      // 处理完成

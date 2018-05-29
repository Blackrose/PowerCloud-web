/**
 * 导航器
 * - 在这里注册页面, 用于跳转
 *
 * @author bovenson
 * @email szhkai@qq.com
 */


'use strict';

import React from 'react';
import { StackNavigator } from 'react-navigation';
import { Greeting } from "./ui/Greeting";
import {Login} from "./ui/Login";
import {Main} from "./ui/Main";
import {CustomerDetailScreen} from "./ui/monitor/CompanySubstation";
import {CompanyInfoScreen} from "./ui/monitor/customer/CompanyInfo";
import {ServiceRecordScreen} from "./ui/monitor/customer/ServiceRecord";
import PDFViewer from "./ui/components/PDFViewer";
import {VideoMonitoringScreen} from "./ui/monitor/substation/VideoMonitoring";
import {CustomerSubstationAlertScreen} from "./ui/monitor/CustomerSubstationAlertRecord";
import {UserProfileScreen} from "./ui/user/UserProfile";
import {SubstationStatusScreen} from "./ui/monitor/substation/SubstationStatus";
import {WorkTaskAlertScreen} from "./ui/worktask/WorkTaskInfo";
import {PositionScreen} from "./ui/position/PositionTab";
import {WorkTaskProcessDetailScreen} from "./ui/worktask/WorkTaskProcessDetail";
import {UserCertificateScreen} from "./ui/user/UserCertificate";
import {SystemStructureScreen} from "./ui/monitor/substation/SystemStructure";
import {StatisticScreen} from "./ui/monitor/customer/StatisticAnalysis";


export const MainNavigator = StackNavigator({
    Login: {
        screen: Login,
        navigationOptions: {
            header: null,
        },
    },
    Greeting: {
        screen: Greeting,
        navigationOptions: {
            header: null,
        },
    },
    Main: {
        screen: Main,
        navigationOptions: {
            header: null,
        },
    },
    CustomerDetail: {
        screen: CustomerDetailScreen,
    },
    CompanyInfoScreen: {
        screen: CompanyInfoScreen,
    },
    ServiceRecordScreen: {
        screen: ServiceRecordScreen,
    },
    PDFViewer: {
        screen: PDFViewer,
    },
    VideoMonitoringScreen: {
        screen: VideoMonitoringScreen,
    },
    CustomerSubstationAlertScreen: {
        screen: CustomerSubstationAlertScreen,
    },
    UserProfileScreen: {
        screen: UserProfileScreen,
    },
    SubstationStatusScreen: {
        screen: SubstationStatusScreen,
    },
    WorkTaskAlertScreen: {
        screen: WorkTaskAlertScreen,
    },
    PositionScreen: {
        screen: PositionScreen,
    },
    WorkTaskProcessDetailScreen: {
        screen: WorkTaskProcessDetailScreen,
    },
    UserCertificateScreen: {
        screen: UserCertificateScreen,
    },
    SystemStructureScreen: {
        screen: SystemStructureScreen,
    },
    StatisticScreen: {
        screen: StatisticScreen,
    },
}, {
    initialRouteName: 'Greeting',
});

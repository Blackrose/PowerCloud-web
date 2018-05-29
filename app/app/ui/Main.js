/**
 * 主页, 包含四个Tab页
 *
 * @author bovenson
 * @email szhkai@qq.com
 */
'use strict';

import React, {Component} from 'react';
import { TabNavigator } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {WorkTaskScreen} from "./worktask/WorktaskTab";
import {UserScreen} from "./user/UserTab";
import {PositionScreen} from "./position/PositionTab";
import {MonitorScreen} from "./monitor/MonitorTab";
import TabBarComponent from "./components/TabBarComponent";

export const Main = TabNavigator({
    MonitorScreen: {
        screen: MonitorScreen,
        navigationOptions: {
            tabBarLabel: '监控',
            tabBarIcon: ({ tintColor, focused }) => (
                <Ionicons
                    name={focused ? 'ios-pulse' : 'ios-pulse-outline'}
                    size={26}
                    style={{color: tintColor}}
                />
            )
        },
    },
    WorkTaskScreen: {
        screen: WorkTaskScreen,
        navigationOptions: {
            tabBarLabel: '工单',
            tabBarIcon: ({ tintColor, focused }) => (
                <Ionicons
                    name={focused ? 'ios-list' : 'ios-list-outline'}
                    size={26}
                    style={{color: tintColor}}
                />
            )
        },
    },
    PositionScreen: {
        screen: PositionScreen,
        navigationOptions: {
            tabBarLabel: '位置',
            tabBarIcon: ({ tintColor, focused }) => (
                <Ionicons
                    name={focused ? 'ios-locate' : 'ios-locate-outline'}
                    size={26}
                    style={{color: tintColor}}
                />
            )
        },
    },
    UserScreen: {
        screen: UserScreen,
        navigationOptions: {
            tabBarLabel: '我',
            tabBarIcon: ({ tintColor, focused }) => (
                <Ionicons
                    name={focused ? 'ios-person' : 'ios-person-outline'}
                    size={26}
                    style={{color: tintColor}}
                />
            )
        },
    },
}, {
    tabBarPosition: 'bottom',
    swipeEnabled: false,
    tabBarOptions: {

    },
    tabBarComponent: TabBarComponent,
});
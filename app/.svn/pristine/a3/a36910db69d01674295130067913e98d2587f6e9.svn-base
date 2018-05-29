/**
 * 监控Tab页 -> 企业 -> 数据分析
 *
 * @author bovenson
 * @email szhkai@qq.com
 */

'use strict';
import React, {Component} from 'react';
import {
    Text,
    SafeAreaView,
    ActivityIndicator,
    StyleSheet,
    WebView,
    ScrollView,
    } from 'react-native';
import GlobalStyles from "../../../constants/GlobalStyles";

export class StatisticScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    static navigationOptions = ({navigation}) => {
        const {params} = navigation.state;

        return {
            title: '数据分析',
            headerStyle: {
                backgroundColor: '#444',
                height: 40,
            },
            headerTintColor: 'white',
            headerTitleStyle: {
                textAlign: 'center',
                flex: 1,
            },
            headerRight: <Text>
            </Text>,
        }
    };


    render() {
        return (
            <SafeAreaView style={[GlobalStyles.safeContainer]}>
                <WebView
                    source={{uri: 'file:///android_asset/html/charts.html'}}
                    renderLoading={() => {return <ActivityIndicator/>}}
                />
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
});
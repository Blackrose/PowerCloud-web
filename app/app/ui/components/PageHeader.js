/**
 * 页头组件
 *
 * @author bovenson
 * @email szhkai@qq.com
 */

'use strict';
import React, {Component} from 'react';
import {
    Text,
    View,
} from 'react-native';
import {GlobalColors} from "../../constants/GlobalStyles";

export class PageHeader extends Component {
    render() {
        return (
            <View style={{backgroundColor: GlobalColors.black, height: 40, justifyContent: 'center',}}>
                <Text style={{fontSize: 20, color: 'white', textAlign: 'center'}}>{this.props.title}</Text>
            </View>
        )
    }
}
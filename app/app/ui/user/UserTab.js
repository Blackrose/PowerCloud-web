/**
 * 用户Tab页
 *
 * @author bovenson
 * @email szhkai@qq.com
 */

'use strict';
import React, {Component} from 'react';
import {PageHeader} from "../components/PageHeader";
import {
    Text,
    SafeAreaView,
    View,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import GlobalStyles, {GlobalColors, GlobalListItemStyle} from "../../constants/GlobalStyles";
import Ionicons from "react-native-vector-icons/Ionicons";
import {NavigationUtils} from "../../utils/Utils";

export class UserScreen extends Component {
    onItemPressed() {
        NavigationUtils.navTo(this.props, "UserProfileScreen")
    }

    generateListItem(icon, onPress, text) {
        return <TouchableOpacity
            style={[GlobalListItemStyle.ListItem]}
            onPress={() => onPress()}
        >
            <View style={[GlobalListItemStyle.ListItemImage, {backgroundColor: GlobalColors.success}]}>
                <Ionicons
                    name={icon}
                    size={25}
                    style={{color: 'white'}}
                />
            </View>
            <View style={[GlobalListItemStyle.ListItemInfo]}>
                <Text style={[GlobalListItemStyle.ListItemTitle]}>{text}</Text>
            </View>
        </TouchableOpacity>;
    }

    render() {
        return (
            <SafeAreaView style={[GlobalStyles.safeContainer]}>
                <PageHeader title={'我'}/>
                <ScrollView>
                    {this.generateListItem('ios-person', () => NavigationUtils.navTo(this.props, 'UserProfileScreen'), global.LOGIN_USER_INFO.name)}
                    {/*{this.generateListItem('ios-book', () => this.props.navigation.navigate('UserCertificateScreen'), '我的证书')}*/}
                </ScrollView>

            </SafeAreaView>
        )
    }
}
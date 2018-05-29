/**
 * 列表及列表项
 *
 * @author bovenson
 * @email szhkai@qq.com
 */

'use strict';
import React, {Component} from 'react';
import {
    Text,
    Alert,
    View,
    FlatList,
    TouchableOpacity,
    TouchableHighlight, ListView,
    StyleSheet,
    Image,
} from 'react-native';
import {SERVER_IMG_CUSTOMER, WORK_TASK_PROCESSING, WORK_TASK_UNPROCESSED} from "../../constants/GlobalVars";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from "react-native-vector-icons/Ionicons";
import Entypo from "react-native-vector-icons/Entypo";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import moment from "moment/moment";
import {SwipeListView, SwipeRow} from "react-native-swipe-list-view";
import {GlobalColors, GlobalIconStyles, GlobalListItemStyle} from "../../constants/GlobalStyles";

/**
 * 获取列表右侧状态展示图标及颜色
 * @param alertLevel
 * @returns {*}
 */
function getStatusIcon(alertLevel) {
    if (alertLevel === WORK_TASK_UNPROCESSED) {
        return <Ionicons
            name={'ios-alert-outline'}
            size={25}
            style={{color: GlobalColors.danger}}
        />;
    } else if (alertLevel === WORK_TASK_PROCESSING) {
        return <Ionicons
            name={'ios-help-circle-outline'}
            size={25}
            style={{color: GlobalColors.warning}}
        />;
    } else {
        return <Ionicons
            name={'ios-checkmark-circle-outline'}
            size={25}
            style={{color: GlobalColors.success}}
        />;
    }
}

/**
 * 监控页 -> 列表项
 */
export class MonitorListItem extends Component {
    render() {
        let imgUri = SERVER_IMG_CUSTOMER + this.props.data.pic;
        return (
            <TouchableOpacity
                style={[GlobalListItemStyle.ListItem]}
                onPress={this.props.onItemPressed}
            >

                <Image
                    source={{ uri: imgUri }}
                    style={[GlobalListItemStyle.ListItemImage]}/>
                <View style={[GlobalListItemStyle.ListItemInfo]}>
                    <Text style={[GlobalListItemStyle.ListItemTitle]}>{this.props.data.company}</Text>
                    <Text style={[GlobalListItemStyle.ListItemDescription]}>变电站数量: {this.props.data.num}</Text>
                </View>
                <View style={[GlobalListItemStyle.ListItemStatus]}>
                    {getStatusIcon(this.props.data.status)}
                </View>
            </TouchableOpacity>
        )
    }
}

/**
 * 监控页 -> 列表
 */
export class MonitorList extends Component {

    onItemPressed(item) {
        this.props.onItemPressed(item);
    }

    renderItem({item}) {
        return <MonitorListItem
            id={item.key}
            data={item}
            onItemPressed={this.onItemPressed.bind(this, item)}
        />
    }

    render() {
        return(
            <FlatList
                refreshing={false}
                data={this.props.data}
                extraData={this.state}
                onRefresh={this.props.onRefresh}
                keyExtractor={(item, index) => index.toString()}
                renderItem={this.renderItem.bind(this)}
            />
        )
    }
}

/**
 * 监控 -> 企业-> 服务报告 -> 列表项
 */
export class ServiceRecordListItem extends Component {
    render() {
        return (
            <TouchableOpacity
                style={[GlobalListItemStyle.ListItem]}
                onPress={this.props.onItemPressed}
            >
                <View style={[GlobalListItemStyle.ListItemImage, GlobalIconStyles.iconWithCycleContainer.container]}>
                    <Ionicons
                        name={'ios-book'}
                        size={GlobalIconStyles.iconWithCycleContainer.iconSize}
                        style={{color: GlobalColors.blue}}
                    />
                </View>
                <View style={[GlobalListItemStyle.ListItemInfo]}>
                    <Text style={[GlobalListItemStyle.ListItemTitle]}>{this.props.data.servicename}</Text>
                </View>
            </TouchableOpacity>
        )
    }
}

/**
 * 监控 -> 企业-> 服务报告 -> 列表
 */
export class ServiceRecordList extends Component {
    onItemPressed(item) {
        this.props.onItemPressed(item);
    }

    renderItem({item}) {
        return <ServiceRecordListItem
            id={item.key}
            data={item}
            onItemPressed={this.onItemPressed.bind(this, item)}
        />
    }

    render() {
        return(
            <FlatList
                data={this.props.data}
                extraData={this.state}
                keyExtractor={(item, index) => index.toString()}
                renderItem={this.renderItem.bind(this)}
            />
        )
    }
}

/**
 * 监控 -> 企业 -> 变电所列表 -> 滑动列表项
 */
export class SubstationSwipeListItem extends Component {
    render() {
        let data = this.props.data.item;
        return (
            <View style={[GlobalListItemStyle.ListItem]}>
                <View style={{width: 40, justifyContent: 'center', alignItems: 'center'}}>
                    <Ionicons
                        name={'ios-analytics-outline'}
                        style={{color: GlobalColors.blue}}
                        size={40}
                    />
                </View>
                <View style={[GlobalListItemStyle.ListItemInfo]}>
                    <Text style={[GlobalListItemStyle.ListItemTitle]}>{data.title}</Text>
                    <Text style={[GlobalListItemStyle.ListItemDescription]}>变压器数量: {data.transformerNo || 0}</Text>
                </View>
                <View style={[GlobalListItemStyle.ListItemStatus]}>
                    {getStatusIcon(data.alertLevel)}
                </View>
            </View>
        )
    }
}

/**
 * 监控 -> 企业 -> 变电所列表 -> 滑动列表项 -> 隐藏项
 */
export class SubstationSwipeListHiddenItem extends Component {

    menuItemClick(item) {
        this.props.rowRef.closeRow();
        switch (item) {
            case '数据':
                this.props.parentNavigation.navigate('SubstationStatusScreen', {data: this.props.data.item});
                break;
            case '系统图':
                this.props.parentNavigation.navigate('SystemStructureScreen', {id: this.props.data.item.id});
                break;
            case '视频':
                this.props.parentNavigation.navigate('VideoMonitoringScreen', {id: this.props.data.item.id});
                break;
        }
    }

    render() {
        return (
            <View style={styles.ListItemMenu}>
                <TouchableOpacity onPress={() => this.menuItemClick('数据')}>
                    <View style={styles.ListItemMenuItem}>
                        <View style={[styles.iconContainer]}>
                            <FontAwesome name={'bar-chart-o'} size={18} color={GlobalColors.blue}/>
                        </View>
                        <Text style={{fontSize: 12, marginTop: 3}}>数据</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => this.menuItemClick('系统图')}>
                    <View style={styles.ListItemMenuItem}>
                        <View style={[styles.iconContainer]}>
                            <MaterialIcons name={'settings-input-component'} size={18} color={GlobalColors.danger}/>
                        </View>
                        <Text style={{fontSize: 12, marginTop: 3}}>系统图</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.menuItemClick('视频')}>
                    <View style={styles.ListItemMenuItem}>
                        <View style={[styles.iconContainer]}>
                            <Ionicons name={'ios-videocam'} size={18} color={GlobalColors.success}/>
                        </View>
                        <Text style={{fontSize: 12, marginTop: 3}}>视频</Text>
                    </View>
                </TouchableOpacity>

            </View>
        )
    }
}

/**
 * 监控 -> 企业 -> 变电所列表 -> 滑动列表
 */
export class SubstationSwipeList extends Component {

    constructor(props) {
        super(props);
    }

    static openRow(rowRef) {
        const nowValue = rowRef._translateX._value;
        const rightOpenValue = rowRef.props.rightOpenValue;
        if (nowValue === 0 || Math.abs(nowValue) < 5) {
            rowRef.manuallySwipeRow(rightOpenValue);
        } else {
            rowRef.manuallySwipeRow(0);
        }
    }

    renderItem(rowData, rowMap) {
        return <TouchableHighlight onPress={() => SubstationSwipeList.openRow(rowMap[rowData.index])}>
            <SubstationSwipeListItem data={rowData}/>
        </TouchableHighlight>
    }

    renderHiddenItem(rowData, rowMap) {
        return <View>
            <SubstationSwipeListHiddenItem
                rowRef={rowMap[rowData.index]}
                parentNavigation={this.props.parentNavigation} data={rowData}/>
        </View>;
    }

    render() {
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

        return (
            <View style={{flex: 1}}>
                <SwipeListView
                    useFlatList={true}
                    data={this.props.data}
                    renderItem={(rowData, rowMap) => this.renderItem(rowData, rowMap)}
                    renderHiddenItem={(rowData, rowMap) => this.renderHiddenItem(rowData, rowMap)}
                    keyExtractor={(item, index) => index.toString()}
                    rightOpenValue={-160}
                    disableRightSwipe={true}
                    enableEmptySections={true}
                    closeOnRowPress={false}
                />
            </View>
        )
    }
}

/**
 * 工单Tab页 -> 工单列表项; 监控Tab页 -> 企业 -> 历史工单 -> 列表项
 */
export class WorkTaskListItem extends Component {
    static getIconAndColor(alertLevel) {
        if (alertLevel === WORK_TASK_UNPROCESSED) {
            let color = GlobalColors.danger;
            let icon = <MaterialCommunityIcons
                name={'exclamation'}
                size={25}
                style={{color: 'white'}}
            />;
            return {icon: icon, color: color}
        } else if (alertLevel === WORK_TASK_PROCESSING) {
            let color = GlobalColors.warning;
            let icon = <Ionicons
                name={'ios-help'}
                size={25}
                style={{color: 'white'}}
            />;
            return {icon: icon, color: color};
        } else {
            let color = GlobalColors.success;
            let icon = <Ionicons
                name={'ios-checkmark'}
                size={25}
                style={{color: 'white'}}
            />;
            return {icon: icon, color: color};
        }
    }

    render() {
        let iconAndColor = WorkTaskListItem.getIconAndColor(this.props.data.status);
        return (
            <TouchableOpacity
                style={[GlobalListItemStyle.ListItem]}
                onPress={this.props.onItemPressed}
            >
                <View style={{backgroundColor: iconAndColor.color,
                    borderRadius: 20,
                    width: 40, height: 40,
                    justifyContent: 'center', alignItems: 'center'}}>
                    {iconAndColor.icon}
                </View>
                <View style={[GlobalListItemStyle.ListItemInfo]}>
                    <Text style={[GlobalListItemStyle.ListItemTitle]}>{this.props.data.company}</Text>
                    <Text style={[GlobalListItemStyle.ListItemDescription]}>{this.props.data.description}</Text>
                </View>
                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                    <Text>{moment(this.props.data.starttime).format('YYYY-MM-DD')}</Text>
                </View>
            </TouchableOpacity>
        )
    }
}

/**
 * 工单Tab页 -> 工单列表; 监控Tab页 -> 企业 -> 历史工单 -> 列表
 */
export class WorkTaskList extends Component {
    onItemPressed(item) {
        this.props.onItemPressed(item);
    }

    renderItem({item}) {
        return <WorkTaskListItem
            data={item}
            onItemPressed={this.onItemPressed.bind(this, item)}
        />
    }

    render() {
        return(
            <FlatList
                data={this.props.data}
                extraData={this.state}
                onRefresh={this.props.onRefresh}
                refreshing={false}
                keyExtractor={(item, index) => index.toString()}
                renderItem={this.renderItem.bind(this)}
            />
        )
    }
}

const styles = StyleSheet.create({
    ListItemMenu: {
        flexDirection: 'row',
        backgroundColor: '#fafafa',
        justifyContent: 'flex-end',
        alignItems: 'center',
        height: '100%',
        borderStyle: 'solid',
        borderBottomWidth: 0.3,
        borderBottomColor: '#ccc',
    },
    ListItemMenuItem: {
        width: 50,
        flexDirection: 'column',
        alignItems: 'center',
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

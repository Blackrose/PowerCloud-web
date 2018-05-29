/**
 * 样式
 *
 * @author bovenson
 * @email szhkai@qq.com
 */

'use strict';
import {
    StyleSheet,
    Platform,
} from 'react-native';

const GlobalStyles = StyleSheet.create({
    container: {
        paddingTop: Platform.OS === 'ios' ? 20 : 0,
        flex: 1,
    },
    safeContainer: {
        backgroundColor: 'white',
        flex: 1,
    },
    textInput: {
        borderStyle: 'solid',
        borderColor: 'black',
        borderWidth: 1,
        fontSize: 15,
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 10,
        paddingRight: 10,
        ...Platform.select({
            android: {
                padding: 0,
            },
        }),
    },
    textInputSearch: {
        backgroundColor: 'white',
        borderRadius: 2,
        paddingLeft: 2,
        paddingRight: 2,
        paddingTop: 0,
        paddingBottom: 0,
        height: 20,
    },
    listFlowView: {
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 80,
    },
    textBig: {
        fontSize: 26,
    },
    textMid: {
        fontSize: 22,
    },
    textSmall: {
        fontSize: 15,
    },

    // 灰色横条
    grayLine: {
        borderStyle: 'solid',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },

    // 横条提示 + 数据显示样式
    infoRowView: {
        alignItems: 'center',
        flexDirection: 'row',
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 8,
        paddingRight: 8,
    },

    infoRowViewWithBottomBorder: {
        alignItems: 'center',
        flexDirection: 'row',
        borderBottomWidth: 0.3,
        borderColor: '#999',
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 8,
        paddingRight: 8,
    },

    infoRowText: {
        fontSize: 16,
    },

    btnConfirmStyle: {
        borderRadius: 3,
        backgroundColor: '#009688',
        padding: 7,
    },
    btnCancelStyle: {
        borderRadius: 3,
        backgroundColor: '#e51c23',
        padding: 7,
    },
    btnInfoStyle: {
        borderRadius: 3,
        backgroundColor: '#3f51b5',
        padding: 7,
    },

    btnTipText: {
        fontSize: 14,
        textAlign: 'center',
        color: 'white',
    },

    radiusBorder: {
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: 5,
        paddingBottom: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    tableRowUpperLine: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: 5,
        paddingBottom: 5,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
    },
    tableRowWithoutLine: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: 5,
        paddingBottom: 5,
        borderWidth: 0,
    },
    tableCell: {
        textAlign: 'center',
        flex: 1,
    },
});

export const GlobalColors = {
    blue: '#409EFF',
    success: '#67C23A',
    warning: '#E6A23C',
    danger: '#F56C6C',
    info: '#909399',
    green: '#43bd56',
    bgColor: '#eee',
    bgColorGreen: '#E8F5E9',
    bgColorBlue: '#ecf5ff',
    black: '#444',
    headerColor: '#304156',
};

export const GlobalBtnStyles = {    // 全局按钮样式
    greenSolidBtn: {
        height: 50,
        width: '100%',
        borderRadius: 5,
        backgroundColor: GlobalColors.green,
        justifyContent: 'center',
        alignItems: 'center',
    },
    greenSolidBtnText: {
        fontSize: 18,
        color: 'white',
        textAlign: 'center',
    },
    greenHollowBtn: {
        height: 50,
        width: '100%',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#43bd56',
        backgroundColor: '#E8F5E9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    greenHollowBtnText: {
        fontSize: 18,
        color: GlobalColors.green,
        textAlign: 'center',
    },
};

export const GlobalListItemStyle = {    // 列表样式
    ListItem: {     //  列表项
        backgroundColor: 'white',
        borderStyle: 'solid',
        borderBottomColor: '#ccc',
        minHeight: 70, height: 70,
        borderBottomWidth: 0.3,
        padding: 5,
        paddingLeft: 10,
        paddingRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    ListItemTitle: {    // 列表标题样式
        fontWeight: '400',
        fontSize: 16,
        color: '#444'
    },
    ListItemDescription: {  // 描述
        marginTop: 3,
        color: '#aaa'
    },
    ListItemStatus: {   // 状态展示图标
        justifyContent: 'center', alignItems: 'center',
        marginRight: 15,
        width: 25, height: 25,
    },
    ListItemInfo: { // 中部信息展示部分 包括标题及描述
        flexDirection: 'column',
        justifyContent: 'center',
        paddingLeft: 10,
        flex: 1
    },
    ListItemImage: {
        width: 46,
        height: 46,
        borderRadius: 23,
        justifyContent: 'center',
        alignItems: 'center',
    },
    ListItemMenu: {
        flexDirection: 'row',
        backgroundColor: '#eee',
        justifyContent: 'flex-end',
        alignItems: 'center',
        height: '100%',
        borderStyle: 'solid',
        borderBottomWidth: 0.5,
        borderBottomColor: '#ccc',
    },
    ListItemMenuItem: {
        width: 50,
        flexDirection: 'column',
        alignItems: 'center',
    }
};

export const GlobalIconStyles = {   // 全局Icon样式
    // 外圆形 内图标
    iconWithCycleContainer: {
        container: {
            width: 40,
            height: 40,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: '#ccc',
            justifyContent: 'center',
            alignItems: 'center',
        },
        iconSize: 25,
    }
};

export default GlobalStyles;

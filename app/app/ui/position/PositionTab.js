/**
 * 位置Tab页
 *
 * @author bovenson
 * @email szhkai@qq.com
 */


'use strict';
import React, {Component} from "react";
import {
    Alert,
    SafeAreaView, StyleSheet,
    Text,
    WebView,
    TouchableOpacity,
    View,
} from 'react-native';
import Modal from 'react-native-modalbox';
import {
    MapView,
    Marker,
} from 'react-native-amap3d';
import {PageHeader} from "../components/PageHeader";
import {ElectricianPositionUtil} from "../../common/StorageManager";
import Ionicons from "react-native-vector-icons/Ionicons";
import {GlobalColors} from "../../constants/GlobalStyles";
import {MAP_URL, SERVER_ADDRESS} from "../../constants/GlobalVars";


export class PositionScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            points: [],
            allPoints: [],
            centerCoordinate: {
                latitude: 39.91095,
                longitude: 116.37296
            },
            region: {
                latitude: 41.000,
                longitude: 123.000,
                latitudeDelta: 1,
                longitudeDelta: 1,
            }
        };
        this.fetchData();
    }

    customerMenuTrigger() {
        this.refs.menuModal.open();
    }

    /**
     * 地图Marker点击事件处理
     */
    markerClickHandler(item) {
        try {
            switch (item.type) {
                case "customer":
                    this.props.navigation.navigate("CompanyInfoScreen", {id: item.id});
                    break;
                case "substation":
                    this.props.navigation.navigate("SubstationStatusScreen", {data: {id: item.id, title: item.name}});
                    break;
                case "electrician":
                    this.props.navigation.navigate("UserProfileScreen", {id: item.id});
                    break;
            }
        } catch (error) {

        }
    }

    /**
     * 生成头部右侧按钮
     * @returns {*}
     */
    generateRightButton() {
        return <View style={{
            position: 'absolute', right: 0, top: 0,
            flexDirection: 'row', height: 40, justifyContent: 'center', alignItems: 'center'
        }}>
            {/*<TouchableOpacity*/}
            {/*style={{marginRight: 15}}*/}
            {/*onPress={this.showTextHandler.bind(this)}>*/}
            {/*<Text style={{color: 'white'}}>显示标签</Text>*/}
            {/*</TouchableOpacity>*/}
            <TouchableOpacity
                style={{marginRight: 15}}
                onPress={this.customerMenuTrigger.bind(this)}>
                <Ionicons
                    name={'ios-add'}
                    size={30}
                    style={{color: 'white',}}
                />
            </TouchableOpacity>
        </View>
    }

    /**
     * 获取显示区域
     * @param points
     */
    static getShowRegion(points) {
        let maxLatitude = -1000, minLatitude = 1000;
        let maxLongitude = -1000, minLongitude = 1000;

        for (let i = 0; i < points.length; ++i) {
            maxLatitude = Math.max(maxLatitude, points[i].location.latitude);
            minLatitude = Math.min(minLatitude, points[i].location.latitude);
            maxLongitude = Math.max(maxLongitude, points[i].location.longitude);
            minLongitude = Math.min(minLongitude, points[i].location.longitude);
        }
        return {
            latitude: minLatitude,
            longitude: minLongitude,
            latitudeDelta: maxLatitude - minLatitude,
            longitudeDelta: maxLongitude - minLongitude,
        };
    }

    resetPoints(typeMarker) {
        let res = [];
        for (let i = 0; i < this.state.allPoints.length; ++i) {
            if (this.state.allPoints[i].type === typeMarker) {
                res.push(this.state.allPoints[i]);
            }
        }
        this.setState({points: res});
    }

    fetchData() {
        try {
            ElectricianPositionUtil.getPositions((res) => {
                res = JSON.parse(res);

                for (let i = 0; i < res.length; ++i) {
                    res[i].location = JSON.parse(res[i].location);
                    res[i].location.longitude = parseFloat(res[i].location.longitude);
                    res[i].location.latitude = parseFloat(res[i].location.latitude);
                }

                this.setState({
                    allPoints: res,
                    region: PositionScreen.getShowRegion(res),
                });
                this.resetPoints('electrician');

            }, (error) => {
                console.log(error);
                Alert.alert("警告", error);
            });
        } catch (error) {
            console.log(error);
            Alert.alert('警告', '处理位置信息出错!')
        }
    }

    static generateMarkerIcon(markerType) {
        if (markerType === "substation") {
            return <View style={[styles.markerStyle]}>
                <Ionicons
                    name={'ios-analytics'}
                    size={20}
                    style={{color: 'white'}}
                />
            </View>
        } else if (markerType === "electrician") {
            return <View style={[styles.markerStyle]}>
                <Ionicons
                    name={'ios-man'}
                    size={20}
                    style={{color: 'white'}}
                />
            </View>
        } else if (markerType === "customer") {
            return <View style={[styles.markerStyle]}>
                <Ionicons
                    name={'ios-home'}
                    size={20}
                    style={{color: 'white'}}
                />
            </View>
        }
    }

    /**
     * 生成地图电工图标
     * @returns {Array}
     */
    generateMarker() {
        try {
            let res = [];
            let points = this.state.points;
            if (points !== null) {
                for (let i = 0; i < points.length; ++i) {
                    let curPoint = points[i];
                    let curElement = <Marker
                        // active
                        title={curPoint.name}
                        key={i.toString()}
                        coordinate={{
                            latitude: curPoint.location.latitude,
                            longitude: curPoint.location.longitude
                        }}
                        onInfoWindowPress={() => this.markerClickHandler(curPoint)}
                        icon={() => PositionScreen.generateMarkerIcon(curPoint.type)}
                    />;
                    res.push(curElement);
                }
            }
            return res;
        } catch (error) {
            console.log(error);
            Alert.alert('警告', '处理位置信息出错!');
        }
    }

    // render() {
    //     let markers = this.generateMarker();
    //     return (
    //         <SafeAreaView style={{backgroundColor: 'white', flex: 1}}>
    //             <PageHeader title={"位置"}/>
    //             {this.generateRightButton()}
    //             <MapView
    //                 // locationEnabled={true}
    //                 showsZoomControls={true}
    //                 showsCompass={true}
    //                 region={this.state.region}
    //                 showsScale={true}
    //                 // showsLocationButton={true}
    //                 zoomEnabled={true}
    //                 scrollEnabled={true}
    //                 tiltEnabled={false}
    //                 zoomLevel={13}
    //                 // coordinate={this.state.centerCoordinate}
    //                 style={{flex: 1,}}>
    //                 {markers}
    //             </MapView>
    //
    //             <Modal style={[styles.menuModal]} position={"top"} ref={"menuModal"}
    //                    animationDuration={0}
    //                    backdropColor={'white'}
    //                    backdropOpacity={0}>
    //                 <View style={{width: '100%', height: '100%'}}>
    //                     <TouchableOpacity
    //                         onPress={() => {
    //                             this.resetPoints("customer")
    //                         }}
    //                         style={[styles.menuModalItem, styles.menuModalItemBorder]}>
    //                         <Text style={[styles.menuModalText]}>企业</Text>
    //                     </TouchableOpacity>
    //                     <TouchableOpacity
    //                         onPress={() => {
    //                             this.resetPoints("electrician")
    //                         }}
    //                         style={[styles.menuModalItem, styles.menuModalItemBorder]}>
    //                         <Text style={[styles.menuModalText]}>电工</Text>
    //                     </TouchableOpacity>
    //                     <TouchableOpacity
    //                         onPress={() => {
    //                             this.resetPoints("substation")
    //                         }}
    //                         style={[styles.menuModalItem, styles.menuModalItemBorder]}>
    //                         <Text style={[styles.menuModalText]}>变电所</Text>
    //                     </TouchableOpacity>
    //                     <TouchableOpacity
    //                         onPress={() => {
    //                             this.setState({points: this.state.allPoints})
    //                         }}
    //                         style={[styles.menuModalItem]}>
    //                         <Text style={[styles.menuModalText]}>所有</Text>
    //                     </TouchableOpacity>
    //                 </View>
    //             </Modal>
    //         </SafeAreaView>
    //     )
    // }

    pageOnLoaded() {
        let data = {
            key: 'app',
            url: SERVER_ADDRESS + "/api/customer/getPositionInfo?id=" + global.LOGIN_USER_INFO.id +
            "&token=" + global.TOKEN + "&account=" + global.LOGIN_USER_INFO.phone
        };
        this.refs.webView.postMessage(JSON.stringify(data));
    }

    render() {
        return <SafeAreaView style={{backgroundColor: 'white', flex: 1}}>
            <PageHeader title={"位置"}/>
            <WebView
                ref={'webView'}
                source={{uri: MAP_URL}}
                javaScriptEnabled={true}
                onLoadEnd={this.pageOnLoaded.bind(this)}
            />
        </SafeAreaView>
    }
}

const styles = StyleSheet.create({
    menuModal: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 100,
        height: 160,
        position: 'absolute',
        right: 140,
        top: 42,
        backgroundColor: '#444',
    }, menuModalText: {
        fontSize: 17,
        fontWeight: "400",
        color: 'white',
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    }, menuModalItem: {
        height: 32,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }, menuModalItemBorder: {
        borderBottomWidth: 0.3,
        borderColor: 'black',
    }, infoItemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    markerStyle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: GlobalColors.blue,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
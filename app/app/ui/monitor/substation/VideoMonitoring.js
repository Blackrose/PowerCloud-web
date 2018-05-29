/**
 * 变电站视频监控
 * 路径:
 *  - 监控Tab页 -> 企业 -> 变电站列表 -> 隐藏菜单 -> 视频
 *  - 工单详情页 -> 视频
 */

'use strict';
import React, {Component} from 'react';
import {
    SafeAreaView,
    Text,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    Dimensions,
    StatusBar,
} from 'react-native';
import Video from 'react-native-video';
import {getSubstationVideo} from "../../../common/NetworkRequests";

export class VideoMonitoringScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            videoLoaded: false,
            url: '',
            urls: [],
            substationID: this.props.navigation.state.params.id,    // 页面导航传入参数
        };
    }

    static navigationOptions = () => {
        return {
            title: "视频监控",
            headerStyle: {
                backgroundColor: '#444',
                height: 40,
            },
            headerTintColor: 'white',
            headerTitleStyle: {
                textAlign: 'center',
                flex: 1,
            },
            headerRight: <TouchableOpacity>
            </TouchableOpacity>,
        }
    };


    componentDidMount() {
        StatusBar.setHidden(true);
        this.fetchData();
    }

    componentWillUnmount() {
        StatusBar.setHidden(false);
    }

    videoOnLoad() {
        try {
            this.setState({videoLoaded: true});
        } catch (e) {
        }
    }

    fetchData() {
        try {
            let urls = [];
            getSubstationVideo(this.state.substationID, (res) => {
                for (let i = 0; i < res.length; ++i) {
                    urls.push({key: i, url: res[i].url});
                }
                this.setState({
                    urls: urls,
                    url: urls.length > 0 ? urls[0].url : '',
                });
            }, (error) => {
                Alert.alert("警告", error);
            });
        } catch (error) {
            console.log(error);
            Alert.alert("警告", "视频请求失败!")
        }
    }

    generateVideoTag() {
        let activityIndicatorElement = <ActivityIndicator
            key={'activityIndicatorElement'}
            style={{
                position: 'absolute',
                top: '50%', bottom: '50%', left: '50%', right: '50%'
            }}/>;
        let videoElement = <Video
            key={'videoElement'}
            resizeMode={"stretch"}
            onLoad={this.videoOnLoad.bind(this)}
            style={{
                width: Dimensions.get('window').height,
                height: Dimensions.get('window').width,
                minWidth: Dimensions.get('window').height,
                minHeight: Dimensions.get('window').width,
                transform: [{rotate: '90deg'}],
            }}
            source={{uri: this.state.url}}
        />;
        let showElement = this.state.videoLoaded ? null : activityIndicatorElement;
        return [videoElement, showElement]
    }

    render() {
        let tag;
        if (!this.state.url || this.state.url.trim().length === 0) {
            tag = <Text style={{fontSize: 18, fontWeight: '400', textAlign: 'center'}}>没有视频数据</Text>
        } else {
            tag = this.generateVideoTag();
        }

        return (<SafeAreaView style={{
                flex: 1, justifyContent: 'center',
                alignItems: 'center', backgroundColor: 'white',
            }}>
                {tag}
            </SafeAreaView>
        )
    }
}
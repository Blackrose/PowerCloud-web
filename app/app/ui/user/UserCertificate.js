/**
 * 用户Tab页 -> 用户证书
 */
'use strict';

import React, {Component} from 'react';
import {
    SafeAreaView,
    Text,
    Alert,
    Image,
    View, StyleSheet,
} from 'react-native';
import GlobalStyles from "../../constants/GlobalStyles";
import {UserInfoManager} from "../../common/StorageManager";
import {SERVER_IMG_ELECTRICIAN} from "../../constants/GlobalVars";

export class UserCertificateScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pics: [],
            mounted: false,
        };

        this.fetchData();
    }

    static navigationOptions = () => {
        return {
            title: "我的证书",
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

    componentDidMount() {
        this.setState({mounted: true});
    }

    componentWillUnmount() {
        this.setState({mounted: false});
    }

    fetchData() {
        try {
            UserInfoManager.getUserCertificatePics((res) => {
                let pics = [];
                for (let i = 0; i < res.length; ++i) {
                    pics.push(res[i].pic);
                }
                if (this.state.mounted) {
                    this.setState({pics: pics});
                }
            }, (error) => {
                Alert.alert("警告", error)
            });
        } catch (error) {
            Alert.alert("警告", "获取用户请求整数失败!")
        }
    }

    generalImagesTags() {
        let images = this.state.pics;
        let imageTags = [];

        for (let i = 0; i < images.length; ++i) {
            let imgFileName = images[i].trim();
            if (imgFileName.length === 0) {
                continue;
            }
            let uri = SERVER_IMG_ELECTRICIAN + imgFileName;
            console.log(uri);
            let imageTag = <Image key={images[i]}
                                  source={{uri: uri}}
                                  style={[styles.image]}/>;
            imageTags.push(imageTag);
        }

        if (imageTags.length === 0) {
            let noImageTextTip = <View key={1} style={{flex: 1, marginTop: 60,}}>
                <Text style={{color: '#aaa', fontSize: 15, textAlign: 'center'}}>暂未上传证书图片</Text>
            </View>;
            imageTags.push(noImageTextTip);
        }
        return imageTags;
    }

    render() {
        return (
            <SafeAreaView style={[GlobalStyles.safeContainer, {padding: 10, flexDirection: 'row',}]}>
                {this.generalImagesTags()}
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    image: {
        width: 80,
        height: 80,
        margin: 5,
    }
});
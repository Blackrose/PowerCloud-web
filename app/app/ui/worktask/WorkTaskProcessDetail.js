/**
 * 工单处理详情
 *
 * 路径:
 *  - 工单列表 -> 工单详情 -> 处理工单/处理详情
 */


'use strict';
import React, {Component} from 'react';
import {
    SafeAreaView,
    Text,
    View,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Image,
    StyleSheet, Alert,
} from 'react-native';
import GlobalStyles, {GlobalColors} from "../../constants/GlobalStyles";
import ImagePicker from "react-native-image-picker";
import {MUtils} from "../../utils/Utils";
import {
    SERVER_IMG_WORKTASK
} from "../../constants/GlobalVars";
import {fetchWorkTaskDetail, saveWorkTaskRequest} from "../../common/NetworkRequests";

let imagePickerOptions = {  // image picker 选项
    title: '选择图片',
    storageOptions: {
        skipBackup: true,
        path: 'images'
    },
    quality: 0.5,
    takePhotoButtonTitle: "拍摄照片",
    cancelButtonTitle: "取消",
    chooseFromLibraryButtonTitle: "从相册选取",
};

export class WorkTaskProcessDetailScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            workTaskID: this.props.navigation.state.params.workTaskID,
            workTaskStatus: this.props.navigation.state.params.status,
            onGoBack: this.props.navigation.state.params.onGoBack,

            workTask: {},
            processMethod: "",   // 处理办法
            images: [],
            remoteImages: [],
            saveButtonText: '保存',
            saveButtonEnable: true,
            submitButtonText: '提交',
            submitButtonEnable: true,
        };

        this.fetchData();
    }

    /**
     * 自定义页面头部
     * @param navigation
     * @returns
     */
    static navigationOptions = ({ navigation }) => {
        const { params } = navigation.state;

        return {
            title: "工单处理详情",
            headerStyle: {
                backgroundColor: '#444',
                height: 40,
            },
            headerTintColor: 'white',
            headerTitleStyle: {
                textAlign: 'center',
                flex: 1,
            },
            headerRight:<TouchableOpacity>
            </TouchableOpacity>,
        }
    };

    fetchData() {   // 加载工单信息
        try {
            fetchWorkTaskDetail(this.state.workTaskID, this.state.workTaskStatus, (data) => {
                this.setState({workTask: data});
                let pic = this.state.workTask.hasOwnProperty('pic') ? this.state.workTask.pic.split(";") : [];
                this.setState({processMethod: this.state.workTask.reason, remoteImages: pic, images: []});
            }, (error) => {
                Alert.alert("获取工单信息失败", error);
            });
        } catch (error) {
            Alert.alert("警告", "获取工单信息失败!");
        }
    }

    choicePicture() {   // 选择图片
        try {
            ImagePicker.showImagePicker(imagePickerOptions, (response) => {
                if (response.didCancel) {
                }
                else if (response.error) {
                    console.log('ImagePicker Error: ', response.error);
                }
                else if (response.customButton) {
                } else {
                    let source = { uri: response.uri };
                    let images = this.state.images;
                    let flag = false;
                    for (let i=0; i < images.length; ++i) {
                        if (images[i].uri === response.uri) {
                            flag = true;
                        }
                    }
                    if (!flag) {
                        images.push(response);
                    }
                    this.setState({images: images});
                }
            });
        } catch (e) {
            console.log(e);
        }
    }

    generalImagesTags() {
        try {
            let images = this.state.images;
            let imageTags = [];

            // 远程图片
            for (let i=0; i < this.state.remoteImages.length; ++i) {
                let imgFileName = this.state.remoteImages[i].trim();
                if (imgFileName.length === 0) { continue; }
                let uri = SERVER_IMG_WORKTASK + imgFileName;
                let imageTag = <Image key={this.state.remoteImages[i]}
                                      source={{uri: uri}}
                                      style={[styles.image]}/>;
                imageTags.push(imageTag);
            }

            for (let i=0; i < images.length; ++i) {
                let imageTag = <Image
                    style={[styles.image]}
                    source={{uri: images[i].uri}}
                    key={images[i].uri}
                />;
                imageTags.push(imageTag);
            }

            if (imageTags.length === 0) {
                let noImageTextTip = <View key={1} style={{width: 80, height: 80, justifyContent: 'center', alignContent: 'center'}}>
                    <Text style={{color: '#aaa', fontSize: 15, textAlign: 'center'}}>未选择图片</Text>
                </View>;
                imageTags.push(noImageTextTip);
            }
            return imageTags;
        } catch (error) {
            Alert.alert("警告", "处理图片信息错误!");
        }
    }

    uploadWorkTaskData(actionType, successCB, errorCB) {
        try {
            let formData = MUtils.packFormData({
                id: global.LOGIN_UER_ID,
                workTaskId: this.state.workTask.id,
                processMethod: this.state.processMethod,
                type: actionType,
            });
            for (let i=0; i < this.state.images.length; ++i) {
                let photo = {
                    uri: this.state.images[i].uri,
                    type: 'image/jpeg',
                    name: this.state.images[i].fileName,
                };
                formData.append('file' + i, photo);
            }

            saveWorkTaskRequest(formData, (response) => {
                this.fetchData();
            }, (error) => {
                errorCB(error);
            });
            successCB();
        } catch (error) {
            console.log(error);
            errorCB(error);
        }
    }

    saveWorkTask() {    // 保存工单
        try {
            if (!this.state.saveButtonEnable) {
                return;
            }

            this.setState({
                saveButtonText: '保存中',
                saveButtonEnable: false,
            });

            this.uploadWorkTaskData('save', () => {Alert.alert('提示', '保存成功!')}, (error) => {Alert.alert('警告', error)});
            this.fetchData();
        } catch (error) {
            console.log(error);
            Alert.alert("警告", "保存信息失败!");
        } finally {
            this.setState({
                saveButtonText: '保存',
                saveButtonEnable: true,
            });
        }
    }

    submitWorkTask() {
        Alert.alert("提示", "确定要提交本工单吗?", [{
            text: '确定',
            onPress: () => {
                this.submitWorkTaskConfirmed();
            }}, {
            text: '取消',
        }]);
    }

    submitWorkTaskConfirmed() {  // 确定提交工单
        try {
            if (!this.state.submitButtonEnable) {
                return;
            }

            this.setState({
                submitButtonText: '提交中...',
                submitButtonEnable: false,
            });

            this.uploadWorkTaskData('submit', () => {
                Alert.alert('提示', '提交成功!', [{
                    text: '确定',
                    onPress: () => {
                        if (this.state.onGoBack) {
                            this.state.onGoBack();
                        }
                        this.props.navigation.goBack();
                    }
                }]);
            }, (error) => {Alert.alert('警告', error)});
        } catch (error) {
            console.log(error);
            Alert.alert("警告", "提交信息失败!");
        } finally {
            this.setState({
                submitButtonText: '提交',
                submitButtonEnable: true,
            });
        }
    }

    render() {
        let imageTags = this.generalImagesTags();
        let displayOption = this.state.workTaskStatus === '3' ? {display: 'none'} : null;

        return (
            <SafeAreaView style={[GlobalStyles.safeContainer, {backgroundColor: '#eee'}]}>
                {MUtils.getToast()}
                <ScrollView style={[{flex: 1}]}>
                    <View style={{backgroundColor: 'white', padding: 12}}>
                        <Text style={[GlobalStyles.infoRowText]}>处理办法</Text>
                        <TextInput
                            editable={this.state.workTaskStatus !== '3'}
                            underlineColorAndroid='transparent'
                            style={{height: 120, borderStyle: 'solid',
                                width: '100%',
                                borderRadius: 3,
                                marginTop: 8,
                                textAlignVertical: "top",
                                borderWidth: 1, borderColor: '#ddd'}}
                            multiline={true}
                            numberOfLines={5}
                            value={this.state.processMethod}
                            placeholder={'输入原因及处理办法'}
                            onChangeText={(text) => this.setState({processMethod: text})}
                        />
                    </View>

                    <View style={{marginTop: 10, backgroundColor: 'white', padding: 12}}>
                        <View style={[GlobalStyles.infoRowView, {justifyContent: 'space-between'}]}>
                            <Text style={[GlobalStyles.infoRowText]}>图像资料</Text>
                            <TouchableOpacity
                                style={[displayOption]}
                                onPress={this.choicePicture.bind(this)}>
                                <Text style={{color: GlobalColors.green, fontSize: 16}}>选择图片</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={[{padding: 5, flexWrap: 'wrap', flexDirection: 'row'}]}>
                            {imageTags}
                        </View>
                    </View>
                    <View style={[displayOption, {padding: 12}]}>
                        <TouchableOpacity
                            onPress={this.submitWorkTask.bind(this)}
                            style={[styles.btnSave]}>
                            <Text style={{color: 'white', fontSize: 18}}>{this.state.submitButtonText}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={this.saveWorkTask.bind(this)}
                            style={[styles.btnSubmit]}>
                            <Text style={{color: GlobalColors.green, fontSize: 18}}>{this.state.saveButtonText}</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    image: {
        width: 90,
        height: 90,
        margin: 5,
    },

    btnSave: {
        height: 50,
        width: '100%',
        borderRadius: 5,
        backgroundColor: GlobalColors.green,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    btnSubmit: {
        height: 50,
        width: '100%',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: GlobalColors.green,
        backgroundColor: '#E8F5E9',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 12,
    }
});
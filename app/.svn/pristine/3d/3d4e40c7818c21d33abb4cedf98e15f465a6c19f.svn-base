/**
 * 显示 PDF 文档组件
 */
'use strict';

import React from 'react';
import {
    StyleSheet,
    Dimensions,
    Alert,
    SafeAreaView,
    TouchableOpacity,
} from 'react-native';

import Pdf from 'react-native-pdf';

export default class PDFViewer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pdfFileSource: {uri: this.props.navigation.state.params.pdfFileUri, cache: true},
            title: this.props.navigation.state.params.title,
        };
    }

    static navigationOptions = ({ navigation }) => {
        const { params } = navigation.state;

        return {
            title: params.title,
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

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <Pdf
                    source={this.state.pdfFileSource}
                    onError={(error)=>{
                        console.log(error);
                        Alert.alert('警告', '文档加载失败!');
                    }}
                    style={styles.pdf}/>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    pdf: {
        flex:1,
        width:Dimensions.get('window').width,
    }
});
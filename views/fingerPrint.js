//关于
'use strict';
import React, { Component } from 'react';
import { View, StyleSheet, WebView, Platform, Share, TouchableHighlight, Text, ToastAndroid, DeviceEventEmitter } from 'react-native';
import GATFingerprint from 'react-native-fingerprint';

export default class FingerPrint extends Component {
    componentDidMount() {
        DeviceEventEmitter.addListener('fingerprintCallBack', this.fingerprintCallBack);
    }

    constructor(props) {
        super(props);
        this._shareText = this._shareText.bind(this);
        this._showResult = this._showResult.bind(this);
        this.state = {
            result: ''
        };
    }

    async  _isSupport() {
        try {
            var e = await GATFingerprint.isSupport();
            ToastAndroid.show(JSON.stringify(e), ToastAndroid.SHORT);
        } catch (e) {
            Alert.alert(JSON.stringity(e));
        }
    }

    _startTouch() {
        GATFingerprint.startTouch('fingerprintCallBack', 'ios propmpt');
    }

    fingerprintCallBack(e: Event) {
        ToastAndroid.show(JSON.stringify(e), ToastAndroid.SHORT);
    }

    _shareText() {
        Share.share({
            message: '我是被分享的本文信息',
            url: 'http://www.lcode.org',
            title: 'React Native'
        }, {
                dialogTitle: '分享博客地址',
                excludedActivityTypes: [
                    'com.apple.UIKit.activity.PostToTwitter'
                ],
                tintColor: 'green'
            })
            .then(this._showResult)
            .catch((error) => this.setState({ result: 'error: ' + error.message }));
    }

    _showResult(result) {
        if (result.action === Share.sharedAction) {
            if (result.activityType) {
                this.setState({ result: 'shared with an activityType: ' + result.activityType });
            } else {
                this.setState({ result: 'shared' });
            }
        } else if (result.action === Share.dismissedAction) {
            this.setState({ result: 'dismissed' });
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableHighlight style={styles.wrapper}
                    onPress={() => {
                        this._isSupport();
                    }}>
                    <View style={styles.button}>
                        <Text>点击分享文本,URL和标题</Text>
                    </View>
                </TouchableHighlight>

                 <TouchableHighlight style={styles.wrapper}
                    onPress={() => {
                        this._startTouch();
                    }}>
                    <View style={styles.button}>
                        <Text>指纹</Text>
                    </View>
                </TouchableHighlight>
                <Text>{this.state.result}</Text>
            </View>
        );
    }

}

var styles = StyleSheet.create({
    container: {
        marginTop: Platform.OS === 'ios' ? 64 : 51,
    },
    wrapper: {
        borderRadius: 5,
        marginBottom: 5,
    },
    button: {
        backgroundColor: '#eeeeee',
        padding: 10,
    },
});
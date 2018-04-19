import React, {Component} from 'react'
import {Alert, AsyncStorage, KeyboardAvoidingView, StyleSheet, Text, TouchableHighlight, View} from 'react-native'
import SettingsService from './../../services/settingsService'
import Auth from './../../util/auth'
import TextInput from './../../components/textInput'
import Colors from './../../config/colors'
import Header from './../../components/header'

export default class AmountEntry extends Component {
    static navigationOptions = {
        title: 'Verify mobile number',
    };

    constructor(props) {
        super(props);
        const params = this.props.navigation.state.params;
        this.state = {
            otp_msg: "Enter OTP",
            isEdit: false,
            otp: '',
            loginInfo: params.loginInfo,
            signupInfo: params.signupInfo,
        };
    }

    reload = () => {
        // TODO: Fix this bypass
        Auth.login(this.props.navigation, this.state.loginInfo);
        this.props.navigation.navigate("GetVerified");
    };
    resend = async () => {
        let responseJson = await SettingsService.resendMobileVerification({
            mobile: this.state.signupInfo.mobile_number,
            company: this.state.signupInfo.company,
        });
        if (responseJson.status === "success") {
            Alert.alert(
                "Email Resend",
                "A verification email has been resent, please check your email box.",
                [{text: 'OK', onPress: () => this.setState({loading: false})}],
            )
        }
        else {
            Alert.alert('Error',
                responseJson.message,
                [{text: 'OK'}])
        }
    };

    verify = async () => {
        console.log('in verify...');
        await AsyncStorage.setItem("token", this.state.loginInfo.token);
        // TODO - Fix this bypass
        let responseJson = await SettingsService.verifyMobile(this.state);
        if (responseJson.status === "success") {
            this.reload()
        }
        else {
            Alert.alert('Error',
                responseJson.message,
                [{text: 'OK'}])
        }
        this.reload();
    };

    render() {
        return (
            <View style={{flex: 1}}>
                <Header
                    navigation={this.props.navigation}
                    title="Verify mobile number"
                />
                <KeyboardAvoidingView style={styles.container} behavior={'padding'}>
                    <View style={{flex: 1}}>
                        <TextInput
                            title={this.state.otp_msg}
                            placeholder="OTP"
                            autoCapitalize="none"
                            keyboardType="numeric"
                            underlineColorAndroid="white"
                            onChangeText={(otp) => this.setState({otp})}
                        />
                    </View>

                    <TouchableHighlight
                        style={[styles.resend]}
                        onPress={this.verify}>
                        <Text style={{color: 'white', fontSize: 20}}>
                            Verify
                        </Text>
                    </TouchableHighlight>

                    <View style={styles.buttons}>
                        <TouchableHighlight
                            style={[styles.submit, {backgroundColor: Colors.red}]}
                            onPress={() => this.reload()}>
                            <Text style={{color: 'white', fontSize: 20}}>
                                Skip
                            </Text>
                        </TouchableHighlight>
                        <TouchableHighlight
                            style={[styles.submit, {marginLeft: 25}]}
                            onPress={() => this.resend()}>
                            <Text style={{color: 'white', fontSize: 20}}>
                                Resend
                            </Text>
                        </TouchableHighlight>

                    </View>
                </KeyboardAvoidingView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white',
        paddingTop: 10,
    },
    submit: {
        flex: 1,
        marginBottom: 10,
        backgroundColor: Colors.lightblue,
        borderRadius: 25,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    resend: {
        marginHorizontal: 25,
        marginBottom: 10,
        backgroundColor: Colors.lightblue,
        borderRadius: 25,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttons: {
        height: 65,
        flexDirection: 'row',
        alignSelf: 'stretch',
        paddingHorizontal: 25,
    },
});

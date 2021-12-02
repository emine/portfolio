import React, { Component} from 'react';
import { StyleSheet, View, Text, Alert } from 'react-native';

import { Input} from 'react-native-elements';
import { Button } from 'react-native-elements';
//import Icon from 'react-native-vector-icons/FontAwesome';

import AsyncStorage from '@react-native-async-storage/async-storage';
import AppContext from '../AppContext' ;

import axios from 'axios';
import uuid from 'react-native-uuid';
import * as Config from '../Config.js'; 

import * as Helper from '../Helper.js'; 
import * as Localization from 'expo-localization';
import X from 'i18n-js';
// Set the locale once at the beginning of your app.
X.locale = Localization.locale;
X.fallbacks = true;
X.translations = Config.Lang ;


export class RegisterScreen extends Component {
    
    static contextType = AppContext ; 
    
    constructor(props) {
        super(props);
        // initial value
        this.state = {
            name : "",
            passwd: "",
            token: uuid.v4(),
            id: 0,
            message: ""
        }
    }
 
    
    storeData = async () => {
        try {
          const jsonValue = JSON.stringify(this.state)
          await AsyncStorage.setItem('user', jsonValue)
          // set context
          this.context.setUser(this.state);
          this.props.navigation.navigate('home') ;
        } catch (e) {
          // saving error
        }
    }
 
    
    register = () => {
        console.log('register invoked' ) ;
        console.log(this.state) ; 
        if (this.state.name.trim().length == 0) {
            Alert.alert(X.t("Error"), X.t("Please enter your name")) ;
            return ;
        }
        if (this.state.passwd.trim().length == 0) {
            Alert.alert(X.t("Error"), X.t("Please enter password")) ;
            return ;
        }
        axios.post(Config.apiUrl + '/register', this.state)
        .then(res => {
            if (res.data.success) {
                // console.log(res.data) ;
                // save in local storage
                this.setState({id: res.data.data.id}) ;
                this.storeData() ;
            } else {
                this.setState( {message : res.data.error} ) ;
                  Alert.alert(
                    X.t("Error"),
                    res.data.error
                    ) ;
            }
        })
    }
    
    
    
    render() {
        return (
            <View style={{
                 flexDirection: "column",
                 display: "flex",
                 marginTop: 11,
            }}>
                <Input
                    label={X.t("Name")}
                    placeholder={X.t("your name or alias")}
                    onChangeText={value => this.setState({ name: value })}
                />
                <Input
                    label={X.t("Password")}
                    placeholder="your password"
                    onChangeText={value => this.setState({ passwd: value })}
                />
                <Button
                    title={X.t("Register")}
                    onPress={this.register}
                    buttonStyle = {Config.buttonStyle}
                    buttonTitleStyle = {Config.buttonTitleStyle}
                />
                <Text>
                    {this.state.message}
                </Text>    
                
            </View>
        )
    }
}
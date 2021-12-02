import React, { Component} from 'react';
import { View, Alert } from 'react-native';
import { Text, Button, Divider, Input } from 'react-native-elements';
import axios from 'axios';

import * as Config from '../Config.js'; 
import * as Helper from '../Helper.js'; 
import * as Localization from 'expo-localization';
import X from 'i18n-js';
// Set the locale once at the beginning of your app.
X.locale = Localization.locale;
X.fallbacks = true;
X.translations = Config.Lang ;

const input = React.createRef();

import AppContext from '../AppContext' ;

export class NewEvent extends Component{

    static contextType = AppContext ;    
    
    constructor(props) {
        super(props);
        this.state = {
            message: '',
            eventName: ''
        };
    }
    
    addEvent = () => {
        if (this.state.eventName.trim() == '') {
            Alert.alert(X.t("missing event")) ;
            input.current.focus();
            return ;
        } 
        axios.post(Config.apiUrl + '/addEvent', { id_user: this.context.state.user.id, name: this.state.eventName})
        .then(res => {
            if (res.data.success) {
                this.props.addTrip(false) ;
            } else {
                this.setState( {message : res.data.error} ) ;
                  Alert.alert(
                    X.t("Error"),
                    res.data.error
                    ) ;
            }
        })
    }    
   
    
    cancelEvent = () =>  {
        this.props.addTrip(false) ;
    }
       
    
    render() {
      //  console.log(this.context.state.user) ;

        return (
            <View style={{ flexDirection:"column"}}>
                    <Text 
                        h3 
                        h3Style={{padding: '5%', textAlign : 'center'}}
                    >
                    {X.t("Event")}
                    </Text>                

                    <Input
                        ref={input}
                        autoFocus={true}
                        placeholder={X.t("New Event")}
                        onChangeText={(value) => this.setState({eventName: value})}
                    />                
                    <View style={{ flexDirection:"row", justifyContent: 'center'}}>
                        <Button
                            title={X.t("Add")}
                            onPress={this.addEvent}
                            containerStyle= {{margin:'5%'}}
                            buttonStyle = {Config.buttonStyle}
                            titleStyle = {{color:"white"}}
                        />
                        <Button
                            title={X.t("cancel")}
                            type="outline"
                            onPress={this.cancelEvent}
                            containerStyle= {{margin:'5%'}}
                            buttonStyle = {Config.buttonStyle}
                            titleStyle = {Config.buttonTitleStyle}
                        />
                    </View>
            </View>
        );
    } 
}
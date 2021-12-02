import React, { Component} from 'react';
import { View, ScrollView } from 'react-native';
import { Text, Button, Divider, CheckBox } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as Config from '../Config.js'; 
import AppContext from '../AppContext' ;

import * as Localization from 'expo-localization';
import X from 'i18n-js';
// Set the locale once at the beginning of your app.
X.locale = Localization.locale;
X.fallbacks = true;
X.translations = Config.Lang ;


export class FriendsScreen extends Component{

    static contextType = AppContext ;    
    
    constructor(props) {
        super(props);
        this.state = {
            users : []
        };
    }
    
    async componentDidMount() {
        const jsonValue = await AsyncStorage.getItem('user') ;
        this.context.setUser(jsonValue != null ? JSON.parse(jsonValue) : null);
    //    this._unsubscribe = this.props.navigation.addListener('focus', () => {
    //        this.listUsers() ;
    //    });
        this.listUsers() ;
        
        
        //this.props.navigation.setOptions({
        //    headerTitle: this.context.event.name
        //})
    }
        
    
    componentWillUnmount() {
        console.log('will unmount FriendsScreen');
        
//        Dimensions.removeEventListener("change", this.onChange);
    //    this._unsubscribe();
    }
    
    
     listUsers = () => {            
        axios.post(Config.apiUrl + '/friends', this.context.state.user)
        .then( (res) => {
            if (res.data.success) {
                this.setState({ users: res.data.data}) ;
                console.log(this.state.users) ; 
            } else {
                console.log(res.data.error) ;
            }
        })
    }

    
    
    toggleFriend = (i, user_ref) => {
        this.setState( {users: this.state.users.map(function(user) {
            if (user.id == user_ref.id) {
                user.isFriend = user.isFriend == 0 ? 1 : 0 ;
            }
            return user ;
        })});
        // update on server
        axios.post(Config.apiUrl + '/updateFriend', this.state.users[i])
        .then( (res) => {
            if (res.data.success) {
                console.log('Friends updated') ;
            } else {
                console.log(res.data.error) ;
            }
        })
    }

    render() {
        return(
            <ScrollView style={{ flexDirection:"column"}}>
            <Text h4 h4Style={ {padding: 15 }}>{X.t("Select users allowed to see your pictures")}
            </Text>
            {this.state.users.map( (user, i) => 
                <CheckBox
                    key= {i}
                    title={user.name}
                    checked={user.isFriend}
                    onPress={() => this.toggleFriend(i, user)}
                />
            )}
            </ScrollView>      
        );
    }
    
    
}
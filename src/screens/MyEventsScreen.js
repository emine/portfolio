import React, { Component} from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { Text, Button, Divider } from 'react-native-elements';
import { Avatar, ListItem } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';

import {NewEvent} from './NewEvent.js' ; 

import * as Config from '../Config.js'; 
import * as Helper from '../Helper.js'; 
import * as Localization from 'expo-localization';
import X from 'i18n-js';
// Set the locale once at the beginning of your app.
X.locale = Localization.locale;
X.fallbacks = true;
X.translations = Config.Lang ;

import AppContext from '../AppContext' ;

export class MyEventsScreen extends Component{

    static contextType = AppContext ;    
    
    constructor(props) {
        super(props);
        this.state = {
            events: [],
            addTrip : false ,
        };
    }
    
    

    async componentDidMount() {
        console.log('component did mount invoked') ;
        const jsonValue = await AsyncStorage.getItem('user') ;
        this.context.setUser(jsonValue != null ? JSON.parse(jsonValue) : null);
        console.log(this.context.user) ;
        
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
                this.listEvents() ;
            });
        this.listEvents() ;
    }
    
    listEvents = () => {
        console.log('listEvent invoked') ;
        if (this.context.state.user) {
            console.log('post axios') ;
            console.log(this.context.state.user) ;
            
            axios.post(Config.apiUrl + '/events', this.context.state.user)
            .then( (res) => {
                if (res.data.success) {
                   // console.log('listEvents') ;
                   // console.log(res.data.data) ;
                    this.setState({ events: res.data.data}) ;
                } else {
                    console.log(res.data.error) ;
                }
            })
        }        
    }


    componentWillUnmount() {
        this._unsubscribe();   
     }

    
    logout = async () => {
        await AsyncStorage.removeItem('user') ;
        this.context.setUser(null);
        this.props.navigation.navigate('home') ;
    }
    
    eventScreen = (event) => {
        console.log('EVENT') ;
        console.log(event) ;
        this.context.setEvent(event) ;
        this.props.navigation.navigate('event') ;
    }
    
    // function passed to child component NewEvent
    addTrip = (val) =>  {
        this.setState({addTrip: val}) ;
        if (!this.state.addTrip) {
            this.listEvents() ;
        }
    }
    
    openInput = () => {
        this.setState({addTrip: true})
    }
    

    render() {
      //  console.log(this.context.state.user) ;

        return (
            <View>
                { this.context.state.user != null  && !this.state.addTrip &&
                    <Button
                        icon={
                            <Icon
                            name="plus"
                            size={Config.iconBigSize}
                            color={Config.iconColor}
                            />
                        }
                        title={' ' + X.t("Add Event")}
                        onPress={this.openInput}
                        type='clear'
                        buttonStyle = {Config.buttonStyle}
                        titleStyle = {Config.buttonTitleStyle}
                    />    
                }

                { this.context.state.user != null  && this.state.addTrip &&
                    <NewEvent addTrip = {this.addTrip} /> 
                }
                
                { this.context.state.user != null  && !this.state.addTrip &&
                    <ScrollView
                        style={{marginBottom : 100}}
                    >
                    {this.state.events.map( (item, i) => 
                            <ListItem 
                                key={i} 
                                bottomDivider
                                onPress={() => this.eventScreen(item)}
                            >
                            <Avatar 
                                rounded title={item.name.substring(0,2)}  
                                containerStyle={{ color: 'white', backgroundColor: 'grey'}}
                                source={{uri: Config.apiUrl + '/images/' + item.url}} 
                                />
                               <ListItem.Content>
                                   <ListItem.Title>{item.name}</ListItem.Title>
                                   <ListItem.Subtitle style={{color: 'grey', fontSize: 12}}>{Helper.dateFr(item.date)}</ListItem.Subtitle>
                               </ListItem.Content>
                               <ListItem.Chevron />
                           </ListItem>
                        )
                    }
                    </ScrollView>
                }
                
            </View>
        );
    } 
}
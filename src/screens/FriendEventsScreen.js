import React, { Component} from 'react';
import { View, ScrollView, SafeAreaView } from 'react-native';
import { Text, Button, Divider, Input, BottomSheet } from 'react-native-elements';
import { Avatar, ListItem } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as Config from '../Config.js'; 
import * as Helper from '../Helper.js'; 

import AppContext from '../AppContext' ;

export class FriendEventsScreen extends Component{

    static contextType = AppContext ;    
    
    constructor(props) {
        super(props);
        this.state = {
            events: [],
        };
    }
    
    async componentDidMount() {
        console.log('component did mount invoked') ;
        const jsonValue = await AsyncStorage.getItem('user') ;
        this.context.setUser(jsonValue != null ? JSON.parse(jsonValue) : null);
        console.log(this.context.user) ;
        
       // this._unsubscribe = this.props.navigation.addListener('focus', () => {
       //         this.listEvents() ;
       //     });
        this.listEvents() ;
    }
    
    listEvents = () => {
        console.log('listEvent invoked') ;
        if (this.context.state.user) {
            console.log('post axios') ;
            console.log(this.context.state.user) ;
            
            axios.post(Config.apiUrl + '/friend_events', this.context.state.user)
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

    eventScreen = (event) => {
        this.context.setEvent(event) ;
        this.props.navigation.navigate('event') ;
    }
    
    
    
    render() {
      //  console.log(this.context.state.user) ;


        return (
            <ScrollView>
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
                               <ListItem.Title>{item.friend[0].name + ': ' + item.name} </ListItem.Title>
                               <ListItem.Subtitle style={{color: 'grey', fontSize: 12}}>{Helper.dateFr(item.date)}</ListItem.Subtitle>
                           </ListItem.Content>
                       </ListItem>
                    )
                }
            </ScrollView>
        );
    } 
}
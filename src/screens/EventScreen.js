import React, { Component} from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { Text, Button, Divider } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as Config from '../Config.js'; 
import AppContext from '../AppContext' ;
import { Image } from 'react-native-elements';
//import { Dimensions } from 'react-native';
import GridImageView from 'react-native-grid-image-viewer';
import Icon from 'react-native-vector-icons/FontAwesome';

import * as Helper from '../Helper.js'; 
import * as Localization from 'expo-localization';
import X from 'i18n-js';

// Set the locale once at the beginning of your app.
X.locale = Localization.locale;
X.fallbacks = true;
X.translations = Config.Lang ;

//const window = Dimensions.get("window");    
//const screen = Dimensions.get("screen");



export class EventScreen extends Component{

    static contextType = AppContext ;    
    
    constructor(props) {
        super(props);
        this.state = {
          //  dimensions: {window, screen},
            pictures: [],
            grid_pictures: []
        };
    }
    /*
    onChangeDimensions = ({ window, screen }) => {
        this.setState({ dimensions: { window, screen} });
    };
     * 
     */
 
    
    listPictures = () => {
        console.log('listPictures invoked') ;
        axios.post(Config.apiUrl + '/pictures', this.context.state.event)
        .then( (res) => {
            if (res.data.success) {
                console.log('listPictures') ;
                console.log(res.data.data) ;
                this.setState({ pictures: res.data.data}) ;
                var grid_pictures = this.state.pictures.map( (item, i) => {
                    return {image: Config.apiUrl + '/images/' + item.url}
                })
                this.setState({ grid_pictures: grid_pictures}) ;
                console.log(this.state.grid_pictures) ;
            //    this.context.setPictures(res.data.data) ;
            } else {
                console.log(res.data.error) ;
            }
        })
    }        
    

    async componentDidMount() {
        console.log('component did mount invoked') ;
        const jsonValue = await AsyncStorage.getItem('user') ;
        this.context.setUser(jsonValue != null ? JSON.parse(jsonValue) : null);
     //   Dimensions.addEventListener("change", this.onChangeDimensions);
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.listPictures() ;
        });
        this.listPictures() ;
        
        
        //this.props.navigation.setOptions({
        //    headerTitle: this.context.event.name
        //})
    }
    
        
    
    componentWillUnmount() {
       // Dimensions.removeEventListener("change", this.onChange);
        this._unsubscribe();
    }
    
    isOwner = () => {
        console.log(this.context.state) ;
        return (this.context.state.user.id == this.context.state.event.id_user) ;
    }
    
    isEmpty = () => {
        return (this.state.pictures.length == 0) ;
    }
    
    actionDeleteEvent = () => {
        Alert.alert(
            X.t("Warning"),
            X.t("This event and associated pictures will be deleted"),
            [
              {
                text: X.t("cancel"),
                style: "cancel"
              },
              { text: "OK", onPress: () => this.deleteEvent() }
            ]
          );
    }  
        
    
    deleteEvent = () => {        
         axios.post(Config.apiUrl + '/deleteEvent', this.context.state.event)
        .then( (res) => {
            if (res.data.success) {
               this.props.navigation.navigate('myevents')
            } else {
                console.log(res.data.error) ;
            }
        })
    }
    
 
        
    render() {

        return (
            <View style={{ flex: 1}}>
                {this.isOwner() &&
                <Button
                    icon={
                        <Icon
                          name="plus"
                          size={25}
                          color="#60ace8"
                        />
                      }
                    title={' ' + X.t("Add Picture")}
                    buttonStyle = {Config.buttonStyle}
                    titleStyle={Config.buttonTitleStyle}
                    type='clear'
                    onPress={() => this.props.navigation.navigate('picture')}
                />    
                }
                {this.isOwner()  &&
                <Button
                    icon={
                        <Icon
                          name="trash"
                          size={25}
                          color="red"
                        />
                      }
                    title={' ' + X.t("Delete this event")}
                    buttonStyle = {{color: 'red', margin: 10, borderColor: 'red'}}
                    titleStyle={{color: 'red'}}
                    titleStyle={Config.buttonTitleStyle}
                    type='clear'
                    onPress={() => this.actionDeleteEvent()}
                />    
                }               
               
                <GridImageView data={this.state.pictures.map( (item, i) => {
                    return {image: Config.apiUrl + '/images/' + item.url}
                })} />
               
                
            </View>
        );
    } 

}
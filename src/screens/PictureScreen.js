
// adapted from https://docs.expo.io/versions/latest/sdk/imagepicker/#imagepickerlaunchcameraasyncoptions


// restructure into class component


import React, { Component, useState, useContext, useEffect} from 'react';
import { View, Platform, Alert, ActivityIndicator } from 'react-native';
import { Button, Text, Image } from 'react-native-elements';

import * as ImagePicker from 'expo-image-picker';
// import axios from 'axios';
import * as Config from '../Config.js'; 
import AppContext from '../AppContext' ;

import * as Localization from 'expo-localization';
import X from 'i18n-js';
// Set the locale once at the beginning of your app.
X.locale = Localization.locale;
X.fallbacks = true;
X.translations = Config.Lang ;

import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import Icon from 'react-native-vector-icons/FontAwesome';

import { manipulateAsync} from 'expo-image-manipulator';


const PictureScreen = (props) => {

    const appContext = useContext(AppContext)


    const [image, setImage] = useState(null) ;
    const [allowed, setAllowed] = useState(false) ;
    const [uploading, setUploading] = useState(false) ;
    
    const textStyle= { textAlign: 'center', margin:10, color: 'grey'} ;
    
    // TODO static contextType = AppContext ;  
/*    
    constructor(props) {
        super(props);
        this.state = {
            image: null,
            allowed: false,
            uploading: false,
        };
        this.textStyle= { textAlign: 'center', margin:10, color: 'grey'} ;
    }
*/
    
    // const async componentDidMount = () {     
    // 
    useEffect(() => {   
        // reference https://modern-javascript.fr/comment-utiliser-une-async-function-dans-un-hook-useeffect-avec-react/
        async function requestPermission() {
            if (Platform.OS !== 'web') {
                var OK = true;
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    OK = false ;
                } else {
                    const resp = await ImagePicker.requestCameraPermissionsAsync();
                    console.log('response') ;
                    console.log(resp) ; ;
                    if (resp.status !== 'granted') {
                        OK = false ;
                    } 
                }
                if (OK) {
                    setAllowed(true) ;
                } else {
                    Alert.alert(X.t('Sorry'),  X.t('We need camera permissions to make this work!'));
                }
            }
        }
        requestPermission() ;
        }, []) ;

    pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if (!result.cancelled) {
            // setImage(result.uri);
            //setImage(result) ;
            reduceImage(result) ; 
        }
    }
    
    
    takePicture = async () => {       
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        console.log('take picture') ;
        console.log(result);
        
        if (!result.cancelled) {
            // setImage(result.uri);
            // this.props.navigation.navigate('event') ;
            //setImage(result) ;
            reduceImage(result) ; 
        }
    }
    
    // https://docs.expo.dev/versions/latest/sdk/imagemanipulator/#__next
    // result is image object
    const reduceImage = async (result) => {
        const manipResult = await manipulateAsync(
            result.uri,
            [
              { resize: {width:500} },
            ],
          );
        setImage(manipResult);
  };
    
    createFormData = (photo, body = {}) => {
        const data = new FormData();
        data.append('photo', {
            name: photo.fileName ? photo.fileName : 'ma_photo' ,
        //    type: photo.type,
            type: 'image/jpeg' ,    // does not work on Android if type is simply image, but works on IOS
            uri: Platform.OS === 'ios' ? photo.uri.replace('file://', '') : photo.uri,
        });

        Object.keys(body).forEach((key) => {
            data.append(key, body[key]);
        });
        console.log(data) ;
        return data;
    };
    
    
    uploadPicture = () => {
        setUploading(true) ;
 
        fetch(Config.apiUrl  + '/upload', {
          method: 'POST',
          body: createFormData(image, appContext.state.event),
        })
          .then((response) => {
           // console.log('response');
           // console.log(response);
           // Alert.alert(X.t("Success"), X.t("Image uploaded")) ;
           setUploading(false) ;
             props.navigation.navigate('event') ;
            //this.setState({ image : null}) ;
           // var pictures = JSON.parse(JSON.stringify(this.context.state.pictures)) ;
           // pictures.push(response.data) ;
           // this.context.setPictures(pictures) ;
           
          })
          .catch((error) => {
            console.log('error', error);
          });
      };
         
    onSwipeDown = () => {
        props.navigation.navigate('home') ;
    } 
 
   
    return (
        <GestureRecognizer
            onSwipeDown={() => onSwipeDown()}
            config={Config.gestureConfig}
            style={{
                justifyContent: 'center', 
                alignItems: 'stretch'
            }}
        >

        {allowed && 
            <Text h4 h4Style={textStyle}>
            {X.t("Add Image to")} "{appContext.state.event.name}"
            </Text>
        }
        {allowed && 
        <Button 
            icon={
                <Icon
                    name="image"
                    size={Config.iconBigSize}
                    color={Config.iconColor}
                />
            }        
            title={' ' + X.t("Pick an image from the gallery")} 
            buttonStyle = {Config.buttonStyle}
            type="clear"
            onPress={() => pickImage()}
            buttonStyle = {Config.buttonStyle}
            titleStyle = {Config.buttonTitleStyle}
            />
        }
        <Text h4 h4Style={textStyle}>
            {X.t('Or')}
        </Text>
        {allowed && 
        <Button 
            icon={
                <Icon
                    name="camera"
                    size={Config.iconBigSize}
                    color={Config.iconColor}
                />
            }
            title={' ' + X.t("Take a picture with your camera")}
            buttonStyle = {Config.buttonStyle}
            type="clear"
            onPress={() => takePicture()} 
            buttonStyle = {Config.buttonStyle}
            titleStyle = {Config.buttonTitleStyle}
            />    
        }
        {image && 
        <Image 
            source={{ uri: image.uri }} 
            style={{ width: 200, height: 200, margin: 20}} 
            />
        }
        {image && ! uploading && 
        <Button 
            title={X.t("Upload Image")} 
            onPress={() => uploadPicture()} 
            />    
        }
        {uploading && 
        <ActivityIndicator size="large"  color="blue"/>    
        }

        </GestureRecognizer>  

    );
    
}
export default PictureScreen;
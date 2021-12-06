import React, { useState, useContext, useEffect} from 'react';
import {Input, Box, Container, Button} from '@mui/material';


// import axios from 'axios';
import * as Config from '../Config.js'; 
import AppContext from '../AppContext' ;
import { useNavigate } from 'react-router-dom';
import TopAppBar from './TopAppBar' ;

function PictureScreen() {
    const context = useContext(AppContext)
    const [image, setImage] = useState(null) ;
    const [uploading, setUploading] = useState(false) ;
    const navigate = useNavigate();
        
    const createFormData = (photo) => {
        const data = new FormData();
        data.append('photo', image);
        console.log('context.event') ;
        console.log(context.event) ;
        Object.keys(context.event).forEach((key) => {
            data.append(key, context.event[key]);
        });
        console.log(data) ;
        return data;
    };
    
    
    const uploadPicture = () => {
        setUploading(true) ;
 
        fetch(Config.apiUrl  + '/upload', {
          method: 'POST',
          body: createFormData(image),
        })
          .then((response) => {
           // console.log('response');
           // console.log(response);
           // Alert.alert(X.t("Success"), X.t("Image uploaded")) ;
           setUploading(false) ;
             navigate('/event') ;
            //this.setState({ image : null}) ;
           // var pictures = JSON.parse(JSON.stringify(this.context.state.pictures)) ;
           // pictures.push(response.data) ;
           // this.context.setPictures(pictures) ;
           
          })
          .catch((error) => {
            console.log('error', error);
          });
      };
         
 
   
   return (
        <Container maxWidth="sm">
        <TopAppBar 
            title="Choose Picture"
            returnLink="/event"
            />
        <Box
            component="form"
            sx={{
              '& .MuiTextField-root': { m: 1, width: '25ch' },
            }}
            noValidate
            autoComplete="off"
        >
            <div>
                <Input 
                    type="file"
                    onChange={(e) => setImage(e.target.files[0])}
                />
            </div>

            
            <Button variant="outlined" onClick={ () => uploadPicture()}>Upload</Button>

            
        </Box>    
        </Container>
    )   
    
}
export default PictureScreen;
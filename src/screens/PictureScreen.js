import React, { useState, useContext} from 'react';
import {Input, Box, Container, Button, Alert} from '@mui/material';

// import axios from 'axios';
import * as Config from '../Config.js'; 
import AppContext from '../AppContext' ;
import { useNavigate } from 'react-router-dom';
import TopAppBar from './TopAppBar' ;

import Loader from "react-loader-spinner";
import { useTranslation } from "react-i18next";

function PictureScreen() {
    const {t} = useTranslation() ;
    const context = useContext(AppContext)
    const [image, setImage] = useState(null) ;
    const [message, setMessage] = useState("") ;
    
    const [uploading, setUploading] = useState(false) ;
    const navigate = useNavigate();
        
    const createFormData = () => {
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
        
        if (!image) {
            setMessage(t("Please Choose Picture")) ;
            return ;
        }
        setUploading(true) ;
 
        fetch(Config.apiUrl  + '/site/upload', {
          method: 'POST',
          body: createFormData(),
        })
        
        .then(response => response.json())
        // axios.post(Config.apiUrl + '/addEvent', { id_user: context.user.id, name: eventName})
        .then(res => {
            if (res.success) {
                setUploading(false) ;
                navigate('/event') ;
            } else {
                alert(res.error) ;
            }    
           
          })
          .catch((error) => {
            console.log('error', error);
          });
      };
         
 
   
   return (
        <Container maxWidth="sm">
        <TopAppBar 
            title={t("Choose Picture")}
            returnLink="/event"
            />
        <Box
            component="form"
            sx={{
              '& .MuiTextField-root': { m: 1, width: '25ch' },
            }}
            noValidate
            autoComplete="off"
            textAlign = "center"
            marginTop = "5%"
            width="100%"
        >
            <div>
                <Input 
                    type="file"
                    onChange={(e) => {setImage(e.target.files[0]) ; setMessage("")}}
                    style={{"width" : "100%"}}
                />
            </div>
            {message && 
                <Alert severity="error">{message}</Alert>
            }
            <Button 
                variant="outlined" 
                onClick={ () => uploadPicture()}
                sx={{"marginTop" : "5%"}}
            >
                {t("Upload")}
            </Button>
            
             {uploading && 
                <Loader type="Circles" color="#00BFFF" height={80} width={80}/>    
            }

            
            
        </Box>    
        </Container>
    )   
    
}
export default PictureScreen;
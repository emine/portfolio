import React, { useState, useContext, useEffect} from 'react';

import { Add, Delete} from '@mui/icons-material';
import {Button, Container, Box} from '@mui/material';


import * as Config from '../Config.js'; 
import AppContext from '../AppContext' ;

import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";

//import * as Helper from '../Helper.js'; 
import TopAppBar from './TopAppBar' ;
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";

function EventScreen() {
    const {t} = useTranslation() ;
    const context = useContext(AppContext) ;
    const [pictures, setPictures] = useState([]) ;  
    const navigate = useNavigate();
 
    
    const listPictures = () => {
        console.log('listPictures invoked') ;
        
        const data = new FormData();
        data.append('id', context.event.id);
        data.append('token', context.user.token);

        fetch(Config.apiUrl  + '/site/pictures',  {
            method: 'POST',
            body: data,
        })
        .then(response => response.json())
        .then( (res) => {
            if (res.success) {
                console.log('listPictures') ;
                console.log(res.data) ;
                setPictures(res.data) ;
            } else {
                console.log(res.error) ;
            }
        })
    }        
    
    useEffect(() => { 
        console.log('useeffect invoked') ;
       // const jsonValue = localStorage.getItem('user') ;    // USEFULL ??? TODO
       // context.setUser(jsonValue != null ? JSON.parse(jsonValue) : null);
        listPictures() ;
    // the next line prevents the useEffect excessive warning
    // eslint-disable-next-line react-hooks/exhaustive-deps    
    },[]) 
    

    const isOwner = () => {
        console.log('isOwner') ;
        console.log(context.user) ;
        console.log(context.event) ;
        
        return (parseInt(context.user.id) === parseInt(context.event.id_user)) ;
    }
    
    const isEmpty = () => {
        return (pictures.length === 0) ;
    }
    
    
    const actionDeleteEvent = () => {
        if (window.confirm("This event and associated pictures will be deleted")) {
              deleteEvent() ;
        }      
    }  
        
    
    const deleteEvent = () => { 
        const data = new FormData();
        data.append('id', context.event.id);
        data.append('token', context.user.token);

        fetch(Config.apiUrl  + '/site/delete-event',  {
            method: 'POST',
            body: data,
        })
        .then(response => response.json())
         //axios.post(Config.apiUrl + '/deleteEvent', context.event)
        .then( (res) => {
            if (res.success) {
               navigate('/my_events/' + context.type )
            } else {
                alert(res.error) ;
            }
        })
    }
    
 
    return (
        <Container maxWidth="sm" >
            <TopAppBar 
            title={context.event.name} 
            returnLink={"/my_events/" + context.type}
            />
            {isOwner() &&
            <Box
                display="flex"
                justifyContent="space-around"
                alignItems= "center"
                marginTop="5%"
                marginBottom="5%"
            >    
                <Button 
                    variant="outlined" 
                    startIcon={<Add />} 
                    onClick={ () => navigate('/picture')}>
                    {t("Add Picture")}
                </Button>
                <Button 
                    sx={{color: 'error.main'}} 
                    variant="outlined" 
                    startIcon={<Delete />} 
                    onClick={ () => actionDeleteEvent()}>
                    {t("Delete this event")}
                </Button>
            </Box>    
            } 
            {!isEmpty() &&
            <ImageGallery 
                items={pictures.map( (item, i) => {
                    return {original: Config.imageDir + item.url,
                            thumbnail: Config.imageDir +  item.url

                        } ;
                })}
                thumbnailHeight = "50px"
                thumbnailWidth = "50px"
            />
            }
        </Container>
    );

}
export default EventScreen ;
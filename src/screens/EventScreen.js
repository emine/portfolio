import React, { useState, useContext, useEffect} from 'react';

import { Add, Delete} from '@mui/icons-material';
import {Button, Container} from '@mui/material';


import axios from 'axios';
import * as Config from '../Config.js'; 
import AppContext from '../AppContext' ;

import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";

import * as Helper from '../Helper.js'; 
import TopAppBar from './TopAppBar' ;
import { useNavigate } from 'react-router-dom';

function EventScreen() {
    const context = useContext(AppContext) ;
    const [pictures, setPictures] = useState([]) ;  
    const navigate = useNavigate();
 
    
    const listPictures = () => {
        console.log('listPictures invoked') ;
        axios.post(Config.apiUrl + '/pictures', context.event)
        .then( (res) => {
            if (res.data.success) {
                console.log('listPictures') ;
                console.log(res.data.data) ;
                setPictures(res.data.data) ;
            } else {
                console.log(res.data.error) ;
            }
        })
    }        
    
    useEffect(() => { 
        console.log('useeffect invoked') ;
        const jsonValue = localStorage.getItem('user') ;    // USEFULL ??? TODO
        context.setUser(jsonValue != null ? JSON.parse(jsonValue) : null);
        listPictures() ;
        //this.props.navigation.setOptions({
        //    headerTitle: this.context.event.name
        //})
    },[]) 
    

    const isOwner = () => {
        console.log(context.user) ;
        return (context.user.id === context.event.id_user) ;
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
         axios.post(Config.apiUrl + '/deleteEvent', context.event)
        .then( (res) => {
            if (res.data.success) {
               navigate('/my_events/' + context.type )
            } else {
                console.log(res.data.error) ;
            }
        })
    }
    
    const addPicture = () => {
        
    }
 
    return (
        <Container>
        <TopAppBar 
            title={context.event.name} 
            returnLink={"/my_events/" + context.type}
            />
            {isOwner() &&
                <Button variant="outlined" startIcon={<Add />} onClick={ () => navigate('/picture')}>Add Picture</Button>
            }
            {isOwner() && 
                <Button sx={{color: 'error.main'}} variant="outlined" startIcon={<Delete />} onClick={ () => actionDeleteEvent()}>Delete this event</Button> 
            }     
            <ImageGallery 
                items={pictures.map( (item, i) => {
                    return {original: Config.apiUrl + '/images/' + item.url,
                            thumbnail: Config.apiUrl + '/images/' + item.url

                        } ;
                })}
                thumbnailHeight = "50px"
                thumbnailWidth = "50px"
            />
        </Container>
    );

}
export default EventScreen ;
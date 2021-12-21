import React, { useState, useContext, useEffect} from 'react';

import { Add, Delete} from '@mui/icons-material';
import {Button, Container} from '@mui/material';


import * as Config from '../Config.js'; 
import AppContext from '../AppContext' ;

import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";

//import * as Helper from '../Helper.js'; 
import TopAppBar from './TopAppBar' ;
import { useNavigate } from 'react-router-dom';

function EventScreen() {
    const context = useContext(AppContext) ;
    const [pictures, setPictures] = useState([]) ;  
    const navigate = useNavigate();
 
    
    const listPictures = () => {
        console.log('listPictures invoked') ;
        
        const data = new FormData();
        data.append('id', context.event.id);

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
                console.log(res.error) ;
            }
        })
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
            {!isEmpty() &&
            <ImageGallery 
                items={pictures.map( (item, i) => {
                    return {original: Config.apiUrl + '/images/' + item.url,
                            thumbnail: Config.apiUrl + '/images/' + item.url

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
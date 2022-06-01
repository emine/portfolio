import React, { useContext, useState} from 'react';
import {Button, Box, TextField, Container} from '@mui/material';
import { useTranslation } from "react-i18next";
// import axios from 'axios';

import * as Config from '../Config.js'; 
import AppContext from '../AppContext' ;


function NewEvent(props) {
    const { t } = useTranslation();
    const context = useContext(AppContext) ;
    const [message, setMessage] = useState('') ;
    const [eventName, setEventName] = useState('') ;

    const addEvent = () => {
        if (eventName.trim() === '') {
            alert("missing event") ;
            return ;
        } 
        
        const data = new FormData();
        data.append('id_user', context.user.id);
        data.append('name', eventName);
        data.append('token', context.user.token);
        
        fetch(Config.apiUrl  + '/site/add-event', {
          method: 'POST',
          body: data,
        })
        .then(response => response.json())
        // axios.post(Config.apiUrl + '/addEvent', { id_user: context.user.id, name: eventName})
        .then(res => {
            if (res.success) {
                props.addTrip(false) ;
            } else {
                setMessage(res.error) ;
                alert("Error " + res.error) ;
            }
        })
    }    
   
    
    const cancelEvent = () =>  {
        props.addTrip(false) ;
    }
       
    

    return (
        <Container maxWidth="sm">
            <h2 style={{"text-align": "center"}}>{t("Create Event")}</h2> 
            <Box
                component="form"
                sx={{
                  '& .MuiTextField-root': { m: 1, width: '100%' },
                }}
                noValidate
                autoComplete="off"
            >
                <div>
                    <TextField 
                        required
                        label={t("New Event")} 
                        variant="standard" 
                        onChange={(ev) => setEventName(ev.target.value)} 
                        autoFocus
                    />
                </div>

                <Box
                    display="flex"
                    justifyContent="space-around"
                    alignItems= "center"
                >    
                    <Button variant="outlined" onClick={ () => addEvent()}>{t('Add')}</Button>
                    <Button variant="outlined" onClick={ () => cancelEvent()}>{ t('Cancel')}</Button>
                </Box>
                <p className="text-danger">
                    {message}
                </p>        
            </Box>    
        </Container>
    );
     
}

export default NewEvent ;
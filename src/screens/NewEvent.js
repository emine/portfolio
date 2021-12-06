import React, { useContext, useState, useEffect} from 'react';
import {Button, Box, TextField, Container} from '@mui/material';

import axios from 'axios';

import * as Config from '../Config.js'; 
import * as Helper from '../Helper.js'; 
import AppContext from '../AppContext' ;


function NewEvent(props) {
    const context = useContext(AppContext) ;
    const [message, setMessage] = useState('') ;
    const [eventName, setEventName] = useState('') ;

    const addEvent = () => {
        if (eventName.trim() == '') {
            alert("missing event") ;
            return ;
        } 
        axios.post(Config.apiUrl + '/addEvent', { id_user: context.user.id, name: eventName})
        .then(res => {
            if (res.data.success) {
                props.addTrip(false) ;
            } else {
                setMessage(res.data.error) ;
                alert("Error " + res.data.error) ;
            }
        })
    }    
   
    
    const cancelEvent = () =>  {
        props.addTrip(false) ;
    }
       
    

    return (
        <Container maxWidth="sm">
        <h3>Event</h3>
            <Box
                component="form"
                sx={{
                  '& .MuiTextField-root': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
            >
                <div>
                    <TextField 
                        required
                        label="New Event" 
                        variant="standard" 
                        onChange={(ev) => setEventName(ev.target.value)} 
                        autoFocus
                    />
                </div>

                
                <Button variant="outlined" onClick={ () => addEvent()}>Add</Button>
                <Button variant="outlined" onClick={ () => cancelEvent()}>Cancel</Button>
            </Box>    
        </Container>
    );
     
}

export default NewEvent ;
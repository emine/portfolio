import React, { useState, useContext} from 'react';
// import { StyleSheet, View, Text, Alert } from 'react-native';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Alert from '@mui/material/Alert';
import { useTranslation } from "react-i18next";


import uuid from 'react-uuid' ;
import TopAppBar from './TopAppBar' ;


//import { Input} from 'react-native-elements';
//import { Button } from 'react-native-elements';
//import Icon from 'react-native-vector-icons/FontAwesome';

// import AsyncStorage from '@react-native-async-storage/async-storage';
import AppContext from '../AppContext' ;
import { useNavigate } from 'react-router-dom';

//import axios from 'axios';
//import uuid from 'react-native-uuid';
import * as Config from '../Config.js'; 


function RegisterScreen()  {
    const {t} = useTranslation() ;
    const [name, setName] = useState("") ;
    const [passwd, setPasswd] = useState("") ;
    const [message, setMessage] = useState("") ;
    
    var id = 0 ;
    var token = "" ;
    
    const context = useContext(AppContext) ;
    const navigate = useNavigate();

    const storeData = async () => {
        try {
            const jsonValue = JSON.stringify({name: name, passwd: passwd, token:token, id: id}) ;
            localStorage.setItem('user', jsonValue)
            // set context
            context.setUser({name: name, passwd: passwd, token:token, id: id});
            navigate('/');
        } catch (e) {
            console.log(e.message) ;
        }
    }
 
    
    const register = () => {
        console.log('register invoked' ) ;
        if (name.trim().length === 0) {
            setMessage(t("Please enter your name")) ;
            return ;
        }
        if (passwd.trim().length === 0) {
            setMessage(t("Please enter password")) ;
            return ;
        }
        
        const data = new FormData();
        data.append('name', name);
        data.append('passwd', passwd);
        token = uuid() ;
        data.append('token', token);
        
        fetch(Config.apiUrl  + '/site/register', {
          method: 'POST',
          body: data,
        })
        // axios.post(Config.apiUrl + '/login', {name : name, passwd : password})
        .then(response => response.json())
        .then(res => {
            if (res.success) {
                // console.log(res.data) ;
                // save in local storage
                id = res.data.id ;
                storeData() ;
            } else {
                // use regexp to translate : Name "XXDX" has already been taken 
                let err = res.error ;
                err = err.replace("Name", t('Name')) ;
                err = err.replace("has already been taken", t('has already been taken')) ;
                setMessage(err) ;
            }
        })
    }
    
    
    
    return (
        <Container maxWidth="sm">
        <TopAppBar 
            title= {t("Register")} 
            returnLink="/"
        />

        <Box
            component="form"
            sx={{
              '& .MuiTextField-root': { m: 1, width: '25ch' },
              'marginTop' : '10%'
            }}
            noValidate
            autoComplete="off"
        >
         <div>
            <TextField 
                required
                label={t("Name or alias")} 
                variant="standard" 
                onChange={(ev) => setName(ev.target.value)} 
                autoFocus
            />
        </div>
        <div>
            <TextField 
                required
                label={t("Choose a password")} 
                variant="standard" 
                onChange={(ev) => setPasswd(ev.target.value)} 
            />
        </div>
        <Box
            display="flex"
            justifyContent="space-around"
            alignItems= "center"
            marginTop="5%"
            marginBottom="5%"
            >    
            <Button variant="outlined" onClick={ () => register()}>{t('Register')}</Button>
        </Box>
        {message && 
            <Alert severity="error">{message}</Alert>
        }  
    </Box>    
    </Container>

    )
}

export default RegisterScreen ;
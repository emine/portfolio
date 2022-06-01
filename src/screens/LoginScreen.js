import React, { useState, useContext} from 'react';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Alert from '@mui/material/Alert';
import { useTranslation } from "react-i18next";

import AppContext from '../AppContext' ;

import { useNavigate } from 'react-router-dom';

//import axios from 'axios';
//import uuid from "uuid";

import * as Config from '../Config.js'; 
import TopAppBar from './TopAppBar' ;


function LoginScreen()  {
    const {t} = useTranslation() ;
    const [name, setName] = useState("") ;
    const [password, setPassword] = useState("") ;
    const [message, setMessage] = useState("") ;
    
    const context = useContext(AppContext) ;
    const navigate = useNavigate();
    
   
    
    const login = () => {
        // console.log('login invoked' ) ;
        if (name.trim().length === 0) {
            setMessage(t("Please enter your name")) ;
            return ;
        }
        if (password.trim().length === 0) {
            setMessage(t("Please enter password")) ;
            return ;
        }

        const data = new FormData();
        data.append('name', name);
        data.append('passwd', password);
        
        fetch(Config.apiUrl  + '/site/login', {
          method: 'POST',
          body: data,
        })
        // axios.post(Config.apiUrl + '/login', {name : name, passwd : password})
        .then(response => response.json())
        .then(res => {
            console.log(res) ;
            if (res.success) {
                const id = res.data[0].id ;
                const token = res.data[0].token ;
                
                setMessage("") ; // this must be done BEFORE storeData() as storeDate will lead to a navigate which will unmount the component 
                if (id > 0) {
                    let user = {name: name, password: password, id: id, token:token}
                    const jsonValue = JSON.stringify(user) ;
                    localStorage.setItem('user', jsonValue) ;
                    // set context
                    context.setUser(user);
                    navigate('/');
                }
            } else {
                setMessage(t(res.error)) ;
            }
        })
    }
    
  
        
    return (
        <Container maxWidth="sm">
        <TopAppBar 
            title= {t("Log In")} 
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
                    label={t("User Name")} 
                    variant="standard" 
                    onChange={(ev) => setName(ev.target.value)} 
                    autoFocus
                />
            </div>

            <div>
                <TextField 
                    required
                    label={t("Password")} 
                    variant="standard" 
                    type="password" 
                    onChange={(ev) => setPassword(ev.target.value)} 
                />
            </div>
            <Box
                  display="flex"
                  justifyContent="space-around"
                  alignItems= "center"
                  marginTop="5%"
                  marginBottom="5%"
                  
              >    
                <Button variant="outlined" onClick={ () => login()}>{t("Log In")}</Button>
            </Box>
            {message && 
                <Alert severity="error">{message}</Alert>
            }  
        </Box>    
        </Container>
    )   
}

export default LoginScreen ;
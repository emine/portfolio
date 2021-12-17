import React, { useState, useContext, useEffect} from 'react';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';


import AppContext from '../AppContext' ;

import { useNavigate } from 'react-router-dom';

//import axios from 'axios';
//import uuid from "uuid";

import * as Config from '../Config.js'; 


function LoginScreen()  {
    const [name, setName] = useState("") ;
    const [password, setPassword] = useState("") ;
    const [id, setId] = useState(0) ;
    const [message, setMessage] = useState("") ;
    
    const context = useContext(AppContext) ;
    const navigate = useNavigate();
    
    useEffect(() => {
        if (id > 0) {
            const jsonValue = JSON.stringify({name: name, password: password, id: id}) ;
            localStorage.setItem('user', jsonValue) ;
            // set context
          
            // EXPERIMENTAL fix context: 
            context.setUser({name: name, password: password, id: id});
            navigate('/');
        }
    });
 
  
    
    const login = () => {
        // console.log('login invoked' ) ;
        if (name.trim().length === 0) {
            alert("Please enter your name") ;
            return ;
        }
        if (password.trim().length === 0) {
            alert("Please enter password") ;
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
                // console.log('AAAAARRRGHHHH') ;
                // console.log(res.data.data[0].id) ;
                // save in local storage
                setId(res.data[0].id) ;
                
                setMessage("") ; // this must be done BEFORE storeData() as storeDate will lead to a navigate which will unmount the component 
                // storeData() ; // cannot change the state of an unmounted component
            } else {
                setMessage(res.error) ;
                alert(res.error) ;
            }
        })
    }
    
  
        
    return (
        <Container maxWidth="sm">
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
                    label="User Name" 
                    variant="standard" 
                    onChange={(ev) => setName(ev.target.value)} 
                    autoFocus
                />
            </div>

            <div>
                <TextField 
                    required
                    label="Password" 
                    variant="standard" 
                    type="password" 
                    onChange={(ev) => setPassword(ev.target.value)} 
                />
            </div>
            
            <Button variant="outlined" onClick={ () => login()}>Log In</Button>

            <p className="text-danger">
                {message}
            </p>    
        </Box>    
        </Container>
    )   
}

export default LoginScreen ;
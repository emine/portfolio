import React, { useState, useContext} from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Context from '../Context'

import { useNavigate } from 'react-router-dom';


import axios from 'axios';
//import uuid from "uuid";

import * as Config from '../Config.js'; 


function LoginScreen()  {
    const [name, setName] = useState("") ;
    const [password, setPassword] = useState("") ;
    const [id, setId] = useState(0) ;
    const [message, setMessage] = useState("") ;
    
    const context = useContext(Context) ;
    
    const navigate = useNavigate();
  
    const storeData = () => {
        try {
            const jsonValue = JSON.stringify({name: name, password: password, id: id})
            localStorage.setItem('user', jsonValue)
            // set context
          
            // TODO fix context: bugged
            context.setUser({name: name, password: password, id: id});
            navigate('/');
        } catch (e) {
            alert(e.message)
        }
    }
 
    
    const login = () => {
        console.log('login invoked' ) ;
        if (name.trim().length === 0) {
            alert("Please enter your name") ;
            return ;
        }
        if (password.trim().length === 0) {
            alert("Please enter password") ;
            return ;
        }
        axios.post(Config.apiUrl + '/login', {name : name, passwd : password})
        .then(res => {
            if (res.data.success) {
                // console.log(res.data) ;
                // save in local storage
                setId(res.data.data[0].id) ;
                storeData() ;
                setMessage("") ;
            } else {
                setMessage(res.data.error) ;
                alert(res.data.error) ;
            }
        })
    }
    
  
        
    return (
        <div style={{
             flexDirection: "column",
             display: "flex",
             marginTop: 11,
        }}>
            
            <Form.Group>
                <Form.Label>User name</Form.Label>
                <Form.Control 
                    type="text" 
                    placeholder="your name or alias"
                    onChange={(ev) => setName(ev.target.value)} 
                    autoFocus
                />
            </Form.Group>

            <Form.Group>
                <Form.Label>Password</Form.Label>
                <Form.Control 
                    type="password" 
                    placeholder="your password"
                    onChange={(ev) => setPassword(ev.target.value)} 
                />
            </Form.Group>
            
            <Button onClick={ () => login()}>Log In</Button>

            <p className="text-danger">
                {message}
            </p>    

        </div>
    )   
}

export default LoginScreen ;
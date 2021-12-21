import React, { useContext, useEffect} from 'react';

import { NavLink } from "react-router-dom" ;

//import axios from 'axios';
import * as Config from '../Config.js'; 
import AppContext from '../AppContext' ;

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

import {List, ListItem} from '@mui/material';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import TopAppBar from './TopAppBar' ;

import { ArrowCircleUp, Login, Image, PermMedia, Group, Logout, Delete } from '@mui/icons-material';


function HomeScreen()  {
    const context = useContext(AppContext) ;
    
     useEffect(() => {
        console.log('EFFECT HOME SCREEN') ;
        const jsonValue = localStorage.getItem('user') ;
        console.log(jsonValue) ;
        if (jsonValue != null) { 
            let user = JSON.parse(jsonValue) ;
            console.log(user) ;
            context.setUser(user);
            //console.log(context) ;
        }
    },[]) ;
    
    
    const unregister = () => {
        try {
            // delete user on server
            
            const data = new FormData();
            data.append('id', context.user.id);

            fetch(Config.apiUrl  + '/site/unregister', {
              method: 'POST',
              body: data,
            })
            // axios.post(Config.apiUrl + '/login', {name : name, passwd : password})
            .then(response => response.json())
            .then( (res) => {
                if (res.success) {
                    logout() ;
                } else {
                    console.log(res.error) ;
                }
            })
        } catch(e) {
            console.log(e.message) ;
        } 
    }
    
    const logout = () => {
        localStorage.removeItem('user') ;
        context.setUser(null);
    }
    
  
    const actionUnregister = () => {
        if(window.confirm("Your account and all associated data will be removed")) {
            unregister()
        }
    }    
        
    
    return (
        <Container maxWidth="sm">
        <TopAppBar 
            title={"Home " + (context.user != null ? context.user.name : "")} 
            returnLink={false}
            />
        <Box
            component="form"
            sx={{
              '& .MuiTextField-root': { m: 1, width: '25ch' },
              color: 'primary.main',
            }}
            noValidate
            autoComplete="off"
        >
        <List>
            { context.user == null  &&
                <ListItem sx={{color: 'primary.main'}} component={NavLink} to="/register">
                    <ListItemButton>
                        <ListItemIcon sx={{color: 'primary.main'}}>
                            <ArrowCircleUp/>
                        </ListItemIcon>
                        <ListItemText primary="Register" />
                    </ListItemButton>
                </ListItem>
            }        
            { context.user == null  &&
                <ListItem  sx={{color: 'primary.main'}} component={NavLink} to="/login">
                    <ListItemButton>
                        <ListItemIcon sx={{color: 'primary.main'}} >
                            <Login/>
                        </ListItemIcon>
                        <ListItemText primary="Login" />
                    </ListItemButton>
                </ListItem>
            }
            { context.user != null  &&
                <ListItem sx={{color: 'primary.main'}} component={NavLink} to="/my_events/mine">
                    <ListItemButton>
                        <ListItemIcon sx={{color: 'primary.main'}}>
                            <Image/>
                        </ListItemIcon>
                        <ListItemText  primary="My Events" />
                    </ListItemButton>
                </ListItem>
            }
            { context.user != null  &&
                <ListItem sx={{color: 'primary.main'}} component={NavLink} to="/my_events/friends">
                    <ListItemButton>
                        <ListItemIcon sx={{color: 'primary.main'}}>
                            <PermMedia/>
                        </ListItemIcon>
                        <ListItemText primary="Friend Events" />
                    </ListItemButton>
                </ListItem>
            }
            { context.user != null  &&
                <ListItem sx={{color: 'primary.main'}} component={NavLink} to="/my_friends">
                    <ListItemButton>
                        <ListItemIcon sx={{color: 'primary.main'}}>
                            <Group/>
                        </ListItemIcon>
                        <ListItemText primary="My Friends" />
                    </ListItemButton>
                </ListItem>
            }
            { context.user != null  &&
                <ListItem sx={{color: 'primary.main'}} onClick={() => logout()}>
                    <ListItemButton>
                        <ListItemIcon sx={{color: 'primary.main'}}>
                            <Logout/>
                        </ListItemIcon>
                        <ListItemText primary="Log Out" />
                    </ListItemButton>
                </ListItem>
            }
            { context.user != null  &&
                <ListItem sx={{color: 'error.main'}} onClick={() => actionUnregister()}>
                    <ListItemButton>
                        <ListItemIcon sx={{color: 'error.main'}}>
                            <Delete/>
                        </ListItemIcon>
                        <ListItemText primary="Delete Account" />
                    </ListItemButton>
                </ListItem>
            }
        </List>    
        </Box> 
        
        </Container>
    );
} 

export default HomeScreen ;

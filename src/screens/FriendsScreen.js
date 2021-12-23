import React, {useContext, useState, useEffect } from 'react';

import {List, ListItem, ListItemButton, ListItemText, Checkbox, Container}  from '@mui/material';

import TopAppBar from './TopAppBar' ;

// import axios from 'axios';
import * as Config from '../Config.js'; 
import AppContext from '../AppContext' ;
import { useNavigate } from 'react-router-dom';

export default function FriendsScreen() {
    const context = useContext(AppContext) ;
    const [users, setUsers] = useState([]) ;
    const navigate = useNavigate();
    
    useEffect(() => {
        const jsonValue = localStorage.getItem('user') ;
        if (jsonValue == null) {
            navigate('/login') ;
        } else {
            context.setUser(JSON.parse(jsonValue));
            listUsers() ;
        }
    // the next line prevents the useEffect excessive warning
    // eslint-disable-next-line react-hooks/exhaustive-deps        
    }, []) ;
        
    
    
     const listUsers = () => {
         
        const data = new FormData();
        data.append('id', context.user.id);

        fetch(Config.apiUrl  + '/site/friends',  {
            method: 'POST',
            body: data
        })
        .then(response => response.json())
        .then( (res) => {
            if (res.success) {
                setUsers(res.data) ;
            } else {
                console.log(res.error) ;
            }
        })
    }

    
    
    const toggleFriend = (i, user_ref) => {
        setUsers(users.map(function(user) {
            if (user.id === user_ref.id) {
                user.isFriend = user.isFriend === 0 ? 1 : 0 ;
            }
            return user ;
        }));
        const data = new FormData();
        data.append('id_friend',  user_ref.id) ;
        data.append('id_user', context.user.id) ;
        data.append('isFriend', users[i].isFriend) ;
        
        fetch(Config.apiUrl  + '/site/update-friend',  {
            method: 'POST',
            body: data 
        })
        // update on server
//        axios.post(Config.apiUrl + '/updateFriend', users[i])
        .then( (res) => {
            if (res.success) {
                console.log('Friends updated') ;
            } else {
                console.log(res.error) ;
            }
        })
    }

    return(
        <Container maxWidth="sm">
            <TopAppBar 
                title= "Users" 
                returnLink="/"
            />

            <h4>Select users allowed to see your pictures</h4>
                
             <List>
                {users.map( (user, i) =>  
                     <ListItem
                        key={i}
                        secondaryAction={
                          <Checkbox
                            edge="end"
                            checked={user.isFriend}
                            onClick={() => toggleFriend(i, user)}
                          />
                        }
                        disablePadding
                      >
                        <ListItemButton>
                          <ListItemText primary={user.name} />
                        </ListItemButton>
                      </ListItem>
                    )
                }
            </List>    
        </Container>        
    );
}
    
    

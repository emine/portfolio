import React, {useContext, useState, useEffect } from 'react';

import {List, ListItem, ListItemButton, ListItemText, Checkbox, Container}  from '@mui/material';

import TopAppBar from './TopAppBar' ;

// import axios from 'axios';
import * as Config from '../Config.js'; 
import AppContext from '../AppContext' ;
import { useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from "react-i18next";

export default function FriendsScreen() {
    const { t } = useTranslation();
    const context = useContext(AppContext) ;
    const [users, setUsers] = useState([]) ;
    const navigate = useNavigate();
    const {action} = useParams() ;   // 'allow' 'block'
    
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
        data.append('action', action) ;
        data.append('token', context.user.token);

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
        data.append('action', action) ;
        data.append('id_user', context.user.token) ;
        
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
                title= {action === 'allow' ? t("Allowed Users") : t("Blocked Users") } 
                returnLink="/"
            />

            <h4>{action === 'allow' ? t('Select users allowed to see your pictures') : 
                                      t('Select users you do not want to see pictures')} 
            </h4>
                
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
    
    

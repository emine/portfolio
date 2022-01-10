import React, { useContext, useState, useEffect} from 'react';
import NewEvent from './NewEvent.js' ; 

import {Button, List, ListItem, ListItemAvatar, Avatar, ListItemText, IconButton, Container, Box} from '@mui/material';
import { Add, ChevronRight} from '@mui/icons-material';
import TopAppBar from './TopAppBar' ;

//import axios from 'axios';

import { useNavigate, useParams } from 'react-router-dom';

import * as Config from '../Config.js'; 
import * as Helper from '../Helper.js'; 

import AppContext from '../AppContext' ;

import { useTranslation } from "react-i18next";

// param type indicates my events (type = 'mine') or friend events (type= 'friend')


function MyEventsScreen () {
    const { t } = useTranslation();
    const context = useContext(AppContext) ;
    const [events, setEvents] = useState([]) ;
    const [addTrip, setAddTrip] = useState(false) ;
    const navigate = useNavigate();
    const {type} = useParams() ;

    useEffect(() => {
        console.log("MyEventsScreen useEffect invoked") ;
    //    const jsonValue = localStorage.getItem('user') ;
    //    context.setUser(jsonValue != null ? JSON.parse(jsonValue) : null);
        console.log(context.user) ;
        
      //  this._unsubscribe = this.props.navigation.addListener('focus', () => {
      //          this.listEvents() ;
      //      });
        listEvents() ;
    // the next line prevents the useEffect excessive warning
    // eslint-disable-next-line react-hooks/exhaustive-deps            
    }, [])
    
    const listEvents = () => {
        console.log('listEvent invoked') ;
        if (context.user) {
            console.log(context.user) ;
            let link = type === 'mine' ? '/site/events' : '/site/friend_events' ;
            
            const data = new FormData();
            data.append('id', context.user.id);

            fetch(Config.apiUrl  + link,  {
                method: 'POST',
                body: data,
            })
            // axios.post(Config.apiUrl + '/login', {name : name, passwd : password})
            .then(response => response.json())
            
            // axios.post(Config.apiUrl + link, context.user)
            .then( (res) => {
                console.log(res) ;
                if (res.success) {
                    console.log(res.data) ;
                    setEvents(res.data) ;
                } else {
                    console.log(res.error) ;
                }
            })
        }        
    }


   // componentWillUnmount() {
   //     this._unsubscribe();   
   //  }

    
    const eventScreen = (event) => {
        console.log('EVENT') ;
        console.log(event) ;
        context.setEvent(event) ;
        context.setType(type) ;
        navigate('/event') ;
    }
    
    // function passed to child component NewEvent
    const actionAddTrip = (val) =>  {
        setAddTrip(val) ;
        if (addTrip) {
            listEvents() ;
        }
    }
    
    const openInput = () => {
        setAddTrip(true)
    }

    return (
        
        <Container maxWidth="sm" style={{justifyContent: 'center'}}>
            <TopAppBar 
                title= {type === 'mine' ? t("My Events") : t("Friend Events")} 
                returnLink="/"
                />
            { type === 'mine' && context.user != null  && !addTrip &&
                <Box
                    textAlign = "center"
                    marginTop = "5%"
                >
                    <Button 
                        startIcon={<Add />}
                        onClick={openInput}
                        variant="outlined"
                        >{t('Add Event')}
                    </Button>
                </Box>    
                }

            { type === 'mine' && context.user != null  && addTrip &&
                  <NewEvent addTrip = {actionAddTrip} /> 
            }

            { context.user != null  && !addTrip &&
                <List>
                {events.map( (item, i) => 
                    <ListItem
                        key = {i}
                        onClick={() => eventScreen(item)}
                        secondaryAction={
                            <IconButton edge="end">
                                <ChevronRight />
                            </IconButton>
                        }
                        >
                        <ListItemAvatar>
                            <Avatar src={Config.imageDir + item.url} />
                        </ListItemAvatar>
                        <ListItemText
                            primary={ type==='mine' ? item.name : item.friend[0].name + ': ' + item.name}
                            secondary={Helper.dateFr(item.date)}
                        />
                    </ListItem>
                    )
                }
                </List>
            }

        </Container>
    );
}

export default MyEventsScreen ;
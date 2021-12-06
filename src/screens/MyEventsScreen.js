import React, { useContext, useState, useEffect} from 'react';
import NewEvent from './NewEvent.js' ; 

import {Button, List, ListItem, ListItemAvatar, Avatar, ListItemText, IconButton, Container} from '@mui/material';
import { Add, ChevronRight} from '@mui/icons-material';
import TopAppBar from './TopAppBar' ;

import axios from 'axios';

import { useNavigate, useParams } from 'react-router-dom';

import * as Config from '../Config.js'; 
import * as Helper from '../Helper.js'; 

import AppContext from '../AppContext' ;



function MyEventsScreen () {
    const context = useContext(AppContext) ;
    const [events, setEvents] = useState([]) ;
    const [addTrip, setAddTrip] = useState(false) ;
    const navigate = useNavigate();
    const {type} = useParams() ;

    useEffect(() => {
        console.log("MyEventsScreen useEffect invoked") ;
        const jsonValue = localStorage.getItem('user') ;
        context.setUser(jsonValue != null ? JSON.parse(jsonValue) : null);
        console.log(context.user) ;
        
      //  this._unsubscribe = this.props.navigation.addListener('focus', () => {
      //          this.listEvents() ;
      //      });
        listEvents() ;
    }, [])
    
    const listEvents = () => {
        console.log('listEvent invoked') ;
        if (context.user) {
            console.log('post axios') ;
            console.log(context.user) ;
            let link = type === 'mine' ? '/events' : '/friend_events' ;
            axios.post(Config.apiUrl + link, context.user)
            .then( (res) => {
                if (res.data.success) {
                   // console.log('listEvents') ;
                   // console.log(res.data.data) ;
                    setEvents(res.data.data) ;
                } else {
                    console.log(res.data.error) ;
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
        
        <Container maxWidth="sm">
            <TopAppBar 
                title= {type === 'mine' ? "My Events" : "Friend Events"} 
                returnLink="/"
                />
            { type === 'mine' && context.user != null  && !addTrip &&
                <Button 
                    startIcon={<Add />}
                    onClick={openInput}
                    variant="outlined"
                    >Add Event
                </Button>    
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
                            <Avatar src={Config.apiUrl + '/images/' + item.url} />
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
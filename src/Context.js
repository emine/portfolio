// context provider

import React, { useState} from 'react';

const AppContext = React.createContext() ;


function Context() {
    const [user, setUser] = useState(null) ;
    const [event, setEvent] = useState(null) ;
    
    setUser = (value) => {
        this.setState( { user: value } ) ;
    }
    
    setEvent = (value) => {
        this.setState( { event: value } ) ;
    }
    
    //setPictures = (value) => {
    //    this.setState( { pictures: value } ) ;
    //}
    
        
   
    return (
        <AppContext.Provider
            value={{
                state: {user: user, event: event} ,
                setUser: setUser,
                setEvent: setEvent,
            }}
        >
        </AppContext.Provider>
    );
    
}
export default Context ;
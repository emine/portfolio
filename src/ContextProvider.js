// context provider

import React, { useState} from 'react';

import AppContext from "./AppContext" ;


function ContextProvider({children}) {
    const [user, setUserState] = useState(null) ;
    const [event, setEventState] = useState(null) ;
    
    const setUser = (value) => {
        setUserState(value) ;
    }
    
    const setEvent = (value) => {
        setEventState(value) ;
    }
       
    return (
        <AppContext.Provider
            value={{
                user: user,
                event: event,
                setUser: setUser,
                setEvent: setEvent,
            }}
        >
        {children}    
        </AppContext.Provider>
    );
    
}
export default ContextProvider ;
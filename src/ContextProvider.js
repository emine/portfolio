// context provider

import React, { useState} from 'react';

import AppContext from "./AppContext" ;


function ContextProvider({children}) {
    const [user, setUser] = useState(null) ;
    const [event, setEvent] = useState(null) ;
    const [type, setType] = useState('mine') ;   // 'mine' or 'friend'
    
    return (
        <AppContext.Provider
            value={{
                user: user,
                event: event,
                type: type,
                setUser: (value) => setUser(value),
                setEvent: (value) => setEvent(value),
                setType: (value) => setType(value)
            }}
        >
        {children}    
        </AppContext.Provider>
    );
    
}
export default ContextProvider ;
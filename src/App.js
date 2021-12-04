import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom" ;

import LoginScreen from './screens/LoginScreen.js' ; 
import HomeScreen from './screens/HomeScreen.js' ; 
import ContextProvider from "./ContextProvider" ;

//import {RegisterScreen} from './screens/RegisterScreen.js' ; 
//import PictureScreen from './screens/PictureScreen.js' ;   // WATCH OUT this is a functional component 
//import {EventScreen} from './screens/EventScreen.js' ; 
//import {MyEventsScreen} from './screens/MyEventsScreen.js' ; 
//import {FriendEventsScreen} from './screens/FriendEventsScreen.js' ; 
//import {FriendsScreen} from './screens/FriendsScreen.js' ; 


function App() {
  return (
    <ContextProvider>
        <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/login" element={<LoginScreen />} />
            </Routes>
        </BrowserRouter>        
    </ContextProvider>     
  );
}

export default App;

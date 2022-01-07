import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom" ;

import LoginScreen from './screens/LoginScreen.js' ; 
import MyEventsScreen from './screens/MyEventsScreen.js' ; 
import EventScreen from './screens/EventScreen.js' ; 
import PictureScreen from './screens/PictureScreen.js' ; 
import FriendsScreen from './screens/FriendsScreen.js' ; 
import HomeScreen from './screens/HomeScreen.js' ; 
import RegisterScreen from './screens/RegisterScreen.js' ;    

import ContextProvider from "./ContextProvider" ;

import i18n from "i18next";
import {initReactI18next } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';

import translationEN from './i18n/en.json';
import translationFR from './i18n/fr.json';

i18n
    .use(LanguageDetector)
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        // the translations
        // (tip move them in a JSON file and import them,
        // or even better, manage them via a UI: https://react.i18next.com/guides/multiple-translation-files#manage-your-translations-with-a-management-gui)
        resources: {
            en: {
              translation: translationEN
            },
            fr: {
              translation: translationFR
            }
        },    
        // lng: "en", // if you're using a language detector, do not define the lng option
        fallbackLng: "en",

        interpolation: {
          escapeValue: false // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
        }
});


function App() {

    return (
        <ContextProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<HomeScreen />} />
                    <Route path="/login" element={<LoginScreen />} />
                    <Route path="/my_events/:type" element={<MyEventsScreen />} />
                    <Route path="/event" element={<EventScreen />} />
                    <Route path="/picture" element={<PictureScreen />} />
                    <Route path="/my_friends/:action" element={<FriendsScreen />} />
                    <Route path="/register" element={<RegisterScreen />} />
                </Routes>
            </BrowserRouter>        
        </ContextProvider>     
  );
}

export default App;

import React, { Fragment} from 'react';

import { FaArrowCircleUp, FaSignInAlt, FaImage, FaFileImage, FaUsers, FaSignOutAlt, FaTrash } from "react-icons/fa";
import { NavLink } from "react-router-dom" ;

import axios from 'axios';
import * as Config from '../Config.js'; 
//import AppContext from '../AppContext' ;
import Button from 'react-bootstrap/Button';

function HomeScreen()  {

 //   static contextType = AppContext ;    
    
    
    /*
    async componentDidMount() {
        console.log('component did mount invoked') ;
        const jsonValue = await AsyncStorage.getItem('user') ;
        console.log(jsonValue) ;
        this.context.setUser(jsonValue != null ? JSON.parse(jsonValue) : null);
        console.log(this.context.user) ;
    }
     * 
     */
    
  

    
    const unregister = () => {
        /*
        try {
            // delete user on server
             axios.post(Config.apiUrl + '/unregister', this.context.state.user)
            .then( async (res) => {
                if (res.data.success) {
                    await AsyncStorage.removeItem('user') ;
                    this.context.setUser(null);
                    this.props.navigation.navigate('home') ;
                } else {
                    console.log(res.data.error) ;
                }
            })
        } catch(e) {
            console.log(e) ;
        } 
        */
    }
    
    const logout = () => {
        /*
        await AsyncStorage.removeItem('user') ;
        this.context.setUser(null);
        this.props.navigation.navigate('home') ;
         * 
         */
    }
    
  
    const actionUnregister = () => {
        /*
        Alert.alert(
            X.t("Warning"),
            X.t("Your account and all associated data will be removed"),
            [
              {
                text: X.t("cancel"),
                style: "cancel"
              },
              { text: "OK", onPress: () => this.unregister() }
            ]
          );
         * 
         */
    }  
        
    
    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "start"
        }}>
            <NavLink to='/'>
                 <FaArrowCircleUp/> Register
            </NavLink>
            <NavLink to='/login'>
                 <FaSignInAlt/> Log In
            </NavLink>
            <NavLink to='/my_events'>
                 <FaImage/> My Events
            </NavLink>
            <NavLink to='/friend_events'>
                 <FaFileImage/> Friend Events
            </NavLink>
            <NavLink to='/my_friend'>
                 <FaFileImage/> <FaUsers/> My Friends
            </NavLink>
            <Button onClick={() => logout()} ><FaSignOutAlt/> Log Out</Button>
            <Button onClick={() => actionUnregister()} ><FaTrash/> Delete Account</Button>
        </div>    
    );
} 

export default HomeScreen ;

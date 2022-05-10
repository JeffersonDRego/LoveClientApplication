import React, {useContext} from "react";
import { View, Text, ActivityIndicator } from "react-native";

import AuthRoute from "./auth.route";
import AppRoute from "./app.route";

import {AuthContext} from "../contexts/auth";
import IonIcons from 'react-native-vector-icons/Ionicons';


function Routes(){

    const{signed, loading} = useContext(AuthContext);
 
    // if(loading){
    //     return(
    //         <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
    //             <ActivityIndicator size={'large'} color='red'/>
    //             <Text>TA INDO MEU FIO...PACIÊNCIA</Text>
    //         </View>
    //     )
    // }
    
    return(
        signed? <AppRoute/> : <AuthRoute/>
    )
}
export default Routes;
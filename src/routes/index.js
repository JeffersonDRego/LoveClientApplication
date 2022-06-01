import React, {useContext} from "react";
import { View, Text, ActivityIndicator } from "react-native";

import AuthRoute from "./auth.route";
import AppRoute from "./app.route";

import {AuthContext} from "../contexts/auth";



function Routes(){
    const{signed, loading} = useContext(AuthContext);

    return(
        signed? <AppRoute/> : <AuthRoute/>
    )
}
export default Routes;
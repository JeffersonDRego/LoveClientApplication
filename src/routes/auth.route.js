import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../pages/LoginScreen";

const AuthStack = createNativeStackNavigator();

export default function AuthRoute() {
  
 return (
   <AuthStack.Navigator>
       <AuthStack.Screen
       name="Login"
       component={Login}
       options={{headerShown:false}}
       />
   </AuthStack.Navigator>
  );
}
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {View} from "react-native";
import Home from "../pages/HomeScreen";
import EditClient from "../pages/EditScreen";
import ConfigsStack from "./configs.stack";
import ListStack from "./list.stack";

import IonIcons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

export default function AppRoute(){
    return(
        <Tab.Navigator 
        initialRouteName="Home"
        screenOptions={{
            headerShown: false,
            tabBarHideOnKeyboard:true,
            // tabBarShowLabel: false,
            tabBarActiveTintColor:'#F2F2F2',
            tabBarInactiveTintColor:'#252525',
            tabBarActiveBackgroundColor:'#2A5959',
            tabBarInactiveBackgroundColor:'#404040',
            
            tabBarStyle:{
                backgroundColor:'#112426',
                borderTopWidth:0,
                // borderBottomWidth:5,
                // borderTopColor:'black',
                // borderBottomColor:'#A61F1F',
                height: Platform.OS === 'ios' ? 90 : 70,  
            },
            tabBarLabelStyle:{
                fontWeight:"bold",
                fontSize:11,
            },
            tabBarItemStyle:{
                borderRadius:4,
                margin: 3,
                padding: 2,
                // borderColor:'#404040',
                // height:100,
            },
        }}
        >
            <Tab.Screen
            name="Home"
            component={Home}
            options={{
                // headerShown:false,
                tabBarLabel: 'PAGINA INICIAL',
                tabBarShowLabel:true,
                tabBarIcon:({color, size}) => {
                    return <IonIcons name="home-outline" color={color} size={30}></IonIcons>
                }
            }}
            />
            <Tab.Screen
            name="ListScreen"
            component={ListStack}
            options={{
                // headerShown:true, 
                tabBarLabel: 'LISTA DE CLIENTES',
                tabBarShowLabel:true,
                tabBarIcon:({color, size}) => {
                    return <IonIcons name="list" color={color} size={30}></IonIcons>
                }
            }}
            />

            <Tab.Screen
            name="ConfigsScreen"
            component={ConfigsStack}
            options={{
                // headerShown:true, 
                tabBarLabel: 'CONFIGURAÇÕES',
                tabBarShowLabel:true,
                tabBarIcon:({color, size}) => {
                    return <IonIcons name="settings-outline" color={color} size={30}></IonIcons>
                }
            }}
            />
            <Tab.Screen
            name="EditClient"
            component={EditClient}
            options={{
                // headerShown:true, 
          
                    tabBarButton: () => (
                        <View style={{width:0, height:0}}></View>
                    ),
                tabBarLabel: 'EDITAR CLIENTE',
                tabBarShowLabel:true,
                tabBarIcon:({color, size}) => {
                    return <IonIcons name="settings-outline" color={color} size={30}></IonIcons>
                }
            }}
            />


        </Tab.Navigator>
    )
}
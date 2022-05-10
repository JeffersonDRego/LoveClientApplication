import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Home from "../pages/HomeScreen";
import Configs from "../pages/ConfigScreen";
import NewClientScreen from "../pages/NewClientScreen";

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
            tabBarActiveTintColor:'#FFF',
            tabBarInactiveTintColor:'#F28E85',
            tabBarActiveBackgroundColor:'#F28E85',
            tabBarLabelStyle:{
                fontWeight:"bold"
            },
            tabBarItemStyle:{
                borderRadius:5
            },
            tabBarStyle:{
                backgroundColor:'#A61F1F',
                borderTopWidth:2,
                // borderBottomWidth:5,
                borderTopColor:'black',
                // borderBottomColor:'#A61F1F',
                height: 65,
                
            }
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
            name="NewClient"
            component={NewClientScreen}
            options={{
                // headerShown:true, 
                tabBarLabel: 'NOVO CLIENTE',
                tabBarShowLabel:true,
                tabBarIcon:({color, size}) => {
                    return <IonIcons name="person-add" color={color} size={30}></IonIcons>
                }
            }}
            />

            <Tab.Screen
            name="Configs"
            component={Configs}
            options={{
                // headerShown:true, 
                tabBarLabel: 'LISTA DE CLIENTES',
                tabBarShowLabel:true,
                tabBarIcon:({color, size}) => {
                    return <IonIcons name="list" color={color} size={30}></IonIcons>
                }
            }}
            />

        </Tab.Navigator>
    )
}
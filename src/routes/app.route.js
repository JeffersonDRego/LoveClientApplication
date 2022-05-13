import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Home from "../pages/HomeScreen";
import Configs from "../pages/ConfigScreen";
import NewClientScreen from "../pages/NewClientScreen";

import IonIcons from 'react-native-vector-icons/Ionicons';
import { backgroundColor } from "react-native/Libraries/Components/View/ReactNativeStyleAttributes";

const Tab = createBottomTabNavigator();

export default function AppRoute(){
    return(
        <Tab.Navigator 
        initialRouteName="Home"
        screenOptions={{
            headerShown: false,
            tabBarHideOnKeyboard:true,
            // tabBarShowLabel: false,
            tabBarActiveTintColor:'#0D0D0D',
            tabBarInactiveTintColor:'#A6A6A6',
            tabBarActiveBackgroundColor:'#BFB47A',
            tabBarInactiveBackgroundColor:'#0D0D0D',

            tabBarLabelStyle:{
                fontWeight:"bold"
            },
            tabBarItemStyle:{
                borderRadius:4,
                margin: 3,
                padding: 2,
                // borderColor:'#404040',
            },
            tabBarStyle:{
                backgroundColor:'#262626',
                // borderTopWidth:2,
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
import React, {useContext, useState, useEffect} from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {View} from "react-native";
import firebase from "../services/firebaseConnection";

import Home from "../pages/HomeScreen";
import EditClient from "../pages/EditScreen";
import ConfigsStack from "./configs.stack";
import ListStack from "./list.stack";
import Warning from "../pages/WarningsScreen";

import { AuthContext } from "../contexts/auth";
import moment from "moment";
import IonIcons from 'react-native-vector-icons/Ionicons';


const Tab = createBottomTabNavigator();

export default function AppRoute(){
    const {user} = useContext(AuthContext)
    const uid = user && user.uid;

    const [listWarnings, setListWarnings] = useState([]);
    const listLength = listWarnings.length
    
    const mustReload = user.configurated;
    useEffect(()=> {
        async function loadListWarnings(){
            // console.log(mustReload)
            firebase.database().ref('clients').child(uid).on('value', (snapshot) => {
            setListWarnings([]);
            snapshot.forEach((childItem) => {
            var carimbos = childItem.val().purchases
            let primeiraCompra = childItem.val().firstPurchase;
            let numTotalCar = parseFloat(user.numTotalCarimbos)
            moment.locale('pt-br')
            var dataAtual = moment().format('DD/MM/YYYY');
            var diff = moment(dataAtual,"DD/MM/YYYY").diff(moment(primeiraCompra,"DD/MM/YYYY"));
            var mesesByDB = moment.duration(diff).asMonths();
            var meses = mesesByDB;
            // console.log(primeiraCompra +'  '+ childItem.val().nameClient + '  ' + meses +' meses de diferença '+ carimbos + ' carimbos')
            if(carimbos >= numTotalCar || carimbos == numTotalCar-1 || meses>user.validadeCarimbos ||  meses>user.validadeCarimbos-1 && meses<user.validadeCarimbos){
                let list = {
                key: childItem.key,
                nameClient: childItem.val().nameClient,
                phoneClient: childItem.val().phoneClient,
                purchases: childItem.val().purchases,
                firstPurchase: childItem.val().firstPurchase
    
                };
                setListWarnings(oldArray => [...oldArray, list]);
            }
            });
        })
        // await new Promise(resolve=> setTimeout(resolve, 300))

        }
        loadListWarnings();
    },[mustReload]);

   
    return(
        <Tab.Navigator 
        initialRouteName="Home"
        screenOptions={{
            headerShown: false,
            tabBarHideOnKeyboard:true,
            tabBarShowLabel: false,
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
                tabBarLabel: 'LISTA CLIENTES',
                tabBarShowLabel:true,
                tabBarIcon:({color, size}) => {
                    return <IonIcons name="list" color={color} size={30}></IonIcons>
                }
            }}
            />

            <Tab.Screen
            name="WarningScreen"
            component={Warning}
            options={{
                // headerShown:true, 
                tabBarLabel: 'AVISOS',
                tabBarShowLabel:true,
                tabBarBadge: listLength,
                tabBarBadgeStyle:{backgroundColor:'#FFA500'},
                tabBarIcon:({color, size}) => {
                    return <IonIcons name="notifications-outline" color={color} size={30}></IonIcons>
                }
            }}
            
            />  

            <Tab.Screen
            name="ConfigsScreen"
            component={ConfigsStack}
            options={{
                // headerShown:true, 
                tabBarLabel: 'AJUSTES',
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
import { createNativeStackNavigator } from "@react-navigation/native-stack";


import IonIcons from 'react-native-vector-icons/Ionicons';
import ListPageScreen from "../pages/ListScreen";
import EditClient from "../components/ListComponents/EditClient";
const Stack = createNativeStackNavigator();

export default function ListStack(){
    return(
        <Stack.Navigator 
        initialRouteName="ListPageScreen"
        >
            <Stack.Screen
            name="ListPageScreen"
            component={ListPageScreen}
            options={{
                headerShown:false,
                // tabBarLabel: 'PAGINA INICIAL',
                // tabBarShowLabel:true,
                // tabBarIcon:({color, size}) => {
                //     return <IonIcons name="home-outline" color={color} size={30}></IonIcons>
                // }
            }}
            />

            <Stack.Screen
            name="EditClient"
            component={EditClient}
            options={{
                headerTitle:'Editar Cliente',
                headerTintColor:'#FFF',
                // tabBarIcon:({color, size}) => {
                //     return <IonIcons name="home-outline" color={color} size={30}></IonIcons>
                // }
                headerStyle:{
                    backgroundColor:'#0D0D0D'
                }
            }}
            />

        </Stack.Navigator>
    )
}
import { createNativeStackNavigator } from "@react-navigation/native-stack";


import IonIcons from 'react-native-vector-icons/Ionicons';
import ConfigsPageScreen from "../pages/ConfigsScreen";
import EditClient from "../components/ListComponents/EditClient";
const Stack = createNativeStackNavigator();

export default function ConfigsStack(){
    return(
        <Stack.Navigator 
        initialRouteName="ConfigsPageScreen"
        >
            <Stack.Screen
            name="ConfigsPageScreen"
            component={ConfigsPageScreen}
            options={{
                headerShown:false,
                // tabBarLabel: 'PAGINA INICIAL',
                // tabBarShowLabel:true,
                // tabBarIcon:({color, size}) => {
                //     return <IonIcons name="home-outline" color={color} size={30}></IonIcons>
                // }
            }}
            />

        </Stack.Navigator>
    )
}
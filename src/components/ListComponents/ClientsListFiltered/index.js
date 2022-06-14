import React, {useContext} from 'react';
import {TouchableOpacity, TouchableWithoutFeedback, Text, View, Linking } from 'react-native';
import { ContainerList, ViewClient, TextName, ButtonsView, IconView, InfosView } from '../../../styles/styles';
import IonIcons from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../../../contexts/auth';
import { useNavigation } from '@react-navigation/native';

// import EditClient from '../EditClient';

export default function ClientsListFiltered({data, zerarLista}) {
  const {user,} = useContext(AuthContext);
  const navigation = useNavigation();
  
  
  if(user){
    return (
      <TouchableWithoutFeedback>

        <View style={{ padding:1,paddingLeft:10, width:'98%', margin:3,}}>
          <TouchableOpacity style={{ flexDirection:'row', alignItems:'center'}}
          onPress={(props)=> {
            navigation.navigate('EditClient', {data})
            zerarLista()
          }
          }>

              <View style={{ width:'80%'}}>
                <Text style={{color:'#0D0D0D', marginBottom:2, fontSize:20, fontFamily:'OxaniumSemiBold'}}>{data.nameClient}</Text>

                <View style={{flexDirection:'row'}}>
                  <Text style={{color:'#0D0D0D', fontFamily:'OxaniumMedium', fontSize:16}}>Telefone:</Text>
                  <Text style={{color:'#0D0D0D', fontFamily:'OxaniumLight', fontSize:16}}> ({data.phoneClient.slice(0,2)}) {data.phoneClient.slice(2,7)}-{data.phoneClient.slice(7,11)} </Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('EditClient', {data})
                }
                  style={{flexDirection:'row', alignItems:'center', width:'10%'}}>
                <IonIcons style={{marginTop:-6, marginLeft:-5}} name='information-circle-outline' size={33} color={'#4682B4'}/>
              </TouchableOpacity>  
              
              <TouchableOpacity
            onPress={() =>
              Linking.canOpenURL("whatsapp://send?text=oi").then(supported => {
                if (supported) {
                  return Linking.openURL(
                    `whatsapp://send?phone=55${data.phoneClient}&text=Olá`
                    );
                  } else {
                    return Linking.openURL(
                      `https://api.whatsapp.com/send?phone=55${data.phoneClient}&text=Olá`
                      );
                    }
                  })
                }
                style={{flexDirection:'row', alignItems:'center', width:'10%'}}>
              <IonIcons style={{marginTop:-8}} name='logo-whatsapp' size={30} color={'green'}/>
            </TouchableOpacity>  
                  
          </TouchableOpacity>
          <View style={{width:'100%', height:0.5, backgroundColor:'#112426', marginTop:2}}>
          </View>
          <View style={{height:10}}></View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
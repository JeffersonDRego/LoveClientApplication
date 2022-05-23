import React, {useContext} from 'react';
import {TouchableOpacity, Text, View } from 'react-native';
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
      <View style={{ padding:1,paddingLeft:10, width:'98%', margin:3, marginBottom:5}}>
        <TouchableOpacity style={{ flexDirection:'row', alignItems:'center'}}
        onPress={(props)=> {
          navigation.navigate('EditClient', {data})
          zerarLista()
        }
        }>

        {/* <View style={{height:50, width:'90%', flexDirection:'row'}}> */}
            <View style={{ width:'80%', margin:0}}>
              <TextName style={{color:'#0D0D0D', marginBottom:2, fontSize:20, fontWeight:'bold'}}>{data.nameClient}</TextName>

              <View style={{flexDirection:'row'}}>
                <TextName style={{color:'#0D0D0D', fontWeight:'bold'}}>Telefone:</TextName>
                <TextName style={{color:'#0D0D0D'}}>{data.phoneClient}</TextName>
              </View>
            </View>
    
            <View style={{width:'20%', backgroundColor:'#F2F2F2', borderRadius:5}}>
              <IconView style={{flexDirection:'column', justifyContent:'center'}}>
                <IonIcons name="person-outline" size={30} color={'#BFB47A'}></IonIcons>
                <TextName style={{color:'#0D0D0D', fontSize:12, marginTop:-5}}>EDITAR</TextName>
              </IconView>
            </View>
            
    
          {/* </View> */}
        </TouchableOpacity>
            <View style={{width:'100%', height:1, backgroundColor:'#112426'}}>
            </View>
      </View>
    );
  }
}
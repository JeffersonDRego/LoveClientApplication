import React, {useContext} from 'react';
import {TouchableOpacity, TouchableWithoutFeedback, Text, View, Linking } from 'react-native';
import { ContainerList, ViewClient, TextName, ButtonsView, IconView, InfosView } from '../../../styles/styles';
import IonIcons from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../../../contexts/auth';
import { useNavigation } from '@react-navigation/native';

// import EditClient from '../EditClient';

export default function ClientsList({data, deleteItem, editItem}) {
  const {user,} = useContext(AuthContext);
  const navigation = useNavigation();
  if(user){
    return (
      <TouchableWithoutFeedback>

        <ContainerList style={{ borderRadius:5, marginBottom:10}}>
          <TouchableOpacity onPress={()=> navigation.navigate('EditClient', {data})}>

            <ViewClient style={{width:'100%'}}>
              <InfosView style={{width:'80%'}}>
                <Text style={{fontFamily:'OxaniumSemiBold', fontSize:20}}>{data.nameClient}</Text>
              </InfosView>
                <TouchableOpacity
                  style={{flexDirection:'row', alignItems:'center', width:'10%'}}
                  onPress={() =>
                    navigation.navigate('EditClient', {data})
                  }>
                  <IonIcons style={{marginTop:-6, marginLeft:-5}} name='information-circle-outline' size={33} color={'#4682B4'}/>
                </TouchableOpacity>
                <TouchableOpacity
                style={{flexDirection:'row', justifyContent:'flex-end', width:'10%'}}
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
                    >
                  <IonIcons style={{marginTop:-8}} name='logo-whatsapp' size={30} color={'green'}/>
                </TouchableOpacity>  
            </ViewClient>

            <View style={{width:'100%', borderWidth:0.5, borderStyle:'dashed', borderRadius:1, marginBottom:10}}> 
            </View>
            {
              data.firstPurchase?
              <Text style={{fontFamily:'OxaniumLight', margin:5}}>1ª compra: {data.firstPurchase}</Text>
              :<Text style={{fontFamily:'OxaniumLight', margin:5}}>1ª compra: 0 compras Válidas</Text>
            }
            {
              data.phoneClient?
              <Text style={{fontFamily:'OxaniumLight', margin:5}}>TELEFONE: ({data.phoneClient.slice(0,2)}) {data.phoneClient.slice(2,7)}-{data.phoneClient.slice(7,11)}</Text>
              :<View></View>
            }

          </TouchableOpacity>
            
            

        </ContainerList>
      </TouchableWithoutFeedback>
    );
  }
}
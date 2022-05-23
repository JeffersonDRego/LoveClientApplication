import React, {useContext} from 'react';
import {TouchableOpacity, Text, View } from 'react-native';
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
      <ContainerList>
        <TouchableOpacity onPress={()=> navigation.navigate('EditClient', {data})}>

        <ViewClient>
            <InfosView>
              <TextName>{data.nameClient}</TextName>
              
              <View style={{flexDirection:'row'}}>
                <TextName style={{ fontWeight:'bold'}}>Telefone:</TextName>
                <TextName style={{}}>{data.phoneClient}</TextName>
              </View>
            </InfosView>
    
            <ButtonsView>
              <IconView style={{flexDirection:'column', justifyContent:'center'}}>
                <IonIcons name="person-outline" size={30} color={'#BFB47A'}></IonIcons>
                <TextName style={{color:'#F2F2F2', fontSize:12, marginTop:-5}}>EDITAR</TextName>
              </IconView>
    
              {/* <IconView style={{backgroundColor:'blue'}}>
                <TouchableOpacity>
                  <IonIcons name="information" size={20} color={'white'}></IonIcons>
                </TouchableOpacity>
              </IconView>
    
              <IconView style={{backgroundColor:'red'}}>
                <TouchableOpacity onPress={()=> deleteItem(data)}>
                  <IonIcons name="trash" size={20} color={'white'}></IonIcons>
                </TouchableOpacity>
              </IconView> */}
            </ButtonsView>
    
          </ViewClient>
        </TouchableOpacity>
      </ContainerList>
    );
  }
}
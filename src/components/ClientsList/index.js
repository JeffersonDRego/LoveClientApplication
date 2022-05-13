import React, {useContext} from 'react';
import {TouchableOpacity, Text } from 'react-native';
import { ContainerList, ViewClient, TextName, ButtonsView, IconView, InfosView } from '../../styles/styles';
import IonIcons from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../../contexts/auth';

export default function ClientsList({data, deleteItem, editItem}) {
  const {user,} = useContext(AuthContext);

  if(user){
    return (
      <ContainerList>
       <ViewClient>
          <InfosView>
            <TextName>{data.nameClient + ' com ' + data.purchases + ' carimbos'}</TextName>
          </InfosView>
  
          <ButtonsView>
            <IconView style={{backgroundColor:'green'}}>
              <TouchableOpacity onPress={()=>editItem(data)}>
                <IonIcons name="create" size={20} color={'white'}></IonIcons>
              </TouchableOpacity>
            </IconView>
  
            <IconView style={{backgroundColor:'blue'}}>
              <TouchableOpacity>
                <IonIcons name="information" size={20} color={'white'}></IonIcons>
              </TouchableOpacity>
            </IconView>
  
            <IconView style={{backgroundColor:'red'}}>
              <TouchableOpacity onPress={()=> deleteItem(data)}>
                <IonIcons name="trash" size={20} color={'white'}></IonIcons>
              </TouchableOpacity>
            </IconView>
          </ButtonsView>
  
        </ViewClient>
        
      </ContainerList>
    );
  }
}
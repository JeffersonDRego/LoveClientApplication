import React from 'react';
import {TouchableOpacity, Text } from 'react-native';
import { ContainerList, ViewClient, TextName, ButtonsView, IconView } from '../../styles/styles';
import IonIcons from 'react-native-vector-icons/Ionicons';

export default function ClientsList({data}) {
 return (
   <ContainerList>
     <ViewClient>
        <TextName>{data.name + ' com ' + data.purchases + ' carimbos'}</TextName>
        <ButtonsView>
          <IconView style={{backgroundColor:'green'}}>
            <TouchableOpacity>
              <IonIcons name="create" size={20} color={'white'}></IonIcons>
            </TouchableOpacity>
          </IconView>
          <IconView style={{backgroundColor:'blue'}}>
            <TouchableOpacity>
              <IonIcons name="information" size={20} color={'white'}></IonIcons>
            </TouchableOpacity>
          </IconView>
          <IconView style={{backgroundColor:'red'}}>
            <TouchableOpacity>
              <IonIcons name="trash" size={20} color={'white'}></IonIcons>
            </TouchableOpacity>
          </IconView>
        </ButtonsView>
     </ViewClient>
        
   </ContainerList>
  );
}
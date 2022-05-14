import React, {useState, useEffect, useContext} from "react";
import { Text, Keyboard, ActivityIndicator, Image, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import firebase from "../../services/firebaseConnection";
import { AuthContext } from "../../contexts/auth";
import { format } from "date-fns";

import {SafeArea, ContainerHeaderConfigs, ContainerConfigsScreen, ButtonAct, TextsLogin} from '../../styles/styles';
// import MaskInput, { Masks } from 'react-native-mask-input';

export default function ConfigsPageScreen() {
  const navigation = useNavigation();
  
  const {user,} = useContext(AuthContext);
  const [search, setSearch] = useState(null);

  const uid = user && user.uid;

  const [loading, setLoading] = useState(false);

  
  return (
    <View style={{flex:1,}}>
      <ContainerHeaderConfigs >
      <Image source={require('../../Img/LogoPNG.png')} 
            style={{width:'60%', height:100, resizeMode:'contain', marginBottom:'-10%', marginLeft:'2%'}}/>
        
        <Image source={require('../../Img/ListClient.png')} 
              style={{width:'20%', height:'60%', resizeMode:'contain', marginRight:'5%', marginBottom:'-8%',}}/>
      </ContainerHeaderConfigs>

      <View style={{width:'100%', height:7, backgroundColor:'#BFB47A'}}>
      </View>
      <View style={{width:'100%', height:2, backgroundColor:'#FFF'}}>
      </View>

      <ContainerConfigsScreen>

        {/* <TextsTitleLogin style={{marginBottom: 10}}>Lista de Clientes:</TextsTitleLogin> */}
       
        <ButtonAct onPress={()=> navigation.navigate('EditClient')}>
          <TextsLogin>BOTAO</TextsLogin>
        </ButtonAct>
        
      </ContainerConfigsScreen>
    </View>
  );
}
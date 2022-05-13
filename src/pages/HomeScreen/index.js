import React, {useState, useContext, useEffect} from "react";
import { Text, StyleSheet, Keyboard, Alert, TouchableOpacity, Image, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import firebase from "../../services/firebaseConnection";
import { AuthContext } from "../../contexts/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from "date-fns";
import IonIcons from "react-native-vector-icons/Ionicons";

import {ContainerHeaderHome, Container, ButtonAct, TextInputs, TextsLogin, SafeArea} from '../../styles/styles';
// import MaskInput, { Masks } from 'react-native-mask-input';

export default function Home({data}) {
  const navigation = useNavigation();
  
  const {user, Logout} = useContext(AuthContext);

  const [nameClient, setNameClient] = useState(null);
  const [phoneClient, setPhoneClient] = useState(null);
  const [purchases, setPurchases] = useState(0);
  
  function handleLogout(){

    Alert.alert(
      'DESEJA SAIR DA SUA CONTA?',
      `Será necessário novo Login para acessar o App novamente`,
      [
        {
          text:'VOLTAR AO APP',
          style: 'cancel'
        },
        {
          text:'SAIR',
          onPress: ()=> Logout()
        }
      ]
    )
  }
  async function handleSubmitClient(){

    let uid = user.uid;
    let key = await firebase.database().ref('clients').child(uid).push().key;
    await firebase.database().ref('clients').child(uid).child(key).set({
      nameClient: nameClient,
      phoneClient: phoneClient,
      purchases: purchases,
      date: format(new Date(),'dd/MM/yyyy')
    })
    //AUTALIZAR QUANTIDADE DE CLIENTES
    setNameClient('');
    setPhoneClient('');
    Keyboard.dismiss();
    navigation.navigate('Configs');
    alert('CLIENTE CADASTRADO');
  }

  function handle(){
    console.log(user)
  }
  
  return (
    <SafeArea>
      <ContainerHeaderHome>
        <Image source={require('../../Img/LogoPNG.png')} 
            style={{width:'60%', height:100, resizeMode:'contain', marginBottom:'-10%', marginLeft:'2%'}}/>
        
        <View style={{marginTop:20}}>
          <TouchableOpacity onPress={handleLogout}>
            <IonIcons style={{marginRight:10, marginBottom:-5}} name={'exit'} size={38} color={'white'}/>
            <Text style={{marginRight:18, marginBottom:-20,color:'#FFF'}}>SAIR</Text>
      
          </TouchableOpacity>
        </View>
      </ContainerHeaderHome>

      <View style={{width:'100%', height:7, backgroundColor:'#BFB47A'}}>
      </View>
      <View style={{width:'100%', height:2, backgroundColor:'#FFF'}}>
      </View>
      <ButtonAct onPress={handle}>
            
            <Text style={{marginRight:18, marginBottom:-20,color:'#FFF'}}>SAIR</Text>
      
          </ButtonAct>
      <Container>
        <TextsLogin style={{fontWeight:'bold', fontSize:22}}>Olá {user.name}</TextsLogin>
        <TextsLogin style={{fontWeight:'bold', fontSize:20}}>Você possui {user.clients} Clientes cadastrados.</TextsLogin>
      </Container>

    </SafeArea>
  );
}

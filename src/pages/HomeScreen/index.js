import React, {useState, useContext, useEffect} from "react";
import { Text, StyleSheet, Keyboard, Alert, SafeAreaView, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import firebase from "../../services/firebaseConnection";
import { AuthContext } from "../../contexts/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from "date-fns";
import IonIcons from "react-native-vector-icons/Ionicons";

import {ContainerHeader, Container, ButtonAct, TextInputs, TextsLogin} from '../../styles/styles';
// import MaskInput, { Masks } from 'react-native-mask-input';

export default function Home({data}) {
  const navigation = useNavigation();
  
  const {user, Logout} = useContext(AuthContext);

  const [nameClient, setNameClient] = useState(null);
  const [phoneClient, setPhoneClient] = useState(null);
  const [purchases, setPurchases] = useState(0);
  
  useEffect(()=>{
   
  },[])

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
  
  return (
    <SafeAreaView style={{flex:1, backgroundColor:'#731212'}}>

      <ContainerHeader>
        <TouchableOpacity onPress={handleLogout}>
          <IonIcons style={{marginRight:10}} name={'exit'} size={40} color={'white'}/>
          <Text style={{marginRight:18, color:'#FFF'}}>SAIR</Text>

        </TouchableOpacity>
      </ContainerHeader>
    <Container>
      <TextsLogin style={{fontWeight:'bold', fontSize:22, marginBottom:50}}>Olá {user.name}</TextsLogin>
      {/* <Text>{user && user.uid + "  " + user.name +"  " + user.email + user.clients}</Text> */}
      {/* <Text>TOKEN DE USUÁRIO: {user.uid}</Text> */}
      <TextsLogin style={{fontWeight:'bold', fontSize:20}}>Você possui {user.clients} Clientes cadastrados.</TextsLogin>
      
      {/* <ButtonAct style={{marginTop:20, backgroundColor:'#aaa1aa'}} onPress={Logout}>
        <Text style={{color:'#FFF', fontSize:19, fontWeight:'bold'}}>Sair</Text>
      </ButtonAct> */}
    </Container>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  InputPhone:{
    width:'80%',
    height:40,
    backgroundColor:'#fff',
    borderRadius:5,
    padding:5,
    margin:10,
    fontSize:17
  }

})

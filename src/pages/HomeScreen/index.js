import React, {useState, useContext, useEffect} from "react";
import { Text, StyleSheet, Keyboard, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import firebase from "../../services/firebaseConnection";
import { AuthContext } from "../../contexts/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from "date-fns";

import {Container, ButtonAct, TextInputs, TextsLogin} from '../../styles/styles';
// import MaskInput, { Masks } from 'react-native-mask-input';

export default function Home({data}) {
  const navigation = useNavigation();
  
  const {user, Logout} = useContext(AuthContext);

  const [nameClient, setNameClient] = useState(null);
  const [phoneClient, setPhoneClient] = useState(null);
  const [purchases, setPurchases] = useState(0);
  
  useEffect(()=>{
   
  },[])

  function handleSubmit(){
    Keyboard.dismiss();
    if (isNaN(phoneClient) || nameClient === null){
      alert('Preencha corretamente')
      return;
    }
    Alert.alert(
      'Confira os dados',
      `Nome: ${nameClient}  Telefone: ${phoneClient}`,
      [
        {
          text:'Cancelar',
          style: 'cancel'
        },
        {
          text:'Confirmar',
          onPress: ()=> handleSubmitClient()
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
    <Container>
      <TextsLogin style={{fontWeight:'bold', fontSize:22, marginBottom:50}}>Olá {user.name}</TextsLogin>
      {/* <Text>{user && user.uid + "  " + user.name +"  " + user.email + user.clients}</Text> */}
      {/* <Text>TOKEN DE USUÁRIO: {user.uid}</Text> */}
      <TextsLogin style={{fontWeight:'bold', fontSize:20}}>Você possui {user.clients} Clientes cadastrados.</TextsLogin>
      
      <ButtonAct style={{marginTop:20, backgroundColor:'#aaa1aa'}} onPress={Logout}>
        <Text style={{color:'#FFF', fontSize:19, fontWeight:'bold'}}>Sair</Text>
      </ButtonAct>
    </Container>
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

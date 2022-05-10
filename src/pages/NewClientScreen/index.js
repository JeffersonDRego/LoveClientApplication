import React, {useState, useContext, useEffect} from "react";
import { Text, StyleSheet, Keyboard, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import firebase from "../../services/firebaseConnection";
import { AuthContext } from "../../contexts/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from "date-fns";

import {Container, ButtonAct, TextInputs, TextsLogin} from '../../styles/styles';
// import MaskInput, { Masks } from 'react-native-mask-input';

export default function NewClientScreen() {
  const navigation = useNavigation();
  
  const {user, Logout, storageUser, loadStoragedUser} = useContext(AuthContext);

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
    //AUTALIZAR QUANTIDADE DE CLIENTES AQUI
    let usuario = firebase.database().ref('users').child(uid);
    await usuario.once('value').then((snapshot)=>{
      let numClients = parseFloat(snapshot.val().clients);
      numClients += parseFloat(1)
      usuario.child('clients').set(numClients);
    }).then((snapshot)=>{
      let data = {
          uid: uid,
          name: user.name,
          email: user.email,
          clients: user.clients + 1,
      }
      storageUser(data);
      loadStoragedUser();
      setNameClient('');
      setPhoneClient('');
      Keyboard.dismiss();
      navigation.navigate('Configs');
      alert('CLIENTE CADASTRADO');
      
    })
  }
  
  return (
    <Container>
      <TextsLogin style={{fontWeight:'bold', fontSize:22, marginBottom:50}}>CADASTRAR NOVO CLIENTE:</TextsLogin>
      {/* <Text>{user && user.uid + "  " + user.name +"  " + user.email}</Text> */}
      {/* <Text>TOKEN DE USUÁRIO: {user.uid}</Text> */}
      <TextsLogin style={{fontWeight:'bold', fontSize:20, marginLeft:'-43%'}}>Cadastrar Cliente:</TextsLogin>
      <TextInputs
      onChangeText={(text)=>{setNameClient(text)}}
      value={nameClient}
      placeholder="NOME CLIENTE"
      />
      <TextInputs
      onChangeText={(text)=>{setPhoneClient(text)}}
      value={phoneClient}
      placeholder="PHONE CLIENTE"
      keyboardType="numeric"
      />

      {/* <MaskInput
      style={styles.InputPhone}
      value={phoneClient}
      onChangeText={(numeric)=>{setPhoneClient(numeric)}}
      keyboardType="numeric"
      mask={Masks.BRL_PHONE}
      
    /> */}
      <ButtonAct style={{marginTop:20, backgroundColor:'#D93232'}} onPress={handleSubmit} >
        <Text style={{color:'#FFF', fontSize:19, fontWeight:'bold'}}>Cadastrar</Text>
      </ButtonAct>
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

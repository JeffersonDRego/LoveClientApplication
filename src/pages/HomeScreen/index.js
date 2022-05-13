import React, {useState, useContext, useEffect} from "react";
import { Text, ActivityIndicator, Keyboard, Alert, TouchableOpacity, Image, View } from "react-native";
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
  
  const {user, Logout, loading} = useContext(AuthContext);

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
  function handleSubmit(){
    Keyboard.dismiss();
    if (isNaN(phoneClient) || nameClient === null ){
      alert(`Preencha corretamente... Verifique o telefone e certifique-se que preencheu o campo de Nome`)
      return;
    }
    Alert.alert(
      'Confirme o TELEFONE',
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
    setLoading(true);
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
    })
    loadStoragedUser();
    setNameClient('');
    setPhoneClient('');
    Keyboard.dismiss();
    navigation.navigate('Configs');
    setLoading(false);
    alert('CLIENTE CADASTRADO COM SUCESSO');
  }
  
  return (
    <SafeArea>
      <ContainerHeaderHome>
        <Image source={require('../../Img/LogoPNG.png')} 
            style={{width:'60%', height:100, resizeMode:'contain', marginBottom:'-10%', marginLeft:'2%'}}/>
        
        <View style={{marginTop:20}}>
          <TouchableOpacity onPress={handleLogout}>
            <IonIcons style={{marginRight:10, marginBottom:-5}} name={'exit'} size={38} color={'red'}/>
            <Text style={{marginRight:18, marginBottom:-20,color:'#FFF'}}>SAIR</Text>
      
          </TouchableOpacity>
        </View>
      </ContainerHeaderHome>

      <View style={{width:'100%', height:7, backgroundColor:'#BFB47A'}}>
      </View>
      <View style={{width:'100%', height:2, backgroundColor:'#FFF'}}>
      </View>
      {/* <ButtonAct onPress={handle}>
            
            <Text style={{marginRight:18, marginBottom:-20,color:'#FFF'}}>SAIR</Text>
      
          </ButtonAct> */}
      <Container>
        <TextsLogin style={{fontWeight:'bold', fontSize:22}}>Olá {user.name}</TextsLogin>
        <TextsLogin style={{fontWeight:'bold', fontSize:20}}>Você possui {user.clients} Clientes cadastrados.</TextsLogin>
        <TextsLogin style={{ fontSize:20, textAlign:'center', marginBottom:15, margin:'10%'}}>CADASTRAR NOVO CLIENTE:</TextsLogin>
        
        <View style={{width:'80%', marginBottom:-5}}>
          <TextsLogin>Nome do Cliente:</TextsLogin>
        </View>
        <TextInputs
        onChangeText={(text)=>{setNameClient(text)}}
        value={nameClient}
        placeholder="Insira o Nome do Cliente"
        />

        <View style={{width:'80%', marginBottom:-5}}>
          <TextsLogin>Telefone do Cliente:</TextsLogin>
        </View>
        <TextInputs
        onChangeText={(text)=>{setPhoneClient(text)}}
        value={phoneClient}
        placeholder="Insira o Telefone do Cliente"
        keyboardType="numeric"
        />

        {/* <View style={{width:'80%', marginBottom:-5}}>
          <TextsLogin>Confirmar Telefone:</TextsLogin>
        </View>
        <TextInputs
        onChangeText={(text)=>{setConfirmPhone(text)}}
        value={confirmPhone}
        placeholder="Confirme o Telefone do Cliente"
        keyboardType="numeric"
        /> */}

        {/* <MaskInput
        style={styles.InputPhone}
        value={phoneClient}
        onChangeText={(numeric)=>{setPhoneClient(numeric)}}
        keyboardType="numeric"
        mask={Masks.BRL_PHONE}
        
        /> */}
      
        <ButtonAct style={{marginTop:20, backgroundColor:'#D93232'}} onPress={handleSubmit} >
        {
        loading?(
          <ActivityIndicator size={20} color={"#FFF"}/>
        ) : (
          <Text style={{color:'#FFF', fontSize:19, fontWeight:'bold'}}>Cadastrar</Text>
        )
      }
        </ButtonAct>
      </Container>

    </SafeArea>
  );
}

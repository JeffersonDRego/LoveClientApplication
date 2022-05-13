import React, {useState, useContext} from "react";
import { Text, StyleSheet, Keyboard, ActivityIndicator,Alert, Image, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import firebase from "../../services/firebaseConnection";
import { AuthContext } from "../../contexts/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from "date-fns";

import {ContainerNewClient, ButtonAct, TextInputs, TextsLogin, ContainerHeaderNew, SafeArea} from '../../styles/styles';
// import MaskInput, { Masks } from 'react-native-mask-input';

export default function NewClientScreen() {
  const navigation = useNavigation();
  
  const {user, storageUser, loadStoragedUser} = useContext(AuthContext);

  const [nameClient, setNameClient] = useState(null);
  const [phoneClient, setPhoneClient] = useState(null);
  const [loading, setLoading] = useState(false);
  // const [confirmPhone, setConfirmPhone] = useState(null);
  const [purchases, setPurchases] = useState(0);
  

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
      <ContainerHeaderNew >
        <Image source={require('../../Img/LogoPNG.png')} 
              style={{width:'60%', height:100, resizeMode:'contain', marginLeft:'10%'}}/>
        
        <Image source={require('../../Img/AddClient.png')} 
              style={{width:'20%', height:'50%', resizeMode:'contain', marginRight:'5%', marginBottom:'4%',}}/>
      </ContainerHeaderNew>
      
      <View style={{width:'100%', height:7, backgroundColor:'#BFB47A'}}>
      </View>
      <View style={{width:'100%', height:2, backgroundColor:'#FFF'}}>
      </View>
      
      <ContainerNewClient>

        {/* <TextsLogin style={{fontWeight:'bold', fontSize:22, marginBottom:30}}>CADASTRAR NOVO CLIENTE:</TextsLogin> */}
        {/* <Text>{user && user.uid + "  " + user.name +"  " + user.email}</Text> */}
        {/* <Text>TOKEN DE USUÁRIO: {user.uid}</Text> */}
        <TextsLogin style={{ fontSize:17, textAlign:'center', marginBottom:25, margin:'10%'}}>Preencha o Nome e o Telefone do Cliente e clique em 'CADASTRAR'</TextsLogin>
        
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
  



      </ContainerNewClient>
    </SafeArea>
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

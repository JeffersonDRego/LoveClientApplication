import React, {useState, useContext, useEffect} from "react";
import { Text, ActivityIndicator, Keyboard, StyleSheet ,Alert, TouchableOpacity, Image, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import firebase from "../../services/firebaseConnection";
import { AuthContext } from "../../contexts/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from "date-fns";
import IonIcons from "react-native-vector-icons/Ionicons";

import {ContainerHeaderHome, Container, ButtonAct, TextInputs, TextsLogin, SafeArea} from '../../styles/styles';
import MaskInput, {Masks} from 'react-native-mask-input';

export default function Home({data}) {
  const navigation = useNavigation();
  
  const {user, Logout, storageUser, loadStoragedUser} = useContext(AuthContext);

  const [nameClient, setNameClient] = useState(null);
  const [phoneClient, setPhoneClient] = useState(null);
  const [purchases, setPurchases] = useState(0);
  const [loading, setLoading] = useState(false);
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
      alert(phoneClient)
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
          numTotalCarimbos:user.numTotalCarimbos,
          validadeCarimbos:user.validadeCarimbos,
          valorMin:user.valorMin,
          configurated:user.configurated
      }
      
      storageUser(data);
    })
    loadStoragedUser();
    setNameClient('');
    setPhoneClient('');
    Keyboard.dismiss();
    navigation.navigate('ListScreen');
    setLoading(false);
    alert('CLIENTE CADASTRADO COM SUCESSO');
  }
  
  return (
  
  

    <View style={{flex:1}}>
      <ContainerHeaderHome>
        <Image source={require('../../Img/LogoPNG.png')} 
            style={{width:'60%', height:100, resizeMode:'contain', marginBottom:'-10%', marginLeft:'2%'}}/>
        
        <View style={{marginTop:20}}>
          <TouchableOpacity onPress={handleLogout}>
            <IonIcons style={{marginRight:10, marginBottom:-5}} name={'exit'} size={38} color={'#FFF'}/>
            <Text style={{marginRight:18, marginBottom:-20,color:'#FFF'}}>SAIR</Text>
      
          </TouchableOpacity>
        </View>
      </ContainerHeaderHome>

      {/* <View style={{width:'100%', height:7, backgroundColor:'#F2EDA2'}}>
      </View> */}
      <View style={{width:'100%', height:1, backgroundColor:'#F2F2F2'}}>
      </View>

      <Container>
        <TouchableOpacity onPress={()=>{console.log(user)}}>
          <TextsLogin>ASOSAOKSAOKOSAK</TextsLogin>
        </TouchableOpacity>
        <TextsLogin style={{fontWeight:'bold', fontSize:22}}>Olá {user.name}</TextsLogin>
        <TextsLogin style={{fontWeight:'bold', fontSize:20}}>Você possui {user.clients} Clientes cadastrados.</TextsLogin>
        
        <View style={{backgroundColor:'#223A40', marginTop:20, borderRadius:5,height:320, width:'100%', justifyContent:'center', alignItems:'center', }}>

          <TextsLogin style={{ fontSize:20, textAlign:'center', marginBottom:15, color:'#fff'}}>CADASTRAR NOVO CLIENTE:</TextsLogin>
          
          <View style={{width:'90%', marginBottom:-5}}>
            <TextsLogin>Nome do Cliente:</TextsLogin>
          </View>
          <TextInputs
          onChangeText={(text)=>{setNameClient(text)}}
          value={nameClient}
          placeholder="Insira o Nome do Cliente"
          placeholderTextColor="#696969"
          style={{width:'90%'}}
          selectionColor={'#898989'}
          />

          <View style={{width:'90%', marginBottom:-5}}>
            <TextsLogin>Telefone do Cliente:</TextsLogin>
          </View>
          <MaskInput
          style={styles.InputPhone}
          value={phoneClient}
          inputType="number"
          onChangeText={(text, rawValue)=>setPhoneClient(rawValue)}
          keyboardType="numeric"
          placeholderTextColor="#696969"
          mask={Masks.BRL_PHONE}
          selectionColor={'#696969'}
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

          <TouchableOpacity 
          onPress={handleSubmit}
          style={{elevation:5,flexDirection:'row',backgroundColor:'#2A5959', alignItems:'center',alignSelf:'center', margin:10, padding:10, borderRadius:3}}>
            <Text style={{color:'#FFF', fontSize:16, marginRight:8, fontWeight:'bold'}}>Cadastrar</Text>
          {
          loading?(
            <ActivityIndicator size={20} color={"#FFF"}/>
          ) : (
            <IonIcons  name="person-add-outline" size={25} color={'#FFF'}/>
          )
        }
          </TouchableOpacity>
        </View>
      </Container>

    </View>
  );
}

const styles = StyleSheet.create({
  InputPhone:{
    width: '90%',
    height: 40,
    backgroundColor:'#DCDCDC',
    borderRadius:5,
    padding:5,
    margin:10,
    fontSize: 17,
  }
})
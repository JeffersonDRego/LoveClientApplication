import React, {useState, useContext,} from "react";
import { Text, ActivityIndicator, Keyboard, StyleSheet ,Alert, TouchableOpacity, Image, View, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import firebase from "../../services/firebaseConnection";
import { AuthContext } from "../../contexts/auth";
// import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from "moment";
// import { useFonts } from 'expo-font';
// import { AppLoading } from 'expo';
import IonIcons from "react-native-vector-icons/Ionicons";

import {ContainerHeader, ContainerHome, ButtonAct, TextInputs, TextsLogin, SafeArea, ListaClientes} from '../../styles/styles';
import MaskInput, {Masks} from 'react-native-mask-input';

export default function Home({data}) {
    
  const navigation = useNavigation();
  
  const {user, Logout, storageUser, loadStoragedUser,} = useContext(AuthContext);

  const [nameClient, setNameClient] = useState(null);
  const [phoneClient, setPhoneClient] = useState('');
  const [purchases, setPurchases] = useState(0);
  const [loading, setLoading] = useState(false);


  function handleSubmit(){
    Keyboard.dismiss();
    if (isNaN(phoneClient) || phoneClient.length < 11 ){
      alert('PREENCHA CORRETAMENTE')
      return;
    }
    if ( nameClient === null || nameClient.length < 3){
      alert('O nome precisa ter pelo menos 3 letras')
      return;
    }
    // if ( nameClient !== String){
    //   alert('Você não pode inserir números no campo de Nome do Cliente')
    //   return;
    // }
    if ( user.configurated == 'noConfigurated'){
      alert('Você precisa predefinir suas configurações antes de adicionar um cliente')
      navigation.navigate('ConfigsScreen')
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
      date: moment().format('DD/MM/YYYY')
    })
    //AUTALIZAR QUANTIDADE DE CLIENTES AQUI
    let usuario = firebase.database().ref('users').child(uid);
    await usuario.once('value').then((snapshot)=>{
      let numClients = parseFloat(snapshot.val().clients);
      numClients += parseFloat(1)
      usuario.child('clients').set(numClients);
    }).then(()=>{
      let data = {
          uid: uid,
          name: user.name,
          email: user.email,
          clients: user.clients + 1,
          numTotalCarimbos:user.numTotalCarimbos,
          validadeCarimbos:user.validadeCarimbos,
          valorMin:user.valorMin,
          configurated:user.configurated,
          adminPass:user.adminPass
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
    <ScrollView contentContainerStyle={{flexGrow: 1}} style={{flex:1, backgroundColor:'red'}}>
      <View style={{flex:1}}>
      <Image source={require('../../Img/BackgroundApp.png')} 
              style={{width:'100%', height:'100%', position:"absolute"}}/>
        <ContainerHeader>
          <Image source={require('../../Img/LogoBlackPNG.png')} 
              style={{width:210, height:60, resizeMode:'contain', alignSelf:'flex-end'}}/>
        </ContainerHeader>
        <View style={{height:3, backgroundColor:'#0D0D0D'}}></View>

        <ContainerHome>
            <Text style={{fontSize:28, fontFamily: 'OxaniumBold', marginBottom:10, marginTop:30}}>Olá {user.name} Teste,</Text>
          <TouchableOpacity onPress={()=>{navigation.navigate('ListScreen')}} style={{flexDirection:'row', alignItems:'center'}}>
            <Text style={{fontSize:20, fontFamily: 'OxaniumLight', marginTop:5}}>- Você possui {user.clients} Clientes cadastrados</Text>
            <IonIcons style={{marginTop:7, marginLeft:7}} name={'people-outline'} size={23} color={'#0D0D0D'}/>

          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{navigation.navigate('WarningsScreen')}} style={{flexDirection:'row', alignItems:'center'}}>
            <Text style={{fontSize:20, fontFamily: 'OxaniumLight', marginTop:15}}>- Minha lista de Notificações</Text>
            <IonIcons style={{marginTop:16, marginLeft:7}} name={'list-outline'} size={23} color={'#0D0D0D'}/>
          </TouchableOpacity>
          {/* ------------------VIEW CADASTRO CLIENTES HOME--------------------------------- */}
          <View style={{borderRadius:5,height:320, width:'100%', marginTop:80}}>

            <Text style={{ fontFamily:'OxaniumSemiBold', fontSize:20, marginBottom:15, color:'#0D0D0D'}}>CADASTRAR NOVO CLIENTE:</Text>
            
            <View style={{width:'90%',}}>
              <Text style={{fontFamily:'OxaniumExtraLight'}}>Nome do Cliente:</Text>
            </View>
            <TextInputs
            onChangeText={(text)=>{setNameClient(text)}}
            value={nameClient}
            placeholder="Insira o Nome do Cliente"
            placeholderTextColor="#696969"
            style={{width:'90%'}}
            selectionColor={'#898989'}
            />

            <View style={{width:'90%', marginTop:15}}>
              <Text style={{fontFamily:'OxaniumExtraLight'}}>Telefone do Cliente:</Text>
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
            
            <TouchableOpacity 
            onPress={handleSubmit}
            style={{marginTop:40,elevation:5,flexDirection:'row',backgroundColor:'#FFA500', alignItems:'center',alignSelf:'center', marginTop:20, padding:10, borderRadius:3}}>
              <Text style={{color:'#0D0D0D', fontSize:16, marginRight:8, fontFamily:'OxaniumSemiBold'}}>CADASTRAR</Text>
            {
            loading?(
              <ActivityIndicator size={20} color={"#F2F2F2"}/>
            ) : (
              <IonIcons  name="person-add-outline" size={25} color={'#0D0D0D'}/>
            )
          }
            </TouchableOpacity>
          </View>
        </ContainerHome>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  InputPhone:{
    width: '90%',
    // height: 40,
    // backgroundColor:'#DCDCDC',
    borderBottomWidth:0.5,
    borderRadius:5,
    padding:5,
    margin:10,
    fontSize: 17,
    fontFamily:'OxaniumExtraLight'
  }
})
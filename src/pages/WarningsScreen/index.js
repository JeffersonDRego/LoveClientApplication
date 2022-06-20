import React, {useState, useContext, useEffect} from "react";
import { ActivityIndicator, StyleSheet, TouchableOpacity, Image, View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import firebase from "../../services/firebaseConnection";
import { AuthContext } from "../../contexts/auth";
import IonIcons from "react-native-vector-icons/Ionicons";


import {ContainerHeader, TextsLogin, ListaClientes, ContainerHome} from '../../styles/styles';
import moment from 'moment';

import ClientsListWarnings from "../../components/ListComponents/ClientsListWarnings";

export default function Warning({data}) {
  const navigation = useNavigation();
  
  const {user, Logout, storageUser, loadStoragedUser} = useContext(AuthContext);
  const [listClientsWarnings, setListClientsWarnings] = useState([]);

  const [loading, setLoading] = useState(false);
  const uid = user && user.uid;
  
  useEffect(()=> {
    loadListClientsWarnings();
  },[]);
  async function loadListClientsWarnings(){
      
    // const timer = await new Promise (resolve => setTimeout(resolve, 1000)) 
    // clearTimeout(timer);
    
    firebase.database().ref('clients').child(uid).on('value', (snapshot) => {
      setListClientsWarnings([]);
      snapshot.forEach((childItem) => {
        var carimbos = childItem.val().purchases
        let primeiraCompra = childItem.val().firstPurchase;
        let numTotalCar = parseFloat(user.numTotalCarimbos)
        moment.locale('pt-br')
        var dataAtual = moment().format('DD/MM/YYYY');
        var diff = moment(dataAtual,"DD/MM/YYYY").diff(moment(primeiraCompra,"DD/MM/YYYY"));
        var mesesByDB = moment.duration(diff).asMonths();
        var meses = mesesByDB;
        // console.log(primeiraCompra +'  '+ childItem.val().nameClient + '  ' + meses +' meses de diferença '+ carimbos + ' carimbos')
        if(carimbos >= numTotalCar || carimbos == numTotalCar-1 || meses>user.validadeCarimbos ||  meses>user.validadeCarimbos-1 && meses<user.validadeCarimbos){
          let list = {
            key: childItem.key,
            nameClient: childItem.val().nameClient,
            phoneClient: childItem.val().phoneClient,
            purchases: childItem.val().purchases,
            firstPurchase: childItem.val().firstPurchase

          };
          setListClientsWarnings(oldArray => [...oldArray, list].reverse());
        }
      });
    })
    // await new Promise(resolve=> setTimeout(resolve, 300))

  }

  return (
      <View style={{flex:1}}>
        <Image source={require('../../Img/BackgroundApp.png')} 
              style={{width:'100%', height:'100%', position:"absolute"}}/>
        <ContainerHeader>
        <Image source={require('../../Img/LogoBlackPNG.png')} 
              style={{width:210, height:60, resizeMode:'contain', alignSelf:'flex-end'}}/>
        </ContainerHeader>
        <View style={{height:3, backgroundColor:'#0D0D0D'}}></View>

        <View style={{padding:20, paddingTop:35 }}>

          <Text style={{fontFamily:'OxaniumSemiBold', fontSize:30, marginBottom:5}}>Notificações</Text>
          <Text style={{fontFamily:'OxaniumLight', fontSize:15, marginBottom:15, borderBottomWidth:0.5,}}>Acompanhe o status dos seus clientes e faça contato!</Text>

          <View style={{ width:'100%', height:'70%',marginTop:20
            , borderRadius:10, backgroundColor:'#FFA500', padding:10, paddingRight:15,}}>
              {
              listClientsWarnings.length==0
              ?
              <View style={{width:'100%', alignItems:'center', backgroundColor:'red', marginTop:15}}>
                <Text style={{color:'#FFF', fontSize:15, fontWeight:'bold'}}>NENHUM AVISO POR ENQUANTO</Text>
              </View>
              :
              <ListaClientes
                data={listClientsWarnings}
                keyExtractor={item => item.key}
                initialNumToRender={5}
                renderItem={({item})=> (
                  loading?(
                    <ActivityIndicator size={20} color={"#FFF"} style={{marginTop:30,marginBottom:35}}/>
                  ):(
                    <ClientsListWarnings data={item}/>
                    )
                )}
              />
            }
          </View>
          {/* ------------------------------BOTAOO ATUALIZAR LISTA-------------------------------- */}
          <TouchableOpacity onPress={()=>{loadListClientsWarnings()}}
          style={{margin:10, backgroundColor:'#FAA500', padding:12, borderRadius:3, alignSelf:'center', width:'40%'}}>
            <Text style={{fontFamily:'OxaniumSemiBold', textAlign:'center'}}>ATUALIZAR LISTA</Text>
          </TouchableOpacity>

        </View>
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
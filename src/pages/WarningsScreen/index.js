import React, {useState, useContext, useEffect} from "react";
import { ActivityIndicator, StyleSheet, TouchableOpacity, Image, View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import firebase from "../../services/firebaseConnection";
import { AuthContext } from "../../contexts/auth";
import IonIcons from "react-native-vector-icons/Ionicons";


import {ContainerHeaderHome, TextsLogin, ListaClientes, ContainerHome} from '../../styles/styles';
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
  ///////////////////IMPORTANTE////////////////////////////////
          // let dataAtual = new moment();
          // let primeiraCompra = new moment()
          // let primeiraCompraFormated = primeiraCompra.format('DD/MM/YYYY')
          // var diff = moment(dataAtual,"DD/MM/YYYY").diff(moment(primeiraCompra,"DD/MM/YYYY"));
          // var meses = moment.duration(diff).asMonths();

  return (
      <View style={{flex:1}}>
        <ContainerHeaderHome>
          <Image source={require('../../Img/LogoPNG.png')} 
              style={{width:'60%', height:100, resizeMode:'contain', marginBottom:'-10%', marginLeft:'2%'}}/>
          
          <View style={{marginTop:20}}>
            <TouchableOpacity onPress={()=>{}}>
              <IonIcons style={{marginRight:10, marginBottom:-15}} name={'alert-circle-outline'} size={60} color={'#FFA500'}/>
            </TouchableOpacity>
          </View>
        </ContainerHeaderHome>

        <View style={{width:'100%', height:1, backgroundColor:'#F2F2F2'}}>
        </View>

        <ContainerHome>
        <View style={{ width:'100%', height:'70%',marginTop:20
          , borderRadius:10, backgroundColor:'#223A40'}}>
            {
              listClientsWarnings.length==0
              ?
              <View style={{width:'100%', alignItems:'center', backgroundColor:'red', marginTop:15}}>
                <Text style={{color:'#FFF', fontSize:15, fontWeight:'bold'}}>NENHUM AVISO POR ENQUANTO</Text>
              </View>
              :
              <ListaClientes style={{marginBottom:0}}
                data={listClientsWarnings}
                keyExtractor={item => item.key}
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
          {/* ------------------------------BOTAOO TESTE-------------------------------- */}
          <TouchableOpacity onPress={()=>{loadListClientsWarnings()}}>
            <TextsLogin>ATUALIZAR LISTA</TextsLogin>
          </TouchableOpacity>

        </ContainerHome>
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
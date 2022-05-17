import React, {useState, useEffect, useContext} from "react";
import { Text, StyleSheet, ScrollView, ActivityIndicator,Alert, Image, View, } from "react-native";
import { useNavigation } from "@react-navigation/native";
import firebase from "../../services/firebaseConnection";
import { AuthContext } from "../../contexts/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from "date-fns";

import {SafeArea, ViewList, ContainerHeaderList, ContainerListScreen, ListaClientes, TextsLogin, TextInputs, 
  ButtonActListScreen} from '../../styles/styles';
// import MaskInput, { Masks } from 'react-native-mask-input';
import ClientsList from "../../components/ListComponents/ClientsList";
export default function ListPageScreen() {
  const navigation = useNavigation();
  
  const {user,storageUser,loadStoragedUser} = useContext(AuthContext);
  const [search, setSearch] = useState(''); 
  const [filteredData, setFilteredData] = useState([]); 
  const [listClients, setListClients] = useState([]);
  const uid = user && user.uid;
  const [loading, setLoading] = useState(false);

  useEffect(()=> {
    loadListClients()
    },[]);
    
  //CARREGANDO LISTA DE CLIENTES E SALVANDO DADOS EM data
  async function loadListClients(){
    setLoading(true);
    firebase.database().ref('clients').child(uid).on('value', (snapshot) => {
      setListClients([]);
      snapshot.forEach((childItem) => {
        let list = {
          key: childItem.key,
          nameClient: childItem.val().nameClient,
          phoneClient: childItem.val().phoneClient,
          purchases: childItem.val().purchases
        };
        setListClients(oldArray => [...oldArray, list]);
      });
    })
    await new Promise(resolve=> setTimeout(resolve, 100))
    setLoading(false)
  };
  
  //FILTRO DE LISTAGEM
  const searchFilter = (text) => {
    if(text === ''){
      setFilteredData([]);
      setSearch(text);
    }
    if (text) {
      const newData = listClients.filter(
        function (item) {
          // console.log(item.nameClient)
          if (item) {
            const phoneData = item.phoneClient.toUpperCase();
            const textData = text.toUpperCase();
            const nameData = item.nameClient.toUpperCase();
            return phoneData.indexOf(textData) > -1 ||
            nameData.indexOf(textData) > -1;

          }
          if (item.nameClient) {
            const textData = text.toUpperCase();
          }
      });
      setFilteredData(newData);
      setSearch(text);
    } else {
      setSearch(text);
    }
  };
  
  return (
    <View style={{flex:1,}}>

      <ContainerHeaderList >
        <Image source={require('../../Img/LogoPNG.png')} 
        style={{width:'60%', height:100, resizeMode:'contain', marginBottom:'-10%', marginLeft:'2%'}}/>
        
        <Image source={require('../../Img/ListClient.png')} 
              style={{width:'20%', height:'60%', resizeMode:'contain', marginRight:'5%', marginBottom:'-8%',}}/>
      </ContainerHeaderList>

      <View style={{width:'100%', height:7, backgroundColor:'#BFB47A'}}>
      </View>
      <View style={{width:'100%', height:2, backgroundColor:'#FFF'}}>
      </View>

      <ContainerListScreen>

        <View style={{justifyContent:'center', alignItems:'center', width:'100%', marginTop:'5%'}}>
          <TextsLogin>PESQUISAR CLIENTE:</TextsLogin>
          <TextInputs
          onChangeText={(text) =>filteredData===['']? setFilteredData([]): searchFilter(text)}
          value={search}
          placeholder="Digite o número ou nome do Cliente" 
          placeholderTextColor="#999999"
          selectionColor={'#0D0D0D'}
          />
        </View>
        <View style={{ width:'100%', height:'50%', backgroundColor:'#404040'}}>
          <ListaClientes style={{marginBottom:0}}
            data={filteredData}
            keyExtractor={item => item.key}
            renderItem={({item})=> (
                <ClientsList data={item}/>
              
            )}
          />
        </View>

        {/* <ViewList>
        <TextsLogin style={{marginBottom: 10}}>LISTA DE CLIENTES:</TextsLogin>
          <ListaClientes
          // showsVerticalScrollIndicator={false}
          data={listClients}
          keyExtractor={item=>item.key}
          renderItem={({item})=> (
            loading?(
              <ActivityIndicator size={20} color={"#FFF"} style={{marginBottom:'10%'}}/>
            ) : (
              <ClientsList data={item} />
            )
          )}
          />
        </ViewList> */}
        
      </ContainerListScreen>
    </View>
  );
}
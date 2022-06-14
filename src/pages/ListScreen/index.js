import React, {useState, useEffect, useContext} from "react";
import { Text, TouchableWithoutFeedback, TouchableOpacity, Keyboard, ActivityIndicator,Alert, Image, View, } from "react-native";
import { useNavigation } from "@react-navigation/native";
import firebase from "../../services/firebaseConnection";
import { AuthContext } from "../../contexts/auth";
import IonIcons from  'react-native-vector-icons/Ionicons';

import {SafeArea, SearchListaClientes, ContainerHeader, ContainerListScreen, ListaClientes, TextsLogin, TextInputs, 
  ButtonActListScreen} from '../../styles/styles';
// import MaskInput, { Masks } from 'react-native-mask-input';
import ClientsList from "../../components/ListComponents/ClientsList";
import ClientsListFiltered from "../../components/ListComponents/ClientsListFiltered";

export default function ListPageScreen(props) {  
  const navigation = useNavigation();
  
  const {user,storageUser,loadStoragedUser} = useContext(AuthContext);
  const [search, setSearch] = useState(''); 
  const [filteredData, setFilteredData] = useState([]); 
  const [listClients, setListClients] = useState([]);
  const uid = user && user.uid;
  const [loading, setLoading] = useState(false);

  //CARREGANDO LISTA DE CLIENTES E SALVANDO DADOS EM data
  useEffect(()=> {
    async function loadListClients(){
      setLoading(true);
      // const timer = await new Promise (resolve => setTimeout(resolve, 1000)) 
      // clearTimeout(timer);
      
      firebase.database().ref('clients').child(uid).on('value', (snapshot) => {
        setListClients([]);
        snapshot.forEach((childItem) => {
          let list = {
            key: childItem.key,
            nameClient: childItem.val().nameClient,
            phoneClient: childItem.val().phoneClient,
            purchases: childItem.val().purchases,
            firstPurchase: childItem.val().firstPurchase
          };
          setListClients(oldArray => [...oldArray, list].reverse());
        });
      })
      // await new Promise(resolve=> setTimeout(resolve, 300))
      setLoading(false)
    }
    loadListClients();
    setSearch('')
  },[]);
  
  //FILTRO DE LISTAGEM NOME OU TELEFONE
  const searchFilter = (text) => {
    if(text === ''|| text.length < 3){
      setFilteredData([]);
      setSearch(text);
    }
    if (text.length > 2) {
      const newData = listClients.filter(
        function (item) {
          // console.log(item.nameClient)
          if (item) {
            const nameData = item.nameClient.toUpperCase();
            const phoneData = item.phoneClient.toUpperCase();
            const textData = text.toUpperCase();
            return phoneData.indexOf(textData) > -1 || nameData.indexOf(textData) > -1;

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
  }
  const msgListEmpty=()=>{
    return(
      <View style={{height:60, alignItems:'center', justifyContent:'center', }}>
        <Text style={{fontSize:15, fontFamily:'OxaniumSemiBold'}}>O resultado da sua busca aparecerá aqui</Text>

      </View>
    )
  }
  function setFilteredToEmpty(){
    setFilteredData('')
    setSearch('')
  }
  function handleOrderedFilter(){
    let newList = [...listClients]
    newList.sort((a, b)=> (a.nameClient > b.nameClient ? 1 : b.nameClient > a.nameClient ? -1 : 0))
    setListClients(newList);
  }
  
  return (
    // <ScrollView contentContainerStyle={{flexGrow: 1}} style={{flex:1, backgroundColor:'red'}}>

    <View style={{flex:1,}}>
      <Image source={require('../../Img/BackgroundApp.png')} 
              style={{width:'100%', height:'100%', position:"absolute"}}/>
      <ContainerHeader >
        <Image source={require('../../Img/LogoBlackPNG.png')} 
                style={{width:210, height:60, resizeMode:'contain', alignSelf:'flex-end'}}/>
      </ContainerHeader>
      <View style={{height:3, backgroundColor:'#0D0D0D'}}></View>

      {/* <View style={{width:'100%', height:7, backgroundColor:'#BFB47A'}}> */}
      {/* </View> */}
      <View style={{width:'100%', height:2, backgroundColor:'#FFF'}}>
      </View>
      <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()}>

        <ContainerListScreen>
  
          <View style={{minHeight:150,maxHeight:300, justifyContent:'center', alignItems:'center', width:'100%', 
          marginTop:'5%', marginBottom:'5%'}}>
            <TextsLogin style={{ fontFamily:'OxaniumSemiBold'}}>PESQUISAR CLIENTE:</TextsLogin>
            <View style={{flexDirection:"row", alignItems:'center' }}>
              <TextInputs
              style={{width:'90%'}}
              onChangeText={(text) =>filteredData===['']? setFilteredData([]): searchFilter(text)}
              value={search}
              placeholder="Digite o número ou nome do Cliente" 
              placeholderTextColor="#696969"
              selectionColor={'#696969'}
              />
              <TouchableOpacity style={{marginLeft:-38}} onPress={()=>{
                setFilteredData([])
                setSearch('')
                }}>
                <IonIcons  name="close-outline" size={23} color={'#0D0D0D'}/>
              </TouchableOpacity>
            </View>

            <SearchListaClientes style={{marginBottom:0}}
              data={filteredData}
              keyExtractor={item => item.key}
              ListEmptyComponent={msgListEmpty()}
              renderItem={({item})=> (
                loading?(
                  <ActivityIndicator size={20} color={"#FFF"} style={{marginTop:20,marginBottom:60}}/>
                ):(
                  <ClientsListFiltered zerarLista={setFilteredToEmpty} data={item}/>
                  )
              )}
            />
            
          </View>

          <View style={{width:'100%', borderStyle:'dashed', borderColor:'#AAA', borderWidth:0.5,  borderRadius:1, marginBottom:10, marginTop:10}}>
          </View>

          <View style={{ width:'100%', height:400,marginTop:20
          , borderRadius:10, backgroundColor:'#FFA500', padding:10, paddingRight:15}}>
            <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', padding:6}}>

              <TextsLogin style={{marginLeft:10, fontFamily:'OxaniumBold', color:'#FFF', fontSize:20}} >CLIENTES CADASTRADOS:</TextsLogin>
                  {/* -----------------------BOTÃO ORDEM ALFABÉTICA-------------------- */}
              <TouchableOpacity 
              onPress={handleOrderedFilter}
              style={{ alignItems:'center', justifyContent:'space-between', padding:4}}>
                <IonIcons style={{marginBottom:-6}} name="list-outline" size={30} color={'#FFF'} />
                <TextsLogin style={{fontSize:13, fontFamily:'OxaniumBold', color:'#FFF'}}>ABC</TextsLogin>
              </TouchableOpacity>
            </View>
            {
              user.clients==0
              ?
              <View style={{width:'100%', alignItems:'center', backgroundColor:'red', marginTop:15}}>
                <Text style={{color:'#FFF', fontSize:15, fontWeight:'bold'}}>Você não possui clientes cadastrados</Text>
              </View>
              :
              <ListaClientes style={{marginBottom:0}}
                data={listClients}
                keyExtractor={item => item.key}
                renderItem={({item})=> (
                  loading?(
                    <ActivityIndicator size={20} color={"#FFF"} style={{marginTop:30,marginBottom:35}}/>
                  ):(
                    <ClientsList data={item}/>
                    )
                )}
              />
            }
          </View>        
        </ContainerListScreen>
      </TouchableWithoutFeedback>
    </View>
    // </ScrollView>

  );
}
import React, {useState, useEffect, useContext} from "react";
import { Text, TouchableOpacity, ScrollView, ActivityIndicator,Alert, Image, View, } from "react-native";
import { useNavigation } from "@react-navigation/native";
import firebase from "../../services/firebaseConnection";
import { AuthContext } from "../../contexts/auth";
import { format } from "date-fns";
import IonIcons from  'react-native-vector-icons/Ionicons';

import {SafeArea, SearchListaClientes, ContainerHeaderList, ContainerListScreen, ListaClientes, TextsLogin, TextInputs, 
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
            purchases: childItem.val().purchases
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
  };
  //
  const msgListEmpty=()=>{
    return(
      <View style={{height:60, alignItems:'center', justifyContent:'center'}}>
        <Text style={{fontSize:15}}>O resultado da sua busca aparecerá aqui</Text>

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
    <View style={{flex:1,}}>

      <ContainerHeaderList >
        <Image source={require('../../Img/LogoPNG.png')} 
        style={{width:'60%', height:100, resizeMode:'contain', marginBottom:'-10%', marginLeft:'2%'}}/>
        
        <Image source={require('../../Img/ListClient.png')} 
              style={{width:'20%', height:'60%', resizeMode:'contain', marginRight:'5%', marginBottom:'-8%',}}/>
      </ContainerHeaderList>

      {/* <View style={{width:'100%', height:7, backgroundColor:'#BFB47A'}}> */}
      {/* </View> */}
      <View style={{width:'100%', height:2, backgroundColor:'#FFF'}}>
      </View>

      <ContainerListScreen>

        <View style={{minHeight:150,maxHeight:300, justifyContent:'center', alignItems:'center', width:'100%', 
        marginTop:'5%', marginBottom:'5%'}}>
          <TextsLogin>PESQUISAR CLIENTE:</TextsLogin>
          {/* <ButtonActListScreen onPress={()=>setShowList(showList=>showList==='unShow' ? 'Show' : 'unShow')}>
            <Text>alo</Text>
          </ButtonActListScreen> */}
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

        {/* <View style={{width:'100%', height:0, backgroundColor:'#FFF'}}>
        </View> */}

        <View style={{ width:'100%', height:300,marginTop:20
        , borderRadius:10, backgroundColor:'#223A40'}}>
          <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', padding:6}}>

            <TextsLogin style={{marginLeft:10, fontWeight:'bold'}} >CLIENTES CADASTRADOS:</TextsLogin>

            <TouchableOpacity 
            onPress={handleOrderedFilter}
            style={{ alignItems:'center', justifyContent:'space-between', padding:4}}>
              <IonIcons style={{marginBottom:-6}} name="list-outline" size={30} color={'#FFF'} />
              <TextsLogin style={{fontSize:13}}>Abc</TextsLogin>
            </TouchableOpacity>
          </View>
          
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
        </View>

        {/* <ViewList>
          <TextsLogin style={{marginBottom: 10}}>EDITAR CLIENTES:</TextsLogin>

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
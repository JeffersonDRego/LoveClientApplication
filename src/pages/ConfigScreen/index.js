import React, {useState, useContext, useEffect} from "react";
import { Alert, View, ActivityIndicator, Image } from "react-native";
import firebase from "../../services/firebaseConnection";
import { AuthContext } from "../../contexts/auth";
import {SafeArea, ViewList, ContainerHeaderList, ContainerConfigs, ListaClientes, TextsLogin, TextInputs, ButtonAct} from '../../styles/styles';
import ClientsList from "../../components/ClientsList";

export default function Configs() {
const {user,storageUser,loadStoragedUser} = useContext(AuthContext);
const [search, setSearch] = useState(null);
const [listClients, setListClients] = useState([]);
const uid = user && user.uid;

const [loading, setLoading] = useState(false);
useEffect(()=> {
  
  // loadListClients()
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
  
  //DELETANDO CLIENTE
  function handleDeleteClient(data){
    Alert.alert(
      'CERTEZA QUE QUER DELETAR CLIENTE?',
      `Nome: ${data.nameClient}  Telefone: ${data.phoneClient}`,
      [
        {
          text:'Cancelar',
          style: 'cancel'
        },
        {
          text:'Confirmar',
          onPress: ()=> handleDeleteClientSuccess(data)
        }
      ]
    )
  }
  async function handleDeleteClientSuccess(data){
    await firebase.database().ref('clients').child(uid).child(data.key).remove()
    let usuario = firebase.database().ref('users').child(uid);
    await usuario.once('value').then((snapshot)=>{
      let numClients = parseFloat(snapshot.val().clients);
      numClients -= parseFloat(1)
      usuario.child('clients').set(numClients);
    }).then((snapshot)=>{
      let data = {
          uid: uid,
          name: user.name,
          email: user.email,
          clients: user.clients - 1,
      }
      storageUser(data);
      alert('CLIENTE EXLUÍDO');
      loadStoragedUser();
      
    })
  }

  //EDITANDO CLIENTE
  function handleEdit(data){
    if(data.purchases == 5){
      return(
        Alert.alert(
          'O Cliente deve ter resgatado seu bônus...',
          `A nova quantidade de carimbos para ${data.nameClient} será 0.`,
          [
            {
              text:'CANCELAR',
              style: 'cancel'
            },
            {
              text:'CONFIRMAR',
              onPress: ()=> handleEditPurchaseToZero(data)
            }
          ]
        )
      )
    }else{
      handleEditPurchaseClient(data)
    }
  }
  async function handleEditPurchaseToZero(data){
    await firebase.database().ref('clients').child(uid).child(data.key).update({
      purchases: 0
    })
  }
  async function handleEditPurchaseClient(data){
    await firebase.database().ref('clients').child(uid).child(data.key).update({
      purchases: data.purchases + 1
    })
  }
  
  return (
    <SafeArea>
      <ContainerHeaderList >
        <Image source={require('../../Img/LogoPNG.png')} 
              style={{width:'60%', height:100, resizeMode:'contain', marginLeft:'10%'}}/>
        
        <Image source={require('../../Img/ListClient.png')} 
              style={{width:'20%', height:'60%', resizeMode:'contain', marginRight:'5%', marginBottom:'4%',}}/>
      </ContainerHeaderList>

      <View style={{width:'100%', height:7, backgroundColor:'#BFB47A'}}>
      </View>
      <View style={{width:'100%', height:2, backgroundColor:'#FFF'}}>
      </View>

      <ContainerConfigs>

        {/* <TextsTitleLogin style={{marginBottom: 10}}>Lista de Clientes:</TextsTitleLogin> */}
        <TextsLogin>PESQUISAR CLIENTE:</TextsLogin>
        <TextInputs
        onChangeText={text=>setSearch(text)}
        value={search}
        placeholder="Digite o número ou nome do Cliente" 
        />
        {/* {
          loading?(
            <ActivityIndicator size={20} color={"#FFF"}/>
          ) : (
          )
        } */}
            <ButtonAct onPress={loadListClients}>
              <TextsLogin>CARREGAR LISTA</TextsLogin>
            </ButtonAct>

        <ViewList>
          <ListaClientes
          // showsVerticalScrollIndicator={false}
          data={listClients}
          keyExtractor={item=>item.key}
          renderItem={({item})=> (
            loading?(
              <ActivityIndicator size={20} color={"#FFF"} style={{marginBottom:'10%'}}/>
            ) : (
              <ClientsList data={item} deleteItem={handleDeleteClient} editItem={handleEdit} 
              editPurchaseToZero={handleEditPurchaseToZero}/>
            )
          )}
          />
        </ViewList>
        
      </ContainerConfigs>
    </SafeArea>
  );
}

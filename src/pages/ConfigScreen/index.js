import React, {useState, useContext, useEffect} from "react";
import { Alert, View, ActivityIndicator } from "react-native";
import firebase from "../../services/firebaseConnection";
import { AuthContext } from "../../contexts/auth";
import {ContainerHeader, ContainerConfigs, ListaClientes, TextsTitleLogin} from '../../styles/styles';
import ClientsList from "../../components/ClientsList";

export default function Configs() {
const {user,storageUser,loadStoragedUser} = useContext(AuthContext);

const [listClients, setListClients] = useState([]);
const uid = user && user.uid;

const [loading, setLoading] = useState(false);
useEffect(()=> {
  
  async function loadListClients(){
    //WATCHING NAME VALUE FROM REALTIME DATABASE
    // await database().ref('users').child(uid).on('name', (snapshot)=>{
    //   setName(snapshot.val().name);
    // })
    setLoading(true);
    await firebase.database().ref('clients').child(uid).on('value', (snapshot) => {
      setListClients([]);
      snapshot.forEach((childItem) => {
        let list = {
          key: childItem.key,
          nameClient: childItem.val().nameClient,
          phoneClient: childItem.val().phoneClient,
          purchases:childItem.val().purchases
        };
        setListClients(oldArray => [...oldArray, list]);
      });
    })
    // await new Promise(resolve=> setTimeout(resolve, 100))
    setLoading(false)
  }
  loadListClients()
  },[]);

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
    // .then(async()=>{
    //   let numClients = parseFloat(snapshot.val().clients);
      
    // })
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

  return (
    <ContainerConfigs>
      <TextsTitleLogin style={{marginBottom: 10}}>Lista de Clientes:</TextsTitleLogin>
      <View style={{marginBottom:50, height:'60%', width:'100%', justifyContent:'center'}}>

        <ListaClientes
        // showsVerticalScrollIndicator={false}
        data={listClients}
        keyExtractor={item=>item.key}
        renderItem={({item})=> (
          loading?(
            <ActivityIndicator size={20} color={"#FFF"} style={{marginBottom:'10%'}}/>
          ) : (
            <ClientsList data={item} deleteItem={handleDeleteClient}/>
          )
        )}
        />
      </View>
      
    </ContainerConfigs>
  );
}

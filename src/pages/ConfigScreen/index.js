import React, {useState, useContext, useEffect} from "react";
import firebase from "../../services/firebaseConnection";
import { AuthContext } from "../../contexts/auth";
import {ContainerConfigs, ListaClientes, TextsTitleLogin} from '../../styles/styles';
import { Text, View } from "react-native";

import ClientsList from "../../components/ClientsList";

export default function Configs() {
const {user} = useContext(AuthContext);

const [listClients, setListClients] = useState([]);
const uid = user && user.uid;

useEffect(()=> {
  async function loadListClients(){
    //WATCHING NAME VALUE FROM REALTIME DATABASE
    // await database().ref('users').child(uid).on('name', (snapshot)=>{
    //   setName(snapshot.val().name);
    // })

    await firebase.database().ref('clients').child(uid).on('value', (snapshot) => {
      setListClients([]);
      snapshot.forEach((childItem) => {
        let list = {
          key: childItem.key,
          name: childItem.val().nameClient,
          phone: childItem.val().phoneClient,
          purchases:childItem.val().purchases
        };
        setListClients(oldArray => [...oldArray, list]);
      });
    })
  }
  loadListClients()
},[])

  return (
    <ContainerConfigs>
      <TextsTitleLogin style={{marginTop:100, marginBottom: 10}}>Lista de Clientes:</TextsTitleLogin>
      
      <ListaClientes
      // showsVerticalScrollIndicator={false}
      data={listClients}
      keyExtractor={item=>item.key}
      renderItem={({item})=> (<ClientsList data={item}/>)}
      />
      <Text style={{marginBottom:100}}>{user && user.uid + "  " + user.name +"  " + user.email}</Text>
      
    </ContainerConfigs>
  );
}

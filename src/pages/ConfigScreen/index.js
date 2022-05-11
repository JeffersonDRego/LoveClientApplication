import React, {useState, useContext, useEffect} from "react";
import { Text, View, ActivityIndicator } from "react-native";
import firebase from "../../services/firebaseConnection";
import { AuthContext } from "../../contexts/auth";
import {ContainerHeader, ContainerConfigs, ListaClientes, TextsTitleLogin} from '../../styles/styles';
import ClientsList from "../../components/ClientsList";

export default function Configs() {
const {user} = useContext(AuthContext);

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
          name: childItem.val().nameClient,
          phone: childItem.val().phoneClient,
          purchases:childItem.val().purchases
        };
        setListClients(oldArray => [...oldArray, list]);
      });
    })
    await new Promise(resolve=> setTimeout(resolve, 500))
    setLoading(false)
  }
  loadListClients()
  },[])
  // if(loading){
  //       return(
  //         <View>
  //           <ActivityIndicator size={'large'} color='red'/>
  //         </View>
  //       )
  //   }
  return (
    <ContainerConfigs>
      <TextsTitleLogin style={{marginBottom: 10}}>Lista de Clientes:</TextsTitleLogin>
      {/* {
        loading?(
          <ActivityIndicator size={20} color={"#FFF"}/>
        ) : (
          <Text>LISTA CARREGADA</Text>
        )
      } */}
      <View style={{marginBottom:50, height:'60%', width:'100%', justifyContent:'center'}}>

        <ListaClientes
        // showsVerticalScrollIndicator={false}
        data={listClients}
        keyExtractor={item=>item.key}
        renderItem={({item})=> (
          loading?(
            <ActivityIndicator size={20} color={"#FFF"} style={{marginBottom:'10%'}}/>
          ) : (
            <ClientsList data={item}/>
          )
        )}
        />
      </View>
      {/* <Text style={{marginBottom:100}}>{user && user.uid + "  " + user.name +"  " + user.email}</Text> */}
      
    </ContainerConfigs>
  );
}

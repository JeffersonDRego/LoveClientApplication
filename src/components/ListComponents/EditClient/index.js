import React, {useContext, useState} from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ButtonAct, SafeArea, ContainerEditScreen, TextsLogin, IconView } from '../../../styles/styles';
import firebase from "../../../services/firebaseConnection";
import { AuthContext } from "../../../contexts/auth";
import IonIcons from 'react-native-vector-icons/Ionicons';

export default function EditClient({route}) {
  const {user,storageUser,loadStoragedUser} = useContext(AuthContext);
  const [loading,setLoading] = useState(false);
  const navigation = useNavigation();
  const uid = user && user.uid;
  
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
          onPress: ()=> {
            handleDeleteClientSuccess(data);
            navigation.navigate('ListPageScreen');
          }
        }
      ]
    )
  }
  async function handleDeleteClientSuccess(data){
    setLoading(true)
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
      setLoading(false)
    })
  }
  return (
    <SafeArea>
      <ContainerEditScreen>
        <ButtonAct onPress={()=> console.log(route.params.data.key)}>
          <Text>AQUI</Text>
        </ButtonAct>

        <View style={{flexDirection:'row', height:'10%'}}>
          <TextsLogin style={{fontSize:22, fontWeight:'bold'}}>Chave:  </TextsLogin>
          <TextsLogin style={{fontSize:22}}>{route.params?.data.key}</TextsLogin>
        </View>
        <View style={{flexDirection:'row', height:'10%'}}>
          <TextsLogin style={{fontSize:22, fontWeight:'bold'}}>Nome:  </TextsLogin>
          <TextsLogin style={{fontSize:22}}>{route.params?.data.nameClient}</TextsLogin>
        </View>
        <View style={{flexDirection:'row', height:'10%'}}>
          <TextsLogin style={{fontSize:22, fontWeight:'bold'}}>Telefone:  </TextsLogin>
          <TextsLogin style={{fontSize:22}}>{route.params?.data.phoneClient}</TextsLogin>
        </View>
        <View style={{flexDirection:'row', height:'10%'}}>
          <TextsLogin style={{fontSize:22, fontWeight:'bold'}}>Compras:  </TextsLogin>
          <TextsLogin style={{fontSize:22}}>{route.params?.data.purchases}</TextsLogin>
        </View>

        <View style={{flexDirection:'row', height:'20%', width:'100%', justifyContent:'space-between', padding:20,}}>
          <IconView style={{backgroundColor:'red', width:'18%', height:'90%' }}>
            <TouchableOpacity onPress={()=> handleDeleteClient(route.params.data)}>
              {
                loading?(
                  <ActivityIndicator size={50} color={"#FFF"}/>
                ) : (
                  <IonIcons name="trash" size={50} color={'white'}></IonIcons>
                )
              }
            </TouchableOpacity>
          </IconView>
          <IconView style={{backgroundColor:'green', width:'18%', height:'90%'}}>
            <TouchableOpacity onPress={()=> handleDeleteClient(route.params.data)}>
              {
                loading?(
                  <ActivityIndicator size={50} color={"#FFF"}/>
                ) : (
                  <IonIcons name="add-circle" size={50} color={'white'}></IonIcons>
                )
              }
            </TouchableOpacity>
          </IconView>
          <IconView style={{backgroundColor:'red', width:'18%', height:'90%' }}>
            <TouchableOpacity onPress={()=> handleDeleteClient(route.params.data)}>
              {
                loading?(
                  <ActivityIndicator size={50} color={"#FFF"}/>
                ) : (
                  <IonIcons name="trash" size={50} color={'white'}></IonIcons>
                )
              }
            </TouchableOpacity>
          </IconView>
        </View>
      </ContainerEditScreen>
    </SafeArea>
    );
}
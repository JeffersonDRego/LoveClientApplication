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
              style: 'cancel',
            },
            {
              text:'CONFIRMAR',
              onPress: ()=> {handleEditPurchaseToZero(data);
              navigation.navigate('ListPageScreen');
              }
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
    navigation.navigate('ListPageScreen')
  }
  async function handleEditPurchaseClient(data){
    await firebase.database().ref('clients').child(uid).child(data.key).update({
      purchases: data.purchases + 1
    })
    navigation.navigate('ListPageScreen')
  }
  
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

        <View style={{flexDirection:'row', height:'10%',alignItems:'center', justifyContent:'center'}}>
          <TextsLogin style={{fontSize:22, fontWeight:'bold'}}>Informações do Cliente:</TextsLogin>
        </View>
        <View style={{paddingLeft:15,flexDirection:'column',width:'100%', height:'4%', backgroundColor:'#404040'}}>
          <TextsLogin style={{fontSize:22}}>{route.params?.data.nameClient}</TextsLogin>
        </View>
        <View style={{flexDirection:'row', alignItems:'center', marginBottom:10, justifyContent:'flex-end', backgroundColor:'#404040'}}>
          <TouchableOpacity style={{flexDirection:'row', alignItems:'center', marginRight:10, marginTop:10}}>
            <TextsLogin style={{fontSize:16, color:'skyblue', marginRight:10,}}>Editar Nome</TextsLogin>
            <IonIcons name="hammer-outline" size={30} color={'skyblue'}></IonIcons>
          </TouchableOpacity>
        </View>

        <View style={{paddingLeft:15,flexDirection:'column',width:'100%', height:'4%', backgroundColor:'#404040'}}>
          <TextsLogin style={{fontSize:22}}>{route.params?.data.phoneClient}</TextsLogin>
        </View>
        <View style={{flexDirection:'row', alignItems:'center', marginBottom:10, justifyContent:'flex-end', backgroundColor:'#404040'}}>
          <TouchableOpacity style={{flexDirection:'row', alignItems:'center', marginRight:10, marginTop:10}}>
            <TextsLogin style={{fontSize:16, color:'skyblue', marginRight:10,}}>Editar Telefone</TextsLogin>
            <IonIcons name="hammer-outline" size={30} color={'skyblue'}></IonIcons>
          </TouchableOpacity>
        </View>

        <View style={{paddingLeft:15,flexDirection:'row',width:'100%', height:'4%', backgroundColor:'#404040'}}>
          {/* <View style={{flexDirection:'row', alignItems:'flex-start',borderWidth:1, borderColor:'red'}}> */}
            <TextsLogin style={{fontSize:22, fontWeight:'bold'}}>Carimbos:    </TextsLogin>
            <TextsLogin style={{fontSize:22}}>{route.params?.data.purchases}</TextsLogin>
          {/* </View> */}
        </View>
        <View style={{flexDirection:'row', alignItems:'center', marginBottom:10, justifyContent:'flex-end', backgroundColor:'#404040'}}>
          <TouchableOpacity onPress={()=> handleEdit(route.params.data)}style={{flexDirection:'row', alignItems:'center', marginRight:10, marginTop:10}}>
           
                <TextsLogin style={{fontSize:16, color:'skyblue', marginRight:10,}}>Adicionar um Carimbo</TextsLogin>
                <IonIcons name="add-circle" size={50} color={'green'}></IonIcons>
              
          </TouchableOpacity>
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
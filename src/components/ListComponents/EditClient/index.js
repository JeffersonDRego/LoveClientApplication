import React, {useContext, useState, useRef} from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, StyleSheet} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ButtonAct, SafeArea, ContainerEditScreen, TextsLogin, IconView } from '../../../styles/styles';
import firebase from "../../../services/firebaseConnection";
import { AuthContext } from "../../../contexts/auth";
import IonIcons from 'react-native-vector-icons/Ionicons';
import MaskInput, {Masks} from 'react-native-mask-input';
import { TextInputs } from '../../../styles/styles';

export default function EditClient({data}) {
  const {user,storageUser,loadStoragedUser} = useContext(AuthContext);
  const [loading,setLoading] = useState(false);
  const navigation = useNavigation();
  const uid = user && user.uid;
  const [infoPurchase, setInfoPurchase] = useState(null);
  const inputInfo = useRef();
  const [type,setType] = useState('NoEdit');
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');

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
              navigation.navigate('ListScreen');
              }
            }
          ]
        )
      )
    }else{
      handleEditPurchaseClient(data);
      navigation.navigate('ListScreen');
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
  
  function TextInputEditName(){
    if(type === 'NoEdit'){
      return
    }
    if(type === 'EditName'){
      return (
        <View style={{flexDirection:'row', width:'100%', marginBottom:5, alignItems:'center', }}>
          <TextInputs
          style={{width:'70%'}}
          onChangeText={text=>setNewName(text)}
          value={newName}
          placeholder="Novo Nome"
          // keyboardType="numeric"
          />
          <ButtonAct style={{width:'23%'}}>
            <Text>ALTERAR</Text>
          </ButtonAct>
        </View>
      )}
  }
  function TextInputEditPhone(){
    if(type === 'NoEdit'){
      return
    }
    if(type === 'EditPhone'){
      return(
        <View style={{flexDirection:'row', width:'100%', marginBottom:5, alignItems:'center', }}>
          <MaskInput
          style={styles.InputPhone}
          value={newPhone}
          inputType="number"
          onChangeText={(text, rawValue)=>setNewPhone(rawValue)}
          keyboardType="numeric"
          mask={Masks.BRL_PHONE}
          />
          <ButtonAct style={{width:'23%'}}>
            <Text>ALTERAR</Text>
          </ButtonAct>
        </View>
        
      )
    }

  }
  return (
      <ContainerEditScreen>
        <ButtonAct onPress={()=> console.log(data.key)}>
          <Text>AQUI</Text>
        </ButtonAct>

        <View style={{flexDirection:'row', height:'10%',alignItems:'center', justifyContent:'center'}}>
          <TextsLogin style={{fontSize:22, fontWeight:'bold'}}>Informações do Cliente:</TextsLogin>
        </View>
        
        <View style={{paddingLeft:15, paddingRight:10,flexDirection:'column',width:'100%', backgroundColor:'#404040', marginBottom:10}}>
          <TextsLogin style={{fontSize:22}}>{data.nameClient}</TextsLogin>
          <TouchableOpacity onPress={()=>setType(type=>type==='NoEdit' ? 'EditName' : 'NoEdit')}
          style={{flexDirection:'row', alignItems:'center', marginRight:10, marginTop:10, alignSelf:'flex-end'}}>
            <TextsLogin style={{fontSize:16, color:'skyblue',marginRight:10}}>EDITAR NOME</TextsLogin>
            <IonIcons name="chatbox-ellipses-outline" size={30} color={'skyblue'}></IonIcons>
          </TouchableOpacity>
          {TextInputEditName()}
        </View>

        <View style={{paddingLeft:15, paddingRight:10 ,flexDirection:'column',width:'100%', backgroundColor:'#404040', marginBottom:10}}>
          <TextsLogin style={{fontSize:22}}>{data.phoneClient}</TextsLogin>
          <TouchableOpacity onPress={()=>setType(type=>type==='NoEdit' ? 'EditPhone' : 'NoEdit')}
          style={{flexDirection:'row', alignItems:'center', marginRight:10, alignSelf:'flex-end'}}>
            <TextsLogin style={{fontSize:16, color:'skyblue',marginRight:10}}>EDITAR TELEFONE</TextsLogin>
            <IonIcons name="call-outline" size={30} color={'skyblue'}></IonIcons>
          </TouchableOpacity>
          {TextInputEditPhone()}
        </View>

        <View style={{paddingLeft:15, paddingRight:10 ,flexDirection:'row', alignItems:'center', justifyContent:'space-between', width:'100%', backgroundColor:'#404040', marginBottom:10}}>
            <TextsLogin style={{fontSize:22, fontWeight:'bold'}}>Carimbos:</TextsLogin>
            <TextsLogin style={{fontSize:22}}>{data.purchases}</TextsLogin>
            <TouchableOpacity onPress={()=>inputInfo.current.focus()} style={{flexDirection:'row', alignItems:'center', marginRight:10, marginTop:10}}>
                  <TextsLogin style={{fontSize:16, color:'skyblue', marginRight:10,}}>ADICIONAR CARIMBO</TextsLogin>
                  <IonIcons name="add-circle" size={35} color={'skyblue'} style={{marginBottom:'2%'}}></IonIcons>
            </TouchableOpacity>
        </View>
        <View style={{width:'100%', flexDirection:'row', justifyContent:'space-around'}}>
          <MaskInput
          style={styles.InputInfoPurchase}
          value={infoPurchase}
          inputType="number"
          onChangeText={(text, rawValue)=>setInfoPurchase(text)}
          keyboardType="numeric"
          mask={Masks.BRL_CURRENCY}
          placeholder={'R$ VALOR DA COMPRA'}
          ref={inputInfo}
          />
          <ButtonAct style={{marginTop:10, width:'35%'}}>
            <TextsLogin style={{fontSize:14}}> Cadastrar Compra</TextsLogin>
          </ButtonAct>
        </View> 

        <View style={{flexDirection:'column', flex:1, width:'100%', justifyContent:'flex-end', paddingBottom:20, paddingRight:10}}>    
          <TouchableOpacity style={{alignSelf:'flex-end' ,flexDirection:'row', alignItems:'center',backgroundColor:'red', width:'42%',
           justifyContent:'center', borderRadius:5, padding:5}}onPress={()=> handleDeleteClient(data)}>
            <TextsLogin style={{marginRight:'5%', color:'#FFFFFF',}}>Excluir Cliente</TextsLogin>
            {
              loading?(
                <ActivityIndicator size={30} color={"#FFF"}/>
              ) : (
                <IonIcons name="trash" size={30} color={'white'}></IonIcons>
              )
            }
          </TouchableOpacity>
        </View>

      </ContainerEditScreen>


    );
}

const styles = StyleSheet.create({
  InputInfoPurchase:{
    width: '55%',
    height: 40,
    backgroundColor:'#DCDCDC',
    borderRadius:5,
    padding:5,
    margin:10,
    fontSize: 17,
  },
  InputPhone:{
    width: '70%',
    height: 40,
    backgroundColor:'#DCDCDC',
    borderRadius:5,
    padding:5,
    margin:10,
    fontSize: 17,
  }
})
import React, {useContext, useState, useRef} from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, StyleSheet, Image} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ButtonAct, SafeArea, ContainerEditScreen, TextsLogin, IconView, ContainerHeaderEditScreen } from '../../styles/styles';
import firebase from "../../services/firebaseConnection";
import { AuthContext } from "../../contexts/auth";
import IonIcons from 'react-native-vector-icons/Ionicons';
import MaskInput, {Masks} from 'react-native-mask-input';
import { TextInputs } from '../../styles/styles';

export default function EditClient({route}) {
  const {user,storageUser,loadStoragedUser} = useContext(AuthContext);
  const [loading,setLoading] = useState(false);
  const navigation = useNavigation();
  const uid = user && user.uid;
  const [infoPurchase, setInfoPurchase] = useState(null);
  const inputInfo = useRef();
  const [type,setType] = useState('NoEdit');
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  //----------------------------------EDITANDO CLIENTE
  //EDITANDO NOME
  async function handleEditNameClient(data){
    await firebase.database().ref('clients').child(uid).child(route.params.data.key).update({
      nameClient: newName
    })
    alert('NOME ALTERADO')
    setNewName('')
    setType('noEdit')
    navigation.navigate('ListPageScreen')

  }
  //EDITANDO TELEFONE
  async function handleEditPhoneClient(data){
    await firebase.database().ref('clients').child(uid).child(route.params.data.key).update({
      phoneClient: newPhone
    })
    alert('TELEFONE ALTERADO')
    setNewPhone('')
    setType('noEdit')
    navigation.navigate('ListPageScreen')
  }
  //VERIFICANDO QTD DE CARIMBOS
  function handleEditPurchase(route){
    if(route.params.data.purchases == user.numTotalCarimbos){
      return(
        Alert.alert(
          'O Cliente deve ter resgatado seu bônus...',
          `A nova quantidade de carimbos para ${route.params.data.nameClient} será 0.`,
          [
            {
              text:'CANCELAR',
              style: 'cancel',
            },
            {
              text:'CONFIRMAR',
              onPress: ()=> {handleEditPurchaseToZero(route);
              navigation.navigate('ListScreen');
              }
            }
          ]
        )
      )
    }else{
      handleEditPurchaseClient(route);
      navigation.navigate('ListScreen');
    }
  }
  //SETANDO CARIMBOS A ZERO
  async function handleEditPurchaseToZero(route){
    await firebase.database().ref('clients').child(uid).child(route.params.data.key).update({
      purchases: 0
    })
    navigation.navigate('ListPageScreen')
  }
  //ADICIONANDO UM CARIMBO 
  async function handleEditPurchaseClient(route){
    await firebase.database().ref('clients').child(uid).child(route.params.data.key).update({
      purchases: route.params.data.purchases + 1
    })
    navigation.navigate('ListPageScreen')
  }
   //DELETANDO CLIENTE
   function handleDeleteClient(route){
    Alert.alert(
      'CERTEZA QUE QUER DELETAR CLIENTE?',
      `Nome: ${route.params.data.nameClient}  Telefone: ${route.params.data.phoneClient}`,
      [
        {
          text:'Cancelar',
          style: 'cancel'
        },
        {
          text:'Confirmar',
          onPress: ()=> {
            handleDeleteClientSuccess(route.params.data);
            navigation.navigate('ListPageScreen');
          }
        }
      ]
    )
  }
  async function handleDeleteClientSuccess(){
    setLoading(true)
    await firebase.database().ref('clients').child(uid).child(route.params.data.key).remove()
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
          numTotalCarimbos:user.numTotalCarimbos,
          validadeCarimbos:user.validadeCarimbos,
          valorMin:user.valorMin,
          configurated:user.configurated
      }
      storageUser(data);
      alert('CLIENTE EXLUÍDO');
      loadStoragedUser();
      setLoading(false)

    })
  }
  //RENDERIZANDO INPUTS DE EDIÇÃO
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
          <ButtonAct onPress={handleEditNameClient} style={{width:'23%'}}>
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
          <ButtonAct onPress={handleEditPhoneClient} style={{width:'23%'}}>
            <Text>ALTERAR</Text>
          </ButtonAct>
        </View> 
      )
    }

  }
  return (
    <View style={{flex:1}}>

      {/* CONTAINER HEADER EDIT SCREEN---------------------------- */}
      <ContainerHeaderEditScreen>
        <Image source={require('../../Img/LogoPNG.png')} 
        style={{width:'60%', resizeMode:'contain', marginBottom:'-10%', marginLeft:'2%'}}/>
        
        {/* <Image source={require('../../Img/ListClient.png')} 
              style={{width:'20%', height:'60%', resizeMode:'contain', marginRight:'5%', marginBottom:'-8%',}}/> */}
        <TouchableOpacity style={{marginTop:50, flexDirection:'row',backgroundColor:'#FFA500', alignItems:'center',alignSelf:'center', margin:10, padding:6, borderRadius:3,elevation:5}} onPress={()=>navigation.navigate('ListScreen')}>
          <Text style={{fontWeight:'bold', color:'#0D0D0D', marginRight:3}}>Voltar</Text>
          <IonIcons name='list-circle-outline' size={26} color={'#0D0D0D'} />
        </TouchableOpacity>
      </ContainerHeaderEditScreen>

      <View style={{width:'100%', height:2, backgroundColor:'#FFF'}}>
      </View>
      
      <ContainerEditScreen>
        {/* <ButtonAct onPress={()=> console.log(route.params.data.key)}>
          <Text>AQUI</Text>
        </ButtonAct> */}

        {/* TITLE------------------------------------------ */}
        <View style={{flexDirection:'row', height:'10%',alignItems:'center', justifyContent:'center', marginBottom:10}}>
          <TextsLogin style={{fontSize:22, fontWeight:'bold'}}>Informações do Cliente:</TextsLogin>
        </View>

        {/* VIEW NAME CLIENT------------------------------------------- */}
        <View style={{padding:2, paddingLeft:15, paddingRight:10,flexDirection:'column',width:'100%', backgroundColor:'#2A696969', borderRadius:5, marginBottom:10}}>
          <TextsLogin style={{fontSize:22,}}>{route.params.data.nameClient}</TextsLogin>
          <TouchableOpacity 
          onPress={()=>setType(type=>type==='NoEdit' ? 'EditName' : 'NoEdit')}
          style={{flexDirection:'row', alignItems:'center', marginRight:10,  alignSelf:'flex-end'}}
          >
            <TextsLogin style={{fontSize:16, color:'skyblue',marginRight:10}}>EDITAR NOME</TextsLogin>
            <IonIcons name="chatbox-ellipses-outline" size={30} color={'skyblue'}></IonIcons>
          </TouchableOpacity>
          {TextInputEditName()}
        </View>

        {/* VIEW PHONE CLIENT ------------------------------------------ */}
        <View style={{padding:2, paddingLeft:15, paddingRight:10,flexDirection:'column',width:'100%', backgroundColor:'#2A696969', marginBottom:10, borderRadius:5,}}>
          <TextsLogin style={{fontSize:22}}>{route.params.data.phoneClient}</TextsLogin>
          <TouchableOpacity 
          onPress={()=>setType(type=>type==='NoEdit' ? 'EditPhone' : 'NoEdit')}
          style={{flexDirection:'row', alignItems:'center', marginRight:10, alignSelf:'flex-end'}}
          >
            <TextsLogin style={{fontSize:16, color:'skyblue',marginRight:10}}>EDITAR TELEFONE</TextsLogin>
            <IonIcons name="call-outline" size={30} color={'skyblue'}></IonIcons>
          </TouchableOpacity>
          {TextInputEditPhone()}
        </View>

        {/* VIEW PURCHASES CLIENT --------------------------------------- */}
        <View style={{padding:2, paddingLeft:15, paddingRight:10,flexDirection:'row', justifyContent:'space-between',width:'100%', borderRadius:5, backgroundColor:'#2A696969', marginBottom:10}}>
            <TextsLogin style={{fontSize:22, fontWeight:'bold'}}>Carimbos:</TextsLogin>
            <TextsLogin style={{fontSize:22, marginLeft:-20}}>{route.params.data.purchases}</TextsLogin>
            <TouchableOpacity 
            onPress={()=>inputInfo.current.focus()} 
            style={{flexDirection:'row', alignItems:'center', marginRight:10, marginTop:10}}
            >
              <TextsLogin style={{fontSize:16, color:'skyblue', marginRight:10,}}>ADICIONAR CARIMBO</TextsLogin>
              <IonIcons name="add-circle" size={35} color={'skyblue'} style={{marginBottom:'2%'}}></IonIcons>
            </TouchableOpacity>
        </View>

        {/* VIEW INPUT VALOR DE COMPRA ----------------------------------------- */}
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
          <ButtonAct 
          onPress={()=>handleEditPurchase(route)}
          style={{marginTop:10, width:'35%'}}>
            <TextsLogin style={{fontSize:14}}> Cadastrar Compra</TextsLogin>
          </ButtonAct>
        </View> 

        {/* VIEW BOTÃO EXCLUIR CLIENTE-------------------------------- */}
        <View style={{alignItems:'flex-end', justifyContent:'flex-end',flex:1,flexDirection:'column', width:'100%', paddingBottom:20, paddingRight:10}}>    
          <TouchableOpacity 
          onPress={()=> handleDeleteClient(route)} 
          style={{flexDirection:'row', alignItems:'center',backgroundColor:'red', width:'42%',
           justifyContent:'center', borderRadius:5, padding:5}}
           >
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
    </View>


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
import React, {useContext, useState, useRef} from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, StyleSheet, Image} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ButtonAct, SafeArea, ContainerEditScreen, TextsLogin, IconView, ContainerHeaderEditScreen, TextInputs } from '../../styles/styles';
import { AuthContext } from "../../contexts/auth";
import IonIcons from 'react-native-vector-icons/Ionicons';
import MaskInput, {Masks} from 'react-native-mask-input';
import firebase from "../../services/firebaseConnection";
import IonIcon from "react-native-vector-icons/Ionicons";
import moment from 'moment';


export default function EditClient({route}) {
  const {user,storageUser,loadStoragedUser} = useContext(AuthContext);
  const [loading,setLoading] = useState(false);
  const navigation = useNavigation();
  const uid = user && user.uid;
  const [infoPurchase, setInfoPurchase] = useState('');
  const infoPur = infoPurchase.slice(0,-2);
  const inputInfo = useRef();
  const [type,setType] = useState('NoEdit');
  const [showConfirmAdminPass, setShowConfirmAdminPass] = useState('no');
  const [confirmAdminPass, setConfirmAdminPass] = useState(null);
  const [showPass, setShowPass] = useState(true);
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
  //VERIFICANDO QTD DE CARIMBOS E VALOR MÍNIMO
  function handleEditPurchase(route){
    if(route.params.data.purchases == user.numTotalCarimbos || route.params.data.purchases > user.numTotalCarimbos){
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
    }
    if(user.valorMin =='sem'){
      handleEditPurchaseClient(route);
      Alert.alert('Sucesso!',`Carimbo cadastrado com sucesso para ${route.params.data.nameClient}. Total de carimbos: ${route.params.data.purchases +1 }`)
      navigation.navigate('ListScreen');
      setInfoPurchase('')
      return;
      }
    if(parseFloat(user.valorMin)>infoPur){
      return alert('Valor de compra abaixo do mínimo de R$' + user.valorMin +',00. Carimbo NÃO cadastrado')
    }
    if(infoPur>=parseFloat(user.valorMin)){
      handleEditPurchaseClient(route)
      Alert.alert('Sucesso!',`Carimbo cadastrado com sucesso para ${route.params.data.nameClient}. Total de carimbos: ${route.params.data.purchases +1 }`)
      navigation.navigate('ListScreen');
      setInfoPurchase('')
      return;
    }
  }
  //SETANDO CARIMBOS A ZERO
  async function handleEditPurchaseToZero(route){
    if(user.valorMin=='sem'){
      await firebase.database().ref('clients').child(uid).child(route.params.data.key).update({
        purchases: 0,
        firstPurchase:'0 compras válidas'
      })
      navigation.navigate('ListPageScreen')
    }else{
      if(infoPurchase<user.valorMin){
        return Alert.alert('ERRO','Valor de compra abaixo do mínimo de R$' + user.valorMin +',00. Carimbo NÃO cadastrado')
      }
      await firebase.database().ref('clients').child(uid).child(route.params.data.key).update({
        purchases: 0,
        firstPurchase:'0 compras válidas'
      })
      navigation.navigate('ListPageScreen')
    }
  }
  //ADICIONANDO UM CARIMBO 
  moment.locale('pt-br')
  var nowDate = moment().format('DD/MM/YYYY');
  var today = nowDate;
  async function handleEditPurchaseClient(route){
    if(route.params.data.purchases===0){
      await firebase.database().ref('clients').child(uid).child(route.params.data.key).update({
        purchases: route.params.data.purchases + 1,
        firstPurchase: today

      })
      navigation.navigate('ListPageScreen')  
    }else{
      await firebase.database().ref('clients').child(uid).child(route.params.data.key).update({
        purchases: route.params.data.purchases + 1
      })
    }
  }
   //DELETANDO CLIENTE
   function showConfirmPassDelete(){
    showConfirmAdminPass=='no'? setShowConfirmAdminPass('yes'):setShowConfirmAdminPass('no')
   }
   function handleDeleteClient(route){
    if(user.adminPass!='noPass'){
      if(user.adminPass!= confirmAdminPass){
        return Alert.alert('ERRO', 'SENHA DE ADMINISTRADOR INCORRETA')
      }
      Alert.alert(
        'CERTEZA QUE DESEJA DELETAR CLIENTE?',
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
    Alert.alert(
      'CERTEZA QUE DESEJA DELETAR CLIENTE?',
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
          configurated:user.configurated,
          adminPass:user.adminPass
      }
      storageUser(data);
      setConfirmAdminPass(null);
      setShowConfirmAdminPass('no');
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
          <Text style={{fontWeight:'bold', color:'#0D0D0D', marginRight:3}}>VOLTAR</Text>
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
        <View style={{padding:10, paddingLeft:15, paddingRight:10,flexDirection:'row',width:'100%', borderRadius:5, backgroundColor:'#2A696969', marginBottom:10}}>
            <TextsLogin style={{fontSize:22, fontWeight:'bold'}}>Carimbos:</TextsLogin>
            <TextsLogin style={{fontSize:22, marginLeft:20}}>{route.params.data.purchases}</TextsLogin>
            {/* <TouchableOpacity 
            onPress={()=>inputInfo.current.focus()} 
            style={{flexDirection:'row', alignItems:'center', marginRight:10, marginTop:10}}
            >
              <TextsLogin style={{fontSize:16, color:'skyblue', marginRight:10,}}>ADICIONAR CARIMBO</TextsLogin>
              <IonIcons name="add-circle" size={35} color={'skyblue'} style={{marginBottom:'2%'}}></IonIcons>
            </TouchableOpacity> */}
        </View>

        {/* VIEW INPUT VALOR DE COMPRA ----------------------------------------- */}
        <View style={{width:'100%', flexDirection:'row', justifyContent:'space-around'}}>
          {
            user.valorMin=='sem'?
            <View style={{width:'65%'}}></View>
            : 
            <MaskInput
            style={styles.InputInfoPurchase}
            value={infoPurchase}
            inputType="number"
            onChangeText={(text, rawValue)=>{setInfoPurchase(rawValue)}}
            keyboardType="numeric"
            mask={Masks.BRL_CURRENCY}
            placeholder={'R$ VALOR DA COMPRA'}
            ref={inputInfo}
            />
          }
          <ButtonAct 
          onPress={()=>{handleEditPurchase(route)}}
          style={{marginTop:10, width:'35%', backgroundColor:'#006400'}}>
               {
                route.params.data.purchases==user.numTotalCarimbos
                ?
                  <TextsLogin style={{fontSize:15, fontWeight:'bold'}}>
                  Zerar Carimbos
                  </TextsLogin>
                :
                  <TextsLogin style={{fontSize:15, fontWeight:'bold'}}>
                    Cadastrar Carimbo
                  </TextsLogin>

               }
          </ButtonAct>
        </View> 

        {/* VIEW BOTÃO EXCLUIR CLIENTE-------------------------------- */}
        <View style={{alignItems:'flex-end', justifyContent:'flex-end',flex:1,flexDirection:'column', width:'100%', paddingBottom:20,}}>
          <TouchableOpacity 
          // onPress={()=> handleDeleteClient(route)}
          onPress={()=>{
            user.adminPass=='noPass'? handleDeleteClient(route) : showConfirmPassDelete()
          }}
          style={{flexDirection:'row', alignItems:'center',backgroundColor:'red', width:160,
           justifyContent:'center', borderRadius:5, padding:5}}
           >
            <Text style={{marginRight:5, color:'#FFFFFF', fontSize:16}}>Excluir Cliente</Text>
            {
              loading?(
                <ActivityIndicator size={30} color={"#FFF"}/>
              ) : (
                <IonIcons name="trash" size={25} color={'white'}></IonIcons>
              )
            }
          </TouchableOpacity>
        </View>
        {
          showConfirmAdminPass=='yes'
          ?
          <View style={{flexDirection:'row', alignItems:'center'}}>
            <TextInputs
            style={{height:35, width:200, marginBottom:0, fontSize:15}}
            onChangeText={text=>setConfirmAdminPass(text.replace(/\s+/g, ''))}
            value={confirmAdminPass}
            placeholder="SENHA ADMINISTRADOR"
            placeholderTextColor="#696969"
            selectionColor={'#696969'}
            secureTextEntry={showPass}
            />
            <TouchableOpacity onPress={()=>{showPass==true ? setShowPass(false):setShowPass(true)}}>
              <IonIcon style={{marginTop:7, marginLeft:0, marginRight:15}}name={showPass==true?'eye-outline':'eye-off-outline'} size={28} color={'#FFF'}/>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={()=> handleDeleteClient(route)}
              style={{backgroundColor:'red', marginTop:8, borderRadius:5, padding:8}}
            >
              <Text style={{color:'#FFF'}}> REMOVER CLIENTE</Text>
            </TouchableOpacity>
          </View>
          :
          <View></View>
        }


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
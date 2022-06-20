import React, {useContext, useState, useRef, useEffect} from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator, StyleSheet, Image, Linking} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {ContainerEditScreen, TextsLogin, ContainerHeader, TextInputs} from '../../styles/styles';
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
  const [showConfirmAdminPassCar, setShowConfirmAdminPassCar] = useState('no');

  const [confirmAdminPass, setConfirmAdminPass] = useState(null);
  const [showPass, setShowPass] = useState(true);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');

  let total =user.numTotalCarimbos
  const tot = parseFloat(total) +1
  let unidade = 100/total
  let uni=unidade.toFixed(1)
  let widthBarraStatus = uni * route.params.data.purchases
  let unidadeConvertido =`${widthBarraStatus.toFixed(2)}%`
  const [numCarimbosBarraStatus, setNumCarimbosBarraStatus]=useState([])
  let i;

  useEffect(()=>{setInfoPurchase('')},[])
  const Nums = () => {
    return [...Array(tot)].map((e, i) => {
      return<Text key={i} style={{fontFamily:'OxaniumMedium', fontSize:15}}>{i}</Text>
    })
  }
  //----------------------------------EDITANDO CLIENTE
  //EDITANDO NOME
  async function handleEditNameClient(){
    await firebase.database().ref('clients').child(uid).child(route.params.data.key).update({
      nameClient: newName
    })
    alert('NOME ALTERADO')
    setNewName('')
    setType('noEdit')
    navigation.navigate('ListPageScreen')

  }
  //EDITANDO TELEFONE
  async function handleEditPhoneClient(){
    if(newPhone.length<11){
      return Alert.alert('ERRO', 'Preencha corretamente.')
    }
    await firebase.database().ref('clients').child(uid).child(route.params.data.key).update({
      phoneClient: newPhone
    })
    alert('TELEFONE ALTERADO')
    setNewPhone('')
    setType('noEdit')
    navigation.navigate('ListScreen')
  }
  //VERIFICANDO QTD DE CARIMBOS E VALOR MÍNIMO
  function handleEditPurchase(){
    if(user.valorMin=='sem'){
      if(route.params.data.purchases>=user.numTotalCarimbos){
        return Alert.alert('ZERAR CARIMBOS?', `${route.params.data.nameClient} deve ter resgatado seu bônus. A nova quantidade de carimbos será 0.`,
        [{text:'CANCELAR', style:'cancel'},{text:'ZERAR CARIMBOS', onPress:()=>{handleEditPurchaseToZero(route)}}]
        )
      }
      else{
        Alert.alert('CADASTRAR CARIMBO?', `Deseja cadastrar um carimbo para ${route.params.data.nameClient}?`,
        [
          {
            text:'CANCELAR',
            style:'cancel',
          },
          {
            text:'CADASTRAR',
            onPress:()=>{handleEditPurchaseClient(route)}
          }
        ]
        )
      }
    }
    if(user.valorMin!=='sem'){
      if(parseFloat(user.valorMin)>infoPur){
          return alert('Valor de compra abaixo do mínimo de R$' + user.valorMin +',00. Carimbo NÃO cadastrado')
        }
        if(infoPur>=parseFloat(user.valorMin) && route.params.data.purchases>=user.numTotalCarimbos){
          return Alert.alert('ZERAR CARIMBOS?', `${route.params.data.nameClient} deve ter resgatado seu bônus. A nova quantidade de carimbos será 0.`,
          [{text:'CANCELAR', style:'cancel'},{text:'ZERAR CARIMBOS', onPress:()=>{handleEditPurchaseToZero(route)}}]
          )
        }
        if(infoPur>=parseFloat(user.valorMin)){
          Alert.alert('CADASTRAR CARIMBO?', `Deseja cadastrar um carimbo para ${route.params.data.nameClient}?`,
          [{text:'CANCELAR', style:'cancel'},{text:'CADASTRAR',onPress:()=>{handleEditPurchaseClient(route)}}]
          )
          // Alert.alert('Sucesso!',`Carimbo cadastrado com sucesso para ${route.params.data.nameClient}. Total de carimbos: ${route.params.data.purchases +1 }`)
          setInfoPurchase('')
          return;
        }
    }
  }
   //ADICIONANDO UM CARIMBO 
   moment.locale('pt-br')
   var nowDate = moment().format('DD/MM/YYYY');
   var today = nowDate;
   async function handleEditPurchaseClient(route){
     if(route.params.data.purchases===0){
       setLoading(true)
       await firebase.database().ref('clients').child(uid).child(route.params.data.key).update({
         purchases: route.params.data.purchases + 1,
         firstPurchase: today
        })
        alert('CARIMBO CADASTRADO COM SUCESSO')
        setLoading(false)
        navigation.navigate('ListScreen')
        if(user.valorMin!=='sem'){
          setInfoPurchase('')
        }
     }else{
       setLoading(true)
       await firebase.database().ref('clients').child(uid).child(route.params.data.key).update({
         purchases: route.params.data.purchases + 1
       })
       alert('CARIMBO CADASTRADO COM SUCESSO')
       setLoading(false)
       navigation.navigate('ListScreen')
       if(user.valorMin!=='sem'){
        setInfoPurchase('')
      }
     }
   }
  //SETANDO CARIMBOS A ZERO
  async function handleEditPurchaseToZero(route){
    setLoading(true)
    await firebase.database().ref('clients').child(uid).child(route.params.data.key).update({
      purchases: 0,
      firstPurchase:'0 compras válidas'
    })
    navigation.navigate('ListScreen')
    setInfoPurchase('')
    setLoading(false)
  }
 
  //REMOVEMDO UM CARIMBO
  function showConfirmRemovePurchase(){
    showConfirmAdminPassCar=='no'? setShowConfirmAdminPassCar('yes'):setShowConfirmAdminPassCar('no')
    setConfirmAdminPass('')
  }
  function handleRemovePurchase(route){
    if(user.adminPass!='noPass'){
      if(user.adminPass!= confirmAdminPass){
        return Alert.alert('ERRO', 'SENHA DE ADMINISTRADOR INCORRETA')
      }
      Alert.alert(
        'CERTEZA QUE DESEJA REMOVER CARIMBO?',
        `Nome: ${route.params.data.nameClient}  Telefone: ${route.params.data.phoneClient} Carimbos: ${route.params.data.purchases}`,
        [
          {
            text:'Cancelar',
            style: 'cancel'
          },
          {
            text:'Confirmar',
            onPress: ()=> {
              handleRemovePurchaseSuccess(route.params.data);
            }
          }
        ]
      )
    }
    Alert.alert(
      'CERTEZA QUE DESEJA REMOVER CARIMBO?',
      `Nome: ${route.params.data.nameClient}  Telefone: ${route.params.data.phoneClient}`,
      [
        {
          text:'Cancelar',
          style: 'cancel'
        },
        {
          text:'Confirmar',
          onPress: ()=> {
            handleRemovePurchaseSuccess(route.params.data);
          }
        }
      ]
    )
  }
  async function handleRemovePurchaseSuccess(){
    setLoading(true)
    if(route.params.data.purchases===0){
      Alert.alert('CLIENTE NÃO POSSUI CARIMBOS',`${route.params.data.nameClient} ainda não possui nenhum carimbo cadastrado`);
      setLoading(false);
      setConfirmAdminPass(null)
      return;
    }else{
      await firebase.database().ref('clients').child(uid).child(route.params.data.key).update({
        purchases: route.params.data.purchases - 1
      })
      setLoading(false)
      navigation.navigate('ListPageScreen');
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
            style: 'cancel' ,
          },
          {
            text:'Confirmar',
            onPress: ()=> {
              setLoading(true)
              handleDeleteClientSuccess(route.params.data);
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
            setLoading(true)
            handleDeleteClientSuccess(route.params.data);
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
    }).then(()=>{
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
      navigation.navigate('ListPageScreen');
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
        <View style={{flexDirection:'row', width:'100%', marginBottom:5, alignItems:'center', justifyContent:'space-around' }}>
          <TextInputs
          style={{width:240}}
          onChangeText={text=>setNewName(text)}
          value={newName}
          placeholder="Novo Nome"
          // keyboardType="numeric"
          />
          <TouchableOpacity 
          style={{width:100, alignItems:'center', borderRadius:5, backgroundColor:'#6495ED', padding:8, elevation:3}}
          onPress={handleEditNameClient} 
          >
            <Text style={{fontFamily:'OxaniumSemiBold', color:'white', fontSize:16}}>Editar</Text>
          </TouchableOpacity>
        </View>
      )}
  }
  function TextInputEditPhone(){
    if(type === 'NoEdit'){
      return
    }
    if(type === 'EditPhone'){
      return(
        <View style={{flexDirection:'row', width:'100%', marginBottom:5, alignItems:'center', justifyContent:'space-around' }}>
          <MaskInput
          style={styles.InputPhone}
          value={newPhone}
          inputType="number"
          onChangeText={(text, rawValue)=>setNewPhone(rawValue)}
          keyboardType="numeric"
          mask={Masks.BRL_PHONE}
          />
          <TouchableOpacity 
          style={{width:100, alignItems:'center', borderRadius:5, backgroundColor:'#6495ED', padding:8, elevation:3}}
          onPress={handleEditPhoneClient} >
            <Text style={{fontFamily:'OxaniumSemiBold', color:'white', fontSize:16}}>Editar</Text>
          </TouchableOpacity>
        </View> 
      )
    }

  }


  const msg = `Olá, ${route.params.data.nameClient} tô passando pra avisar que seu bônus está pronto pra ser resgatado aqui em ${user.name}.`

  let primeiraCompra = route.params.data.firstPurchase;
  let dataAtual = moment().format('DD/MM/YYYY');
  var diff = moment(dataAtual,"DD/MM/YYYY").diff(moment(primeiraCompra,"DD/MM/YYYY"));
  var meses = moment.duration(diff).asMonths();

  return (
    <ScrollView contentContainerStyle={{flexGrow: 1}} style={{flex:1, backgroundColor:'red'}}>
      <View style={{flex:1}}>
        <Image source={require('../../Img/BackgroundApp.png')} 
                style={{width:'100%', height:'100%', position:"absolute"}}/>
        {/* CONTAINER HEADER EDIT SCREEN---------------------------- */}
        <ContainerHeader>
          <Image source={require('../../Img/LogoBlackPNG.png')} 
                style={{width:210, height:60, resizeMode:'contain', alignSelf:'flex-end'}}/>
        </ContainerHeader>
        <View style={{height:3, backgroundColor:'#0D0D0D'}}></View>
        {/* ------------------------BOTÃO VOLTAR----------------------- */}
        <TouchableOpacity style={{alignSelf:'flex-end',width:100, flexDirection:'row', alignItems:'center',justifyContent:'center', padding:6, marginTop:-40}} onPress={()=>navigation.navigate('ListScreen')}>
          <Text style={{fontFamily:'OxaniumSemiBold', color:'#2D2D2D', marginRight:3}}>VOLTAR</Text>
          <IonIcons name='list-circle-outline' size={26} color={'#2D2D2D'} />
        </TouchableOpacity>

        <ContainerEditScreen style={{width:'100%'}}>
          <View style={{width:'100%'}}>
          </View>
          {/* ----------------------------------------TITLE------------------------------------------ */}
          <TextsLogin style={{fontSize:22, fontFamily:'OxaniumBold', fontSize:25, marginTop:20, marginBottom:15,color:'#0D0D0D'}}>Informações do Cliente:</TextsLogin>

          {/* --------------------------------------VIEW NAME CLIENT------------------------------------------- */}
          <View style={{padding:2, paddingLeft:15, paddingRight:10,flexDirection:'column',width:'100%', borderRadius:5}}>
            <Text style={{fontSize:21, fontFamily:'OxaniumSemiBold', alignSelf:'flex-start'}}>{route.params.data.nameClient}</Text>
            <TouchableOpacity 
            onPress={()=>setType(type=>type==='NoEdit' ? 'EditName' : 'NoEdit')}
            style={{flexDirection:'row', alignItems:'center', marginRight:10,  alignSelf:'flex-end'}}
            >
              <Text style={{fontSize:15, color:'#FFA500',marginRight:10, fontFamily:'OxaniumMedium'}}>EDITAR NOME</Text>
              <IonIcons name="chatbox-ellipses-outline" size={25} color={'#FFA500'}></IonIcons>
            </TouchableOpacity>
            {TextInputEditName()}
          </View>
          <View style={{witdh:'100%', borderBottomWidth:0.5}}></View>
          {/* -------------------------------------VIEW PHONE CLIENT ------------------------------------------ */}
          <View style={{padding:2, paddingLeft:15, paddingRight:6,flexDirection:'column',width:'100%', borderRadius:5,}}>
            <Text style={{fontSize:20, fontFamily:'OxaniumSemiBold'}}>
              ({route.params.data.phoneClient.slice(0,2)}) {route.params.data.phoneClient.slice(2,7)}-{route.params.data.phoneClient.slice(7,11)}
            </Text>
            <TouchableOpacity 
            onPress={()=>setType(type=>type==='NoEdit' ? 'EditPhone' : 'NoEdit')}
            style={{flexDirection:'row', alignItems:'center', marginRight:10, alignSelf:'flex-end'}}
            >
              <TextsLogin style={{fontSize:15, color:'#FFA500',marginRight:10, fontFamily:'OxaniumMedium'}}>EDITAR TELEFONE</TextsLogin>
              <IonIcons name="call-outline" size={25} color={'#FFA500'}></IonIcons>
            </TouchableOpacity>
            {TextInputEditPhone()}
          </View>
          <View style={{witdh:'100%', borderBottomWidth:0.5}}></View>

          {/* ------------------------------------VIEW PURCHASES CLIENT --------------------------------------- */}
          <View style={{justifyContent:'space-between', height:60, padding:2, paddingLeft:15, paddingRight:12,flexDirection:'row',width:'100%', borderRadius:5,}}>
              <TextsLogin style={{fontSize:20, fontFamily:'OxaniumSemiBold'}}>Carimbos:</TextsLogin>
              <TextsLogin style={{fontSize:20, marginLeft:-40, fontFamily:'OxaniumMedium'}}>{route.params.data.purchases}</TextsLogin>
              <TouchableOpacity 
                onPress={()=>user.adminPass=='noPass'? handleRemovePurchase(route) : showConfirmRemovePurchase()} 
                style={{flexDirection:'row', alignItems:'center',marginBottom:-20}}
                >
                <TextsLogin style={{fontSize:15, color:'#FFA500', marginRight:10, fontFamily:'OxaniumMedium'}}>REMOVER CARIMBO</TextsLogin>
                <IonIcons name="remove-circle-outline" size={25} color={'#FFA500'}></IonIcons>
              </TouchableOpacity>
          </View>
          <View style={{width:'100%', justifyContent:'center'}}>
            {
              showConfirmAdminPassCar=='yes'
              ?
              <View style={{flexDirection:'row', alignItems:'center', paddingBottom:10}}>
                <TextInputs
                style={{height:35, width:180, marginBottom:0, fontSize:15}}
                onChangeText={text=>setConfirmAdminPass(text.replace(/\s+/g, ''))}
                value={confirmAdminPass}
                placeholder="SENHA ADMIN"
                placeholderTextColor="#696969"
                selectionColor={'#696969'}
                secureTextEntry={showPass}
                />
                <TouchableOpacity style={{marginLeft:-35, marginRight:8, marginTop:8}} onPress={()=>{
                  setConfirmAdminPass('')
                  }}>
                  <IonIcons  name="close-outline" size={23} color={'#0D0D0D'}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{showPass==true ? setShowPass(false):setShowPass(true)}}>
                  <IonIcon style={{marginTop:7, marginLeft:0, marginRight:15}}name={showPass==true?'eye-outline':'eye-off-outline'} size={28} color={'#FFF'}/>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={()=> handleRemovePurchase(route)}
                  style={{backgroundColor:'red', marginTop:8, borderRadius:5, padding:8}}
                >
                  <Text style={{elevation:3, fontSize:15, color:'#FFF', fontFamily:'OxaniumSemiBold'}}>Remover Carimbo</Text>
                </TouchableOpacity>
              </View>
              :
              <View></View>
            }
          </View>
          <View style={{witdh:'100%', borderBottomWidth:0.5}}></View>

          {/* ---------------------------------VIEW INPUT VALOR DE COMPRA ----------------------------------------- */}
          <View style={{width:'100%', flexDirection:'row', justifyContent:'space-around', marginTop:10}}>
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
            <TouchableOpacity
              style={{padding:9, elevation:10,marginTop:10, width:155, backgroundColor:'green', justifyContent:'center', alignItems:'center', borderRadius:5}}
              onPress={()=>{handleEditPurchase(route)}}
            >
                {
                  route.params.data.purchases==user.numTotalCarimbos||route.params.data.purchases>user.numTotalCarimbos
                  ?
                  loading?
                    <ActivityIndicator size={20} color={"#FFF"}/>
                    :
                    <TextsLogin style={{fontSize:15, fontFamily:'OxaniumSemiBold', color:'#FFF'}}>
                    Zerar Carimbos
                    </TextsLogin>
                  :
                  loading?
                    <ActivityIndicator size={20} color={"#FFF"}/>
                    :
                    <TextsLogin style={{fontSize:15, fontFamily:'OxaniumSemiBold', color:'#FFF'}}>
                      Cadastrar Carimbo
                    </TextsLogin>
                }
            </TouchableOpacity>
          </View> 

          {/* -------------------------------------VIEW WARNINGS CLIENTE------------------------------------------- */}
          <View style={{marginTop:35, minHeight:150, backgroundColor:'#fff', borderRadius:5, marginBottom:35, padding:5}}>
            <TouchableOpacity
            style={{flexDirection:'row', justifyContent:'flex-end', width:45, alignSelf:'flex-end', marginBottom:-30, marginRight:10}}
            onPress={() =>
              Linking.canOpenURL("whatsapp://send?text=oi").then(supported => {
                if (supported) {
                  return Linking.openURL(
                    `whatsapp://send?phone=55${data.phoneClient}&text=Olá ${route.params.data.nameClient}`
                    );
                  } else {
                    return Linking.openURL(
                      `https://api.whatsapp.com/send?phone=55${data.phoneClient}&text=Olá ${route.params.data.nameClient}`
                      );
                    }
                  })
                }
                >
              <IonIcons style={{}} name='logo-whatsapp' size={45} color={'green'}/>
            </TouchableOpacity>
            {/* ----------------------------------BARRA STATUS CARIMBOS CLIENTE--------------------------------- */}
            <Text style={{fontSize:22, fontFamily:'OxaniumSemiBold', fontSize:27, margin:5}}>{route.params.data.nameClient}</Text>
            <View style={{flexDirection:'row', width:'100%', justifyContent:'space-between', padding:1,marginVertical:4}}>
            {
              user.numTotalCarimbos?
              <Nums/>
              :<View></View>
            }
             
            </View>
            <View style={{width:'100%', height:20, backgroundColor:'#e2e2e2', marginBottom:15}}>
              <View style={{maxWidth:'100%', width:`${unidadeConvertido}`, height:'100%', backgroundColor:'#FFA500', borderTopRightRadius:5, borderBottomRightRadius:5, padding:1}}>
                {
                  unidadeConvertido?
                  <Text style={{alignSelf:'flex-end', fontFamily:'OxaniumLight', fontSize:13, marginRight:3, color:'#F2F2F2'}}>{unidadeConvertido}</Text>
                  :<View></View>
                }
              </View>
            </View>
            
            {/* ---------------------------------BÔNUS GARANTIDO------------------------------- */}
            {
              route.params.data.purchases>=parseFloat(user.numTotalCarimbos) ?
              <TouchableOpacity style={{padding:3, margin:2}}
              onPress={() =>
                Linking.canOpenURL("whatsapp://send?text=oi").then(supported => {
                  if (supported) {
                    return Linking.openURL(
                      `whatsapp://send?phone=55${route.params.data.phoneClient}&text=${msg}`
                      );
                    } else {
                      return Linking.openURL(
                        `https://api.whatsapp.com/send?phone=55${route.params.data.phoneClient}&text=${msg}`
                        );
                      }
                    })
                  }
                  >
                <Text style={{color:'green', fontSize:18, fontFamily:'OxaniumSemiBold', marginBottom:10,}}>BÔNUS GARANTIDO, ENTRAR EM CONTATO   </Text>
              </TouchableOpacity>
              :<View></View>
            }
            {/* ------------------------FALTA 1 CARTIMBO-------------------------- */}
            {
              route.params.data.purchases==user.numTotalCarimbos-1 ?
              <TouchableOpacity 
                  style={{padding:3, margin:2}}>
                <Text style={{color:'#FFA500', fontSize:17, marginBottom:10, fontFamily:'OxaniumSemiBold'}}>FALTA {user.numTotalCarimbos - route.params.data.purchases} CARIMBO PARA GARANTIR O BÔNUS  </Text>
              </TouchableOpacity>
              :<View></View>
            }
            {/* ----------------------------FORA DE VALIDADE----------------------------- */}
            {
              meses>user.validadeCarimbos ?
              <TouchableOpacity onPress={()=>{handleForadeValidade(route.params.data)}}
                  style={{padding:3, margin:2}}>
                <Text style={{color:'red', fontSize:18, marginBottom:10, fontFamily:'OxaniumSemiBold'}}>FORA DE VALIDADE (Faltando {user.numTotalCarimbos - route.params.data.purchases} carimbo`s`)</Text>
              </TouchableOpacity>
              :<View></View>
            }
            {/* -------------------------------ÚLTIMO MÊS RESTANTE--------------------------------- */}
            {
              meses>user.validadeCarimbos-1 && meses<user.validadeCarimbos?
              <TouchableOpacity 
                  style={{padding:3, margin:2}}>
                <Text style={{color:'#FFA500', fontSize:17, marginBottom:10, fontFamily:'OxaniumSemiBold'}}>ÚLTIMO MÊS RESTANTE (Faltando {user.numTotalCarimbos - route.params.data.purchases} carimbo(s))  </Text>
              </TouchableOpacity>
              :<View></View>
            }
          </View>
          {/* ---------------------------------VIEW BOTÃO EXCLUIR CLIENTE-------------------------------- */}

          <TouchableOpacity 
          style={{flexDirection:'row', alignItems:'center',backgroundColor:'red', width:160,
          justifyContent:'center', borderRadius:5, padding:5, alignSelf:'flex-end'}}
          onPress={()=>{
            user.adminPass=='noPass'? handleDeleteClient(route) : showConfirmPassDelete()
          }}
          >
            <Text style={{elevation:3, marginRight:5, color:'#FFF', fontSize:15, fontFamily:'OxaniumSemiBold'}}>Excluir Cliente</Text>
            {
              loading?(
                <ActivityIndicator size={30} color={"#FFF"}/>
              ) : (
                <IonIcons name="trash" size={25} color={'white'}></IonIcons>
              )
            }
          </TouchableOpacity>
          {
            showConfirmAdminPass=='yes'
            ?
            <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-around'}}>
              <TextInputs
              style={{height:35, width:200, marginBottom:0, fontSize:15}}
              onChangeText={text=>setConfirmAdminPass(text.replace(/\s+/g, ''))}
              value={confirmAdminPass}
              placeholder="SENHA ADMIN"
              placeholderTextColor="#696969"
              selectionColor={'#696969'}
              secureTextEntry={showPass}
              />
              <TouchableOpacity style={{marginLeft:-35, marginRight:8, marginTop:8}} 
              onPress={()=>{
                setConfirmAdminPass('')
                }}>
                <IonIcons  name="close-outline" size={23} color={'#0D0D0D'}/>
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>{showPass==true ? setShowPass(false):setShowPass(true)}}>
                <IonIcon style={{marginTop:7, marginLeft:0, marginRight:15}}name={showPass==true?'eye-outline':'eye-off-outline'} size={28} color={'#FFF'}/>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={()=> handleDeleteClient(route)}
                style={{backgroundColor:'red', marginTop:8, borderRadius:5, padding:9}}
              >
                <Text style={{color:'#FFF', fontFamily:'OxaniumSemiBold'}}>Remover Cliente</Text>
              </TouchableOpacity>
            </View>
            :
            <View></View>
          }
        </ContainerEditScreen>
      </View>
    </ScrollView>
    );
}

const styles = StyleSheet.create({
  InputInfoPurchase:{
    width: 200,
    height: 40,
    borderBottomWidth:0.5,
    padding:5,
    margin:10,
    fontSize: 17,
  },
  InputPhone:{
    width: 200,
    height: 40,
    fontFamily:'OxaniumLight',
    borderBottomWidth:0.5,
    padding:5,
    margin:10,
    fontSize: 17,
  }
})
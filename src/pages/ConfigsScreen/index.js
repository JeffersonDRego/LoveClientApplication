import React, {useState, useContext} from "react";
import {ScrollView,KeyboardAvoidingView,TouchableWithoutFeedback, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Image, View, Keyboard, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import firebase from "../../services/firebaseConnection";
import { AuthContext } from "../../contexts/auth";
import IonIcon from "react-native-vector-icons/Ionicons";
import {ContainerHeader, ContainerConfigsScreen, TextsLogin, TextInputs} from '../../styles/styles';
import MaskInput, { Masks } from 'react-native-mask-input';

export default function ConfigsPageScreen() {
  const navigation = useNavigation();
  
  const {user, storageUser, loadStoragedUser, Logout } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const uid = user && user.uid;

  //ADMIN PASS
  const [showAdminPass, setShowAdminPass] = useState('no');
  const [showAdminPassNewConfigs, setShowAdminPassNewConfigs] = useState('no');

  const [showPass, setShowPass] = useState(true);
  const [adminPass, setAdminPass] = useState(null);
  const [confirmAdminPass, setConfirmAdminPass] = useState(null)
  
  //CRITERION CONSTS
  const [criterionByNum, setCriterionByNum]= useState(null);
  const [criterionByVal, setCriterionByVal]= useState(null);

  //CRITERION BY NUM CONSTS
  const [numTotalCarimbos, setNumTotalCarimbos] = useState(null);
  const [validadeCarimbos, setValidadeCarimbos] = useState('semValidade');
  const [valorMin, setValorMin] = useState('semVa');
  const valorMinimo = valorMin.slice(0,-2);
  //LOGOUT
  function handleLogout(){

    Alert.alert(
      'DESEJA SAIR DA SUA CONTA?',
      `Será necessário novo Login para acessar o App novamente`,
      [
        {
          text:'VOLTAR AO APP',
          style: 'cancel'
        },
        {
          text:'SAIR',
          onPress: ()=> Logout()
        }
      ]
    )
  }
  //DEFININDO BÔNUS POR NÚMERO DE COMPRAS OU VALOR
  function handleSetCriterionByNum(){
    if(criterionByNum===null){
      setCriterionByNum('CriterionByNum')
      setCriterionByVal(null)
      setNumTotalCarimbos(null)
      setValidadeCarimbos('semValidade')
      setValorMin('semVa')
    }else{
      setCriterionByNum(null)
    }
  }
  function handleSetCriterionByVal(){
    if(criterionByVal===null){
      setCriterionByVal('CriterionByVal')
      setCriterionByNum(null)
      setNumTotalCarimbos(null)
      setValidadeCarimbos('semValidade')
      setValorMin('semVa')
    }else{
      setCriterionByVal(null)
    }
  }
  //SALVANDO NO BANCO DE DADOS E NO ASYNCSTORAGE
  async function handleForm(){
    
    if(numTotalCarimbos == null || numTotalCarimbos == ''){
      return alert('Preencha corretamente o campo de Quantidade de carimbos')
    }
    if(validadeCarimbos == null ){
      return alert('Preencha corretamente o campo de Validade de carimbos')
    }
    if(valorMin.length <= 2 || valorMin == isNaN ){
      return alert('O campo de valor mínimo está incorreto. (Mínimo 3 digitos). Ex.:R$ 1,00')
    }
    setLoading(true)
    await new Promise(resolve=> setTimeout(resolve, 1000))
    await firebase.database().ref('users').child(uid).set({
      name: user.name,
      clients: user.clients,
      numTotalCarimbos:numTotalCarimbos,
      validadeCarimbos:validadeCarimbos,
      valorMin:valorMinimo,
      adminPass:user.adminPass,
      configurated:'configurated'
    })
    .then(()=>{
      let data = {
        uid: uid,
        name: user.name,
        email: user.email,
        clients: user.clients,
        numTotalCarimbos:numTotalCarimbos,
        validadeCarimbos:validadeCarimbos,
        valorMin:valorMinimo,
        adminPass:user.adminPass,
        configurated:'configurated'
      }
      storageUser(data)
      loadStoragedUser()
    })
    setLoading(false)
  }
  //RENDERIZAÇÃO POR NÚMERO DE COMPRAS 
  function ByNumConfig(){
    return(
      <View style={{width:'100%'}}>
        <View>
          <TextsLogin style={{fontFamily:'OxaniumBold'}}>A CADA QUANTOS CARIMBOS O CLIENTE DEVE RESGATAR SUA BONIFICAÇÃO?</TextsLogin>
        </View>
        <View style={{flexDirection:'row', alignItems:'center'}}>
          <TextInputs
          style={{width:80, height:35, fontFamily:'OxaniumLight'}}
          onChangeText={text=>setNumTotalCarimbos(text)}
          value={numTotalCarimbos}
          placeholder="Ex:10"
          placeholderTextColor="#696969"
          selectionColor={'#696969'}
          keyboardType='numeric'
          />
          <TextsLogin style={{fontSize:17, fontFamily:'OxaniumLight'}}>Carimbos</TextsLogin>
        </View>
        {/* ---------------VALIDADE CARIMBOS------------------------- */}
        <View style={{width:'100%', borderStyle:'dashed', borderColor:'#AAA', borderWidth:1,  borderRadius:1, marginBottom:10}}>
        </View>
        <View>
          <TextsLogin style={{fontWeight:'bold'}}>OS CARIMBOS TÊM PRAZO DE VALIDADE?</TextsLogin>
        </View>
        <View style={{flexDirection:'row', alignItems:'center',}}>
          <TextInputs
          style={validadeCarimbos==='semValidade'? {width:80,height:35, fontSize:10,color:'#F2F2F2'}:{width:80,fontFamily:'OxaniumLight', color:'#0D0D0D'}}
          onChangeText={text=>setValidadeCarimbos(text)}
          value={validadeCarimbos}
          placeholder="Ex:3"
          placeholderTextColor="#696969"
          selectionColor={'#696969'}
          keyboardType='numeric'
          onFocus={()=>setValidadeCarimbos(null)}
          />
          <Text style={{color:'#0D0D0D', fontSize:17}}>MESES</Text>

          <TouchableOpacity 
          onPress={()=>{
            Keyboard.dismiss();
            setValidadeCarimbos(validadeCarimbos=>validadeCarimbos===null||isNaN ? 'semValidade' : null)}} 
            style={{flexDirection:'row', alignItems:"center", marginLeft:10}}>
            <View style={{margin:10, width:25, height:25,backgroundColor:validadeCarimbos==='semValidade'?'#FFA500':'#AAA', 
            borderRadius:25, borderWidth:5, borderColor:'#F2F2F2'}}>
            </View>
            <Text style={{color:validadeCarimbos==='semValidade'?'#FFA500':'#AAA', fontSize:17, fontFamily:'OxaniumLight'}}>SEM VALIDADE</Text>
          </TouchableOpacity>
        </View>
          <TouchableOpacity 
          onPress={()=>{handleForm()}}
          style={{elevation:5, flexDirection:'row',backgroundColor:'#FFA500', alignItems:'center',alignSelf:'center', marginTop:30, padding:10, borderRadius:3}}>
            <Text style={{fontFamily:'OxaniumSemiBold', marginRight:8}}>SALVAR CONFIGURAÇÕES</Text>
            {
            loading?(
              <ActivityIndicator size={20} color={"#FFF"}/>
            )
            :
              <IonIcon name='cloud-upload-outline' size={25} color={'#0D0D0D'}/>
            }
          </TouchableOpacity>
        {/* </View> */}
      </View>
    )
  }
  //RENDERIZAÇÃO POR VALOR DE COMPRAS
  function ByValConfig(){
    return(
      <View style={{width:'100%'}}>
        <View>
          <TextsLogin style={{fontFamily:'OxaniumBold'}}>A CADA QUANTOS CARIMBOS O CLIENTE DEVE RESGATAR SUA BONIFICAÇÃO?</TextsLogin>
        </View>
        <View style={{flexDirection:'row', alignItems:'center'}}>
          <TextInputs
          style={{width:80, height:35, fontFamily:'OxaniumLight'}}
          onChangeText={text=>setNumTotalCarimbos(text)}
          value={numTotalCarimbos}
          placeholder="Ex:10"
          placeholderTextColor="#696969"
          selectionColor={'#696969'}
          keyboardType='numeric'
          />
          <TextsLogin style={{fontSize:17, fontFamily:'OxaniumLight'}}>Carimbos</TextsLogin>
        </View>
        {/* ---------------VALIDADE CARIMBOS------------------------- */}
        <View style={{width:'100%', borderStyle:'dashed', borderColor:'#AAA', borderWidth:1,  borderRadius:1, marginBottom:10}}>
        </View>
        <View>
          <TextsLogin style={{fontFamily:'OxaniumBold'}}>OS CARIMBOS TÊM PRAZO DE VALIDADE?</TextsLogin>
        </View>
        <View style={{flexDirection:'row', alignItems:'center',}}>
          <TextInputs
          style={validadeCarimbos==='semValidade'? {width:80,height:35, fontSize:10,color:'#F2F2F2'}:{width:80,fontFamily:'OxaniumLight', color:'#0D0D0D'}}
          onChangeText={text=>setValidadeCarimbos(text)}
          value={validadeCarimbos}
          placeholder="Ex:3"
          placeholderTextColor="#696969"
          selectionColor={'#696969'}
          keyboardType='numeric'
          onFocus={()=>setValidadeCarimbos(null)}
          />
          <Text style={{color:'#0D0D0D', fontSize:17}}>MESES</Text>

          <TouchableOpacity 
          onPress={()=>{
            Keyboard.dismiss();
            setValidadeCarimbos(validadeCarimbos=>validadeCarimbos===null||isNaN ? 'semValidade' : null)}} 
            style={{flexDirection:'row', alignItems:"center", marginLeft:10}}>
            <View style={{margin:10, width:25, height:25,backgroundColor:validadeCarimbos==='semValidade'?'#FFA500':'#AAA', 
            borderRadius:25, borderWidth:5, borderColor:'#F2F2F2'}}>
            </View>
            <Text style={{color:validadeCarimbos==='semValidade'?'#FFA500':'#AAA', fontSize:17, fontFamily:'OxaniumLight'}}>SEM VALIDADE</Text>
          </TouchableOpacity>
        </View>
        {/* ------------------VALOR DE COMPRA MÍNIMO------------------------- */}
        <View style={{width:'100%', borderStyle:'dashed', borderColor:'#AAA', borderWidth:1,  borderRadius:1, marginBottom:10}}>
        </View>
        <View>
          <TextsLogin style={{fontFamily:'OxaniumBold'}}>QUAL O VALOR DE COMPRA MÍNIMO PARA GERAR UM CARIMBO?</TextsLogin>
        </View>
        <View style={{flexDirection:'row', alignItems:'center'}}>
        <MaskInput
          style={styles.InputInfoPurchase}
          value={valorMin}
          inputType="number"
          onChangeText={(text, rawValue)=>setValorMin(rawValue)}
          keyboardType="numeric"
          mask={Masks.BRL_CURRENCY}
          placeholderTextColor="#696969"
          selectionColor={'#696969'}
          placeholder={'Ex: R$ 50,00'}
          // ref={inputInfo}
          />
          {/* <TextsLogin>MESES</TextsLogin> */}
        </View>
        
        <TouchableOpacity 
        onPress={()=>{handleForm()}}
        style={{elevation:5, flexDirection:'row',backgroundColor:'#FFA500', alignItems:'center',alignSelf:'center', margin:10, padding:10, borderRadius:3}}>
          <Text style={{fontFamily:'OxaniumSemiBold', marginRight:8}}>Salvar Configurações</Text>
          {
            loading?(
              <ActivityIndicator size={20} color={"#FFF"}/>
            )
            :
          <IonIcon name='cloud-upload-outline' size={25} color={'#0D0D0D'}/>
          }
        </TouchableOpacity>
      </View>
    )
  }
  //CHAMANDO NOVAS CONFIGS
  async function setNoConfigurated(){
    if(user.adminPass!=='noPass'){
      return handleShowAdminPassInputNewConfigs()
    }
    // setConfigurated('noConfigurated')
    setLoading(true)
    await new Promise(resolve=> setTimeout(resolve, 1000))
    await firebase.database().ref('users').child(uid).update({
      configurated:'noConfigurated'
    })
    .then(()=>{
      let data = {
          uid: uid,
          name: user.name,
          email: user.email,
          clients: user.clients,
          numTotalCarimbos:numTotalCarimbos,
          validadeCarimbos:validadeCarimbos,
          adminPass: user.adminPass,
          valorMin:valorMin,
          configurated:'noConfigurated'
      }
      // setUser(data)
      storageUser(data)
      loadStoragedUser()
      setLoading(false)
    })
  }
  async function setNoConfiguratedWithAdminPass(){
    if(user.adminPass!==confirmAdminPass){
      return Alert.alert('SENHA INCORRETA', 'Tente novamente.')
    }
    // setConfigurated('noConfigurated')
    setLoading(true)
    await new Promise(resolve=> setTimeout(resolve, 1000))
    await firebase.database().ref('users').child(uid).update({
      configurated:'noConfigurated'
    })
    .then(()=>{
      let data = {
          uid: uid,
          name: user.name,
          email: user.email,
          clients: user.clients,
          numTotalCarimbos:numTotalCarimbos,
          validadeCarimbos:validadeCarimbos,
          adminPass: user.adminPass,
          valorMin:valorMin,
          configurated:'noConfigurated'
      }
      setConfirmAdminPass('')
      setShowAdminPassNewConfigs('no')
      storageUser(data)
      loadStoragedUser()
      setLoading(false)
    })
  }
  //SET ADMIN PASS ON DATABASE
  async function setAdminPassOnDB(){
    if(adminPass==null || adminPass==''|| adminPass=='noPass'||adminPass!=confirmAdminPass){
      return Alert.alert('ERRO', 'Nova senha inválida, tente novamente')
    }
    if(adminPass==confirmAdminPass){
      setLoading(true)
    await new Promise(resolve=> setTimeout(resolve, 1000))
    await firebase.database().ref('users').child(uid).update({
      adminPass:adminPass
    })
    .then(()=>{
      let data = {
          uid: uid,
          name: user.name,
          email: user.email,
          clients: user.clients,
          numTotalCarimbos:user.numTotalCarimbos,
          validadeCarimbos:user.validadeCarimbos,
          valorMin:user.valorMin,
          adminPass:adminPass,
          configurated:user.configurated
      }
      Keyboard.dismiss()
      setAdminPass('')
      setConfirmAdminPass('')
      setShowAdminPass('no')
      storageUser(data)
      loadStoragedUser()
      setLoading(false)
    })
    }
  }
  //REMOVE ADMIN PASS FROM DB
  async function removeAdminPassOnDB(){
    if(confirmAdminPass!=user.adminPass){
      return Alert.alert('ERRO', 'SENHA DE ADMINISTRADOR INCORRETA')
    }
    await firebase.database().ref('users').child(uid).update({
      adminPass:'noPass'
    })
    .then(()=>{
      let data = {
          uid: uid,
          name: user.name,
          email: user.email,
          clients: user.clients,
          numTotalCarimbos:user.numTotalCarimbos,
          validadeCarimbos:user.validadeCarimbos,
          valorMin:user.valorMin,
          adminPass:'noPass',
          configurated:user.configurated
      }
      Keyboard.dismiss()
      setAdminPass('')
      setConfirmAdminPass('')
      setShowAdminPass('no')
      storageUser(data)
      loadStoragedUser()
      setLoading(false)
    })
  }
  //HANDLE SHOW INPUT ADMIN PASS'S
  function handleShowAdminPassInput(){
    setShowAdminPassNewConfigs('no')
    showAdminPass=='no'? setShowAdminPass('yes'):setShowAdminPass('no')
  }
  function handleShowAdminPassInputNewConfigs(){
    setShowAdminPass('no')
    showAdminPassNewConfigs=='no'? setShowAdminPassNewConfigs('yes'):setShowAdminPassNewConfigs('no')
  }
  //ADMIN PASS COMPONENT
  function adminPassInput(){
    return(
      <View style={{width:'100%', marginBottom:80}}>
        <Text style={{color:'#FFA500' ,textAlign:'center'}}>A senha de administrador serve para controlar os serviços de exclusão de clientes e carimbos</Text>
        <View style={{flexDirection:'row', alignItems:'center'}}>
          <TextInputs
          style={{height:35, marginBottom:0, fontSize:15}}
          onChangeText={text=>setAdminPass(text.replace(/\s+/g, ''))}
          value={adminPass}
          placeholder="NOVA SENHA DE ADMINISTRADOR"
          placeholderTextColor="#696969"
          selectionColor={'#696969'}
          secureTextEntry={showPass}
          />
          <TouchableOpacity onPress={()=>{showPass==true ? setShowPass(false):setShowPass(true)}}>
            <IonIcon style={{marginTop:7, marginLeft:10}}name={showPass==true?'eye-outline':'eye-off-outline'} size={30} color={'#0D0D0D'}/>
          </TouchableOpacity>
        </View>
        <View style={{flexDirection:'row', alignItems:'center'}}>
          <TextInputs
          style={{height:35, marginBottom:0, fontSize:15}}
          onChangeText={text=>setConfirmAdminPass(text.replace(/\s+/g, ''))}
          value={confirmAdminPass}
          placeholder="CONFIRME A SENHA DE ADMINISTRADOR"
          placeholderTextColor="#696969"
          selectionColor={'#696969'}
          secureTextEntry={showPass}
          />
          <TouchableOpacity onPress={()=>{showPass==true ? setShowPass(false):setShowPass(true)}}>
            <IonIcon style={{marginTop:7, marginLeft:10}}name={showPass==true?'eye-outline':'eye-off-outline'} size={30} color={'#0D0D0D'}/>
          </TouchableOpacity>
        </View>
        {/* ----------------------------BOTÃO SALVAR ADMIN PASS-------------------------------- */}
        <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-around', }}>
          <TouchableOpacity 
            onPress={()=>{setAdminPassOnDB()}}
            style={{flexDirection:'row',backgroundColor:'green', alignItems:'center',
            alignSelf:'center', padding:10, height:45, borderRadius:3, marginTop:15}}>
            <Text style={{fontFamily:'OxaniumSemiBold', marginRight:8, color:'#FFF'}}>Salvar Senha</Text>
            {
              loading?(
                <ActivityIndicator size={20} color={"#FFF"}/>
              )
              :
                <IonIcon name='cloud-upload-outline' size={25} color={'#FFF'}/>
            }
          </TouchableOpacity>
          {
            user.adminPass=='noPass'|| user.adminPass==null
            ?
            <View style={{marginRight:-200}}></View>
            :
            <TouchableOpacity 
              onPress={()=>{removeAdminPassOnDB()}}
              style={{flexDirection:'row',backgroundColor:'red', alignItems:'center',
              alignSelf:'center', padding:10, height:45, borderRadius:3, marginTop:15}}>
              <Text style={{fontFamily:'OxaniumSemiBold', marginRight:5, color:'#FFF'}}>Remover Senha</Text>
              {
                loading?(
                  <ActivityIndicator size={20} color={"#FFF"}/>
                )
                :
                  <IonIcon name='trash-outline' size={25} color={'#FFF'}/>
              }
            </TouchableOpacity>
          }
          
        </View>

      </View>
    )
  }
  function adminPassInputNewConfigs(){
    return(
      <View style={{width:'100%', marginBottom:40}}>
        <View style={{flexDirection:'row', alignItems:'center'}}>
          <TextInputs
          style={{height:35, marginBottom:0, fontSize:15}}
          onChangeText={text=>setConfirmAdminPass(text.replace(/\s+/g, ''))}
          value={confirmAdminPass}
          placeholder="CONFIRME A SENHA DE ADMINISTRADOR"
          placeholderTextColor="#696969"
          selectionColor={'#696969'}
          secureTextEntry={showPass}
          />
          <TouchableOpacity onPress={()=>{showPass==true ? setShowPass(false):setShowPass(true)}}>
            <IonIcon style={{marginTop:7, marginLeft:10}}name={showPass==true?'eye-outline':'eye-off-outline'} size={30} color={'#0D0D0D'}/>
          </TouchableOpacity>
        </View>
        {/* ----------------------------BOTÃO CONFIRM SET NO CONFIGURATED-------------------------------- */}
        <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-around', }}>
          <TouchableOpacity 
            onPress={()=>{setNoConfiguratedWithAdminPass()}}
            style={{flexDirection:'row',backgroundColor:'green', alignItems:'center',
            alignSelf:'center', padding:10, height:45, borderRadius:3, marginTop:15}}>
            <Text style={{fontFamily:'OxaniumSemiBold', marginRight:8, color:'#FFF', fontSize:16}}>Confirmar</Text>
            {
              loading?(
                <ActivityIndicator size={20} color={"#FFF"}/>
              )
              :
                <IonIcon name='cloud-upload-outline' size={25} color={'#FFF'}/>
            }
          </TouchableOpacity>
          
        </View>

      </View>
    )
  }
  
  if(user.configurated==='configurated'){
    return(
      <TouchableWithoutFeedback onPress={()=>{Keyboard.dismiss()}}>
        <KeyboardAvoidingView style={{height:'100%', backgroundColor:'#FFF'}} contentContainerStyle={{flexGrow:1}} behavior="position" enabled>
          <View style={{height:'100%'}}>
            <Image source={require('../../Img/BackgroundApp.png')} 
                style={{width:'100%', height:'100%', position:"absolute"}}/>
            <ContainerHeader>
              <Image source={require('../../Img/LogoBlackPNG.png')} 
              style={{width:210, height:60, resizeMode:'contain', alignSelf:'flex-end'}}/>
            </ContainerHeader>
            <View style={{height:3, backgroundColor:'#0D0D0D'}}></View>
            {/* ---------------------------BOTÃO SAIR------------------------------ */}
            <TouchableOpacity onPress={()=>{handleLogout()}}
            style={{elevation:5, alignSelf:'flex-end', marginTop:-30, marginRight:7, paddingHorizontal:8,paddingVertical:3,borderRadius:5, backgroundColor:'red'}}>
              <Text style={{fontFamily:'OxaniumSemiBold', color:'#FFF', fontSize:12}}>SAIR</Text>
            </TouchableOpacity>

            <ContainerConfigsScreen style={{ width:'100%',flex:1, paddingTop:showAdminPass=='no'?70:30}}>
              <View  style={{width:'100%', justifyContent:'center', alignItems:'center'}}>
                <TextsLogin style={{textAlign:'center', fontFamily:'OxaniumBold', fontSize:18}}>Você já configurou suas preferências, deseja configurar novamente?</TextsLogin>
              </View>
              {/* --------------------------BOTÃO NOVAS CONFIGS---------------------- */}
              <TouchableOpacity 
                onPress={setNoConfigurated}
                style={{elevation:5,flexDirection:'row',backgroundColor:'#FFA500', alignItems:'center',alignSelf:'center', marginTop:15,margin:10, padding:10, borderRadius:3}}>
                <Text style={{fontFamily:'OxaniumSemiBold', marginRight:8, fontSize:16 }}>Novas Configurações</Text>
                {
                  loading?(
                    <ActivityIndicator size={20} color={"#FFF"}/>
                  )
                  :
                    <IonIcon name='cloud-upload-outline' size={25} color={'#0D0D0D'}/>
                }
              </TouchableOpacity>
              
              {showAdminPassNewConfigs=='no'?<View></View>:adminPassInputNewConfigs()}
              
              {/* -------------------VIEWS SHOW CONFIGS-------------------- */}
              <View style={{backgroundColor:'#E2E2E2', borderRadius:5, padding:10, marginTop:20}}>
                <View style={{flexDirection:'row', marginBottom:10, marginTop:10, justifyContent:'center'}}>
                  <Text style={{color:'#0D0D0D', fontFamily:'OxaniumBold', fontSize:18, textAlign:'center'}}>MINHAS CONFIGURAÇÕES:</Text>
                </View>
                <View style={{width:'100%', borderStyle:'dashed', borderColor:'#0D0D0D', borderWidth:1,  borderRadius:1, marginBottom:10}}>
                </View>
                <View style={{flexDirection:'row', marginBottom:10}}>
                  <Text style={{color:'#0D0D0D', fontFamily:'OxaniumBold', fontSize:16}}>QUANTIDADE DE CARIMBOS: </Text>
                  <Text style={{color:'#0D0D0D', fontSize:16, fontFamily:'OxaniumLight'}}>  {user.numTotalCarimbos} </Text>

                </View>

                <View style={{flexDirection:'column',marginBottom:10, width:'100%',}}>          
                  <Text style={{color:'#0D0D0D', fontFamily:'OxaniumBold', fontSize:16}}>VALIDADE DOS CARIMBOS: </Text>
                  {
                  user.validadeCarimbos === 'semValidade'
                  ?
                  <Text style={{color:'#0D0D0D', fontSize:16, fontFamily:'OxaniumLight'}}>SEM VALIDADE</Text>
                  :
                  <Text style={{color:'#0D0D0D', fontSize:15.5, fontFamily:'OxaniumLight'}}>{user.validadeCarimbos} MESES (a contar a partir do primeiro carimbo adicionado)</Text>
                  }
                </View>
                <View style={{flexDirection:'row', marginBottom:10}}>          
                  <Text style={{color:'#0D0D0D', fontFamily:'OxaniumBold', fontSize:16}}>VALOR MÍNIMO DE COMPRA: </Text>
                  {
                  user.valorMin === 'sem'
                  ?
                  <Text style={{color:'#0D0D0D', fontSize:15.5, fontFamily:'OxaniumLight'}}>SEM VALOR MÍNIMO</Text>
                  :
                  <Text style={{color:'#0D0D0D', fontSize:15.5, fontFamily:'OxaniumLight'}}>R$ {user.valorMin},00</Text>
                  }
                </View>
                <View style={{flexDirection:'row', marginBottom:10}}>          
                  <Text style={{color:'#0D0D0D', fontFamily:'OxaniumBold', fontSize:16}}>SENHA DE ADMINISTRADOR: </Text>
                  {
                  user.adminPass === 'noPass'
                  ?
                  <Text style={{color:'#0D0D0D', fontSize:15.5, fontFamily:'OxaniumLight'}}>NÃO DEFINIDA {user.adminPass}</Text>
                  :
                  <Text style={{color:'#0D0D0D', fontSize:15.5, fontFamily:'OxaniumLight',}}>JÁ DEFINIDA {user.adminPass}</Text>
                  }
                </View>
              </View>
              {/* ------------------DEFININDO ADMIN PASS------------------- */}
              <View style={{marginTop:30, alignItems:'center'}}>
                <TouchableOpacity 
                  onPress={handleShowAdminPassInput}
                  style={{elevation:5 ,flexDirection:'row',backgroundColor:'#FFA500', alignItems:'center',alignSelf:'center', marginTop:15,margin:10, padding:10, borderRadius:3}}>
                    {
                      user.adminPass!='noPass'
                      ?
                      <Text style={{fontFamily:'OxaniumSemiBold', marginRight:8}}>NOVA SENHA DE ADMINISTRADOR</Text>
                      :
                      <Text style={{fontFamily:'OxaniumSemiBold', marginRight:8}}>DEFINIR SENHA DE ADMINISTRADOR</Text>
                    }
                  <IonIcon name='key-outline' size={25} color={'#0D0D0D'}/>
                </TouchableOpacity>
                {showAdminPass=='no'?<View></View>:adminPassInput()}
              </View>
            </ContainerConfigsScreen>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
  )
  }else{
    return (
      <ScrollView contentContainerStyle={{flexGrow: 1}} style={{flex:1, backgroundColor:'#F2F2F2'}}>
        <Image source={require('../../Img/BackgroundApp.png')} 
              style={{width:'100%', height:'100%', position:"absolute"}}/>
    
        <ContainerHeader>
          <Image source={require('../../Img/LogoBlackPNG.png')} 
          style={{width:210, height:60, resizeMode:'contain', alignSelf:'flex-end'}}/>
        </ContainerHeader>
        <View style={{height:3, backgroundColor:'#0D0D0D'}}></View>

        <ContainerConfigsScreen>
          <View>
            <TextsLogin style={{fontFamily:'OxaniumBold'}}>QUAL VAI SER O CRITÉRIO PARA ADIÇÃO DE CARIMBOS AO CLIENTE?</TextsLogin>
          </View>
          <View style={{backgroundColor:criterionByNum===null?'#FFF':'#FFA500', padding:5, marginTop:10, borderRadius:5}}>
            <TouchableOpacity onPress={handleSetCriterionByNum} style={{ alignItems:'center', flexDirection:'row'}} >
              <View style={{marginRight:10, width:25, height:25,backgroundColor:criterionByNum===null?'#AAA':'#FFA500', 
              borderRadius:25, borderWidth:5, borderColor:'#F2F2F2'}}>
              </View>
              <TextsLogin style={{color:criterionByNum===null?'#AAA':'#FFF', fontFamily:'OxaniumMedium'}}>POR QUANTIDADE DE COMPRAS</TextsLogin>
            </TouchableOpacity>
            <TextsLogin style={{marginTop:5,fontSize:14, fontFamily:'OxaniumLight',color:criterionByNum===null?'#AAA':'#FFF'}}>(O carimbo será adicionado ao cliente sem verificação de valores)</TextsLogin>
          </View>
          <View style={{backgroundColor:criterionByVal===null?'#FFF':'#FFA500', padding:5, marginTop:5, borderRadius:5}}>
            <TouchableOpacity onPress={handleSetCriterionByVal} style={{ alignItems:'center', flexDirection:'row'}} >
              <View style={{marginRight:10, width:25, height:25,backgroundColor:criterionByVal===null?'#AAA':'#FFA500', 
              borderRadius:25, borderWidth:5, borderColor:'#F2F2F2'}}>
              </View>
              <TextsLogin style={{color:criterionByVal===null?'#AAA':'#FFF'}}>POR VALOR DE COMPRA</TextsLogin>
            </TouchableOpacity>
            <TextsLogin style={{marginTop:5,fontSize:14, fontFamily:'OxaniumLight',color:criterionByVal===null?'#AAA':'#FFF'}}>(O carimbo só será adiconado se o valor de compra for igual ou maior ao valor mínimo informado)</TextsLogin>
          </View>

          <View style={{height:1, backgroundColor:"#0D0D0D", marginTop:15, marginBottom:15}}>
          </View>
          {
            criterionByNum==='CriterionByNum'? ByNumConfig():<View></View>
          }
          {
            criterionByVal==='CriterionByVal'? ByValConfig():<View></View>
          }
          {/* <TouchableOpacity 
            onPress={()=>{console.log(validadeCarimbos)}}>
            <TextsLogin>ASOSAOKSAOKOSAK</TextsLogin>
          </TouchableOpacity> */}
        </ContainerConfigsScreen>
      </ScrollView>
    );
    
  }
  
}
const styles = StyleSheet.create({
  InputInfoPurchase:{
    width: 150,
    // height: 35,
    // backgroundColor:'#DCDCDC',
    // borderRadius:5,
    borderBottomWidth:0.5,
    padding:5,
    margin:10,
    fontSize: 17,
    fontFamily:'OxaniumLight'
  }
})
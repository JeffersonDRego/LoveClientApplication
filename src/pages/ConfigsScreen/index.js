import React, {useState, useEffect, useContext} from "react";
import {ScrollView, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Image, View, Keyboard, KeyboardAvoidingView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import firebase from "../../services/firebaseConnection";
import { AuthContext } from "../../contexts/auth";
import { format } from "date-fns";
import IonIcon from "react-native-vector-icons/Ionicons";
import {SafeArea, ContainerHeaderConfigs, ContainerConfigsScreen, ButtonAct, TextsLogin, TextInputsLogin} from '../../styles/styles';
import MaskInput, { Masks } from 'react-native-mask-input';

export default function ConfigsPageScreen() {
  const navigation = useNavigation();
  
  const {user, setUser, storageUser, loadStoragedUser } = useContext(AuthContext);
  // const [configurated, setConfigurated] = useState('configurated');
  const [loading, setLoading] = useState(false);

  const uid = user && user.uid;

  const [criterionByNum, setCriterionByNum]= useState(null);
  const [criterionByVal, setCriterionByVal]= useState(null);

  //CRITERION BY NUM CONSTS
  const [numTotalCarimbos, setNumTotalCarimbos] = useState(null);
  const [validadeCarimbos, setValidadeCarimbos] = useState('semValidade');

  //CRITERION BY VAL CONSTS
  const[valorMin, setValorMin] = useState('semValorMinimo');
  

  //DEFININDO BÔNUS POR NÚMERO DE COMPRAS OU VALOR
  function handleSetCriterionByNum(){
    if(criterionByNum===null){
      setCriterionByNum('CriterionByNum')
      setCriterionByVal(null)
      setNumTotalCarimbos(null)
      setValidadeCarimbos('semValidade')
      setValorMin('semValorMinimo')
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
      setValorMin('semValorMinimo')
    }else{
      setCriterionByVal(null)
    }
  }
  //RENDERIZAÇÃO POR NÚMERO DE COMPRAS 
  function ByNumConfig(){
    return(
      <View style={{width:'100%'}}>
        <View>
          <TextsLogin style={{fontWeight:'bold'}}>A CADA QUANTOS CARIMBOS O CLIENTE DEVE RESGATAR SUA BONIFICAÇÃO?</TextsLogin>
        </View>
        <View style={{flexDirection:'row', alignItems:'center'}}>
          <TextInputsLogin
          style={{width:80}}
          onChangeText={text=>setNumTotalCarimbos(text)}
          value={numTotalCarimbos}
          placeholder="Ex:10"
          placeholderTextColor="#696969"
          selectionColor={'#696969'}
          keyboardType='numeric'
          />
          <TextsLogin>CARIMBOS</TextsLogin>
        </View>
        <View>
          <TextsLogin style={{fontWeight:'bold'}}>OS CARIMBOS TÊM PRAZO DE VALIDADE?</TextsLogin>
        </View>
        <View style={{flexDirection:'row', alignItems:'center'}}>
          <TextInputsLogin
          style={validadeCarimbos==='semValidade'? {width:80, fontSize:10,color:'#F2F2F2'}:{width:80, fontSize:15,color:'#0D0D0D'}}
          onChangeText={text=>setValidadeCarimbos(text)}
          value={validadeCarimbos}
          placeholder="Ex:3"
          placeholderTextColor="#696969"
          selectionColor={'#696969'}
          keyboardType='numeric'
          onFocus={()=>setValidadeCarimbos(null)}
          />
          <Text style={{color:'#FFF', fontSize:15}}>MESES</Text>

          <TouchableOpacity 
          onPress={()=>{
            Keyboard.dismiss();
            setValidadeCarimbos(validadeCarimbos=>validadeCarimbos===null||isNaN ? 'semValidade' : null)}} 
          style={{flexDirection:'row', alignItems:"center"}}>
            <View style={{margin:10, width:28, height:28,backgroundColor:validadeCarimbos==='semValidade'?'#FFA500':'#FFF', 
            borderRadius:25, borderWidth:5, borderColor:'#F2F2F2'}}>
            </View>
            <Text style={{color:validadeCarimbos==='semValidade'?'#FFA500':'#FFF', fontSize:15}}>SEM VALIDADE</Text>
          </TouchableOpacity>
        </View>
        {/* <TouchableOpacity onPress={()=>setValidadeCarimbos(type=>type===null ? 'SemValidade' : null)}
        style={{ alignItems:'center', flexDirection:'row'}} >
          <View style={{margin:10, width:28, height:28,backgroundColor:validadeCarimbos===null?'#FFF':'#FFA500', 
          borderRadius:25, borderWidth:5, borderColor:'#F2F2F2'}}>
          </View>
          <TextsLogin style={{color:validadeCarimbos===null?'#FFF':'#FFA500'}}>SEM VALIDADE</TextsLogin>
        </TouchableOpacity> */}
        {/* <View style={{justifyContent:"center", alignItems:'center', width:'100%', height:60,backgroundColor:'red'}}> */}
          <TouchableOpacity 
          onPress={handleForm}
          style={{flexDirection:'row',backgroundColor:'#FFA500', alignItems:'center',alignSelf:'center', margin:10, padding:10, borderRadius:3}}>
            <Text style={{fontWeight:'bold', marginRight:8}}>Salvar Configurações</Text>
            <IonIcon name='cloud-upload-outline' size={25} color={'#0D0D0D'}/>
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
          <TextsLogin style={{fontWeight:'bold'}}>A CADA QUANTOS CARIMBOS O CLIENTE DEVE RESGATAR SUA BONIFICAÇÃO?</TextsLogin>
        </View>
        <View style={{flexDirection:'row', alignItems:'center'}}>
          <TextInputsLogin
          style={{width:80}}
          onChangeText={text=>setNumTotalCarimbos(text)}
          value={numTotalCarimbos}
          placeholder="Ex:10"
          placeholderTextColor="#696969"
          selectionColor={'#696969'}
          keyboardType='numeric'
          />
          <TextsLogin>CARIMBOS</TextsLogin>
        </View>
        
        <View>
          <TextsLogin style={{fontWeight:'bold'}}>OS CARIMBOS TÊM PRAZO DE VALIDADE?</TextsLogin>
        </View>
        <View style={{flexDirection:'row', alignItems:'center'}}>
          <TextInputsLogin
          style={validadeCarimbos==='semValidade'? {width:80, fontSize:10,color:'#F2F2F2'}:{width:80, fontSize:15,color:'#0D0D0D'}}
          onChangeText={text=>setValidadeCarimbos(text)}
          value={validadeCarimbos}
          placeholder="Ex:3"
          placeholderTextColor="#696969"
          selectionColor={'#696969'}
          keyboardType='numeric'
          onFocus={()=>setValidadeCarimbos(null)}
          />
          <Text style={{color:'#FFF', fontSize:15}}>MESES</Text>

          <TouchableOpacity 
          onPress={()=>{
            Keyboard.dismiss();
            setValidadeCarimbos(validadeCarimbos=>validadeCarimbos===null||isNaN ? 'semValidade' : null)}} 
          style={{flexDirection:'row', alignItems:"center"}}>
            <View style={{margin:10, width:28, height:28,backgroundColor:validadeCarimbos==='semValidade'?'#FFA500':'#FFF', 
            borderRadius:25, borderWidth:5, borderColor:'#F2F2F2'}}>
            </View>
            <Text style={{color:validadeCarimbos==='semValidade'?'#FFA500':'#FFF', fontSize:15}}>SEM VALIDADE</Text>
          </TouchableOpacity>
        </View>
        {/* <TouchableOpacity onPress={()=>setValidadeCarimbos(type=>type===null ? 'SemValidade' : null)}
        style={{ alignItems:'center', flexDirection:'row'}} >
          <View style={{margin:10, width:28, height:28,backgroundColor:validadeCarimbos===null?'#FFF':'#FFA500', 
          borderRadius:25, borderWidth:5, borderColor:'#F2F2F2'}}>
          </View>
          <TextsLogin style={{color:validadeCarimbos===null?'#FFF':'#FFA500'}}>SEM VALIDADE</TextsLogin>
        </TouchableOpacity> */}
        <View>
          <TextsLogin style={{fontWeight:'bold'}}>QUAL O VALOR DE COMPRA MÍNIMO PARA GERAR UM CARIMBO?</TextsLogin>
        </View>
        <View style={{flexDirection:'row', alignItems:'center'}}>
        <MaskInput
          style={styles.InputInfoPurchase}
          value={valorMin}
          inputType="number"
          onChangeText={(text, rawValue)=>setValorMin(text)}
          keyboardType="numeric"
          mask={Masks.BRL_CURRENCY}
          placeholderTextColor="#696969"
          selectionColor={'#696969'}
          placeholder={'VALOR MÍNIMO'}
          // ref={inputInfo}
          />
          {/* <TextsLogin>MESES</TextsLogin> */}
        </View>
        
        <TouchableOpacity 
        onPress={handleForm}
        style={{flexDirection:'row',backgroundColor:'#FFA500', alignItems:'center',alignSelf:'center', margin:10, padding:10, borderRadius:3}}>
          <Text style={{fontWeight:'bold', marginRight:8}}>Salvar Configurações</Text>
          <IonIcon name='cloud-upload-outline' size={25} color={'#0D0D0D'}/>
        </TouchableOpacity>
        <View><Text>OLA</Text></View>
      </View>
    )
  }
  //SALVANDO NO BANCO DE DADOS E NO ASYNCSTORAGE
  async function handleForm(){
    setLoading(true)
    // setConfigurated('configurated')
    await firebase.database().ref('users').child(uid).set({
      name: user.name,
      clients: user.clients,
      numTotalCarimbos:numTotalCarimbos,
      validadeCarimbos:validadeCarimbos,
      valorMin:valorMin,
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
          valorMin:valorMin,
          configurated:'configurated'
      }
      storageUser(data)
      loadStoragedUser()
      setLoading(false)
  })
  }

  async function setNoConfigurated(){
    // setConfigurated('noConfigurated')
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
          valorMin:valorMin,
          configurated:'noConfigurated'
      }
      // setUser(data)
      storageUser(data)
      loadStoragedUser()
      setLoading(false)
  })
  }
  
  if(user.configurated==='configurated'){
    return(
        <ScrollView style={{flex:1, backgroundColor:'#112426'}}>
      <View style={{flex:1}}>

        <ContainerHeaderConfigs >
        <Image source={require('../../Img/LogoPNG.png')} 
              style={{width:'60%', height:100, resizeMode:'contain', marginBottom:'-10%', marginLeft:'2%'}}/>
        <IonIcon name="settings-outline" size={50} color={'#FFF'}/>
          {/* <Image source={require('../../Img/ListClient.png')} 
                style={{width:'20%', height:'60%', resizeMode:'contain', marginRight:'5%', marginBottom:'-8%',}}/> */}
        </ContainerHeaderConfigs>

        <View style={{width:'100%', height:2, backgroundColor:'#FFF'}}>
        </View>

        <ContainerConfigsScreen style={{ height:500, width:'100%',flex:1, justifyContent:'center'}}>
          <View  style={{width:'100%', justifyContent:'center', alignItems:'center'}}>
            <TextsLogin style={{textAlign:'center', fontWeight:'bold'}}>VOCÊ JÁ CONFIGUROU SUAS PREFERÊNCIAS. DESEJA CONFIGURAR NOVAMENTE?</TextsLogin>
          </View>

          <TouchableOpacity 
            onPress={setNoConfigurated}
            style={{flexDirection:'row',backgroundColor:'#FFA500', alignItems:'center',alignSelf:'center', marginTop:15,margin:10, padding:10, borderRadius:3}}>
            <Text style={{fontWeight:'bold', marginRight:8}}>NOVAS CONFIGURAÇÕES</Text>
            <IonIcon name='cloud-upload-outline' size={25} color={'#0D0D0D'}/>
          </TouchableOpacity>
          {/* VIEWS SHOW CONFIGS--------------------------------- */}
          <View style={{flexDirection:'row', marginBottom:10, marginTop:20}}>
            <Text style={{color:'#FFF', fontWeight:'bold', fontSize:18}}>MINHAS CONFIGURAÇÕES:</Text>
          </View>
          <View style={{flexDirection:'row', marginBottom:10}}>
            <Text style={{color:'#FFF', fontWeight:'bold'}}>QUANTIDADE DE CARIMBOS: </Text>
            <Text style={{color:'#FFF',}}>{user.numTotalCarimbos} </Text>

          </View>

          <View style={{flexDirection:'row',marginBottom:10}}>          
            <Text style={{color:'#FFF', fontWeight:'bold'}}>VALIDADE DOS CARIMBOS: </Text>
            {
            user.validadeCarimbos === 'semValidade'
            ?
            <Text style={{color:'#FFF',}}>SEM VALIDADE</Text>
            :
            <Text style={{color:'#FFF',}}>{user.validadeCarimbos} MESES (cada)</Text>
            }
          </View>
          <View style={{flexDirection:'row', marginBottom:10}}>          
            <Text style={{color:'#FFF', fontWeight:'bold'}}>VALOR MÍNIMO DE COMPRA: </Text>
            {
            user.valorMin === 'semValorMinimo'
            ?
            <Text style={{color:'#FFF',}}>SEM VALOR MÍNIMO</Text>
            :
            <Text style={{color:'#FFF',}}>{user.valorMin}</Text>
            }
          </View>
          
        </ContainerConfigsScreen>
      </View>
    </ScrollView>
  )
  }else{
    return (
      <ScrollView style={{flex:1, backgroundColor:'#112426'}}>
        <View style={{flex:1}}>
    
          <ContainerHeaderConfigs >
          <Image source={require('../../Img/LogoPNG.png')} 
                style={{width:'60%', height:100, resizeMode:'contain', marginBottom:'-10%', marginLeft:'2%'}}/>
          <IonIcon name="settings-outline" size={50} color={'#FFF'}/>
            {/* <Image source={require('../../Img/ListClient.png')} 
                  style={{width:'20%', height:'60%', resizeMode:'contain', marginRight:'5%', marginBottom:'-8%',}}/> */}
          </ContainerHeaderConfigs>
    
          <View style={{width:'100%', height:2, backgroundColor:'#FFF'}}>
          </View>
    
          <ContainerConfigsScreen>
            <View>
              <TextsLogin style={{fontWeight:'bold'}}>QUAL VAI SER O CRITÉRIO PARA ADIÇÃO DE CARIMBOS AO CLIENTE?</TextsLogin>
            </View>
    
            <TouchableOpacity onPress={handleSetCriterionByNum} style={{ alignItems:'center', flexDirection:'row'}} >
              <View style={{margin:10, width:28, height:28,backgroundColor:criterionByNum===null?'#FFF':'#FFA500', 
              borderRadius:25, borderWidth:5, borderColor:'#F2F2F2'}}>
              </View>
              <TextsLogin style={{color:criterionByNum===null?'#FFF':'#FFA500'}}>POR QUANTIDADE DE COMPRAS</TextsLogin>
            </TouchableOpacity>
              <TextsLogin style={{marginTop:-10,fontSize:13}}>(O carimbo será adicionado independentemente do valor de compra informado)</TextsLogin>
            
            <TouchableOpacity onPress={handleSetCriterionByVal} style={{ alignItems:'center', flexDirection:'row'}} >
              <View style={{margin:10, width:28, height:28,backgroundColor:criterionByVal===null?'#FFF':'#FFA500', 
              borderRadius:25, borderWidth:5, borderColor:'#F2F2F2'}}>
              </View>
              <TextsLogin style={{color:criterionByVal===null?'#FFF':'#FFA500'}}>POR VALOR DE COMPRA</TextsLogin>
            </TouchableOpacity>
            <TextsLogin style={{marginTop:-10,fontSize:13}}>(O carimbo só será adiconado se o valor de compra for igual ou maior ao valor mínimo informado)</TextsLogin>
              
            {
              criterionByNum==='CriterionByNum'? ByNumConfig():<View></View>
            }
            {
              criterionByVal==='CriterionByVal'? ByValConfig():<View></View>
            }
            <TouchableOpacity onPress={()=>{console.log(user)}}>
            <TextsLogin>ASOSAOKSAOKOSAK</TextsLogin>
          </TouchableOpacity>
          </ContainerConfigsScreen>
        </View>
      </ScrollView>
    );
    
  }
  
}
const styles = StyleSheet.create({
  InputInfoPurchase:{
    width: 150,
    height: 40,
    backgroundColor:'#DCDCDC',
    borderRadius:5,
    padding:5,
    margin:10,
    fontSize: 17,
  }
})
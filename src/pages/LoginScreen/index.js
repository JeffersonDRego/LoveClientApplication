import React, {useState, useRef, useContext} from "react";
import { ActivityIndicator, TouchableOpacity, View, Image } from "react-native";
import { ContainerLogin, TextInputsLogin, TextInputsCadastro, ButtonActLogin, TextsLogin,
        } from "../../styles/styles";

import { AuthContext } from "../../contexts/auth";
import logo from "../../Img/Logo.svg";

export default function Login() {

  const [type, setType] = useState('Login');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [imEstab, setImEstab] = useState(null);
  const {signUp, signIn, signInClient, signUpClient, loading}= useContext(AuthContext);
  
  //FAZ CADASTRO OU LOGIN A PARTIR DO TYPE
 function HandleSigInOrSignUpClient(){    
    if(type==='Login'){
      return(
        signInClient(email, password)
      )
    }else{
        signUpClient(email, password, name)
    }
  };

  function HandleSigInOrSignUpEstab(){    
    if(type==='Login'){
      return(
        signIn(email, password)
      )
    }else{
        signUp(email, password, name)
    }
  };

  //RENDERIZA OU NÃO TEXTINPUT DE NOME A PARTIR DE TYPE
  function TextInputName(){
    if(type === 'Login'){
      return
    }else{
      return (
            <View style={{width:'80%', marginBottom:5}}>
              <TextsLogin>Nome:</TextsLogin>
              <TextInputsCadastro
              onChangeText={text=>setName(text)}
              value={name}
              placeholder="Nome"
              // keyboardType="numeric"
              />
              <TouchableOpacity onPress={()=>setImEstab(imEstab=>imEstab===null?'imEstab':null)} style={{ alignItems:'center', flexDirection:'row'}} >
                <View style={{margin:10, width:28, height:28,backgroundColor:imEstab===null?'#FFF':'#FFA500', 
                borderRadius:25, borderWidth:5, borderColor:'#F2F2F2'}}>
                </View>
                <TextsLogin style={{color:imEstab===null?'#FFF':'#FFA500'}}>ME CADASTRAR COMO LOJISTA</TextsLogin>
              </TouchableOpacity>
            </View>
      )}}

 return (
   <ContainerLogin>
    
    <Image source={require('../../Img/LogoPNG.png')} 
            style={{width:'70%', height:100, resizeMode:'contain', marginBottom:'13%'}}/>

    {/* <TextsTitleLogin>{type} Loveclient</TextsTitleLogin> */}
    {TextInputName()}
    {/* <View style={{width:'80%', marginBottom:-5}}>
      <TextsLogin>E-mail:</TextsLogin>
    </View> */}
    <TextInputsLogin
    onChangeText={text=>setEmail(text)}
    value={email}
    placeholder="E-mail"
    placeholderTextColor="#696969"
    selectionColor={'#696969'}
    />

    {/* <View style={{width:'80%', marginBottom:-5}}>
      <TextsLogin>Senha:</TextsLogin>
    </View> */}
    <TextInputsLogin
    onChangeText={text=>setPassword(text)}
    value={password}
    placeholder="Senha"
    placeholderTextColor="#696969"
    secureTextEntry={true}
    selectionColor={'#696969'}
    />
    <ButtonActLogin onPress={imEstab===null ? HandleSigInOrSignUpClient : HandleSigInOrSignUpEstab}>
      {
        loading?(
          <ActivityIndicator size={20} color={"#FFF"}/>
        ) : (
          <TextsLogin style={{color:"#FFF", }}>
            {type === 'Login' ? 'Acessar' : 'Cadastrar'}
          </TextsLogin>
        )
      }
    </ButtonActLogin>

    <TouchableOpacity onPress={()=>setType(type=>type==='Login' ? 'Cadastro' : 'Login')} style={{margin:20}}>
      <TextsLogin>{type === 'Login' ? 'Cadastrar-se' : 'Já possuo uma conta'}</TextsLogin>
    </TouchableOpacity>

   </ContainerLogin>
  );
}

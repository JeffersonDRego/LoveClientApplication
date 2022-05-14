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
  const [numberClients, setNumberClients] = useState(0);

  const {signUp, signIn, loading}= useContext(AuthContext);
  
  //FAZ CADASTRO OU LOGIN A PARTIR DO TYPE
 function HandleSigInOrSignUp(){    
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
            </View>


      )}}

 return (
   <ContainerLogin>
    
    <Image source={require('../../Img/LogoPNG.png')} 
            style={{width:'70%', height:100, resizeMode:'contain', marginBottom:'13%'}}/>

    {/* <TextsTitleLogin>{type} Loveclient</TextsTitleLogin> */}
    {TextInputName()}
    <View style={{width:'80%', marginBottom:-5}}>
      <TextsLogin>E-mail:</TextsLogin>
    </View>
    <TextInputsLogin
    onChangeText={text=>setEmail(text)}
    value={email}
    placeholder="E-mail"
    // keyboardType="numeric"
    />

    <View style={{width:'80%', marginBottom:-5}}>
      <TextsLogin>Senha:</TextsLogin>
    </View>
    <TextInputsLogin
    onChangeText={text=>setPassword(text)}
    value={password}
    placeholder="Senha"
    secureTextEntry={true}
    />

    <ButtonActLogin onPress={HandleSigInOrSignUp}>
      {
        loading?(
          <ActivityIndicator size={20} color={"#FFF"}/>
        ) : (
          <TextsLogin style={{color:"#0D0D0D", }}>
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

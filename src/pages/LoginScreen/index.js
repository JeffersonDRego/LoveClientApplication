import React, {useState, useContext} from "react";
import { ActivityIndicator, Text, TouchableOpacity, View, Image } from "react-native";
import { ContainerLogin, TextInputsLogin, TextInputsCadastro, ButtonActLogin, TextsLogin,
        } from "../../styles/styles";

import { AuthContext } from "../../contexts/auth";
import logo from "../../Img/Logo.svg";

export default function Login() {

  const [type, setType] = useState('Login');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {signUp, signIn, loading}= useContext(AuthContext);
  


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
              {/* <Text >Nome:</Text> */}
              <TextInputsCadastro
              onChangeText={text=>setName(text)}
              value={name}
              placeholder="Nome"
              placeholderTextColor="#2D2D2D"
              selectionColor={'#696969'}
              />
  
            </View>
      )}}

 return (
   <ContainerLogin>
    
    <Image source={require('../../Img/LogoBlackPNG.png')} 
            style={{width:'70%', height:100, resizeMode:'contain', marginBottom:'13%'}}/>

    {TextInputName()}
    <TextInputsLogin
    onChangeText={text=>setEmail(text)}
    value={email}
    placeholder="E-mail"
    placeholderTextColor="#2D2D2D"
    selectionColor={'#696969'}
    />

    <TextInputsLogin
    onChangeText={text=>setPassword(text)}
    value={password}
    placeholder="Senha"
    placeholderTextColor="#2D2D2D"
    secureTextEntry={true}
    selectionColor={'#696969'}
    />
    <ButtonActLogin onPress={()=>{HandleSigInOrSignUpEstab()}}>
      {
        loading?(
          <ActivityIndicator size={20} color={"#FFF"}/>
        ) : (
          <Text style={{fontFamily:'OxaniumSemiBold', color:'#FFF', fontSize:15}}>
            {type === 'Login' ? 'Acessar' : 'Cadastrar'}
          </Text>
        )
      }
    </ButtonActLogin>

    <TouchableOpacity onPress={()=>setType(type=>type==='Login' ? 'Cadastro' : 'Login')} style={{margin:20}}>
      <Text style={{fontFamily:'OxaniumSemiBold',fontSize:15}}>{type === 'Login' ? 'Cadastrar-se' : 'Já possuo uma conta'}</Text>
    </TouchableOpacity>

   </ContainerLogin>
  );
}

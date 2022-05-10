import React, {useState, useRef, useContext} from "react";
import { ActivityIndicator, TouchableOpacity, Animated, StyleSheet, View, Button } from "react-native";
import { ContainerLogin, TextInputsLogin, TextInputsCadastro, ButtonActLogin, ButtonChange, TextsLogin, TextsTitleLogin } from "../../styles/styles";

import { AuthContext } from "../../contexts/auth";


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
  //ANIMATED VIEW
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const fadeIn = () => {
    // Will change fadeAnim value
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2500,
      useNativeDriver: true // Add This line
    }).start();
  };

  //RENDERIZA OU NÃO TEXTINPUT DE NOME A PARTIR DE TYPE
  function TextInputName(){
    if(type === 'Login'){
      return
    }else{
      fadeIn();
      return (
  
          <Animated.View
            style={[
              styles.fadingContainer,
              {
                // Bind opacity to animated value
                opacity: fadeAnim
              }
            ]}
          >
            <TextInputsCadastro
            onChangeText={text=>setName(text)}
            value={name}
            placeholder="Nome"
            // keyboardType="numeric"
            />
          </Animated.View>


      )}}
//   );
// }
    //   return(
    //   <TextInputsLogin
    //   onChangeText={text=>setName(text)}
    //   value={name}
    //   placeholder="Nome"
    //   // keyboardType="numeric"
    //   />
    // )
    // }
  // }
 return (
   <ContainerLogin>
    <TextsTitleLogin>{type} Loveclient</TextsTitleLogin>
    
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
    />

    <ButtonActLogin onPress={HandleSigInOrSignUp}>
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
const styles = StyleSheet.create({
  
  fadingContainer: {
    width:'80%',
    height: 40,
    borderRadius:5,
    margin:10,
  },
});
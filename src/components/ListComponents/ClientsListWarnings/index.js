import React, {useContext} from 'react';
import {TouchableOpacity, Text, View, Linking, Alert } from 'react-native';
import { ContainerList, ViewClient, TextName, InfosView } from '../../../styles/styles';
import IonIcons from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../../../contexts/auth';
import { useNavigation } from '@react-navigation/native';
import firebase from "../../../services/firebaseConnection";
import moment from 'moment';
// import EditClient from '../EditClient';

export default function ClientsListWarnings({data,}) {
  const {user,} = useContext(AuthContext);
  const navigation = useNavigation();

  const msg = `Olá, ${data.nameClient} tô passando pra avisar que seu bônus está pronto pra ser resgatado aqui em ${user.name}.`

  let primeiraCompra = data.firstPurchase;
  let dataAtual = moment().format('DD/MM/YYYY');
  var diff = moment(dataAtual,"DD/MM/YYYY").diff(moment(primeiraCompra,"DD/MM/YYYY"));
  var meses = moment.duration(diff).asMonths();
  //ADICIONANDO NUMERO DE MESES A PARTIR DA PRIMEIRA COMPRA
  // var validade = moment(data.firstPurchase, 'DD/MM/YYYY').add(user.validadeCarimbos, 'months').format('DD/MM/YYYY')

  function handleForadeValidade(data){
    Alert.alert(
      'VOCÊ TEM DUAS OPÇÕES:',
        `Você pode zerar os carimbos de ${data.nameClient}..ou pode entrar em contato! :)`,
        [
          {
            text:'CANCELAR',
            style:'cancel'
          },
          {
            text:'EDITAR DADOS',
            onPress: ()=> navigation.navigate('EditClient', {data})
          }
        ]

    )
  }
  
  if(user){
    return (
      <ContainerList style={{ borderRadius:5, marginBottom:10}}>
        <TouchableOpacity onPress={()=> navigation.navigate('EditClient', {data})}>

        <ViewClient>
          <InfosView>
            <Text style={{fontFamily:'OxaniumSemiBold', fontSize:20}}>{data.nameClient}</Text>
          <TouchableOpacity
          onPress={() =>
            Linking.canOpenURL("whatsapp://send?text=oi").then(supported => {
              if (supported) {
                return Linking.openURL(
                  `whatsapp://send?phone=55${data.phoneClient}&text=Olá`
                  );
                } else {
                  return Linking.openURL(
                    `https://api.whatsapp.com/send?phone=55${data.phoneClient}&text=Olá`
                    );
                  }
                })
              }
              style={{flexDirection:'row', alignItems:'center'}}>
            <IonIcons style={{marginTop:-8}} name='logo-whatsapp' size={30} color={'green'}/>
          </TouchableOpacity>  
          </InfosView>
        </ViewClient>

        <View style={{width:'100%', borderWidth:0.5, borderStyle:'dashed', borderRadius:1, marginBottom:10}}></View>
        
        {/* ---------------------------------BÔNUS GARANTIDO------------------------------- */}
        {
          data.purchases>=parseFloat(user.numTotalCarimbos) ?
          <TouchableOpacity 
          onPress={() =>
            Linking.canOpenURL("whatsapp://send?text=oi").then(supported => {
              if (supported) {
                return Linking.openURL(
                  `whatsapp://send?phone=55${data.phoneClient}&text=${msg}`
                  );
                } else {
                  return Linking.openURL(
                    `https://api.whatsapp.com/send?phone=55${data.phoneClient}&text=${msg}`
                    );
                  }
                })
              }
              style={{flexDirection:'row', alignItems:'center'}}>
            <Text style={{color:'green', fontSize:15, fontFamily:'OxaniumSemiBold', marginBottom:10}}>BÔNUS GARANTIDO, ENTRAR EM CONTATO   </Text>
          </TouchableOpacity>
          :<View></View>
        }
        {/* ------------------------FALTA 1 CARTIMBO-------------------------- */}
        {
          data.purchases==user.numTotalCarimbos-1 ?
          <TouchableOpacity 
              style={{flexDirection:'row', alignItems:'center'}}>
            <Text style={{color:'#FFA500', fontSize:14, marginBottom:10, fontFamily:'OxaniumSemiBold'}}>FALTA {user.numTotalCarimbos - data.purchases} CARIMBO PARA GARANTIR O BÔNUS  </Text>
          </TouchableOpacity>
          :<View></View>
        }
        {/* ----------------------------FORA DE VALIDADE----------------------------- */}
        {
          meses>user.validadeCarimbos ?
          <TouchableOpacity onPress={()=>{handleForadeValidade(data)}}
              style={{flexDirection:'row', alignItems:'center'}}>
            <Text style={{color:'red', fontSize:15, marginBottom:10, fontFamily:'OxaniumSemiBold'}}>FORA DE VALIDADE (Faltando {user.numTotalCarimbos - data.purchases} carimbo`s`)</Text>
          </TouchableOpacity>
          :<View></View>
        }
        {/* -------------------------------ÚLTIMO MÊS RESTANTE--------------------------------- */}
        {
          meses>user.validadeCarimbos-1 && meses<user.validadeCarimbos?
          <TouchableOpacity 
              style={{flexDirection:'row', alignItems:'center'}}>
            <Text style={{color:'#FFA500', fontSize:14, marginBottom:10, fontFamily:'OxaniumSemiBold'}}>ÚLTIMO MÊS RESTANTE.. (Faltando {user.numTotalCarimbos - data.purchases} carimbo`s`)  </Text>
          </TouchableOpacity>
          :<View></View>
        }
        </TouchableOpacity>
          
          

      </ContainerList>
    );
  }
}
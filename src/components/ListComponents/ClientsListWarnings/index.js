import React, {useContext} from 'react';
import {TouchableOpacity, Text, View, Linking } from 'react-native';
import { ContainerList, ViewClient, TextName, ButtonsView, IconView, InfosView, Alert } from '../../../styles/styles';
import IonIcons from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../../../contexts/auth';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
// import EditClient from '../EditClient';

export default function ClientsListWarnings({data,}) {
  const {user,} = useContext(AuthContext);
  const navigation = useNavigation();

  const msg = `Olá, ${data.nameClient} tô passando pra avisar que seu bônus está pronto pra ser resgatado aqui na nossa Loja.`

  let primeiraCompra = data.firstPurchase;
  let dataAtual = moment().format('DD/MM/YYYY');
  var diff = moment(dataAtual,"DD/MM/YYYY").diff(moment(primeiraCompra,"DD/MM/YYYY"));
  var meses = moment.duration(diff).asMonths();
  //ADICIONANDO NUMERO DE MESES A PARTIR DA PRIMEIRA COMPRA
  // var validade = moment(data.firstPurchase, 'DD/MM/YYYY').add(user.validadeCarimbos, 'months').format('DD/MM/YYYY')

  if(user){
    return (
      <ContainerList style={{borderWidth:1, borderColor:'white', borderRadius:5, marginBottom:10}}>
        {/* -----------------------------BOTAO TESTE LISTAHOME----------------- */}
        <TouchableOpacity onPress={()=>{console.log(meses)}}>
          <Text>BOTAO DE TESTE LISTA</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=> navigation.navigate('EditClient', {data})}>

        <ViewClient>
          <InfosView>
            <TextName>{data.nameClient}</TextName>
            
            {/* <View style={{flexDirection:'row'}}>
              <TextName style={{ fontWeight:'bold'}}>Telefone:</TextName>
              <TextName style={{}}>{data.phoneClient}</TextName>
            </View> */}
            {
              data.firstPurchase?
              <View style={{flexDirection:'row'}}>
                <TextName style={{ fontWeight:'bold'}}>1ª Compra:</TextName>
                <TextName style={{}}>{data.firstPurchase}</TextName>
              </View>
              :
              <View><TextName>0 compras realizadas</TextName></View>
            }
          </InfosView>
  
          <ButtonsView>
            <IconView style={{flexDirection:'column', justifyContent:'center'}}>
              <IonIcons name="person-outline" size={30} color={'#BFB47A'}></IonIcons>
              <TextName style={{color:'#F2F2F2', fontSize:12, marginTop:-5}}>EDITAR</TextName>
            </IconView>
          </ButtonsView>
  
        </ViewClient>
        {
          data.purchases>=parseFloat(user.numTotalCarimbos) ?
          <TouchableOpacity 
          onPress={() =>
            Linking.canOpenURL("whatsapp://send?text=oi").then(supported => {
              if (supported) {
                return Linking.openURL(
                  `whatsapp://send?phone=5535998068006&text=${msg}`
                  );
                } else {
                  return Linking.openURL(
                    `https://api.whatsapp.com/send?phone=5531999999999&text=${msg}`
                    );
                  }
                })
              }
              style={{flexDirection:'row', alignItems:'center'}}>
            <Text style={{color:'green', fontSize:15, fontWeight:'bold'}}>BÔNUS GARANTIDO, ENTRAR EM CONTATO   </Text>
            <IonIcons name='logo-whatsapp' size={28} color={'green'}/>
          </TouchableOpacity>
          :<View></View>
        }
        {
          data.purchases==user.numTotalCarimbos-1 ?
          <TouchableOpacity 
              style={{flexDirection:'row', alignItems:'center'}}>
            <Text style={{color:'#FFA500', fontSize:14}}>FALTA APENAS {user.numTotalCarimbos - data.purchases} CARIMBO PARA GARANTIR O BÔNUS  </Text>
            <IonIcons name='logo-whatsapp' size={28} color={'green'}/>
          </TouchableOpacity>
          :<View></View>
        }
        {
          meses>user.validadeCarimbos ?
          <TouchableOpacity onPress={()=>{}}
              style={{flexDirection:'row', alignItems:'center'}}>
            <Text style={{color:'red', fontSize:15}}>FORA DE VALIDADE (Faltando {user.numTotalCarimbos - data.purchases} carimbo`s`)</Text>
          </TouchableOpacity>
          :<View></View>
        }

        {
          meses>user.validadeCarimbos-1 && meses<user.validadeCarimbos?
          <TouchableOpacity 
              style={{flexDirection:'row', alignItems:'center'}}>
            <Text style={{color:'#FFA500', fontSize:14}}>ÚLTIMO MÊS RESTANTE.. (Faltando {user.numTotalCarimbos - data.purchases} carimbo`s`)  </Text>
            <IonIcons name='logo-whatsapp' size={28} color={'green'}/>
          </TouchableOpacity>
          :<View></View>
        }
        </TouchableOpacity>
          
          

      </ContainerList>
    );
  }
}
import React, {useContext} from 'react';
import {TouchableOpacity, Text } from 'react-native';
import { ContainerList, ViewClient, TextName, ButtonsView, IconView } from '../../styles/styles';
import IonIcons from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../../contexts/auth';

export default function ClientsList({data, deleteItem}) {
  const {user,} = useContext(AuthContext);

  // async function handleDeleteClient(){

  //   let uid = user.uid;
  //   let key = await firebase.database().ref('clients').child(uid).push().key;
  //   await firebase.database().ref('clients').child(uid).child(key).delete()
  //   //AUTALIZAR QUANTIDADE DE CLIENTES AQUI
  //   let usuario = firebase.database().ref('users').child(uid);
  //   await usuario.once('value').then((snapshot)=>{
  //     let numClients = parseFloat(snapshot.val().clients);
  //     numClients += parseFloat(1)
  //     usuario.child('clients').set(numClients);
  //   }).then((snapshot)=>{
  //     let data = {
  //         uid: uid,
  //         name: user.name,
  //         email: user.email,
  //         clients: user.clients + 1,
  //     }
  //     storageUser(data);
  //     loadStoragedUser();
  //     setNameClient('');
  //     setPhoneClient('');
  //     Keyboard.dismiss();
  //     navigation.navigate('Configs');
  //     alert('CLIENTE CADASTRADO');
      
  //   })
  // }
 return (
   <ContainerList>
     <ViewClient>
        <TextName>{data.nameClient + ' com ' + data.purchases + ' carimbos'}</TextName>
        <ButtonsView>
          <IconView style={{backgroundColor:'green'}}>
            <TouchableOpacity>
              <IonIcons name="create" size={20} color={'white'}></IonIcons>
            </TouchableOpacity>
          </IconView>
          <IconView style={{backgroundColor:'blue'}}>
            <TouchableOpacity>
              <IonIcons name="information" size={20} color={'white'}></IonIcons>
            </TouchableOpacity>
          </IconView>
          <IconView style={{backgroundColor:'red'}}>
            <TouchableOpacity onPress={()=> deleteItem(data)}>
              <IonIcons name="trash" size={20} color={'white'}></IonIcons>
            </TouchableOpacity>
          </IconView>
        </ButtonsView>
     </ViewClient>
        
   </ContainerList>
  );
}
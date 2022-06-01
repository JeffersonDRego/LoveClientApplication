import React, {useState, createContext, useEffect} from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from "../services/firebaseConnection";


export const AuthContext = createContext({});

function AuthProvider({children}){
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [numberClients, setNumberClients] = useState(0);
    // const [celClient, setcelClient] = useState(null);
    // const [configurated, setConfigurated] = useState('noConfigurated');


    useEffect(()=>{
        loadStoragedUser();
    },[])
   
    //SALVANDO NO ASYNCSTORAGE
    async function storageUser(data){
        await AsyncStorage.setItem('Auth_user', JSON.stringify(data))
    }
    //CARREGANDO USUARIO DO ASYNCSTORAGE
    async function loadStoragedUser(){
        const storageUser = await AsyncStorage.getItem('Auth_user')
        setLoading(true);
        await new Promise(resolve=> setTimeout(resolve, 2000))
        
        if (storageUser){
            setUser(JSON.parse(storageUser))
            setLoading(false)
        }else{
            // navigation.navigate('Login')
            setLoading(false)

        }
    }

  
    // SIGNIN CLIENTE
    async function signInClient(email, password){
        setLoading(true)
        await firebase.auth().signInWithEmailAndPassword(email, password)
        .then(async(value)=>{
            let uid= value.user.uid;
            await firebase.database().ref('usersClients').child(uid).once('value')
            .then((snapshot)=>{
                let data = {
                    uid: uid,
                    name: snapshot.val().name,
                    email: value.user.email,
                    // celClient:value.user.celClient,
                    clients: snapshot.val().clients,
                    numTotalCarimbos:snapshot.val().numTotalCarimbos,
                    validadeCarimbos:snapshot.val().validadeCarimbos,
                    valorMin:snapshot.val().valorMin,
                    configurated:snapshot.val().configurated
                }
                setUser(data);
                storageUser(data);
                setLoading(false);
            })
        })
        .catch((error)=> {
            alert(error)
            setLoading(false);
        })
    }
    // SIGNUP CLIENTE
    async function signUpClient(email, password, name, celClient){
        setLoading(true)
        await firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(async (value)=>{
            let uid = value.user.uid;
            await firebase.database().ref('usersClients').child(uid).set({
                name: name,
                // celClient: celClient,
            })
            .then(()=>{
                let data = {
                    uid: uid,
                    name: name,
                    email: value.user.email,
                    // celClient: celClient,
                }
                setUser(data)
                storageUser(data)
                setLoading(false)
            })
        }).catch((error)=> {
            alert(error)
            setLoading(false)
        })
    }
    
    //SIGNIN LOJISTA
    async function signIn(email, password){
        setLoading(true)
        await firebase.auth().signInWithEmailAndPassword(email, password)
        .then(async(value)=>{
            let uid= value.user.uid;
            await firebase.database().ref('users').child(uid).once('value')
            .then((snapshot)=>{
                let data = {
                    uid: uid,
                    name: snapshot.val().name,
                    email: value.user.email,
                    adminPass:value.user.adminPass,
                    clients: snapshot.val().clients,
                    numTotalCarimbos:snapshot.val().numTotalCarimbos,
                    validadeCarimbos:snapshot.val().validadeCarimbos,
                    valorMin:snapshot.val().valorMin,
                    configurated:snapshot.val().configurated
                }
                setUser(data);
                storageUser(data);
                setLoading(false);
            })
        })
        .catch((error)=> {
            alert(error)
            setLoading(false);
        })
    }
    //SIGNUP LOJISTA
    async function signUp(email, password, name, celEstab){
        setLoading(true)
        await firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(async (value)=>{
            let uid = value.user.uid;
            await firebase.database().ref('users').child(uid).set({
                name: name,
                email:email,
                adminPass:'noPass',
                clients: numberClients,
                configurated: 'noConfigurated'
            })
            .then(()=>{
                let data = {
                    uid: uid,
                    name: name,
                    email: value.user.email,
                    adminPass:'noPass',
                    clients: numberClients,
                    configurated: 'noConfigurated'
                }
                setUser(data)
                storageUser(data)
                setLoading(false)
            })
        }).catch((error)=> {
            alert(error)
            setLoading(false)
        })
    }
    
    //LOGOUT
    async function Logout(){

        await AsyncStorage.clear().then(setUser(null))
        console.log(user)
    }
    
    return(
        <AuthContext.Provider value={{signed: !!user, user, loading,
        setUser, signUp, signIn, signInClient, signUpClient, Logout, storageUser, loadStoragedUser}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;

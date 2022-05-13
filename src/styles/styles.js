import styled from 'styled-components/native';

export const SafeArea = styled.SafeAreaView`
flex:1;
background-color: #404040;
/* padding:1px;
border-width: 2px;
border-color: red; */
`

//LOGIN

export const ContainerLogin = styled.View`
flex:1;
justify-content: center;
align-items: center;
background-color: #262626	;
`
// export const TextsTitleLogin = styled.Text`

// color: #fff;
// font-size: 25px;
// font-weight: bold;

// `
export const TextInputsLogin = styled.TextInput`
width:80%;
height:40px;
background-Color:#DCDCDC;
border-Radius:5px;
padding:5px;
margin:10px;
font-size: 17px;
elevation:2;
`
export const TextInputsCadastro = styled.TextInput`
width:100%;
height:40px;
background-Color:#DCDCDC;
border-Radius:5px;
font-size: 17px;
padding: 5px;
elevation:2;
/* margin-bottom: 5px; */
`
export const  ButtonActLogin = styled.TouchableOpacity`
margin-top: 10px;
width:30%;
height:40px;
background-Color:#BFB47A;
border-Radius:7px;
justify-Content:center;
align-Items:center;
/* box-shadow: 10px 5px 5px black; */
elevation:5;
`

export const TextsLogin = styled.Text`
color: #fff;
font-size: 18px;
`

//HOME SCREEN

export const ContainerHeaderHome = styled.View`
/* flex:1; */
flex-direction:row;
justify-content: space-between;
align-items: center;
background-color: #0D0D0D;
width: 100%;
height: 20%;
padding: 10px;
/* margin-top: 35px; */
`
export const Container = styled.View`
flex:1;
justify-content: center;
align-items: center;
background-color: #262626;
`
export const TextInputs = styled.TextInput`
width:80%;
height:40px;
background-Color:#DCDCDC;
border-Radius:5px;
padding:5px;
margin:10px;
font-size: 17px;
`
export const  ButtonAct = styled.TouchableOpacity`
width:30%;
height:40px;
background-Color:#aaa;
border-Radius:10px;
justify-Content:center;
align-Items:center;
/* elevation:2; */
`
//NEW CLIENT SCREEN
export const ContainerHeaderNew = styled.View`
/* flex:1; */
flex-direction:row;
justify-content: space-between;
align-items: flex-end;
background-color: #0D0D0D;
width: 100%;
height: 20%;
/* padding: 10px; */
/* margin-top: 35px; */
`
export const ContainerNewClient = styled.View`
flex:1;
justify-content: flex-start;
align-items: center;
background-color: #262626;
`

//LIST SCREEN

export const ContainerHeaderList = styled.View`
/* flex:1; */
flex-direction:row;
justify-content: space-between;
align-items: flex-end;
background-color: #0D0D0D;
width: 100%;
height: 20%;
`
export const ContainerConfigs = styled.View`
/* flex:1; */
height: 100%;
/* flex-direction:column; */
justify-content: center;
align-items: center;
background-color: #262626;
`
export const ViewList = styled.View`
margin-Bottom:50px;
height:40%;
width:100%;
justify-Content:center;
border-width: 3px;
border-radius: 5px;
border-color: #BFB47A;
`
export const ListaClientes = styled.FlatList`
padding: 10px;
background-color:#0D0D0D;
border-radius: 5px;
`
export const  ButtonActList = styled.TouchableOpacity`
margin-top: 10px;
margin-bottom: 20px;
width:30%;
height:40px;
background-Color:#BFB47A;
border-Radius:7px;
justify-Content:center;
align-Items:center;
/* box-shadow: 10px 5px 5px black; */
elevation:5;
`

//COMPONENT LIST
export const ContainerList = styled.View`
/* background-color: #FFF; */
padding: 3px;
/* height: 50%; */
`
export const ViewClient = styled.View`
background-color: #262626;
flex-direction:row;
justify-content: space-between;
align-items: center;
border-radius: 3px;
padding: 7px;
margin-bottom: 10px;
width: 100%;
`
export const InfosView = styled.View`
/* background-color: #1212; */
/* flex-direction: column; */
padding: 2px;
justify-content: space-between;
width: 70%;

`
export const TextName = styled.Text`
color: #FFF;
font-size: 18px;
margin-left: 3px;
`
export const ButtonsView = styled.View`
/* background-color: #1212; */
flex-direction: row;
padding: 5px;
justify-content: space-between;
width: 30%;

`

export const IconView = styled.View`
padding: 3px;
justify-content: space-between;
border-radius: 5px;
`
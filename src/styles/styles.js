import styled from 'styled-components/native';

export const SafeArea = styled.SafeAreaView`
flex:1;
/* background-color: #0D0D0D; */
/* padding:1px;
border-width: 2px;
border-color: red; */
`

//---------------------------------------------------LOGIN

export const ContainerLogin = styled.View`
flex:1;
justify-content: center;
align-items: center;
background-color: #112426	;
`
// export const TextsTitleLogin = styled.Text`

// color: #fff;
// font-size: 25px;
// font-weight: bold;

// `
export const TextInputsLogin = styled.TextInput`
width:80%;
height:40px;
background-Color:#F2F2F2;
border-Radius:5px;
padding:5px;
margin:10px;
font-size: 17px;
/* elevation:2; */
`
export const TextInputsCadastro = styled.TextInput`
width:100%;
height:40px;
background-Color:#F2F2F2;
border-Radius:5px;
font-size: 17px;
padding: 5px;
/* elevation:2; */
/* margin-bottom: 5px; */
`
export const  ButtonActLogin = styled.TouchableOpacity`
margin-top: 10px;
width:110px;
height:40px;
background-Color:#2A5959;
border-Radius:4px;
justify-Content:center;
align-Items:center;
/* box-shadow: 10px 5px 5px black; */
/* elevation:5; */
`

export const TextsLogin = styled.Text`
color: #F2F2F2;
font-size: 18px;
`

//--------------------------------------------------HOME SCREEN

export const ContainerHeaderHome = styled.View`
/* flex:1; */
flex-direction:row;
justify-content: space-between;
align-items: center;
background-color: #2A5959;
width: 100%;
height: 130px;
padding: 10px;
/* margin-top: 35px; */
`
export const Container = styled.View`
flex:1;
justify-content: center;
align-items: center;
background-color: #112426;
padding: 12px;
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
width:90px;
height:40px;
background-Color:#aaa;
border-Radius:10px;
justify-Content:center;
align-Items:center;
/* elevation:2; */
`
//-----------------------------------------------------LIST SCREEN

export const ContainerHeaderList = styled.View`
/* flex:1; */
flex-direction:row;
justify-content: space-between;
align-items: center;
background-color: #2A5959;
width: 100%;
height: 130px;
padding: 10px;
/* margin-top: 35px; */
`
export const ContainerListScreen = styled.View`
flex:1;
/* height: 100%; */
/* flex-direction:column; */
/* justify-content: center; */
align-items: center;
background-color: #112426;
padding: 12px;
`
export const ViewList = styled.View`
margin-Bottom:50px;
height:30%;
width:98%;
padding: 6px;
align-items: center;
border-radius: 5px;
border-radius: 25px;
`
export const ListaClientes = styled.FlatList`
padding: 2px;
/* background-color:#223A40; */
border-radius: 5px;
width: 100%;
padding-left: 7px;
`
export const SearchListaClientes = styled.FlatList`
padding: 2px;
background-color:#F2F2F2;
border-radius: 5px;
width: 100%;
padding-left: 4px;
/* min-height: 10px; */
`

export const  ButtonActListScreen = styled.TouchableOpacity`
width:140px;
height:40px;
background-Color:#aaa;
border-Radius:10px;
justify-Content:center;
align-Items:center;
/* elevation:2; */
`

//-------------------------------------COMPONENT CLIENTLIST
export const ContainerList = styled.View`
/* background-color: #AAAAAA; */
padding: 5px;
/* height: 50%; */
`
export const ViewClient = styled.View`
background-color: #2A5959;
flex-direction:row;
justify-content: space-between;
align-items: center;
border-radius: 10px;
padding: 8px;
margin-top: 6px;
width: 98%;
`
export const InfosView = styled.View`
/* padding: 0px; */
justify-content: space-between;
width: 70%;

`
export const ButtonsView = styled.View`
background-color: #1212;
flex-direction: column;
padding: 3px;
justify-content: space-between;
width: 17%;
border-radius: 5px;
/* height: 100%; */

`
export const TextName = styled.Text`
color: #FFF;
font-size: 18px;
margin-left: 3px;
`

export const IconView = styled.View`
/* padding: 3px; */
/* justify-content: center; */
align-items: center;
border-radius: 5px;
`


//--------------------------------------------------------------CONFIGS SCREEN
export const ContainerHeaderConfigs = styled.View`
/* flex:1; */
flex-direction:row;
justify-content: space-between;
align-items: center;
background-color: #2A5959;
width: 100%;
height: 130px;
padding: 10px;
/* margin-top: 35px; */
`
export const ContainerConfigsScreen = styled.View`
flex:1;
/* height: 100%; */
/* flex-direction:column; */
/* justify-content: center; */
/* align-items: center; */
background-color: #112426;
padding: 12px;
`
//--------------------------------------------------------------EDIT SCREEN
export const ContainerHeaderEditScreen = styled.View`
/* flex:1; */
flex-direction:row;
justify-content: space-between;
align-items: center;
background-color: #2A5959;
width: 100%;
height: 130px;
padding: 10px;
/* margin-top: 35px; */
`
export const ContainerEditScreen = styled.View`
flex:1;
/* height: 100%; */
/* flex-direction:column; */
/* justify-content: center; */
align-items: center;
background-color: #112426;
padding: 12px;
`
//-------------------------------------COMPONENT EDIT CLIENT

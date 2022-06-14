import styled from 'styled-components/native';

export const SafeArea = styled.SafeAreaView`
flex:1;
`
export const ContainerHeader = styled.View`
flex-direction:row;
justify-content: center;
/* align-items: center; */
background-color: #FFA500;
width: 100%;
height: 95px;
padding: 2px;
`
//---------------------------------------------------LOGIN

export const ContainerLogin = styled.View`
flex:1;
justify-content: center;
align-items: center;
background-color: #FFA500	;
`
// export const TextsTitleLogin = styled.Text`

// color: #fff;
// font-size: 25px;
// font-weight: bold;

// `
export const TextInputsLogin = styled.TextInput`
width:80%;
height:40px;
/* background-Color:#F2F2F2; */
border-bottom-width: 0.5px;
border-Radius:5px;
padding:5px;
margin:10px;
font-family: 'OxaniumLight';
font-size: 17px;
/* elevation:2; */
`
export const TextInputsCadastro = styled.TextInput`
width:100%;
height:40px;
/* background-Color:#F2F2F2; */
border-bottom-width: 0.5px;
border-Radius:5px;
padding:5px;
/* margin:10px; */
font-family: 'OxaniumLight';
font-size: 17px;
/* elevation:2; */
`
export const  ButtonActLogin = styled.TouchableOpacity`
margin-top: 10px;
width:110px;
height:40px;
background-Color:#2D2D2D;
border-Radius:4px;
justify-Content:center;
align-Items:center;
/* box-shadow: 10px 5px 5px black; */
/* elevation:5; */
`

export const TextsLogin = styled.Text`
color: #0D0D0D;
font-size: 18px;
`

//--------------------------------------------------HOME SCREEN

export const ContainerHome = styled.View`
flex:1;
/* height: 100%; */
/* justify-content: space-evenly; */
/* align-items: center; */
padding: 20px;
padding-top: 40px;
position: relative;
`
export const TextInputs = styled.TextInput`
width:80%;
/* height:40px; */
/* background-Color:#DCDCDC; */
border-Radius:5px;
border-Bottom-Width: 0.5px;
padding:5px;
margin:10px;
font-size: 17px;
font-family: 'OxaniumExtraLight';
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


export const ContainerListScreen = styled.View`
flex:1;
/* height: 100%; */
/* flex-direction:column; */
/* justify-content: center; */
align-items: center;
/* background-color: #F2f2f2; */
padding: 15px;
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
background-color: #FFF;
padding: 5px;
/* height: 50%; */
`
export const ViewClient = styled.View`
/* background-color: #FFF; */
flex-direction:row;
justify-content: space-between;
align-items: center;
border-radius: 10px;
/* border-width: 1; */
padding: 8px;
margin-top: 6px;
width: 98%;
`
export const InfosView = styled.View`
/* margin-bottom: 15px; */
justify-content: space-between;
flex-direction: row;
width: 100%;
`
export const ButtonsView = styled.View`
background-color: #FFA500;
flex-direction: column;
padding: 3px;
justify-content: space-between;
width: 17%;
align-items: center;
border-radius: 5px;
/* height: 100%; */

`
export const TextName = styled.Text`
color: #0D0D0D;
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

export const ContainerConfigsScreen = styled.View`
flex:1;
padding: 15px;
`
//--------------------------------------------------------------EDIT SCREEN

export const ContainerEditScreen = styled.View`
flex:1;
padding: 15px;
`
//-------------------------------------COMPONENT EDIT CLIENT

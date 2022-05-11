import styled from 'styled-components/native';

//LOGIN
export const ContainerLogin = styled.View`
flex:1;
justify-content: center;
align-items: center;
background-color: #731212	;
`
export const TextInputsLogin = styled.TextInput`
width:80%;
height:40px;
background-Color:#F2EADF;
border-Radius:5px;
padding:5px;
margin:10px;
font-size: 17px;
elevation:2;
`
export const TextInputsCadastro = styled.TextInput`
width:100%;
height:40px;
background-Color:#fff;
border-Radius:5px;
font-size: 17px;
padding: 5px;
elevation:2;
`
export const  ButtonActLogin = styled.TouchableOpacity`
margin-top: 10px;
width:30%;
height:40px;
background-Color:#D93232;
border-Radius:10px;
justify-Content:center;
align-Items:center;
/* box-shadow: 10px 5px 5px black; */
elevation:5;
`
export const TextsTitleLogin = styled.Text`
margin-bottom: 20px;
color: #fff;
font-size: 25px;
font-weight: bold;
`
export const TextsLogin = styled.Text`
color: #fff;
font-size: 18px;
`

//HOME
export const ContainerHeader = styled.View`
/* flex:0; */
flex-direction:column;
justify-content: flex-end;
align-items: flex-end;
/* background-color: blueviolet; */
width: 100%;
height: 70px;
padding: 10px;
margin-top: 35px;
`
export const Container = styled.View`
flex:1;
/* justify-content: center; */
align-items: center;
background-color: #731212;
`
export const TextInputs = styled.TextInput`
width:80%;
height:40px;
background-Color:#fff;
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
//NEW CLIENT
export const ContainerNewClient = styled.View`
flex:1;
justify-content: center;
align-items: center;
background-color: #731212;
`

//CONFIGS

export const ContainerConfigs = styled.View`
flex:1;
flex-direction:column;
justify-content: center;
align-items: center;
background-color: #731212;

`
export const ListaClientes = styled.FlatList.attrs({
    marginHorizontal:15
})`
padding-top: 15px;
background-color:#731212;
border-radius: 5px;
margin-bottom: 10px;
/* border-width: 1px;
border-color:#F2EADF; */
/* height: 50%; */
/* width: 96%; */

`
//COMPONENT LIST
export const ContainerList = styled.View`
/* background-color: #FFF; */
padding: 3px;


`
export const ViewClient = styled.View`
background-color: #F2EADF;
flex-direction:row;
justify-content: space-between;
align-items: center;
border-radius: 3px;
padding: 9px;
margin-bottom: 10px;
`
export const TextName = styled.Text`
color: #000;
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
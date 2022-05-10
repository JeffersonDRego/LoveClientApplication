import react from "react";
import { StatusBar, LogBox } from "react-native";
import AuthProvider from "./src/contexts/auth";

import { NavigationContainer } from "@react-navigation/native";
import Routes from "./src/routes";

// console.disableYellowBox=true
LogBox.ignoreAllLogs();

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
      {/* <StatusBar backgroundColor="#731212"/> */}
        <Routes/>
      </AuthProvider>
    </NavigationContainer>
  );
};
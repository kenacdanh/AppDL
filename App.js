import React from "react";
import { View, StatusBar } from "react-native";
import Dashboard from "./src/components/Dashboard"; // Import Dashboard.js

const App = () => {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <Dashboard />
    </View>
  );
};

export default App;

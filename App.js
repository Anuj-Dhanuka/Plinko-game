import React from "react";
import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";

//GameApp
import GameApp from "./src/GameApp";

//store
import store from "./src/store/store";

export default function App() {
  return (
    <Provider store={store}>
      <GameApp />
      <StatusBar style="auto" hidden={true} />
    </Provider>
  );
}


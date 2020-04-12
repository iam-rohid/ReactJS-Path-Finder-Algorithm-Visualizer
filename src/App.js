import "./static/css/main.css";
import React, { Component } from "react";
import PathFindingVisualizer from "./components/PathFindingVisualizer";

export class App extends Component {
  render() {
    return (
      <div>
        <PathFindingVisualizer />
      </div>
    );
  }
}

export default App;

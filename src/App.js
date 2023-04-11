import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/Common.css";
import Register from "./components/authentication/Register";

function App() {
  return (
    <div className="App">
      <h1>TinyTalk</h1>
      <Register />
    </div>
  );
}

export default App;

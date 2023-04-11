import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./components/css/Common.css";
import Register from "./components/loggedOut/Register";

function App() {
  return (
    <div className="App">
      <h1>TinyTalk</h1>
      <Register />
    </div>
  );
}

export default App;

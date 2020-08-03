import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route} from "react-router-dom";

import Navbar from "./components/navbar.component"
import UserInfo from "./components/user-info.component";
import TransactionsList from "./components/transactions-list.component";


function App() {
  return (
    <Router>
      <div className="container">
      <Navbar />
      <br/>
      <Route path="/" exact component={UserInfo} />
      <Route path="/transactions" component={TransactionsList} />
      </div>
    </Router>
  );
}

export default App;

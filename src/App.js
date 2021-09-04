import React from 'react';
import {BrowserRouter,Route,Switch} from 'react-router-dom';
import Login from "./pages/login";
import Admin from "./pages/admin";

function App() {
  return (
    <BrowserRouter>
        <Switch>
          <Route path='/login' exact component={Login}/>
          <Route path='/' component={Admin}/>
          {/*<Route path='/' component={Login}/>*/}
        </Switch>
    </BrowserRouter>
  );
}

export default App;

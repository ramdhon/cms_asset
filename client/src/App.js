import React from 'react';
import './App.css';
import Login from './views/Login';
import Register from './views/Register';
import Dashboard from './views/Dashboard';
import Home from './views/Home';
import { Route, Redirect } from 'react-router-dom';

function App() {
  return (
    <>
        <Route path="/" exact component={Home} />
        <PublicRoute path="/login" component={Login} />
        <PublicRoute path="/register" component={Register} />
        <PrivateRoute path="/dashboard" component={Dashboard} />
    </>
  );
}

function PrivateRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
          localStorage.getItem('token') ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
            }}
          />
        )
      }
    />
  );
}

function PublicRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
          !localStorage.getItem('token') ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/",
            }}
          />
        )
      }
    />
  );
}


export default App;

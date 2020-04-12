import React, { useEffect, useState } from 'react';
import './App.css';
import Login from './views/Login';
import Register from './views/Register';
import Dashboard from './views/Dashboard';
import Home from './views/Home';
import axios from './api/database';
import { Route, Redirect } from 'react-router-dom';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      axios
        .get('/user/decode', { headers: { token } })
        .then(({data}) => {
          const { decoded } = data;

          setUser({
            name: decoded.name,
            role: decoded.role
          });
        })
        .catch((err) => {
          setUser(null);
        })
    } else {
      setUser(null);
    }
  }, [user])

  return (
    <>
        <Route path="/" exact render={props => <Home auth={{ user, setUser }} {...props} />} />
        <PublicRoute path="/login" auth={{ user, setUser }} component={Login} />
        <PublicRoute path="/register" auth={{ user, setUser }} component={Register} />
        <PrivateRoute path="/dashboard" auth={{ user, setUser }} component={Dashboard} />
    </>
  );
}

function PrivateRoute({ component: Component, auth, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
          auth.user ? (
          <Component auth={auth} {...props} />
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

function PublicRoute({ component: Component, auth, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
          !auth.user ? (
          <Component auth={auth} {...props} />
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

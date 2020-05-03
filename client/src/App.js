import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

import './App.css';
import Login from './views/Login';
import Register from './views/Register';
import Dashboard from './views/Dashboard';
import Home from './views/Home';
import axios from './api/database';
import store from './store';
import { setUser } from './store/actions';

function App() {
  const [user, setHookUser] = useState(null);
  
  const unsubscribe = store.subscribe(() => {
    const storeState = store.getState();
    setHookUser(storeState.user);
  })
  
  useEffect(() => {
    return unsubscribe;
  })
  
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      axios
        .get('/user/decode', { headers: { token } })
        .then(({data}) => {
          const { decoded } = data;

          store.dispatch(setUser({
            name: decoded.name,
            role: decoded.role
          }));
        })
        .catch((err) => {
          store.dispatch(setUser(null));
        })
    } else {
      store.dispatch(setUser(null));
    }
  }, [user])

  return (
    <Provider store={store}>
        <Route path="/" exact render={props => <Home {...props} />} />
        <PublicRoute path="/login" component={Login} />
        <PublicRoute path="/register" component={Register} />
        <PrivateRoute path="/dashboard" component={Dashboard} />
    </Provider>
  );
}

function PrivateRoute({ component: Component, ...rest }) {
  const [user, setUser] = useState(null);
  
  const unsubscribe = store.subscribe(() => {
    const storeState = store.getState();
    setUser(storeState.user);
  })
  
  useEffect(() => {
    return unsubscribe;
  })

  return (
    <Route
      {...rest}
      render={props =>
          user ? (
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
  const [user, setUser] = useState(null);
  
  const unsubscribe = store.subscribe(() => {
    const storeState = store.getState();
    setUser(storeState.user);
  })

  useEffect(() => {
    return unsubscribe;
  })

  return (
    <Route
      {...rest}
      render={props =>
          !user ? (
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

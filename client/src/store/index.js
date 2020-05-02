import { createStore, applyMiddleware } from 'redux';
import reducer from './reducer';

const logger = store => next => action => {
  // any async will be here
  next(action);
}

const store = createStore(reducer, applyMiddleware(logger));

export default store;
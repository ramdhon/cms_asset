import { SET_USER } from './action-type';

const defaultState = {
  user: null
}

function reducer (state = defaultState, action) {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        user: action.payload
      }
    default:
      return state;
  }
}

export default reducer;
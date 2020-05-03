import { SET_USER, SET_SIDEBARON } from './action-type';

const defaultState = {
  user: null,
  sidebarOn: true
}

function reducer (state = defaultState, action) {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        user: action.payload
      }
    case SET_SIDEBARON:
      return {
        ...state,
        sidebarOn: action.payload
      }
    default:
      return state;
  }
}

export default reducer;
import { SET_USER, SET_SIDEBARON } from './action-type';

export const setUser = (payload) => ({
  type: SET_USER,
  payload
});

export const setSidebarOn = (payload) => ({
  type: SET_SIDEBARON,
  payload
});
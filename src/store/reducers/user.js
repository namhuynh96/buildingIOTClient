import * as actionTypes from "../actions/types";
import { updateObject } from "../../shared/utility";

const initialState = {
  loading: false,
  error: false,
  isAdmin: false,
  userData: {
    username: null,
    isAccepted: false,
    isRequesting: false
  },
  allUsers: []
};

const userRequestStart = (state, action) => {
  return updateObject(state, { loading: true });
};

const userRequestFail = (state, action) => {
  return updateObject(state, { loading: false, error: true });
};

const setIsAdmin = (state, action) => {
  return updateObject(state, { isAdmin: action.isAdmin, loading: false });
};

const setUserData = (state, action) => {
  const updatedUserData = updateObject(state.userData, action.userData);
  return updateObject(state, {
    userData: updatedUserData,
    loading: false
  });
};

const setIsRequesting = (state, action) => {
  const updatedUserData = updateObject(state.userData, {
    isRequesting: action.isRequesting
  });
  return updateObject(state, { userData: updatedUserData, loading: false });
};

const fetchAllUsersSuccess = (state, action) => {
  return updateObject(state, { allUsers: action.allUsers });
};

const updateUserSuccess = (state, action) => {
  let updatedAllUsers = [...state.allUsers];
  const user = updatedAllUsers.find(
    user => user._id === action.updatedUser._id
  );
  for (const key in action.updatedUser) {
    user[key] = action.updatedUser[key];
  }
  return updateObject(state, { allUsers: updatedAllUsers });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.USER_REQUEST_START:
      return userRequestStart(state, action);
    case actionTypes.USER_REQUEST_FAIL:
      return userRequestFail(state, action);

    case actionTypes.SET_IS_ADMIN:
      return setIsAdmin(state, action);

    case actionTypes.SET_USER_DATA:
      return setUserData(state, action);

    case actionTypes.SET_IS_REQUESTING:
      return setIsRequesting(state, action);

    case actionTypes.FETCH_ALL_USERS_SUCCESS:
      return fetchAllUsersSuccess(state, action);

    case actionTypes.UPDATE_USER_SUCCESS:
      return updateUserSuccess(state, action);

    default:
      return state;
  }
};

export default reducer;

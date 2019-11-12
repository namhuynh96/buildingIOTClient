import * as actionTypes from "./types";
import axios from "axios";

const userRequestStart = () => {
  return {
    type: actionTypes.USER_REQUEST_START
  };
};

const userRequestFail = () => {
  return {
    type: actionTypes.USER_REQUEST_FAIL
  };
};

const setIsAdmin = isAdmin => {
  return {
    type: actionTypes.SET_IS_ADMIN,
    isAdmin
  };
};

const setUserData = (username, isAccepted, isRequesting) => {
  return {
    type: actionTypes.SET_USER_DATA,
    userData: { username, isAccepted, isRequesting }
  };
};

export const setAdminOrUserData = () => {
  return dispatch => {
    dispatch(userRequestStart());
    axios
      .get("/api/users")
      .then(res => {
        if (res.data.isAdmin) {
          dispatch(setIsAdmin(true));
        } else {
          const { username, email, isAccepted, isRequesting } = res.data;
          dispatch(
            setUserData(username ? username : email, isAccepted, isRequesting)
          );
        }
      })
      .catch(e => {
        dispatch(userRequestFail());
      });
  };
};

const requestToControllSuccess = isRequesting => {
  return {
    type: actionTypes.SET_IS_REQUESTING,
    isRequesting
  };
};

export const requestToControll = cognitoIdentityId => {
  return dispatchEvent => {
    dispatchEvent(userRequestStart);
    axios
      .post("/api/requestControll", { cognitoIdentityId })
      .then(res =>
        dispatchEvent(requestToControllSuccess(res.data.isRequesting))
      )
      .catch(e => dispatchEvent(userRequestFail()));
  };
};

const fetchAddUsersSuccess = allUsers => {
  return {
    type: actionTypes.FETCH_ALL_USERS_SUCCESS,
    allUsers
  };
};

export const fetchAllUsers = query => {
  return dispatchEvent => {
    dispatchEvent(userRequestStart());
    axios
      .get("/api/allUsers" + query)
      .then(res => {
        dispatchEvent(fetchAddUsersSuccess(res.data));
      })
      .catch(e => dispatchEvent(userRequestFail()));
  };
};

const updateUserSuccess = updatedUser => {
  return {
    type: actionTypes.UPDATE_USER_SUCCESS,
    updatedUser
  };
};

export const acceptUser = id => {
  return dispatchEvent => {
    dispatchEvent(userRequestStart());
    axios
      .patch("/api/acceptUser/" + id)
      .then(res => dispatchEvent(updateUserSuccess(res.data)))
      .catch(e => dispatchEvent(userRequestFail()));
  };
};

export const detachUser = id => {
  return dispatchEvent => {
    dispatchEvent(userRequestStart());
    axios
      .patch("/api/detachUser/" + id)
      .then(res => dispatchEvent(updateUserSuccess(res.data)))
      .catch(e => dispatchEvent(userRequestFail()));
  };
};

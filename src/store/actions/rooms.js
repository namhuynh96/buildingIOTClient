import * as actionTypes from "./types";
import axios from "axios";

const roomRequestStart = () => {
  return {
    type: actionTypes.ROOM_REQUEST_START
  }
}

const roomRequestFail = () => {
  return {
    type: actionTypes.ROOM_REQUEST_FAIL
  }
}

const fetchRoomsSuccess = rooms => {
  return {
    type: actionTypes.FETCH_ROOMS_SUCCESS,
    rooms
  };
};

export const fetchRooms = buildingId => {
  return dispatchEvent => {
    dispatchEvent(roomRequestStart());
    axios
      .get(`/api/rooms/${buildingId}`)
      .then(res => {
        dispatchEvent(fetchRoomsSuccess(res.data));
      })
      .catch(e => dispatchEvent(roomRequestFail()));
  };
};

const addRoomSuccess = roomData => {
  return {
    type: actionTypes.ADD_ROOM_SUCCESS,
    roomData
  };
};

export const addRoom = (buildingId, roomName) => {
  return dispatchEvent => {
    dispatchEvent(roomRequestStart());
    axios
      .post(`/api/rooms/${buildingId}`, {name: roomName})
      .then(res => {
        dispatchEvent(addRoomSuccess(res.data));
      })
      .catch(e => dispatchEvent(roomRequestFail()));
  };
};

const updateRoomSuccess = roomData => {
  return {
    type: actionTypes.UPDATE_ROOM_SUCCESS,
    roomData
  };
};

export const updateRoom = (buildingId, roomId, roomName) => {
  return dispatchEvent => {
    dispatchEvent(roomRequestStart());
    axios
      .patch(`/api/rooms/${buildingId}/${roomId}`, {name: roomName})
      .then(res => {
        dispatchEvent(updateRoomSuccess(res.data));
      })
      .catch(e => dispatchEvent(roomRequestFail()));
  };
};

const deleteRoomSuccess = roomId => {
  return {
    type: actionTypes.DELETE_ROOM_SUCCESS,
    roomId
  };
};

export const deleteRoom = (roomId) => {
  return dispatchEvent => {
    dispatchEvent(roomRequestStart());
    axios
      .delete(`/api/rooms/${roomId}`)
      .then(res => {
        dispatchEvent(deleteRoomSuccess(res.data._id));
      })
      .catch(e => dispatchEvent(roomRequestFail()));
  };
};

export const selectRoom = roomId => {
  return {
    type: actionTypes.SELECT_ROOM,
    roomId
  };
};

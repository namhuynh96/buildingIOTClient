import * as actionTypes from "../actions/types";
import { updateObject } from "../../shared/utility";

const initialState = {
  rooms: null,
  selectedRoomId: null,
  loading: false,
  error: false
};

const roomRequestStart = (state, action) => {
  return updateObject(state, { loading: true });
};

const roomRequestFail = (state, action) => {
  return updateObject(state, { loading: false, error: true });
};

const fetchRoomsSuccess = (state, action) => {
  const { rooms } = action;
  return updateObject(state, {
    rooms,
    selectedRoomId: rooms.length ? rooms[0]._id : null,
    loading: false
  });
};

const addRoomSuccess = (state, action) => {
  return updateObject(state, {
    rooms: state.rooms.concat(action.roomData),
    loading: false
  });
};

const updateRoomSuccess = (state, action) => {
  const updatedRooms = state.rooms.map(r => {
    if (r._id === action.roomData._id) {
      return action.roomData;
    }
    return r;
  });
  return updateObject(state, {
    rooms: updatedRooms,
    loading: false
  });
};

const deleteRoomSuccess = (state, action) => {
  return updateObject(state, {
    rooms: state.rooms.filter(r => r._id !== action.roomId),
    loading: false
  });
};

const selectRoom = (state, action) => {
  return updateObject(state, {
    selectedRoomId: action.roomId
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ROOM_REQUEST_START:
      return roomRequestStart(state, action);
    case actionTypes.ROOM_REQUEST_FAIL:
      return roomRequestFail(state, action);

    case actionTypes.FETCH_ROOMS_SUCCESS:
      return fetchRoomsSuccess(state, action);

    case actionTypes.ADD_ROOM_SUCCESS:
      return addRoomSuccess(state, action);

    case actionTypes.UPDATE_ROOM_SUCCESS:
      return updateRoomSuccess(state, action);

    case actionTypes.DELETE_ROOM_SUCCESS:
      return deleteRoomSuccess(state, action);

    case actionTypes.SELECT_ROOM:
      return selectRoom(state, action);

    default:
      return state;
  }
};

export default reducer;

import * as actionTypes from "../actions/types";
import { updateObject } from "../../shared/utility";

const initialState = {
  loading: false,
  error: false,
  devices: null,
  initialDevicesId: null,
  addedDeviceId: null
};

const requestDeviceStart = (state, action) => {
  return updateObject(state, { loading: true });
};

const requestDeviceFail = (state, action) => {
  return updateObject(state, { loading: false, error: true });
};

const fetchDevicesSuccess = (state, action) => {
  return updateObject(state, {
    devices: action.devices,
    loading: false
  });
};

const fetchAllDevicesId = (state, action) => {
  return updateObject(state, {
    initialDevicesId: action.devicesId
  });
};

const addDeviceSuccess = (state, action) => {
  return updateObject(state, {
    devices: state.devices.concat(action.deviceData),
    addedDeviceId: action.deviceData._id,
    loading: false
  });
};

const updateDeviceSuccess = (state, action) => {
  const updatedDevicesArray = state.devices.map(d => {
    if (d._id === action.deviceData._id) {
      return action.deviceData;
    }
    return d;
  });
  return updateObject(state, {
    devices: updatedDevicesArray,
    loading: false
  });
};

const deleteDeviceSuccess = (state, action) => {
  return updateObject(state, {
    devices: state.devices.filter(d => d._id !== action.deviceId),
    loading: false
  });
};

const setDevicesToNull = (state, action) => {
  return updateObject(state, { devices: null });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.DEVICE_REQUEST_START:
      return requestDeviceStart(state, action);
    case actionTypes.DEVICE_REQUEST_FAIL:
      return requestDeviceFail(state, action);

    case actionTypes.FETCH_DEVICES_SUCCESS:
      return fetchDevicesSuccess(state, action);

    case actionTypes.FETCH_ALL_DEVICES_ID_SUCCESS:
      return fetchAllDevicesId(state, action);

    case actionTypes.ADD_DEVICE_SUCCESS:
      return addDeviceSuccess(state, action);

    case actionTypes.UPDATE_DEVICE_SUCCESS:
      return updateDeviceSuccess(state, action);

    case actionTypes.DELETE_DEVICE_SUCCESS:
      return deleteDeviceSuccess(state, action);

    case actionTypes.SET_DEVICES_TO_NULL:
      return setDevicesToNull(state, action);

    default:
      return state;
  }
};

export default reducer;

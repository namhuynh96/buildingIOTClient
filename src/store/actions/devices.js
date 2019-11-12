import * as actionTypes from "./types";
import axios from "axios";

const deviceRequestStart = () => {
  return {
    type: actionTypes.DEVICE_REQUEST_START
  };
};

const deviceRequestFail = () => {
  return {
    type: actionTypes.DEVICE_REQUEST_FAIL
  };
};

const fetchDevicesSuccess = devices => {
  return {
    type: actionTypes.FETCH_DEVICES_SUCCESS,
    devices
  };
};

export const fetchDevices = roomId => {
  return dispatchEvent => {
    dispatchEvent(deviceRequestStart());
    axios
      .get(`/api/devices/${roomId}`)
      .then(res => dispatchEvent(fetchDevicesSuccess(res.data)))
      .catch(e => dispatchEvent(deviceRequestFail()));
  };
};

const fetchAllDevicesIdSuccess = devicesId => {
  return {
    type: actionTypes.FETCH_ALL_DEVICES_ID_SUCCESS,
    devicesId
  };
};

export const fetchAllDevicesId = () => {
  return dispatchEvent => {
    dispatchEvent(deviceRequestStart);
    axios
      .get("/api/alldevicesid")
      .then(res => dispatchEvent(fetchAllDevicesIdSuccess(res.data)))
      .catch(e => dispatchEvent(deviceRequestFail()));
  };
};

const addDeviceSuccess = deviceData => {
  return {
    type: actionTypes.ADD_DEVICE_SUCCESS,
    deviceData
  };
};

export const addDevice = (buildingId, roomId, deviceData) => {
  return dispatchEvent => {
    dispatchEvent(deviceRequestStart());
    axios
      .post(`/api/devices/${buildingId}/${roomId}`, deviceData)
      .then(res => dispatchEvent(addDeviceSuccess(res.data)))
      .catch(e => dispatchEvent(deviceRequestFail()));
  };
};

const updateDeviceSuccess = deviceData => {
  return {
    type: actionTypes.UPDATE_DEVICE_SUCCESS,
    deviceData
  };
};

export const updateDevice = (roomId, deviceId, deviceData) => {
  return dispatchEvent => {
    dispatchEvent(deviceRequestStart());
    axios
      .patch(`/api/devices/${roomId}/${deviceId}`, deviceData)
      .then(res => dispatchEvent(updateDeviceSuccess(res.data)))
      .catch(e => dispatchEvent(deviceRequestFail()));
  };
};

export const updateDeviceConfigs = (deviceId, configsData) => {
  return dispatchEvent => {
    dispatchEvent(deviceRequestStart());
    axios
      .patch(`/api/deviceconfigs/${deviceId}`, configsData)
      .then(res => dispatchEvent(updateDeviceSuccess(res.data)))
      .catch(e => dispatchEvent(deviceRequestFail()));
  };
};

const deleteDeviceSuccess = deviceId => {
  return {
    type: actionTypes.DELETE_DEVICE_SUCCESS,
    deviceId
  };
};

export const deleteDevice = deviceId => {
  return dispatchEvent => {
    dispatchEvent(deviceRequestStart());
    axios
      .delete(`/api/devices/${deviceId}`)
      .then(res => dispatchEvent(deleteDeviceSuccess(res.data._id)))
      .catch(e => dispatchEvent(deviceRequestFail()));
  };
};

export const setDevicesToNull = () => {
  return {
    type: actionTypes.SET_DEVICES_TO_NULL
  };
};

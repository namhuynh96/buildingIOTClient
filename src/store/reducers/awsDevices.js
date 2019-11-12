import * as actionTypes from "../actions/types";
import { updateObject } from "../../shared/utility";

const initialState = {
  awsDeviceData: []
};

const setAwsDeviceData = (state, action) => {
  const updatedAwsDeviceData = [...state.awsDeviceData];
  const existingDevice = updatedAwsDeviceData.find(
    device => device.id === action.data.id
  );
  if (!existingDevice) {
    updatedAwsDeviceData.push(action.data);
  } else {
    for (const key in existingDevice) {
      existingDevice[key] = action.data[key]
    }
  }
  return updateObject(state, { awsDeviceData: updatedAwsDeviceData });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_AWS_DEVICE_DATA:
      return setAwsDeviceData(state, action);

    default:
      return state;
  }
};

export default reducer;

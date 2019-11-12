import { combineReducers } from "redux";
import { reducer as reduxForm } from "redux-form";
import buildingsReducer from "./buildings";
import roomsReducer from "./rooms";
import devicesReducer from "./devices";
import awsDevicesReducer from "./awsDevices";
import userReducer from "./user";

export default combineReducers({
  form: reduxForm,
  buildings: buildingsReducer,
  rooms: roomsReducer,
  devices: devicesReducer,
  awsDevices: awsDevicesReducer,
  user: userReducer
});

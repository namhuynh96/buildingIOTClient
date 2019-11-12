import * as actionTypes from "../actions/types";
import { updateObject } from "../../shared/utility";

const initialState = {
  buildings: null,
  selectedBuildingId: null,
  loading: false,
  error: false
};

const buildingRequestStart = (state, action) => {
  return updateObject(state, { loading: true });
};

const buildingRequestFail = (state, action) => {
  return updateObject(state, { loading: false, error: true });
};

const fetchBuildingsSuccess = (state, action) => {
  const { buildings } = action;
  return updateObject(state, {
    buildings,
    selectedBuildingId: buildings.length ? buildings[0]._id : null,
    loading: false
  });
};

const addBuildingSuccess = (state, action) => {
  return updateObject(state, {
    buildings: state.buildings.concat(action.building),
    loading: false
  });
};

const updateBuildingSuccess = (state, action) => {
  const updatedBuildings = state.buildings.map(b => {
    if (b._id === action.building._id) {
      return action.building;
    }
    return b;
  });
  return updateObject(state, {
    buildings: updatedBuildings,
    loading: false
  });
};
const deleteBuildingSuccess = (state, action) => {
  return updateObject(state, {
    buildings: state.buildings.filter(b => b._id !== action.buildingId),
    loading: false
  });
};

const selectBuilding = (state, action) => {
  return updateObject(state, {
    selectedBuildingId: action.buildingId
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.BUILDING_REQUEST_START:
      return buildingRequestStart(state, action);
    case actionTypes.BUILDING_REQUEST_FAIL:
      return buildingRequestFail(state, action);

    case actionTypes.FETCH_BUILDINGS_SUCCESS:
      return fetchBuildingsSuccess(state, action);

    case actionTypes.ADD_BUILDING_SUCCESS:
      return addBuildingSuccess(state, action);

    case actionTypes.UPDATE_BUILDING_SUCCESS:
      return updateBuildingSuccess(state, action);

    case actionTypes.DELETE_BUILDING_SUCCESS:
      return deleteBuildingSuccess(state, action);

    case actionTypes.SELECT_BUILDING:
      return selectBuilding(state, action);

    default:
      return state;
  }
};

export default reducer;

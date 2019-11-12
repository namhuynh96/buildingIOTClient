import * as actionTypes from "./types";
import axios from "axios";

const buildingRequestStart = () => {
  return {
    type: actionTypes.BUILDING_REQUEST_START
  }
}

const buildingRequestFail = () => {
  return {
    type: actionTypes.BUILDING_REQUEST_FAIL
  }
}

const fetchBuildingsSuccess = buildings => {
  return {
    type: actionTypes.FETCH_BUILDINGS_SUCCESS,
    buildings
  };
};

export const fetchBuildings = () => {
  return dispatchEvent => {
    dispatchEvent(buildingRequestStart());
    axios
      .get("/api/buildings")
      .then(res => {
        dispatchEvent(fetchBuildingsSuccess(res.data));
      })
      .catch(e => dispatchEvent(buildingRequestFail()));
  };
};

const addBuildingSuccess = building => {
  return {
    type: actionTypes.ADD_BUILDING_SUCCESS,
    building
  };
};

export const addBuilding = name => {
  return dispatchEvent => {
    dispatchEvent(buildingRequestStart());
    axios
      .post("/api/buildings", {name})
      .then(res => {
        dispatchEvent(addBuildingSuccess(res.data));
      })
      .catch(e => dispatchEvent(buildingRequestFail()));
  };
};

const updateBuildingSuccess = building => {
  return {
    type: actionTypes.UPDATE_BUILDING_SUCCESS,
    building
  };
};

export const updateBuilding = (buildingId, name) => {
  return dispatchEvent => {
    dispatchEvent(buildingRequestStart());
    axios
      .patch(`/api/buildings/${buildingId}`, {name})
      .then(res => {
        dispatchEvent(updateBuildingSuccess(res.data));
      })
      .catch(e => dispatchEvent(buildingRequestFail()));
  };
};

const deleteBuildingSuccess = buildingId => {
  return {
    type: actionTypes.DELETE_BUILDING_SUCCESS,
    buildingId
  };
};

export const deleteBuilding = buildingId => {
  return dispatchEvent => {
    dispatchEvent(buildingRequestStart());
    axios
      .delete(`/api/buildings/${buildingId}`)
      .then(res => {
        dispatchEvent(deleteBuildingSuccess(res.data._id));
      })
      .catch(e => dispatchEvent(buildingRequestFail()));
  };
};

export const selectBuilding = buildingId => {
  return {
    type: actionTypes.SELECT_BUILDING,
    buildingId
  };
};




import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import * as actions from "../../../../store/actions";
import RadioButton from "../../../../components/UI/RadioButton/RadioButton";
import CircularProgress from "@material-ui/core/CircularProgress";

const Buildings = props => {
  const { buildings, selectedBuildingId, error } = useSelector(
    state => state.buildings
  );

  const dispatch = useDispatch();
  const onFetchBuildings = useCallback(
    () => dispatch(actions.fetchBuildings()),
    [dispatch]
  );

  useEffect(() => {
    onFetchBuildings();
  }, [onFetchBuildings]);

  const changeBuildingHandler = buildingId => {
    dispatch(actions.selectBuilding(buildingId));
  };

  let renderBuildings = error ? (
    <h5>Buildings cannot be loaded</h5>
  ) : (
    <CircularProgress />
  );
  if (buildings) {
    renderBuildings = buildings.map((b, index) => (
      <div key={b._id}>
        <RadioButton
          label={b.name}
          name="building"
          value={b.name}
          changed={() => changeBuildingHandler(b._id)}
          checked={b._id === selectedBuildingId}
        />
      </div>
    ));
  }

  return <div>{renderBuildings}</div>;
};

export default Buildings;

import React, { useState, useEffect, useCallback } from "react";
import { reduxForm } from "redux-form";
import { useSelector, useDispatch } from "react-redux";

import BuildingFormReview from "./BuildingFormReview";
import BuildingForm from "./BuildingForm";
import * as actions from "../../store/actions";
import classes from "./BuildingNew.module.css";

const BuildingNew = props => {
  const [showFormReview, setShowFormReview] = useState(false);

  const { buildings } = useSelector(state => state.buildings);
  const dispatch = useDispatch();
  const onFetchBuildings = useCallback(
    () => dispatch(actions.fetchBuildings()),
    [dispatch]
  );

  useEffect(() => {
    onFetchBuildings();
  }, [onFetchBuildings]);

  const renderContent = () => {
    if (showFormReview) {
      return (
        <BuildingFormReview
          {...props}
          onCancel={() => setShowFormReview(false)}
        />
      );
    }
    return (
      buildings && (
        <BuildingForm
          history={props.history}
          onSubmit={() => setShowFormReview(true)}
          buildings={buildings.map(b => b.name)}
        />
      )
    );
  };

  return <div className={classes.BuildingNew}>{renderContent()}</div>;
};

export default reduxForm({
  form: "buildingForm"
})(BuildingNew);

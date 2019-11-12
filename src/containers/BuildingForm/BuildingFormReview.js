import React, { useState } from "react";
import { connect } from "react-redux";
import axios from "axios";

import Button from "../../components/UI/Button/Button";
import Spinner from "../../components/UI/Spinner/Spinner";
import Modal from "../../components/UI/Modal/Modal";

const BuildingFormReview = props => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const submitHandler = values => {
    setLoading(true);
    setError(null);
    axios
      .post("/api/buildings", values)
      .then(res => {
        setLoading(false);
        props.history.push("/");
      })
      .catch(e => {
        setLoading(false);
        setError("Something went wrong");
      });
  };

  const errorConfirmHandler = () => {
    setError(null);
    props.history.push("/");
  };
  console.log(props.formValues);

  return (
    <div>
      <h5>Please confirm your building</h5>
      <div>
        <label>Building Name:</label>
        <div>{props.formValues.buildingName}</div>
      </div>
      <div>
        <label>Rooms:</label>
        <div>
          {props.formValues.rooms.map(room => (
            <span key={room.name} style={{ margin: "3px", display: "block" }}>
              {`${room.name}: ${room.devices.map(d =>
                d.type ? d.name + ` (${d.type}) ` : d.name
              )}`}
            </span>
          ))}
        </div>
      </div>
      <Button buttonType="Danger" clicked={props.onCancel}>
        Back
      </Button>
      <Button
        buttonType="Success"
        clicked={() => submitHandler(props.formValues)}
      >
        Build
      </Button>
      <Modal show={error} backdropClicked={errorConfirmHandler}>
        {error}
      </Modal>
      <div>{loading && <Spinner />}</div>
    </div>
  );
};

const mapStateToProps = state => ({
  formValues: state.form.buildingForm.values
});

export default connect(mapStateToProps)(BuildingFormReview);

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import { updateObject, checkValidity } from "../../../../../shared/utility";
import * as actions from "../../../../../store/actions";
import Backdrop from "../../../../../components/UI/Backdrop/Backdrop";

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.primary,
    zIndex: 500,
    position: "relative"
  },
  formControl: {
    margin: theme.spacing(3)
  }
}));

const UpdateRoomForm = props => {
  const classes = useStyles();

  const { buildings } = useSelector(state => state.buildings);

  const initialbuildingData = props.buildingData;

  const dispatch = useDispatch();

  const [updateBuildingForm, setUpdateBuildingForm] = useState({
    name: {
      value: initialbuildingData.name,
      validation: {
        required: true,
        checkDuplicatedElementsInArray: true,
        checkAWSIotPattern: true
      },
      errorMessage: null,
      valid: true
    }
  });
  const [formIsValid, setFormIsValid] = useState(false);

  const inputChangedHandler = event => {
    const inputIdentifier = event.target.name;
    const eventValue = event.target.value;

    const buildingsArray = [...buildings];
    buildingsArray.splice(props.buildingIndex, 1);
    const buildingsNameArray = buildingsArray.map(b => b.name);
    buildingsNameArray.push(eventValue);
    const errorMessage = checkValidity(
      eventValue,
      buildingsNameArray,
      updateBuildingForm[inputIdentifier].validation
    );
    const updatedFormElement = updateObject(
      updateBuildingForm[inputIdentifier],
      {
        value: eventValue,
        errorMessage,
        valid: errorMessage === null
      }
    );

    const updatedUpdateBuildingForm = updateObject(updateBuildingForm, {
      [inputIdentifier]: updatedFormElement
    });

    let formIsValid = true;
    for (let inputKey in updatedUpdateBuildingForm) {
      formIsValid =
        updatedUpdateBuildingForm[inputKey].valid &&
        updatedUpdateBuildingForm[inputKey].value !==
          initialbuildingData[inputKey] &&
        formIsValid;
    }

    setUpdateBuildingForm(updatedUpdateBuildingForm);
    setFormIsValid(formIsValid);
  };

  const submitHandler = event => {
    event.preventDefault();
    dispatch(
      actions.updateBuilding(
        props.buildingData._id,
        updateBuildingForm.name.value
      )
    );
    props.onCancel();
  };

  return (
    <div>
      <Paper className={classes.paper}>
        <form onSubmit={submitHandler}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <TextField
                error={!updateBuildingForm.name.valid}
                label="Building Name"
                value={updateBuildingForm.name.value}
                name="name"
                onChange={inputChangedHandler}
                autoFocus={true}
                margin="normal"
              />
            </Grid>
            {updateBuildingForm.name.errorMessage && (
              <Grid item xs={12}>
                <div style={{ color: "red" }}>
                  {updateBuildingForm.name.errorMessage}
                </div>
              </Grid>
            )}
            <Grid item xs={6}>
              <Button
                variant="contained"
                onClick={props.onCancel}
                type="button"
              >
                Cancel
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={!formIsValid}
              >
                Save
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
      <Backdrop show={true} clicked={props.onCancel} />
    </div>
  );
};

export default UpdateRoomForm;

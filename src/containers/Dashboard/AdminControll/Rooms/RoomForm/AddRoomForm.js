import React, { useState } from "react";
import { useDispatch } from "react-redux";
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

const AddDeviceForm = props => {
  const classes = useStyles();

  const dispatch = useDispatch();

  const [addRoomForm, setAddRoomForm] = useState({
    roomName: {
      value: "",
      validation: {
        required: true,
        checkDuplicatedElementsInArray: true
      },
      errorMessage: null,
      touched: false
    }
  });
  const [formIsValid, setFormIsValid] = useState(false);

  const inputChangedHandler = event => {
    const inputIdentifier = event.target.name;
    const eventValue = event.target.value;

    const roomsNameArray = [...props.roomsName];
    roomsNameArray.push(eventValue);
    const updatedFormElement = updateObject(addRoomForm[inputIdentifier], {
      value: eventValue,
      errorMessage: checkValidity(
        eventValue,
        roomsNameArray,
        addRoomForm[inputIdentifier].validation
      ),
      touched: true
    });

    const updatedAddRoomForm = updateObject(addRoomForm, {
      [inputIdentifier]: updatedFormElement
    });

    let formIsValid = true;
    for (let inputKey in updatedAddRoomForm) {
      formIsValid =
        !updatedAddRoomForm[inputKey].errorMessage &&
        updatedAddRoomForm[inputKey].touched &&
        formIsValid;
    }
    setAddRoomForm(updatedAddRoomForm);
    setFormIsValid(formIsValid);
  };

  const submitHandler = event => {
    event.preventDefault();
    dispatch(
      actions.addRoom(props.currentBuildingId, addRoomForm.roomName.value)
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
                error={addRoomForm.roomName.errorMessage !== null}
                label="Room Name"
                value={addRoomForm.roomName.value}
                name="roomName"
                onChange={inputChangedHandler}
                autoFocus={true}
                margin="normal"
              />
            </Grid>
            {addRoomForm.roomName.errorMessage && (
              <Grid item xs={12}>
                <div style={{ color: "red" }}>
                  {addRoomForm.roomName.errorMessage}
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
                Add
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
      <Backdrop show={true} clicked={props.onCancel} />
    </div>
  );
};

export default AddDeviceForm;

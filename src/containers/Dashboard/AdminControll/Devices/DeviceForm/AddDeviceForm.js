import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Input from "../../../../../components/UI/Input/Input";
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
  const { selectedBuildingId } = useSelector(state => state.buildings);

  const [addDeviceForm, setAddDeviceForm] = useState({
    deviceName: {
      value: "",
      validation: {
        required: true,
        checkDuplicatedElementsInArray: true
      },
      errorMessage: null,
      touched: false
    },
    deviceType: {
      value: "digital",
      errorMessage: null,
      touched: true
    }
  });
  const analogConfigs = {
    lowerLimit: {
      elementType: "input",
      elementConfig: {
        type: "number",
        label: "Lower Limit"
      },
      value: "",
      validation: {
        required: true
      },
      errorMessage: null,
      touched: false
    },
    upperLimit: {
      elementType: "input",
      elementConfig: {
        type: "number",
        label: "Upper Limit"
      },
      value: "",
      validation: {
        required: true
      },
      errorMessage: null,
      touched: false
    },
    step: {
      elementType: "input",
      elementConfig: {
        type: "number",
        label: "Step"
      },
      value: "",
      validation: {
        required: true
      },
      errorMessage: null,
      touched: false
    },
    unit: {
      elementType: "input",
      elementConfig: {
        type: "text",
        label: "Unit"
      },
      value: "",
      validation: {
        required: true
      },
      errorMessage: null,
      touched: false
    }
  };
  const [formIsValid, setFormIsValid] = useState(false);

  const inputChangedHandler = event => {
    const inputIdentifier = event.target.name;
    const eventValue = event.target.value;
    let finalAddDeviceForm = { ...addDeviceForm };
    if (inputIdentifier === "deviceType" && eventValue === "analog") {
      finalAddDeviceForm = updateObject(addDeviceForm, analogConfigs);
    } else if (inputIdentifier === "deviceType" && eventValue === "digital") {
      const { deviceName, deviceType } = finalAddDeviceForm;
      finalAddDeviceForm = { deviceName, deviceType };
    }

    const devicesNameArray = [...props.devicesName];
    devicesNameArray.push(eventValue);
    const updatedFormElement = updateObject(
      finalAddDeviceForm[inputIdentifier],
      {
        value: eventValue,
        errorMessage: checkValidity(
          eventValue,
          devicesNameArray,
          finalAddDeviceForm[inputIdentifier].validation
        ),
        touched: true
      }
    );

    const updatedAddDeviceForm = updateObject(finalAddDeviceForm, {
      [inputIdentifier]: updatedFormElement
    });

    let formIsValid = true;
    for (let inputKey in updatedAddDeviceForm) {
      formIsValid =
        !updatedAddDeviceForm[inputKey].errorMessage &&
        updatedAddDeviceForm[inputKey].touched &&
        formIsValid;
    }
    setAddDeviceForm(updatedAddDeviceForm);
    setFormIsValid(formIsValid);
  };

  const submitHandler = event => {
    event.preventDefault();
    const deviceData = {};
    const { deviceName, deviceType } = addDeviceForm;

    deviceData.name = deviceName.value;
    if (deviceType.value === "digital") {
      deviceData.configs = { type: "digital" };
    } else if (deviceType.value === "analog") {
      const { lowerLimit, upperLimit, step, unit } = addDeviceForm;
      deviceData.configs = {
        type: "analog",
        min: lowerLimit.value,
        max: upperLimit.value,
        step: step.value,
        unit: unit.value
      };
    }
    dispatch(
      actions.addDevice(selectedBuildingId, props.currentRoomId, deviceData)
    );
    props.onCancel();
  };

  const formAnalogConfigsArray = [];
  for (let key in addDeviceForm) {
    if (
      key === "lowerLimit" ||
      key === "upperLimit" ||
      key === "step" ||
      key === "unit"
    ) {
      formAnalogConfigsArray.push({
        id: key,
        config: addDeviceForm[key]
      });
    }
  }
  const analogConfigsField = formAnalogConfigsArray.length ? (
    <Grid item xs={6}>
      <Grid container spacing={5}>
        {formAnalogConfigsArray.map(formElement => (
          <Grid item xs={3} key={formElement.id}>
            <Input
              elementType={formElement.config.elementType}
              elementConfig={formElement.config.elementConfig}
              value={formElement.config.value}
              name={formElement.id}
              invalid={formElement.config.errorMessage !== null}
              shouldCheckValid={formElement.config.validation}
              touched={formElement.config.touched}
              onChange={inputChangedHandler}
            />
          </Grid>
        ))}
      </Grid>
    </Grid>
  ) : null;

  const deviceTypeValue = addDeviceForm.deviceType.value;

  const errorsField = (
    <React.Fragment>
      <Grid item xs={deviceTypeValue === "digital" ? 6 : 3}>
        <div style={{ color: "red" }}>
          {addDeviceForm.deviceName.errorMessage}
        </div>
      </Grid>
      {deviceTypeValue !== "digital" && <Grid item xs={3}></Grid>}
      <Grid item xs={6}>
        <Grid container spacing={5}>
          {deviceTypeValue === "analog" &&
            Object.keys(analogConfigs).map(analogConfig => (
              <Grid item xs={3} key={analogConfig}>
                <div style={{ color: "red" }}>
                  {addDeviceForm[analogConfig].errorMessage}
                </div>
              </Grid>
            ))}
        </Grid>
      </Grid>
    </React.Fragment>
  );

  return (
    <div>
      <Paper className={classes.paper}>
        <form onSubmit={submitHandler}>
          <Grid container spacing={1}>
            <Grid item xs={deviceTypeValue === "digital" ? 6 : 3}>
              <TextField
                error={addDeviceForm.deviceName.errorMessage !== null}
                label="Device Name"
                value={addDeviceForm.deviceName.value}
                name="deviceName"
                onChange={inputChangedHandler}
                autoFocus={true}
                margin="normal"
              />
            </Grid>
            <Grid item xs={deviceTypeValue === "digital" ? 6 : 3}>
              <FormControl component="fieldset" className={classes.formControl}>
                <FormLabel component="legend">Device Type</FormLabel>
                <RadioGroup
                  aria-label="deviceType"
                  name="deviceType"
                  value={deviceTypeValue}
                  onChange={inputChangedHandler}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <FormControlLabel
                        value="digital"
                        control={<Radio color="primary" />}
                        label="Digital"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <FormControlLabel
                        value="analog"
                        control={<Radio color="primary" />}
                        label="Analog"
                      />
                    </Grid>
                  </Grid>
                </RadioGroup>
              </FormControl>
            </Grid>

            {analogConfigsField}
            {errorsField}

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

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

const UpdateDeviceForm = props => {
  const classes = useStyles();

  const { devices } = useSelector(state => state.devices);

  const initialDeviceData = props.deviceData;

  const dispatch = useDispatch();
  const onSubmitForm = deviceData => {
    if (deviceData.name !== initialDeviceData.name) {
      return dispatch(
        actions.updateDevice(
          props.currentRoomId,
          initialDeviceData._id,
          deviceData
        )
      );
    }
    dispatch(
      actions.updateDeviceConfigs(initialDeviceData._id, {
        configs: deviceData.configs
      })
    );
  };

  const deviceTypeValue = initialDeviceData.configs.type;
  const analogConfigs = {
    min: {
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
      valid: false
    },
    max: {
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
      valid: false
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
      valid: false
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
      valid: false
    }
  };
  if (deviceTypeValue === "analog") {
    for (let key in analogConfigs) {
      analogConfigs[key].value = initialDeviceData.configs[key];
      analogConfigs[key].valid = true;
    }
  }
  const baseConfigs = {
    deviceName: {
      value: initialDeviceData.name,
      validation: {
        required: true,
        checkDuplicatedElementsInArray: true
      },
      errorMessage: null,
      valid: true
    },
    deviceType: {
      value: deviceTypeValue,
      errorMessage: null,
      valid: true
    }
  };
  const [updateDeviceForm, setUpdateDeviceForm] = useState(
    deviceTypeValue === "digital"
      ? baseConfigs
      : { ...baseConfigs, ...analogConfigs }
  );

  const [formIsValid, setFormIsValid] = useState(false);

  const currentDeviceData = currentForm => {
    const deviceData = {};
    const { deviceName, deviceType } = currentForm;
    deviceData.name = deviceName.value;
    if (deviceType.value === "digital") {
      deviceData.configs = { type: "digital" };
    } else if (deviceType.value === "analog") {
      const { min, max, step, unit } = currentForm;
      deviceData.configs = {
        type: "analog",
        min: min.value,
        max: max.value,
        step: step.value,
        unit: unit.value
      };
    }
    return deviceData;
  };

  const inputChangedHandler = event => {
    const inputIdentifier = event.target.name;
    const eventValue = event.target.value;

    let finalAddDeviceForm = { ...updateDeviceForm };
    if (inputIdentifier === "deviceType" && eventValue === "analog") {
      finalAddDeviceForm = updateObject(updateDeviceForm, analogConfigs);
    } else if (inputIdentifier === "deviceType" && eventValue === "digital") {
      const { deviceName, deviceType } = finalAddDeviceForm;
      finalAddDeviceForm = { deviceName, deviceType };
    }

    const devicesArray = [...devices];
    devicesArray.splice(props.deviceIndex, 1);
    const devicesNameArray = devicesArray.map(d => d.name);
    devicesNameArray.push(eventValue);
    const errorMessage = checkValidity(
      eventValue,
      devicesNameArray,
      finalAddDeviceForm[inputIdentifier].validation
    );
    const updatedFormElement = updateObject(
      finalAddDeviceForm[inputIdentifier],
      {
        value: eventValue,
        errorMessage,
        valid: errorMessage === null
      }
    );

    const updatedAddDeviceForm = updateObject(finalAddDeviceForm, {
      [inputIdentifier]: updatedFormElement
    });

    let formIsValid = true;
    for (let inputKey in updatedAddDeviceForm) {
      formIsValid = updatedAddDeviceForm[inputKey].valid && formIsValid;
    }

    const deviceData = currentDeviceData(updatedAddDeviceForm);
    const differentConfigs = Object.keys(deviceData.configs).find(
      key =>
        deviceData.configs[key].toString() !==
        initialDeviceData.configs[key].toString()
    );
    formIsValid =
      (initialDeviceData.name !== deviceData.name || differentConfigs) &&
      formIsValid;

    setUpdateDeviceForm(updatedAddDeviceForm);
    setFormIsValid(formIsValid);
  };

  const submitHandler = event => {
    event.preventDefault();
    onSubmitForm(currentDeviceData(updateDeviceForm));
    props.onCancel();
  };

  const formAnalogConfigsArray = [];
  for (let key in updateDeviceForm) {
    if (key === "min" || key === "max" || key === "step" || key === "unit") {
      formAnalogConfigsArray.push({
        id: key,
        config: updateDeviceForm[key]
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
              onChange={inputChangedHandler}
            />
          </Grid>
        ))}
      </Grid>
    </Grid>
  ) : null;

  const currentDeviceTypeValue = updateDeviceForm.deviceType.value;

  const errorsField = (
    <React.Fragment>
      <Grid item xs={currentDeviceTypeValue === "digital" ? 6 : 3}>
        <div style={{ color: "red" }}>
          {updateDeviceForm.deviceName.errorMessage}
        </div>
      </Grid>
      {currentDeviceTypeValue !== "digital" && <Grid item xs={3}></Grid>}
      <Grid item xs={6}>
        <Grid container spacing={5}>
          {currentDeviceTypeValue === "analog" &&
            Object.keys(analogConfigs).map(analogConfig => (
              <Grid item xs={3} key={analogConfig}>
                <div style={{ color: "red" }}>
                  {updateDeviceForm[analogConfig].errorMessage}
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
            <Grid item xs={currentDeviceTypeValue === "digital" ? 6 : 3}>
              <TextField
                error={updateDeviceForm.deviceName.errorMessage !== null}
                label="Device Name"
                value={updateDeviceForm.deviceName.value}
                name="deviceName"
                onChange={inputChangedHandler}
                autoFocus={true}
                margin="normal"
              />
            </Grid>
            <Grid item xs={currentDeviceTypeValue === "digital" ? 6 : 3}>
              <FormControl component="fieldset" className={classes.formControl}>
                <FormLabel component="legend">Device Type</FormLabel>
                <RadioGroup
                  aria-label="deviceType"
                  name="deviceType"
                  value={currentDeviceTypeValue}
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

export default UpdateDeviceForm;

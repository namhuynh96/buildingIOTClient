import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import AwsSlider from "../../UI/AwsSlider/AwsSlider";
import AwsSwitch from "../../UI/AwsSwitch/AwsSwitch";
import { iotPublish } from "../../../iot/pubsub";
import { formatTime } from "../../../shared/utility";
import styles from "./DeviceLayout.module.css";
// import { PubSub } from "aws-amplify";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  }
}));

const DeviceLayout = props => {
  const classes = useStyles();

  const { username } = useSelector(state => state.user.userData);
  const { awsDeviceData } = useSelector(state => state.awsDevices);
  const { isAdmin } = useSelector(state => state.user);

  const [thisAwsDeviceData, setThisAwsDeviceData] = useState({
    deviceState: null,
    connected: false,
    controllState: null,
    controller: null,
    controllTime: null
  });

  useEffect(() => {
    const device = awsDeviceData.find(d => {
      return d.id === props.deviceId;
    });
    if (device) {
      const awsData = {};
      for (const key in device) {
        awsData[key] = device[key];
      }
      setThisAwsDeviceData(awsData);
    }
  }, [awsDeviceData, props.deviceId]);

  let deleteButton;
  let editButton;

  if (isAdmin) {
    deleteButton = (
      <IconButton
        aria-label="delete"
        size="small"
        onClick={props.onClickDelete}
      >
        <DeleteIcon />
      </IconButton>
    );

    editButton = (
      <IconButton aria-label="edit" size="small" onClick={props.onClickEdit}>
        <EditIcon />
      </IconButton>
    );
  }

  let controllerInfo;
  if (thisAwsDeviceData.controller) {
    const formattedTime = formatTime(thisAwsDeviceData.controllTime);
    controllerInfo = (
      <div>
        <div>
          Turned to {thisAwsDeviceData.controllState} ({formattedTime})
        </div>
        <div>by {thisAwsDeviceData.controller}</div>
      </div>
    );
  }

  const { type } = props.configs;
  let control;
  if (type === "digital") {
    const deviceSwitchHandler = event => {
      iotPublish(
        props.deviceId,
        event.target.checked ? "ON" : "OFF",
        isAdmin ? "admin" : username
      );
    };
    control = (
      <AwsSwitch
        state={thisAwsDeviceData.controllState}
        onChange={deviceSwitchHandler}
      />
    );
  } else if (type === "analog") {
    const sliderChangeHandler = (event, value) => {
      iotPublish(props.deviceId, value, isAdmin ? "admin" : username);
    };
    control = (
      <AwsSlider
        configs={props.configs}
        onChangeCommitted={sliderChangeHandler}
        state={thisAwsDeviceData.controllState}
      />
    );
  }

  return (
    <div className={classes.root}>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Grid container justify="space-between" spacing={2}>
            <Grid item xs={6}>
              <div style={{ position: "relative" }}>
                {thisAwsDeviceData.connected && (
                  <span className={styles.Online}></span>
                )}
                <div style={{ textAlign: "left", fontWeight: "bold" }}>
                  {props.deviceName} (id: {props.deviceId})
                </div>
              </div>
            </Grid>
            <Grid item xs={2}>
              {editButton}
              {deleteButton}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              {controllerInfo}
            </Grid>
            <Grid item xs={6}>
              {control}
            </Grid>
            <Grid item xs={2}>
              <div>Current State: {thisAwsDeviceData.deviceState}</div>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {props.isDeleting && <LinearProgress />}
    </div>
  );
};

export default DeviceLayout;

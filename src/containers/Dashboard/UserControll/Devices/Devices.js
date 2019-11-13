import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import DeviceLayout from "../../../../components/Layout/DeviceLayout/DeviceLayout";

import classes from "./Devices.module.css";
import * as actions from "../../../../store/actions";
import CircularProgress from "@material-ui/core/CircularProgress";

const Devices = props => {
  const { selectedRoomId } = useSelector(state => state.rooms);
  const { devices, loading, error, addedDeviceId } = useSelector(
    state => state.devices
  );

  const dispatch = useDispatch();
  const onFetchDevices = useCallback(
    () =>
      selectedRoomId
        ? dispatch(actions.fetchDevices(selectedRoomId))
        : dispatch(actions.setDevicesToNull()),
    [dispatch, selectedRoomId]
  );

  useEffect(() => {
    onFetchDevices();
  }, [onFetchDevices]);

  useEffect(() => {
    if (addedDeviceId) {
      dispatch(actions.iotSubcribe([addedDeviceId]));
    }
  }, [addedDeviceId, dispatch]);

  let renderDevices;
  if (error) {
    renderDevices = <h5>Devices cannot be loaded</h5>;
  } else if (loading) {
    renderDevices = <CircularProgress />;
  } else if (devices) {
    if (devices.length === 0) {
      renderDevices = <h5>No devices in this room</h5>;
    } else {
      renderDevices = devices.map((device) => {
        return (
          <div key={device._id} className={classes.EachDevice}>
            <DeviceLayout
              deviceName={device.name}
              deviceId={device._id}
              configs={device.configs}
            />
          </div>
        );
      });
    }
  }

  return (
    <div className={classes.Devices}>
      <div>{renderDevices}</div>
    </div>
  );
};

export default Devices;

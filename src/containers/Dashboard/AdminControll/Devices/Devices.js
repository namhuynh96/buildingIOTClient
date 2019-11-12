import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import DeviceLayout from "../../../../components/Layout/DeviceLayout/DeviceLayout";

import classes from "./Devices.module.css";
import * as actions from "../../../../store/actions";
import CircularProgress from "@material-ui/core/CircularProgress";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import { makeStyles } from "@material-ui/core/styles";
import AddDeviceForm from "./DeviceForm/AddDeviceForm";
import UpdateDeviceForm from "./DeviceForm/UpdateDeviceForm";

const useStyles = makeStyles(theme => ({
  fab: {
    margin: theme.spacing(1)
  },
  addIcon: {
    marginRight: theme.spacing(1)
  }
}));

const Devices = props => {
  const styles = useStyles();
  const [deletedDeviceId, setDeletedDeviceId] = useState(null);
  const [isAddingDevice, setIsAddingDevice] = useState(false);
  const [editingDeviceId, setEditingDeviceId] = useState(null);

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

  const deleteDeviceHandler = deviceId => {
    setDeletedDeviceId(deviceId);
    dispatch(actions.deleteDevice(deviceId));
  };

  let renderDevices = error ? (
    <h5>Devices cannot be loaded</h5>
  ) : (
    <CircularProgress />
  );
  if (devices) {
    renderDevices = devices.map((device, index) => {
      return (
        <div key={device._id} className={classes.EachDevice}>
          {editingDeviceId === device._id ? (
            <UpdateDeviceForm
              onCancel={() => setEditingDeviceId(null)}
              deviceData={device}
              deviceIndex={index}
              currentRoomId={selectedRoomId}
            />
          ) : (
            <DeviceLayout
              deviceName={device.name}
              deviceId={device._id}
              configs={device.configs}
              isDeleting={loading && deletedDeviceId === device._id}
              onClickDelete={() => deleteDeviceHandler(device._id)}
              onClickEdit={() => setEditingDeviceId(device._id)}
            />
          )}
        </div>
      );
    });
  }

  return (
    <div className={classes.Devices}>
      {selectedRoomId && (
        <Fab
          variant="extended"
          aria-label="add"
          className={styles.fab}
          onClick={() => setIsAddingDevice(true)}
        >
          <AddIcon className={styles.addIcon} />
          Add Device
        </Fab>
      )}
      {isAddingDevice && (
        <AddDeviceForm
          onCancel={() => setIsAddingDevice(false)}
          devicesName={devices.map(d => d.name)}
          currentRoomId={selectedRoomId}
        />
      )}
      <div>{renderDevices}</div>
    </div>
  );
};

export default Devices;

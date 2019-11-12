const validate = (values, props) => {
  const errors = {};
  const awsIotThingPattern = /^[a-zA-Z\d-_:]+$/;

  const checkAwsIotThingPattern = value => {
    if (!awsIotThingPattern.test(value)) {
      return "Must contain only alphanumeric characters and/or the following: -_:";
    }
  };

  if (!values.buildingName) {
    errors.buildingName = "Required";
  } else if (props.buildings.includes(values.buildingName)) {
    errors.buildingName = "That building name was taken";
  } else {
    errors.buildingName = checkAwsIotThingPattern(values.buildingName);
  }

  if (!values.rooms || !values.rooms.length) {
    errors.rooms = { _error: "At least one room must be entered" };
  } else {
    const roomsArrayErrors = [];
    values.rooms.forEach((room, roomIndex) => {
      const roomErrors = {};
      if (!room || !room.name) {
        roomErrors.name = "Required";
      } else {
        roomErrors.name = checkAwsIotThingPattern(room.name);

        const roomsNameArray = values.rooms.map(r => r && r.name);
        roomsNameArray.splice(roomIndex, 1);
        if (roomsNameArray.includes(room.name)) {
          roomErrors.name = "Cannot have same rooms!";
        }
      }

      if (room && room.devices && room.devices.length) {
        const devicesArrayErrors = [];
        room.devices.forEach((device, deviceIndex) => {
          const deviceErrors = {};
          if (!device || !device.name) {
            deviceErrors.name = "Required";
          } else {
            deviceErrors.name = checkAwsIotThingPattern(device.name);

            const devicesNameArray = room.devices.map(d => d && d.name);
            devicesNameArray.splice(deviceIndex, 1);
            if (devicesNameArray.includes(device.name)) {
              deviceErrors.name = "Cannot have same devices in the same room!";
            }
          }
          if (!device || !device.type) {
            deviceErrors.type = "Select one";
          }
          devicesArrayErrors[deviceIndex] = deviceErrors;
        });
        if (devicesArrayErrors.length) {
          roomErrors.devices = devicesArrayErrors;
        }
      } else {
        if (!roomErrors.devices) {
          roomErrors.devices = [];
        }
        roomErrors.devices._error = "At least one device must be entered";
      }

      roomsArrayErrors[roomIndex] = roomErrors;
    });

    if (roomsArrayErrors.length) {
      errors.rooms = roomsArrayErrors;
    }
  }
  return errors;
};

export default validate;

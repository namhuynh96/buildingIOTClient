import * as actionTypes from "./types";
import { PubSub } from "aws-amplify";
import { updateObject } from "../../shared/utility";

const setAwsDeviceData = data => {
  return {
    type: actionTypes.SET_AWS_DEVICE_DATA,
    data
  };
};

export const iotSubcribe = deviceIdsArray => {
  return dispatchEvent => {
    for (const id of deviceIdsArray) {
      const topic = `$aws/things/${id}/shadow/update/documents`;
      console.log(topic);
      PubSub.subscribe(topic).subscribe({
        next: ({ value }) => {
          let awsDeviceData = {
            id,
            deviceState: null,
            controllState: null,
            controller: null,
            controllTime: null
          };
          if (value.current.state) {
            const { reported, desired } = value.current.state;
            if (reported) {
              const { state, controller, connected } = reported;
              awsDeviceData = updateObject(awsDeviceData, {
                deviceState: connected ? state : "disconnected",
                connected,
                controller,
                controllState: state,
                controllTime: state && value.current.metadata.reported.state.timestamp
              });
            }
            if (desired) {
              const { state, controller } = desired;
              awsDeviceData = updateObject(awsDeviceData, {
                controller,
                controllState: state,
                controllTime: value.current.metadata.desired.state.timestamp
              });
            }
          }
          dispatchEvent(setAwsDeviceData(awsDeviceData));
        },
        error: error => console.error(error),
        close: () => console.log("Done")
      });
    }
  };
};

export const getInitialState = deviceIdsArray => {
  return dispatchEvent => {
    for (const id of deviceIdsArray) {
      const topic = `$aws/things/${id}/shadow/get/accepted`;
      PubSub.subscribe(topic).subscribe({
        next: ({ value }) => {
          let awsDeviceData = {
            id,
            deviceState: null,
            controllState: null,
            controller: null,
            controllTime: null
          };
          if (value.state) {
            const { reported, desired } = value.state;
            if (reported) {
              const { state, controller, connected } = reported;
              awsDeviceData = updateObject(awsDeviceData, {
                deviceState: connected ? state : "disconnected",
                connected,
                controller,
                controllState: state,
                controllTime: state && value.metadata.reported.state.timestamp
              });
            }
            if (desired) {
              const { state, controller } = desired;
              awsDeviceData = updateObject(awsDeviceData, {
                controller,
                controllState: state,
                controllTime: value.metadata.desired.state.timestamp
              });
            }
          }
          dispatchEvent(setAwsDeviceData(awsDeviceData));
        },
        error: error => console.error(error),
        close: () => console.log("Done")
      });
    }
    setTimeout(async () => {
      const topics = deviceIdsArray.map(id => `$aws/things/${id}/shadow/get`);
      await PubSub.publish(topics, null);
    }, 2000);
  };
};

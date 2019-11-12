import { PubSub } from "aws-amplify";

export const iotPublish = (deviceId, state, controller) => {
  PubSub.publish(`$aws/things/${deviceId}/shadow/update`, {
    state: {
      desired: {
        state,
        controller
      }
    }
  });
};

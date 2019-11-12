import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import { Auth } from "aws-amplify";
import * as actions from "../../../store/actions";

const Request = props => {
  const dispatch = useDispatch();

  const {
    userData: { isRequesting }
  } = useSelector(state => state.user);

  const requestButtonHandler = () => {
    Auth.currentCredentials().then(info => {
      const cognitoIdentityId = info.data.IdentityId;
      dispatch(actions.requestToControll(cognitoIdentityId));
    });
  };

  let content = (
    <Button
      variant="contained"
      color="secondary"
      onClick={requestButtonHandler}
    >
      Request to controll devices
    </Button>
  );
  if (isRequesting) {
    content = <Paper>Waiting for acceptance from admin</Paper>;
  }

  return content;
};

export default Request;

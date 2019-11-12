import React from "react";
import { Auth } from "aws-amplify";

import classes from "./Authenticate.module.css";
import Button from "../../components/UI/Button/Button";

const Authenticate = props => {
  return (
    <div className={classes.Authenticate}>
      <Button buttonType="Success" clicked={() => Auth.federatedSignIn()}>
        Login with Google
      </Button>
    </div>
  );
};

export default Authenticate;

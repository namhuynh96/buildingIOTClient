import React, { useEffect } from "react";
import { Redirect } from "react-router-dom";
import { Auth } from "aws-amplify";

const Logout = props => {
  useEffect(() => {
    Auth.signOut()
      .then(data => console.log(data))
      .catch(err => console.log(err));
  }, []);

  return <Redirect to="/" />;
};

export default Logout;

import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { Auth, Hub } from "aws-amplify";
import axios from "axios";
import withErrorHandler from "./hoc/withErrorHandler/withErrorHandler";
import { ThemeProvider } from "@material-ui/styles";
import theme from "./shared/theme";
import AppLayout from "./components/Layout/AppLayout/AppLayout";
import Authenticate from "./containers/Auth/Authenticate";
import Logout from "./containers/Auth/Logout/Logout";
import Dashboard from "./containers/Dashboard/Dashboard";
import Users from "./containers/Users/Users";
import * as actions from "./store/actions";
import Amplify from "aws-amplify";
import { AWSIoTProvider } from "@aws-amplify/pubsub/lib/Providers";

// window.PubSub = PubSub;

Amplify.addPluggable(
  new AWSIoTProvider({
    aws_pubsub_region: "eu-central-1",
    aws_pubsub_endpoint:
      "wss://aq22ajji2abkw-ats.iot.eu-central-1.amazonaws.com/mqtt"
  })
);

const App = props => {
  const [isAuth, setIsAuth] = useState(false);

  const dispatch = useDispatch();

  const { initialDevicesId } = useSelector(state => state.devices);
  const { isAdmin } = useSelector(state => state.user);

  const authAndUserSetup = useCallback(() => {
    Auth.currentAuthenticatedUser()
      .then(data => {
        Auth.currentSession().then(data => {
          axios.defaults.headers.common["Authorization"] =
            "Bearer " + data.idToken.jwtToken;
          setIsAuth(true);

          dispatch(actions.setAdminOrUserData());
        });
      })
      .catch(e => {
        setIsAuth(false);
      });
  }, [dispatch]);

  useEffect(() => {
    authAndUserSetup();
  }, [authAndUserSetup]);

  useEffect(() => {
    if (isAuth) {
      dispatch(actions.fetchAllDevicesId());
    }
  }, [isAuth, dispatch]);

  useEffect(() => {
    if (initialDevicesId) {
      dispatch(actions.iotSubcribe(initialDevicesId));
      dispatch(actions.getInitialState(initialDevicesId));
    }
  }, [initialDevicesId, dispatch]);

  Hub.listen("auth", ({ payload: { event, data } }) => {
    switch (event) {
      case "signIn":
        authAndUserSetup();
        break;
      case "signOut":
        setIsAuth(false);
        break;
      default:
        break;
    }
  });

  let routes = (
    <Switch>
      <Route path="/" component={Authenticate} />
      <Redirect to="/" />
    </Switch>
  );
  if (isAuth) {
    routes = (
      <Switch>
        <Route path="/logout" component={Logout} />
        {isAdmin && <Route path="/users" component={Users} />}
        <Route path="/" component={Dashboard} />
        <Redirect to="/" />
      </Switch>
    );
  }

  return (
    <div>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <AppLayout isAuth={isAuth}>{routes}</AppLayout>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
};

export default withErrorHandler(App);

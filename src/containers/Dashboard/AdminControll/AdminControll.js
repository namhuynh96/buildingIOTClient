import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import Buildings from "./Buildings/Buildings";
import Rooms from "./Rooms/Rooms";
import Devices from "./Devices/Devices";
import withErrorHandler from "../../../hoc/withErrorHandler/withErrorHandler";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center"
  },
  fab: {
    margin: theme.spacing(1),
    position: "absolute",
    bottom: theme.spacing(2),
    right: theme.spacing(2)
  }
}));

const AdminControll = props => {
  const classes = useStyles();

  return (
    <div classes={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={2}>
          <Paper className={classes.paper}>
            <Buildings />
          </Paper>
        </Grid>
        <Grid item xs={10}>
          <Paper className={classes.paper}>
            <Grid container spacing={2}>
              <Grid item xs={2}>
                <Paper className={classes.paper}>
                  <Rooms />
                </Paper>
              </Grid>
              <Grid item xs={10}>
                <Paper className={classes.paper}>
                  <Devices />
                </Paper>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default withErrorHandler(AdminControll);

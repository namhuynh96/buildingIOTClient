import React from "react";
import Modal from "../Modal/Modal";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

const ConfirmModal = props => {
  return (
    <Modal show={props.show} backdropClicked={props.onCancel}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {props.children}
        </Grid>
        <Grid item xs={6}>
          <Button variant="contained" onClick={props.onCancel}>
            Cancel
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button variant="contained" color="primary" onClick={props.onAccept}>
            Accept
          </Button>
        </Grid>
      </Grid>
    </Modal>
  );
};

export default ConfirmModal;

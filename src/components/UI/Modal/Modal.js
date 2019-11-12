import React from "react";
import Backdrop from "../Backdrop/Backdrop";

import classes from "./Modal.module.css";

const Modal = props => {
  return (
    <div>
      <div
        className={classes.Modal}
        style={{
          transform: props.show ? "translateY(0)" : "translateY(-100vh)",
          opacity: props.show ? "1" : "0"
        }}
      >
        {props.children}
      </div>
      <Backdrop clicked={props.backdropClicked} show={props.show}></Backdrop>
    </div>
  );
};

export default React.memo(
  Modal,
  (prevProps, nextProps) =>
    prevProps.show === nextProps.show &&
    prevProps.children === nextProps.children
);

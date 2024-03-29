import React from "react";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import classes from "./RadioButton.module.css";
import Radio from "@material-ui/core/Radio";

const useStyles = makeStyles(theme => ({
  button: {
    marginLeft: theme.spacing(1)
  }
}));

const RadioButton = props => {
  const styles = useStyles();

  const { isAdmin } = useSelector(state => state.user);

  let editAndDeleteButtons;
  if (isAdmin) {
    editAndDeleteButtons = (
      <div>
        <IconButton
          className={styles.button}
          aria-label="edit"
          size="small"
          onClick={props.onEdit}
        >
          <EditIcon />
        </IconButton>
        <IconButton
          className={styles.button}
          aria-label="delete"
          size="small"
          onClick={props.onDelete}
        >
          <DeleteIcon />
        </IconButton>
      </div>
    );
  }

  return (
    <div className={classes.RadioButton}>
      <label>
        <Radio
          checked={props.checked}
          onChange={props.changed}
          value={props.value}
          name={props.name}
        />
        {props.label}
        {editAndDeleteButtons}
      </label>
    </div>
  );
};

export default RadioButton;

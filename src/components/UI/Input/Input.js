import React from "react";
import TextField from "@material-ui/core/TextField";
// import Radio from "@material-ui/core/Radio";
// import FormControlLabel from "@material-ui/core/FormControlLabel";

const Input = props => {
  let inputElement = null;
  switch (props.elementType) {
    case "input":
      inputElement = (
        <TextField
          {...props.elementConfig}
          value={props.value}
          onChange={props.onChange}
          name={props.name}
          error={props.invalid}
          margin="normal"
        />
      );
      break;
    // case "radio":
    //   inputElement = (
    //     <FormControlLabel
    //       value={props.value}
    //       control={<Radio color="primary" />}
    //       {...props.elementConfig}
    //     />
    //   );
    //   break;
    default:
      inputElement = (
        <TextField
          {...props.elementConfig}
          value={props.value}
          onChange={props.onChange}
          margin="normal"
        />
      );
  }
  return (
    <div>
      {inputElement}
    </div>
  );
};

export default Input;

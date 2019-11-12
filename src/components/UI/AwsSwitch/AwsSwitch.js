import React, { useState, useEffect } from "react";
import Switch from "@material-ui/core/Switch";

const AwsSwitch = ({ state, onChange }) => {
  const [isSwitchOn, setIsSwitchOn] = useState(false);

  useEffect(() => {
    setIsSwitchOn(state === "ON" ? true : false);
  }, [state]);

  return (
    <div>
      <Switch
        checked={isSwitchOn}
        onChange={onChange}
        inputProps={{ "aria-label": "secondary checkbox" }}
      />
    </div>
  );
};

export default AwsSwitch;

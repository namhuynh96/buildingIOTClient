import React from "react";
import { useSelector } from "react-redux";

import classes from "./NavigationItems.module.css";
import NavigationItem from "./NavigationItem/NavigationItem";

const NavigationItems = props => {
  const { isAdmin } = useSelector(state => state.user);

  return (
    <ul className={classes.NavigationItems}>
      <NavigationItem link="/" exact>
        Main
      </NavigationItem>
      {isAdmin && <NavigationItem link="/users">Users</NavigationItem>}
      {props.isAuthenticated ? (
        <NavigationItem link="/logout">Log out</NavigationItem>
      ) : (
        <NavigationItem link="/login">Log in</NavigationItem>
      )}
    </ul>
  );
};

export default NavigationItems;

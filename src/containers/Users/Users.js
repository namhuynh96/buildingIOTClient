import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../../store/actions";
import Grid from "@material-ui/core/Grid";
import Search from "../../components/UI/Search/Search";
import classes from "./Users.module.css";
import UserData from "./UserData/UserData";

const Users = props => {
  const [choosedUserId, setChoosedUserId] = useState();

  const { allUsers } = useSelector(state => state.user);

  const dispatch = useDispatch();

  const usersRequestList = allUsers.map(user => (
    <li
      key={user._id}
      onClick={() => setChoosedUserId(user._id)}
      className={choosedUserId === user._id ? classes.ChoosedUser : null}
    >
      {user.email}
    </li>
  ));

  const acceptUserButtonHandler = () => {
    dispatch(actions.acceptUser(choosedUserId));
  };

  const detachUserButtonHandler = () => {
    dispatch(actions.detachUser(choosedUserId));
  };

  let userData;
  const choosedUser = allUsers.find(user => choosedUserId === user._id);
  if (choosedUser) {
    const { username, email, isRequesting, isAccepted } = choosedUser;
    userData = (
      <UserData
        username={username}
        email={email}
        isRequesting={isRequesting}
        isAccepted={isAccepted}
        acceptClick={acceptUserButtonHandler}
        detachClick={detachUserButtonHandler}
      />
    );
  }

  const userFilterHandler = useCallback(
    email => {
      const query = email.length === 0 ? "" : `?email=${email}`;
      dispatch(actions.fetchAllUsers(query));
    },
    [dispatch]
  );

  return (
    <div className={classes.Users}>
      <Grid container spacing={1}>
        <Grid item xs={3}>
          <Search label="Filter by email" onFilter={userFilterHandler} />
          <ul style={{ listStyle: "none" }}>{usersRequestList}</ul>
        </Grid>

        <Grid item xs={9}>
          <div className={classes.UserData}>{userData}</div>
        </Grid>
      </Grid>
    </div>
  );
};

export default Users;

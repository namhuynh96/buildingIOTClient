import React from "react";
import { useSelector } from "react-redux";
import AdminControll from "./AdminControll/AdminControll";
import UserControll from "./UserControll/UserControll";
import Request from "./Request/Request";

const Dashboard = props => {
  const {
    isAdmin,
    userData: { isAccepted }
  } = useSelector(state => state.user);

  let content;
  if (isAdmin) {
    content = <AdminControll />;
  } else if (isAccepted) {
    content = <UserControll />;
  } else {
    content = <Request />;
  }

  return (
    <div style={{ textAlign: "center", marginTop: "72px" }}>{content}</div>
  );
};

export default Dashboard;

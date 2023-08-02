import React from "react";
import styles from "./UpdateUser.module.scss";
import classNames from "classnames/bind";
import { NavLink, Outlet } from "react-router-dom";
import { OVERVIEW_ROUTE, PERSONAL_ROUTE } from "~/utils/constants";

const cx = classNames.bind(styles);
const UpdateUser = () => {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("title")}>Account Setting</div>
      <div className={cx("content")}>
        <div className={cx("sidebar")}>
          <NavLink to={OVERVIEW_ROUTE} className={({ isActive }) => (isActive ? cx("active") : "")}>
            Overview
          </NavLink>
          <NavLink to={PERSONAL_ROUTE} className={({ isActive }) => (isActive ? cx("active") : "")}>
            Personal
          </NavLink>
        </div>
        <div className={cx("info")}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default UpdateUser;

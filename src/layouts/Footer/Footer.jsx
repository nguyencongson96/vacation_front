import React, { useState } from "react";
import styles from "./Footer.module.scss";
import classNames from "classnames/bind";
import { NavLink } from "react-router-dom";
import { HomeOutlined, ProfileOutlined, PlusCircleFilled } from "@ant-design/icons";
import { Popover } from "antd";
import HandleVacation from "~/modules/vacation/HandleVacation/HandleVacation";
import HandlePost from "~/modules/post/HandlePost/HandlePost";
const cx = classNames.bind(styles);

const Footer = () => {
  const [open, setOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const initVacationDetail = {
    title: "",
    des: "",
    memberList: [],
    dates: [],
    status: "Public",
  };
  return (
    <div className={cx("footer")}>
      <NavLink to="/" className={({ isActive }) => (isActive ? cx("active") : "")}>
        <HomeOutlined />
      </NavLink>
      <Popover
        arrow
        placement="top"
        trigger="click"
        color="#282828"
        content={
          <div className={cx("pop-over")}>
            <div onClick={() => setOpen(true)}>Add Vacation</div>
            <div onClick={() => setShowModal(true)}>Add Post</div>
          </div>
        }
      >
        <PlusCircleFilled className={cx("add")} style={{ cursor: "pointer" }} />
      </Popover>
      <NavLink to="/profile/vacation" className={({ isActive }) => (isActive ? cx("active") : "")}>
        <ProfileOutlined />
      </NavLink>
      <HandlePost setShowModal={setShowModal} showModal={showModal} type="newfeed" />
      <HandleVacation
        setOpen={setOpen}
        showModal={open}
        initVacationDetail={initVacationDetail}
        type="create"
      />
    </div>
  );
};

export default Footer;

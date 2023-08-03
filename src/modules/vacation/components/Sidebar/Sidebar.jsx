import styles from "./Sidebar.module.scss";
import classNames from "classnames/bind";
import {
  faCalendar,
  faCamera,
  faCircleInfo,
  faPen,
  faShareNodes,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar, Image, Tooltip } from "antd";
import React, { useEffect, useRef, useState } from "react";
import ImageField from "~/components/ImageField/ImageField";
import UpLoad from "~/components/UpLoad/UpLoad";
import HandleVacation from "~/modules/vacation/HandleVacation/HandleVacation";
import UserList from "~/modules/vacation/components/UserList/UserList";
import { getDate } from "~/helpers/function";
import { NavLink, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getDetailVacation } from "~/store/slices/vacationSlice";

const cx = classNames.bind(styles);
const Sidebar = () => {
  const imgRef = useRef();
  const dispatch = useDispatch();
  const vacationId = useParams().id;

  // Get User's info
  const { info } = useSelector((state) => state.auth);
  // Get detail of vacation
  const { detail, posts, memberList, shareList } = useSelector((state) => state.vacation);
  const { authorInfo, cover, members, title, startingTime, endingTime, shareStatus } = detail;
  const { totalPost } = posts;
  // get msg of upload image
  const [openUserList, setOpenUserList] = useState(false);
  const [open, setOpen] = useState(false);
  const [isUpdateImg, setIsUpdateImg] = useState(false);
  // create state for listType is memberList or shareList
  const [listType, setListType] = useState("memberList");

  // state and end timeline of the vacation
  const startDate = getDate(startingTime);
  const endDate = getDate(endingTime);

  // check user is author or not
  const isAuthor = info?._id === authorInfo?._id;

  // for responsive
  const { size } = useSelector((state) => state.general);
  const isLargeSize = size.width <= 992;

  const handleImgClick = () => {
    isAuthor && imgRef.current.click();
  };

  useEffect(() => {
    if (isUpdateImg) dispatch(getDetailVacation(vacationId)).then(() => setIsUpdateImg(false));
  }, [isUpdateImg, dispatch, vacationId]);

  const handleAfterClose = () => {
    setIsUpdateImg(true);
  };

  const avatarSize = isLargeSize ? 90 : 140;
  return (
    <div className={cx("sidebar")}>
      <div className={cx("bg-container")}>
        {isAuthor && (
          <UpLoad
            imgRef={imgRef}
            body={{ field: "vcover", id: vacationId }}
            handleAfterClose={handleAfterClose}
          />
        )}
        <ImageField
          src={cover?.path}
          className={cx("img-BG")}
          preview={{
            maskClassName: cx("mask-img"),
          }}
          placeholder={
            <Image
              preview={false}
              src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?x-oss-process=image/blur,r_50,s_50/quality,q_1/resize,m_mfit,h_200,w_200"
            />
          }
        />
        {isAuthor && (
          <div className={cx("bg-icon-container")} onClick={handleImgClick}>
            <span>Edit cover photo</span>
            <FontAwesomeIcon icon={faCamera} className={cx("bg-icon")} />
          </div>
        )}
      </div>
      <div className={cx("sidebar-content")}>
        <div className={cx("user-info")}>
          <div className={cx("user-index")}>
            <div className={cx("index")}>{authorInfo?.friends}</div>
            <div className={cx("index-title")}>friends</div>
          </div>
          <div className={cx("user-avatar")}>
            <Avatar src={authorInfo?.avatar.path} shape="square" size={avatarSize} className={cx("avatar")} />

            <div className={cx("fullname")}>
              {authorInfo?.firstname} {authorInfo?.lastname}
            </div>
            <div className={cx("username")}>{authorInfo?.username}</div>
          </div>
          <div className={cx("user-index")}>
            <div className={cx("index")}>{totalPost || 0}</div>
            <div className={cx("index-title")}>Posts</div>
          </div>
        </div>
        <div className={cx("vacation-detail")}>
          <div className={cx("vacation-title")}>
            Vacation Detail
            {isAuthor && (
              <FontAwesomeIcon icon={faPen} className={cx("title-icon")} onClick={() => setOpen(true)} />
            )}
            <HandleVacation setOpen={setOpen} showModal={open} type="update" vacationId={vacationId} />
          </div>
          <div className={cx("vacation-info")}>
            <div className={cx("vacation-name")}>
              <FontAwesomeIcon icon={faCircleInfo} className={cx("icon")} />
              <Tooltip
                title={title}
                color="grey"
                overlayInnerStyle={{
                  textAlign: "center",
                }}
              >
                <span>{title}</span>
              </Tooltip>
            </div>

            <div
              className={cx("status")}
              onClick={() => {
                setOpenUserList(true);
                setListType("shareList");
              }}
            >
              <FontAwesomeIcon icon={faShareNodes} className={cx("icon")} />
              <span className={cx("memberList")}>{shareStatus}</span>
            </div>

            <div
              onClick={() => {
                setOpenUserList(true);
                setListType("memberList");
              }}
            >
              <FontAwesomeIcon icon={faUser} className={cx("icon")} />
              <span className={cx("memberList")}>{members} people join in</span>
            </div>
            <UserList
              openUserList={openUserList}
              setOpenUserList={setOpenUserList}
              title={listType === "memberList" ? "Member List" : "Friend Who Can See Your Vacation"}
              list={listType === "memberList" ? memberList : shareList}
            />

            <div className={cx("timeline")}>
              <FontAwesomeIcon icon={faCalendar} className={cx("icon")} />
              <Tooltip
                title={`${startDate} - ${endDate}`}
                color="grey"
                overlayInnerStyle={{
                  textAlign: "center",
                }}
              >
                <span>
                  {startDate} - {endDate}
                </span>
              </Tooltip>
            </div>
          </div>
        </div>
        <div className={cx("route")}>
          <NavLink to={"post"} className={({ isActive }) => (isActive ? cx("active") : "")}>
            See All Posts
          </NavLink>
          <NavLink to={"album"} className={({ isActive }) => (isActive ? cx("active") : "")}>
            See Album
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

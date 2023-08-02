import { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import styles from "./PostItem.module.scss";
import classNames from "classnames/bind";
import moment from "moment/moment";
import { Avatar, Image, List, Popover } from "antd";
import { useDispatch, useSelector } from "react-redux";
import Interaction from "~/modules/vacation/components/Interact/Interaction";
import { isPostListChanged } from "~/store/slices/vacationSlice";
import { getDate } from "~/helpers/function";
import vacationAPI from "~/api/vacationAPI";
import Modal from "~/components/Modal/Modal";
import ImageField from "~/components/ImageField/ImageField";
import HandlePost from "../HandlePost/HandlePost";
import Notification from "~/components/Notification/Notification";
import { useClickOutside } from "~/helpers/customHook";
import { Link } from "react-router-dom";
import { Loading3QuartersOutlined } from "@ant-design/icons";
const cx = classNames.bind(styles);

const PostItem = ({ postDetail, vacationId, setHandlePost, handlePost }) => {
  const { authorInfo, content, resource, comments, likes, lastUpdateAt, _id, createdAt, isLiked, location } =
    postDetail;

  const postItemRef = useRef(null);
  const popupRef = useRef();
  const dispatch = useDispatch();
  const { info } = useSelector((state) => state.auth);
  const [showModal, setShowModal] = useState(false);
  const [open, setOpen] = useState(false);
  // open modal img
  const [openImg, setOpenImg] = useState(false);
  // open modal delete post
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [loadingDel, setLoadingDel] = useState(false);
  // state for msg when success or error
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [msg, setMsg] = useState("");
  const [openNoti, setOpenNoti] = useState(false);
  const [postId, setPostId] = useState("");

  const handleDeletePost = async () => {
    try {
      setLoadingDel(true);
      setOpen(false);
      const res = await vacationAPI.deletePost(_id);
      setMsg(res.data?.message);
      dispatch(isPostListChanged(true));
      setIsSuccess(true);
      setLoadingDel(false);
    } catch (error) {
      setMsg(error.message);
      setIsError(true);
      setLoadingDel(false);
    }
    setOpenDeleteModal(false);
    setOpenNoti(true);
  };
  const handleSuccess = () => {
    setIsSuccess(false);
    setMsg("");
  };
  const handleError = () => {
    setIsError(false);
    setMsg("");
  };

  useClickOutside(popupRef, () => {
    setOpen(false);
  });

  return (
    <div className={cx("wrapper")} ref={postItemRef} timeline={getDate(createdAt)}>
      <header>
        <div className={cx("user-info")}>
          <Avatar src={authorInfo?.avatar?.path} size={45} />
          <div className={cx("username-container")}>
            <div className={cx("username")}>
              <Link to={`/profile/${authorInfo._id}`}>{authorInfo.username}</Link>

              <span>at</span>
              <span className={cx("location")}>
                {` ${location?.detail} - ${location?.district} - ${location?.city}`}
              </span>
            </div>
            <div className={cx("moment")}>{moment(lastUpdateAt).fromNow()}</div>
          </div>
        </div>
        {authorInfo._id === info._id && (
          <>
            <Popover
              content={
                <div className={cx("pop-over")} ref={popupRef}>
                  <p
                    className={cx("options")}
                    onClick={() => {
                      setShowModal(true);
                      setOpen(false);
                      setHandlePost("update");
                      setPostId(_id);
                    }}
                  >
                    Edit
                  </p>

                  <p
                    className={cx("options")}
                    onClick={() => {
                      setOpenDeleteModal(true);
                      setOpen(false);
                    }}
                  >
                    Delete
                  </p>
                </div>
              }
              open={open}
              trigger="click"
              placement="bottom"
            >
              {handlePost === "update" && (
                <HandlePost
                  showModal={showModal}
                  setShowModal={setShowModal}
                  setPostId={setPostId}
                  postId={postId}
                  vacationId={vacationId}
                  type={handlePost}
                />
              )}
              <FontAwesomeIcon
                icon={faEllipsisVertical}
                className={cx("options")}
                onClick={() => setOpen(!open)}
              />
              <Modal
                open={openDeleteModal}
                setOpen={setOpenDeleteModal}
                title="Delete Post?"
                className={cx("delete-modal")}
              >
                <div className={cx("modal-content")}>Are you sure you want to delete this post?</div>
                <div className={cx("btn-container")}>
                  <button onClick={handleDeletePost} disabled={loadingDel}>
                    Delete {loadingDel && <Loading3QuartersOutlined spin={true} />}
                  </button>
                  <button onClick={() => setOpenDeleteModal(false)}>Cancel</button>
                </div>
              </Modal>
            </Popover>
          </>
        )}
      </header>

      <main>
        <div className={cx("description")}>{content}</div>
        <div className={cx("image-container")}>
          {resource?.map((item, index) => {
            return (
              index <= 5 && (
                <div
                  className={cx(index === 5 && "last-img")}
                  onClick={() => index === 5 && setOpenImg(true)}
                  key={index}
                >
                  <ImageField src={item.path} preview={index < 5} />
                </div>
              )
            );
          })}
        </div>

        <Modal open={openImg} setOpen={setOpenImg} title="Resources">
          <List
            className={cx("img-container")}
            grid={{ gutter: 35, xs: 1, sm: 2, md: 2, lg: 2, xl: 2, xxl: 2 }}
            dataSource={resource}
            renderItem={(item) => <Image rootClassName={cx("item")} src={item.path} />}
          />
        </Modal>
      </main>

      <Interaction likes={likes} comments={comments} postID={_id} isLikedStatus={isLiked} />
      {(isSuccess || isError) && (
        <Notification
          isSuccess={isSuccess}
          isError={isError}
          msg={msg}
          openNoti={openNoti}
          setOpenNoti={setOpenNoti}
          handleSuccess={handleSuccess}
          handleError={handleError}
        />
      )}
    </div>
  );
};

export default PostItem;

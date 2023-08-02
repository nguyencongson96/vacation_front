import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import styles from "./NewAlbum.module.scss";
import classNames from "classnames/bind";
import Slider from "./Slider/Slider";
import "./Preloader.scss";
import { useParams } from "react-router-dom";
import Image from "./Image/Image";
import { updateAlbumPage, resetSelectedImages, getDetail, deleteAlbum } from "~/store/slices/albumSlice";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, notification } from "antd";
const cx = classNames.bind(styles);

const NewAlbum = () => {
  const albumId = useParams().id;
  const dispatch = useDispatch();
  const ref = useRef(null);
  const navigate = useNavigate();
  const {
    selectedImages,

    selectedAlbum: { title, authorInfo, userId, _id },
  } = useSelector((state) => state.album);
  const { info } = useSelector((state) => state.auth);
  const [containerSize, setContainerSize] = useState({
    outerWidth: 0,
    outerHeight: 0,
  });
  const [isOpen, setIsOpen] = useState(false);
  const isAuthor = (authorInfo?._id || userId) === info?._id;
  const { size } = useSelector((state) => state.general);
  const isLargeSize = size.width > 1440;
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    !isLargeSize
      ? api.warning({
          key: "noti",
          message: `Notification`,
          duration: 0,
          closeIcon: <ArrowLeftOutlined />,
          description: "Album detail view screen only support screen from 1440 and above",
          placement: "top",
          onClick: () => navigate(-1),
          className: cx("message"),
        })
      : api.destroy("noti");
    !isLargeSize && setIsOpen(false);
  }, [isLargeSize, navigate, api]);

  useEffect(() => {
    setContainerSize({
      outerWidth: ref.current.offsetWidth,
      outerHeight: ref.current.offsetHeight,
    });
  }, [ref]);

  useEffect(() => {
    dispatch(resetSelectedImages());
    albumId && dispatch(getDetail({ id: albumId }));
  }, [dispatch, albumId]);

  const saveAlbum = () => {
    dispatch(
      updateAlbumPage({
        albumId: _id,
        resource: selectedImages.map((item) => ({
          style: item.style,
          resourceId: item.resourceId,
        })),
      })
    ).then(() => navigate("/profile/album"));
  };

  const handleDelete = () => dispatch(deleteAlbum({ id: _id })).then(() => navigate("/profile/album"));
  const handleWrapClick = () => (isLargeSize ? setIsOpen((prevState) => !prevState) : setIsOpen(false));

  return (
    <>
      {contextHolder}
      <div className={`wrap ${isOpen ? "open" : ""} ${isAuthor ? "" : "not-author"}`}>
        <div className="overlay" onClick={handleWrapClick}>
          <div className="overlay-content animate slide-left delay-2">
            <h1 className="animate slide-left pop delay-4 line">{title}</h1>
            <p className="animate slide-left pop delay-5" style={{ color: "white", marginBottom: "2.5rem" }}>
              {authorInfo && (
                <>
                  Sign: <em>{authorInfo?.username}</em>
                </>
              )}
            </p>
          </div>
          <div className="image-content animate slide delay-5"></div>
          <div className="dots animate">
            <div className="dot animate slide-up delay-6"></div>
            <div className="dot animate slide-up delay-7"></div>
            <div className="dot animate slide-up delay-8"></div>
          </div>
        </div>
        <div className="text">
          <div className={cx(isAuthor ? "mother" : "mother-banned-you")} ref={ref}>
            {selectedImages.map((item) => (
              <Image key={item.resourceId} imgData={item} containerSize={containerSize} />
            ))}
          </div>
        </div>
      </div>
      {isAuthor && isLargeSize && (
        <>
          <Slider />
          <div className={cx("btn-group")}>
            <Button type="primary" disabled={selectedImages.length === 0} onClick={saveAlbum}>
              Save
            </Button>
            <Button danger type="primary" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </>
      )}
    </>
  );
};

export default NewAlbum;

import React from "react";
import "react-resizable/css/styles.css";
import DraggableCore from "react-draggable";
import { useDispatch } from "react-redux";
import { removeSelected, updateSelected } from "~/store/slices/albumSlice";
import { ResizableBox } from "react-resizable";
import { CloseCircleOutlined } from "@ant-design/icons";
import styles from "../NewAlbum.module.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

const Image = ({ imgData, containerSize }) => {
  const {
    style: { width, height, left, top },
    resourceId,
    path,
  } = imgData;
  const dispatch = useDispatch();
  const handleResize = (event, { size }) => {
    dispatch(
      updateSelected({ resourceId, path, style: { width: size.width, height: size.height, top, left } })
    );
  };

  const handleDragStop = (event, data) => {
    const { lastX, lastY } = data;
    event.target.parentElement &&
      dispatch(updateSelected({ resourceId, path, style: { width, height, top: lastY, left: lastX } }));
  };

  const handleImageRemove = () => dispatch(removeSelected(resourceId));

  return (
    <DraggableCore
      handle={`.${cx("handle")}`}
      defaultPosition={{ x: left, y: top }}
      onStop={handleDragStop}
      bounds="parent"
      defaultClassName={cx("draggable")}
    >
      <div>
        <ResizableBox
          width={width}
          height={height}
          onResizeStop={handleResize}
          minConstraints={[50, 50]}
          maxConstraints={[containerSize.outerWidth - left, containerSize.outerHeight - top]}
        >
          <div
            className={cx("handle")}
            style={{
              backgroundImage: `url(${path})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <CloseCircleOutlined className={cx("close-icon")} onClick={handleImageRemove} />
          </div>
        </ResizableBox>
      </div>
    </DraggableCore>
  );
};

export default Image;

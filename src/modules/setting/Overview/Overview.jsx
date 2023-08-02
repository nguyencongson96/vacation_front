import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, Button, message } from "antd";
import classNames from "classnames/bind";
import styles from "./Overview.module.scss";
import { updateInfo } from "~/store/slices/authSlice";
import { CameraFilled } from "@ant-design/icons";
import UpLoad from "~/components/UpLoad/UpLoad";
import { resetResources } from "~/store/slices/resourceSlice";
const cx = classNames.bind(styles);

const Overview = () => {
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const imgRef = useRef();
  const [inputValue, setInputValue] = useState("");
  const {
    isLoading,
    isError,
    msg,
    info: { firstname, lastname, description, avatar, username },
  } = useSelector((state) => state.auth);
  const { uploadLoading } = useSelector((state) => state.resource.isLoading);
  const isChange = description !== inputValue;

  useEffect(() => {
    setInputValue(description);
  }, [description]);

  useEffect(() => {
    !uploadLoading && dispatch(resetResources());
  }, [uploadLoading, dispatch]);

  // Handle Input Change
  const handleChange = (e) => setInputValue(e.target.value);
  const handleSubmit = () => {
    dispatch(updateInfo({ description: inputValue })).then(() => {
      messageApi.open(isError ? { type: "error", content: msg } : { type: "success", content: "Updated" });
    });
  };
  const handleCancel = () => setInputValue(description);
  const handleImgClick = () => imgRef.current.click();

  return (
    <div className={cx("wrapper")}>
      {contextHolder}
      <div className={cx("userName-container")}>
        <div className={cx("avatar")} onClick={handleImgClick}>
          <UpLoad imgRef={imgRef} body={{ field: "avatar" }} />
          <Avatar src={avatar?.path} size={70} />
          <CameraFilled className={cx("ava-icon")} />
        </div>

        <div className={cx("userName")}>
          <div className={cx("sub-name")}>{username}</div>
          <div className={cx("name")}>{`${firstname} ${lastname}`}</div>
        </div>
      </div>

      <div className={cx("des-container")}>
        <div className={cx("title")}>Description</div>
        <div className={cx("des-detail")}>
          <textarea value={inputValue} onChange={handleChange} spellCheck={false} />
        </div>
      </div>

      <div className={cx("btn-container")}>
        <Button type="primary" onClick={handleSubmit} loading={isLoading} disabled={!isChange}>
          Save
        </Button>
        <Button danger type="primary" onClick={handleCancel} disabled={!isChange}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default Overview;

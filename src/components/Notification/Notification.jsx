import ReactModal from "react-modal";
import styles from "./Notification.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);
const Notification = (props) => {
  const {
    openNoti,
    setOpenNoti,
    msg,
    isSuccess,
    isError,
    handleSuccess,
    handleError,
  } = props;

  const handleClose = () => {
    isSuccess && handleSuccess();
    isError && handleError();
    setOpenNoti(false);
  };
  const Success = () => {
    return (
      <div className={cx("success-box")}>
        <div className={cx("face")}>
          <div className={cx("eye")}></div>
          <div className={cx("eye", "right")}></div>
          <div className={cx("mouth", "happy")}></div>
        </div>
        <div className={cx("shadow", "scale")}></div>
        <div className={cx("message")}>
          <h1 className={cx("alert")}>Success!</h1>
          <p>{msg}</p>
        </div>
        <button className={cx("button-box")} onClick={handleClose}>
          <h1 className={cx("green")}>OK</h1>
        </button>
      </div>
    );
  };
  const Error = () => {
    return (
      <div className={cx("error-box")}>
        <div className={cx("face2")}>
          <div className={cx("eye")}></div>
          <div className={cx("eye", "right")}></div>
          <div className={cx("mouth", "sad")}></div>
        </div>
        <div className={cx("shadow", "move")}></div>
        <div className={cx("message")}>
          <h1 className={cx("alert")}>Error!</h1>
          <p>{msg}</p>
        </div>
        <button className={cx("button-box")} onClick={handleClose}>
          <h1 className={cx("red")}>Close</h1>
        </button>
      </div>
    );
  };

  return (
    <ReactModal
      isOpen={openNoti}
      onRequestClose={() => setOpenNoti(false)}
      className={cx("modal")}
      overlayClassName={cx("overlay")}
    >
      {isSuccess && <Success />}
      {isError && <Error />}
    </ReactModal>
  );
};

export default Notification;

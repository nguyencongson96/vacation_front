import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./HandleVacation.module.scss";
import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faShield, faUserPlus, faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import Input from "antd/es/input/Input";
import { Avatar, Button, DatePicker } from "antd";
import Modal from "~/components/Modal/Modal";
import SelectFriend from "~/components/SelectFriend/SelectFriend";
import ImageField from "~/components/ImageField/ImageField";
import { getDate } from "~/helpers/function";
import { useClickOutside } from "~/helpers/customHook";
import { createVacation, getDetailVacation, updateVacation } from "~/store/slices/vacationSlice";
import { useNavigate } from "react-router-dom";
const { RangePicker } = DatePicker;
const cx = classNames.bind(styles);

const HandleVacation = ({ showModal, setOpen, type, vacationId }) => {
  const statusRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // Get the current user information from the state.
  const { info } = useSelector((state) => state.auth);
  const { resources } = useSelector((state) => state.resource);
  // Get the vacation details from the state.
  const {
    detail,
    isLoading,
    memberList: vacationMemberList,
    shareList: vacationShareList,
  } = useSelector((state) => state.vacation);

  // Create a state variable to store the vacation information.
  const [vacationInfo, setVacationInfo] = useState({
    title: "",
    des: "",
    status: "public",
    dates: [],
  });
  const { title, des, dates, status } = vacationInfo;
  // Create state variables to store the member list and share list.
  const [memberList, setMemberList] = useState([]);
  const [shareList, setShareList] = useState([]);

  // State for the open friend modal.
  const [openFriend, setOpenFriend] = useState(false);
  const [openStatus, setOpenStatus] = useState(false);
  const [isMemberList, setIsMemberList] = useState(true);
  const isCreateType = type === "create";

  // UseEffect hook to set the initial state of vacationInfo, the member list and share list.
  useEffect(() => {
    if (vacationId) {
      setVacationInfo({
        title: detail?.title,
        des: detail?.description,
        status: detail?.shareStatus,
        shareList: detail?.shareList,
        dates: [getDate(detail?.startingTime), getDate(detail?.endingTime)],
      });
      setMemberList(vacationMemberList);
      setShareList(vacationShareList);
    }
  }, []);

  // Function to handle changes to the title.
  const onChange = (e, type) =>
    setVacationInfo((prev) => ({ ...prev, [type === "title" ? "title" : "des"]: e.target.value }));

  // Function to handle changes to the date range.
  const handleCalendar = (values) => {
    const newDate = values?.map((item) => {
      return item?.format("YYYY-MM-DD");
    });
    setVacationInfo((prev) => {
      return {
        ...prev,
        dates: newDate || [],
      };
    });
  };

  //This function handles changes to the status of the vacation.
  //The status can be either "public" or "protected" or "only me".
  const handleStatus = (status) => {
    setVacationInfo((prev) => {
      return { ...prev, status: status };
    });
    if (status === "protected") {
      setOpenFriend(true);
      setIsMemberList(false);
    }
    setOpenStatus(false);
  };

  // Function to handle clearing a member from the list.
  const handleClear = (id) => setMemberList((prev) => prev.filter((item) => item._id !== id));

  // Function to create or update a vacation.
  const handleVacation = async () => {
    // get list Id of memberList and shareList
    const memberListId = memberList?.map((item) => item._id);
    const shareListId = shareList?.map((item) => item._id);
    const params = {
      title: title,
      description: des,
      memberList: memberListId,
      shareStatus: status.toLowerCase(),
      shareList: shareListId,
      startingTime: dates[0],
      endingTime: dates[1],
    };

    isCreateType
      ? dispatch(createVacation(params)).then(() => navigate(`/vacation/${detail._id}`))
      : dispatch(updateVacation({ id: vacationId, body: params })).then(() =>
          dispatch(getDetailVacation(vacationId))
        );

    setOpen(false);
  };

  const isDisabledCreate = useMemo(
    () => !(title !== "" && des !== "" && dates?.length === 2),
    [title, des, dates]
  );

  // The `useClickOutside` hook is used to close the status modal when the user clicks outside of it.
  // The hook takes a ref as an argument, and the ref is used to track the element that the modal is attached to.
  useClickOutside(statusRef, () => setOpenStatus(false));

  return (
    <Modal open={showModal} setOpen={setOpen} title={isCreateType ? "New Vacation" : "Update Vacation"}>
      <div className={cx("wrapper")}>
        <div className={cx("user-info")}>
          <div className={cx("info-name")}>
            <Avatar src={info?.avatar?.path} />
            <div className={cx("username")}>
              <div>{info?.username}</div>
              <div ref={statusRef} className={cx("status")} onClick={() => setOpenStatus(!openStatus)}>
                <span>{status}</span>
                <FontAwesomeIcon icon={faCaretDown} style={{ marginLeft: "0.8rem", cursor: "pointer" }} />
                {openStatus && (
                  <div className={cx("dropdown-status")}>
                    <div onClick={() => handleStatus("public")}>Public</div>
                    <div onClick={() => handleStatus("protected")}>Protected</div>
                    <div onClick={() => handleStatus("onlyme")}>Only Me</div>
                  </div>
                )}
                {status === "protected" && (
                  <FontAwesomeIcon
                    icon={faShield}
                    className={cx("icon")}
                    onClick={() => {
                      setOpenFriend(true);
                      setIsMemberList(false);
                    }}
                  />
                )}
              </div>
            </div>
          </div>
          <RangePicker
            placement="top-left"
            className={cx("select-date")}
            placeholder={["Start Time", "End Time"]}
            style={{
              width: "22rem",
              background: "#a29090a6",
              border: "none",
              height: "50px",
            }}
            defaultValue={dates.length > 0 ? [dayjs(dates[0]), dayjs(dates[1])] : []}
            onChange={(values) => handleCalendar(values)}
          />
        </div>
        <Input
          maxLength={100}
          onChange={(e) => onChange(e, "title")}
          placeholder="Title"
          style={{ textAlign: "center" }}
          value={title}
          spellCheck={false}
        />
        <TextArea
          maxLength={5000}
          onChange={(e) => onChange(e, "des")}
          placeholder="Description..."
          style={{
            textAlign: "center",
            resize: "none",
          }}
          spellCheck={false}
          value={des}
        />
        <div className={cx("post-extension")}>
          <div className={cx("extension-container")}>
            <div> Add on</div>
            <div className={cx("extensions")}>
              <FontAwesomeIcon
                icon={faUserPlus}
                className={cx("icon")}
                onClick={() => {
                  setOpenFriend(true);
                  setIsMemberList(true);
                }}
              />
            </div>
          </div>

          <div className={cx("result")}>
            <div className={cx("result-list")}>
              {memberList?.length > 0 && `with:`}
              {memberList?.map((member) => {
                return (
                  <span key={member._id}>
                    {member.username}
                    <FontAwesomeIcon
                      icon={faXmarkCircle}
                      className={cx("close")}
                      onClick={() => handleClear(member._id)}
                    />
                  </span>
                );
              })}
            </div>
            <div className={cx("resources")}>
              {type === "update" && resources?.length > 0 && "Cover:"}
              {resources?.map((resource, index) => {
                return <ImageField src={resource.path} className={cx("resource")} key={index} />;
              })}
            </div>
          </div>
        </div>
        <Button
          htmlType="button"
          className={cx("btn-submit")}
          disabled={isCreateType && isDisabledCreate}
          loading={isLoading}
          onClick={handleVacation}
        >
          {isCreateType ? "Create Vacation" : "Update"}
        </Button>
      </div>
      <SelectFriend
        open={openFriend}
        setOpen={setOpenFriend}
        setUserList={isMemberList ? setMemberList : setShareList}
        userList={isMemberList ? memberList : shareList}
        type={isMemberList ? "memberList" : "shareList"}
        title={isMemberList ? "Your Member List" : "Friends who will see your vacation"}
      />
    </Modal>
  );
};

export default HandleVacation;

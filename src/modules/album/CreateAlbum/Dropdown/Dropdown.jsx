import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./Dropdown.module.scss";
import classNames from "classnames/bind";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getListVacation } from "~/store/slices/vacationSlice";
import { Tooltip } from "antd";
const cx = classNames.bind(styles);

const Dropdown = ({ selected, setSelected, className }) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const { listVacationProf } = useSelector((state) => state.vacation);
  const { list, page, pages } = listVacationProf;

  const handleScroll = (e) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom && page < pages) dispatch(getListVacation({ type: "userProfile", page: page + 1 }));
  };

  useEffect(() => {
    dispatch(getListVacation({ type: "userProfile", page: 1 }));
  }, [dispatch]);

  return (
    <div className={cx("wrapper", className)}>
      <div className={cx("dropdown-btn")} onClick={() => setOpen((prev) => !prev)}>
        <span>{selected.title}</span>
        <FontAwesomeIcon icon={faCaretDown} />
      </div>
      {open && (
        <div className={cx("dropdown-content")} onScroll={handleScroll}>
          {list.map((option) => {
            return (
              <Tooltip
                title={option.title}
                color="grey"
                placement="right"
                overlayInnerStyle={{
                  textAlign: "center",
                }}
                key={option._id}
              >
                <div
                  className={cx("dropdown-item")}
                  onClick={() => {
                    setSelected(option);
                    setOpen((prev) => !prev);
                  }}
                >
                  {option.title}
                </div>
              </Tooltip>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dropdown;

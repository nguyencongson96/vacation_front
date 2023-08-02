import { useParams, Outlet } from "react-router-dom";
import styles from "./Vacation.module.scss";
import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDetailVacation, getStatusList } from "~/store/slices/vacationSlice";
import Preloader from "~/components/Preloader/Preloader";
import Sidebar from "./components/Sidebar/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBarsStaggered } from "@fortawesome/free-solid-svg-icons";
import DrawerRes from "~/modules/post/Drawer/DrawerRes";
import Timeline from "./components/Timelines/Timeline";
const cx = classNames.bind(styles);

const Vacation = () => {
  const dispatch = useDispatch();
  const vacationId = useParams().id;
  const [preload, setPreload] = useState(true);

  // for responsive
  const [resModal, setResModal] = useState(false);
  const { size } = useSelector((state) => state.general);
  const isSmallSize = size.width <= 576;
  const isMediumSize = size.width <= 992;

  // Get vacation detail & set activeTimeline
  useEffect(() => {
    setPreload(true);
    Promise.all([
      dispatch(getDetailVacation(vacationId)),
      dispatch(
        getStatusList({
          type: "vacations",
          id: vacationId,
          listType: "memberList",
          page: 1,
        })
      ),
      dispatch(
        getStatusList({
          type: "vacations",
          id: vacationId,
          listType: "shareList",
          page: 1,
        })
      ),
    ]).then(() => setPreload(false));
  }, [dispatch, vacationId]);

  return (
    <>
      {preload ? (
        <Preloader />
      ) : (
        <div className={cx("wrapper")}>
          {!isSmallSize && <Sidebar />}

          <div className={cx("content")}>
            <Outlet context={{ vacationId: vacationId }} />
          </div>

          {isMediumSize ? (
            <>
              <div className={cx("timeline-res")} onClick={() => setResModal(true)}>
                <FontAwesomeIcon icon={faBarsStaggered} />
              </div>
              <DrawerRes setResModal={setResModal} resModal={resModal} />
            </>
          ) : (
            <Timeline />
          )}
        </div>
      )}
    </>
  );
};

export default Vacation;

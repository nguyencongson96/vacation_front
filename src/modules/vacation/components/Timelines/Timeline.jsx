import { useSelector } from "react-redux";
import styles from "./Timeline.module.scss";
import classNames from "classnames/bind";
import { Link, useParams } from "react-router-dom";

const cx = classNames.bind(styles);

const Timeline = () => {
  const vacationId = useParams().id;
  const { timeline } = useSelector((state) => state.vacation.posts);

  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <header># Timeline</header>
        <main>
          {timeline?.map((item, index) => {
            return (
              <Link
                to={`/post/timeline?tl=${item}&id=${vacationId}`}
                className={cx("timeline-item")}
                key={index}
              >
                <span className={cx("index")}>{index + 1}.</span>
                <span className={cx("value")}>{item}</span>
              </Link>
            );
          })}
        </main>
      </div>
    </div>
  );
};

export default Timeline;

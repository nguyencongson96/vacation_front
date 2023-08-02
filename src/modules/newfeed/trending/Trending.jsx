import React, { useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./Trending.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { getTrendingPlace } from "~/store/slices/locationSlice";
import GlowingButton from "../glowing/GlowingButton";
import { NavLink } from "react-router-dom";
const cx = classNames.bind(styles);

const Trending = () => {
  const dispatch = useDispatch();
  const { trendingList, isVisible } = useSelector((state) => state.location);
  const { size } = useSelector((state) => state.general);
  const isSmallSize = size.width <= 576;

  useEffect(() => {
    dispatch(getTrendingPlace({ type: "trending", number: 7 }));
  }, [dispatch]);

  return (
    (!isSmallSize || isVisible) && (
      <div className={cx("trending")}>
        <h2 className={cx("trending-title")}>
          <GlowingButton />
        </h2>
        <ul>
          {trendingList?.map((location) => (
            <li key={location._id} className={cx("underline")}>
              <NavLink to={`/post/location?k=${location.title}&id=${location._id}`}>
                # {location.title}
              </NavLink>
            </li>
          ))}
          <div className={cx("trending-more")}>...</div>
        </ul>
      </div>
    )
  );
};

export default Trending;

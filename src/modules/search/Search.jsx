import { NavLink, useSearchParams } from "react-router-dom";
import styles from "./Search.module.scss";
import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImages, faLocation, faUmbrellaBeach, faUsers } from "@fortawesome/free-solid-svg-icons";
import {
  SEARCH_ALBUM_ROUTE,
  SEARCH_LOCATION_ROUTE,
  SEARCH_USER_ROUTE,
  SEARCH_VACATION_ROUTE,
} from "~/utils/constants";
import DefaultLayout from "~/layouts/DefaultLayout/DefaultLayout";
import EmptyRes from "./Empty/EmptyRes";

const cx = classNames.bind(styles);

const filterFields = [
  { title: "People", url: SEARCH_USER_ROUTE, icon: faUsers },
  { title: "Location", url: SEARCH_LOCATION_ROUTE, icon: faLocation },
  { title: "Vacation", url: SEARCH_VACATION_ROUTE, icon: faUmbrellaBeach },
  { title: "Album", url: SEARCH_ALBUM_ROUTE, icon: faImages },
];

const Search = ({ children }) => {
  const [searchParams] = useSearchParams();
  const searchVal = searchParams.get("f");

  return (
    <DefaultLayout>
      <div className={cx("wrapper")}>
        <div className={cx("sidebar-container")}>
          <div className={cx("title")}>Search results</div>
          <div className={cx("filter-container")}>
            <div className={cx("title")}>Filters</div>
            {filterFields.map((item, index) => {
              return (
                <NavLink
                  end
                  className={({ isActive }) => cx("fil-field", isActive ? cx("active-field") : "")}
                  to={`${item.url}?f=${searchVal}`}
                  key={index}
                >
                  <FontAwesomeIcon icon={item.icon} className={cx("fil-icon")} />
                  {item.title}
                </NavLink>
              );
            })}
          </div>
        </div>
        <div className={cx("result-container")}>
          {searchVal === null ? (
            <EmptyRes description="Search anything ..." className={cx("empty")} />
          ) : (
            <div className={cx("result")}>{children}</div>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Search;

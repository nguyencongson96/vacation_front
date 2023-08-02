import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import styles from "./Search.module.scss";
import classNames from "classnames/bind";
import { useSelector, useDispatch } from "react-redux";
import { updateSearchMobileVisible } from "~/store/slices/generalSlice";
const cx = classNames.bind(styles);

const SearchMobile = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const searchVal = searchParams.get("f");
  const [value, setValue] = useState(searchVal || "");
  const { isSearchMobileVisible } = useSelector((state) => state.general);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && value !== "") {
      dispatch(updateSearchMobileVisible());
      navigate(`/search/user?f=${value}`);
    }
  };
  return (
    <input
      className={`${cx("search-input")} ${cx(isSearchMobileVisible ? "show" : "hide")}`}
      type="text"
      placeholder="# Explore..."
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
      }}
      onKeyDown={handleKeyPress}
      spellCheck={false}
    />
  );
};

export default SearchMobile;

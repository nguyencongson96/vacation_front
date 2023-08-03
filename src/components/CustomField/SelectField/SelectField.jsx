import { useEffect, useState } from "react";
import styles from "./SelectField.module.scss";
import classNames from "classnames/bind";
import locationAPI from "~/api/locationAPI";
const cx = classNames.bind(styles);

const SelectField = (props) => {
  const { field, label, options, onFocus, required } = props;
  const [selectList, setSelectList] = useState(options || []);
  // Get name & value of Input
  const { name, value } = field;

  useEffect(() => {
    if (name === "nationality") locationAPI.getNationList().then((res) => setSelectList(res.data.data));
  }, [name]);

  const handleSelectOption = (e) => {
    const selectedValue = e.target.value;
    field.onChange({
      target: {
        name,
        value: selectedValue,
      },
    });
  };

  //label Classes
  const labelClasses = cx("label", {
    active: value !== "" && "active",
    required: required && "required",
  });

  return (
    <div className={cx("wrapper")}>
      <select
        {...field}
        onChange={handleSelectOption}
        className={cx("select")}
        value={value === undefined ? "default" : value}
        onFocus={onFocus}
      >
        <option value="default" disabled hidden>
          Select your {name}
        </option>
        {selectList.map((item, index) => (
          <option key={index} name={item.title} value={item.title}>
            {item.title}
          </option>
        ))}
      </select>
      <label className={labelClasses}>{label}</label>
    </div>
  );
};

export default SelectField;

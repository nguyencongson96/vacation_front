import * as Yup from "yup";
import { UpdateUserData } from "~/modules/auth/config/data";
import { FastField, Form, Formik } from "formik";
import InputField from "~/components/CustomField/InputField/InputField";
import SelectField from "~/components/CustomField/SelectField/SelectField";
import { useDispatch, useSelector } from "react-redux";
import { Validate } from "~/modules/auth/config/validateConfig";
import { Button, List, message } from "antd";
import styles from "./Personal.module.scss";
import classNames from "classnames/bind";
import { resetNoti, updateInfo } from "~/store/slices/authSlice";
const cx = classNames.bind(styles);

const Personal = () => {
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const {
    isLoading,
    isError,
    msg,
    info: { firstname, lastname, dateOfBirth, phoneNumber, gender, nationality },
  } = useSelector((state) => state.auth);
  const timeIndex = dateOfBirth && dateOfBirth.indexOf("T");

  return (
    <div className={cx("wrapper")}>
      {contextHolder}
      <Formik
        initialValues={{
          firstname,
          lastname,
          dateOfBirth: dateOfBirth && dateOfBirth.slice(0, timeIndex),
          phoneNumber,
          gender,
          nationality,
        }}
        validationSchema={Yup.object().shape(Validate["UPDATE_PERSONAL"])}
        enableReinitialize
        onSubmit={(value) => {
          dispatch(resetNoti());
          dispatch(updateInfo(value)).then(() => {
            messageApi.open(
              isError ? { type: "error", content: msg } : { type: "success", content: "Updated" }
            );
          });
        }}
        onReset={(value) => {
          value = {};
        }}
      >
        <Form className={cx("form")}>
          <List
            className={cx("form-container")}
            grid={{ gutter: 35, xs: 1, sm: 2, md: 2, lg: 2, xl: 3, xxl: 3 }}
            dataSource={UpdateUserData.personal}
            renderItem={(item) => (
              <List.Item className={cx("form-item")}>
                <FastField
                  name={item.id}
                  type={item.type}
                  component={item.type === "select" ? SelectField : InputField}
                  label={item.label}
                  options={item.data}
                  required={item.required}
                />
              </List.Item>
            )}
          />
          <div className={cx("btn-container")}>
            <Button type="primary" htmlType="submit" loading={isLoading}>
              Save
            </Button>

            <Button type="primary" danger htmlType="reset">
              Cancel
            </Button>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default Personal;

import * as Yup from "yup";
import styles from "./Register.module.scss";
import classNames from "classnames/bind";
import { RegisterData } from "../config/data";
import { Validate, initValues } from "../config/validateConfig";
import { NavLink } from "react-router-dom";
import { Formik, FastField, Form } from "formik";
import { List, Button, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import InputField from "~/components/CustomField/InputField/InputField";
import { handleAuth, resetNoti } from "~/store/slices/authSlice";

const cx = classNames.bind(styles);

const Register = () => {
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const { isLoading } = useSelector((state) => state.auth);

  return (
    <div className={cx("wrapper")}>
      {contextHolder}
      <Formik
        initialValues={initValues.register}
        validationSchema={Yup.object().shape(Validate.register)}
        enableReinitialize
        onSubmit={(value) => {
          dispatch(resetNoti());
          dispatch(
            handleAuth({
              type: "register",
              data: value,
            })
          ).then((res) => {
            messageApi.open({
              type: res.payload.status >= 400 || !res.payload.status ? "error" : "success",
              content: res.payload.message,
              duration: 5,
            });
          });
        }}
      >
        <Form className={cx("form")}>
          <div className={cx("title")}>Register</div>
          <List
            className={cx("form-container")}
            dataSource={RegisterData.data}
            renderItem={(item) => (
              <FastField
                name={item.id}
                type={item.type}
                component={InputField}
                label={item.label}
                options={item.data}
                required={item.required}
              />
            )}
          />

          <Button type="primary" htmlType="submit" className={cx("btn-submit")} loading={isLoading}>
            Sign Up
          </Button>
        </Form>
      </Formik>

      <div className={cx("direct")}>
        If you have an account, please change to <NavLink to={"/login"}>login</NavLink>
      </div>
    </div>
  );
};

export default Register;

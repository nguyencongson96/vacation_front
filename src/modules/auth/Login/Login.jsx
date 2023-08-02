import * as Yup from "yup";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, NavLink } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./Login.module.scss";
import { Validate, initValues } from "../config/validateConfig";
import { Form, Formik, FastField } from "formik";
import { resetNoti, handleAuth } from "~/store/slices/authSlice";
import { Button, message, List } from "antd";
import InputField from "~/components/CustomField/InputField/InputField";
const cx = classNames.bind(styles);

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const { renderList, isLogin, isLoading } = useSelector((state) => state.auth);
  const { list } = renderList[renderList.length - 1];

  useEffect(() => {
    isLogin && navigate("/");
  }, [isLogin, navigate]);

  return (
    <div className={cx("wrapper")}>
      {contextHolder}

      <Formik
        initialValues={initValues.login}
        validationSchema={Yup.object().shape(Validate.login)}
        enableReinitialize
        onSubmit={(value) => {
          dispatch(resetNoti());
          dispatch(
            handleAuth({
              type: "login",
              data: {
                [value.username.includes("@") ? "email" : "username"]: value.username,
                password: value.password,
              },
            })
          ).then((res) => {
            if (res.payload.status >= 400) messageApi.open({ type: "error", content: res.payload.message });
          });
        }}
      >
        <Form className={cx("form")}>
          <div className={cx("title")}>Login</div>
          <List
            className={cx("form-container")}
            dataSource={list.data}
            renderItem={(item) => (
              <List.Item className={cx("form-item")}>
                <FastField
                  name={item.id}
                  type={item.type}
                  component={InputField}
                  label={item.label}
                  options={item.data}
                  required={item.required}
                />
              </List.Item>
            )}
          />

          <NavLink to={"/forgot"} className={cx("re-pass")}>
            Forgot password
          </NavLink>

          <Button type="primary" htmlType="submit" className={cx("btn-submit")} loading={isLoading}>
            Log in
          </Button>
        </Form>
      </Formik>

      <div className={cx("direct")}>
        If you don't have an account, please change to <NavLink to={"/register"}>register</NavLink>
      </div>
    </div>
  );
};

export default Login;

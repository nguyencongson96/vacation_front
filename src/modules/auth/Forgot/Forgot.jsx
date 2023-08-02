import * as Yup from "yup";
import styles from "./Forgot.module.scss";
import classNames from "classnames/bind";
import images from "~/images";
import { useSelector, useDispatch } from "react-redux";
import { Formik, Form, FastField } from "formik";
import { Validate, initValues } from "../config/validateConfig";
import InputField from "~/components/CustomField/InputField/InputField";
import { NavLink } from "react-router-dom";
import { List, message, Button } from "antd";
import { handleAuth, resetNoti } from "~/store/slices/authSlice";
const cx = classNames.bind(styles);

const Forgot = () => {
  const dispatch = useDispatch();
  const { renderList, isLoading } = useSelector((state) => state.auth);
  const list = renderList[renderList.length - 1].list.children.data;
  const [messageApi, contextHolder] = message.useMessage();

  return (
    <div className={cx("wrapper")}>
      {contextHolder}

      <Formik
        initialValues={initValues.forgotPassword}
        validationSchema={Yup.object().shape(Validate.forgotPassword)}
        enableReinitialize
        onSubmit={(value) => {
          dispatch(resetNoti());
          dispatch(handleAuth({ type: "forgotPassword", data: value })).then((res) => {
            if (res.payload.status >= 400) messageApi.open({ type: "error", content: res.payload.message });
          });
        }}
      >
        <Form className={cx("form")}>
          <div className={cx("header")}>
            <img src={images.key} alt="This is icon" />
            <h1 className={cx("title")}>Forgot your password?</h1>
            <div>Don’t worry we will send you reset code</div>
          </div>
          <List
            className={cx("form-container")}
            dataSource={list}
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

          <Button type="primary" htmlType="submit" className={cx("btn-submit")} loading={isLoading}>
            Send
          </Button>

          <div className={cx("footer")}>
            <img src={images.back} alt="This is icon" />
            <span>Back to </span>
            <NavLink to={"/login"}>Login</NavLink>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default Forgot;

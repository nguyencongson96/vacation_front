import React, { useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./Vacation.module.scss";
import { HeartFilled, CommentOutlined, EyeOutlined, MoreOutlined } from "@ant-design/icons";
import { deleteVacation, getListVacation, resetList } from "~/store/slices/vacationSlice";
import { Card, List, Typography, Skeleton, Image, Popover, Button } from "antd";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useOutletContext } from "react-router-dom";
import images from "~/images";
const cx = classNames.bind(styles);

const Vacations = () => {
  let formatter = Intl.NumberFormat("en", { notation: "compact" });
  const { userId } = useOutletContext();
  const dispatch = useDispatch();
  const {
    listVacationProf: { list, page, pages },
  } = useSelector((state) => state.vacation);
  const userLoginId = useSelector((state) => state.auth.info?._id);

  useEffect(() => {
    dispatch(resetList());
    dispatch(getListVacation(Object.assign({ type: "userProfile", page: 1 }, userId ? { userId } : {})));
  }, [userId, dispatch]);

  const loadMoreData = () =>
    dispatch(
      getListVacation(Object.assign({ type: "userProfile", page: page + 1 }, userId ? { userId } : {}))
    );

  const handleDelete = (id) => dispatch(deleteVacation(id));

  return (
    <div className={cx("feed-container")}>
      <InfiniteScroll
        dataLength={list.length}
        next={loadMoreData}
        hasMore={page < pages}
        loader={<Skeleton paragraph={{ rows: 1 }} active />}
      >
        <List
          className={cx("feed")}
          grid={{ gutter: 35, xs: 1, sm: 2, md: 2, lg: 3, xl: 3, xxl: 3 }}
          dataSource={list}
          renderItem={(item) => {
            const isAuthor = userLoginId === item.authorInfo?._id;
            return (
              <List.Item className={cx("feed-item")}>
                <NavLink to={`/vacation/${item._id}/post`}>
                  <Card
                    bordered={false}
                    className={cx("feed-card")}
                    hoverable={true}
                    cover={
                      <Image
                        preview={false}
                        className={cx("feed-cover")}
                        fallback={images.noImage}
                        src={item?.cover?.path}
                      />
                    }
                  >
                    <Typography.Paragraph
                      className={cx("feed-title")}
                      ellipsis={{ expandable: false, rows: 1 }}
                    >
                      {item.title}
                    </Typography.Paragraph>
                    <div className={cx("feed-cover-rad")}></div>
                    <div className={cx("feed-info")}>
                      <div className={cx("views")}>
                        <EyeOutlined />
                        {formatter.format(item.views)}
                      </div>
                      <div className={cx("likes")}>
                        <HeartFilled />
                        {formatter.format(item.likes)}
                      </div>
                      <div className={cx("cmts")}>
                        <CommentOutlined />
                        {formatter.format(item.comments)}
                      </div>
                    </div>
                  </Card>
                </NavLink>
                {isAuthor && (
                  <Popover
                    className={cx("pop-over")}
                    arrow
                    placement="bottomRight"
                    trigger={"click"}
                    color="#282828"
                    content={
                      <div className={cx("pop-content")}>
                        <Button onClick={() => handleDelete(item._id)}>Delete</Button>
                      </div>
                    }
                  >
                    <MoreOutlined className={cx("more")} />
                  </Popover>
                )}
              </List.Item>
            );
          }}
        />
      </InfiniteScroll>
    </div>
  );
};

export default Vacations;

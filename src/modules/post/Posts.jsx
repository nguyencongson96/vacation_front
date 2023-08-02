import classNames from "classnames/bind";
import styles from "./Posts.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Avatar, List } from "antd";
import PostItem from "./PostItem/PostItem";
import { Loading3QuartersOutlined } from "@ant-design/icons";
import HandlePost from "./HandlePost/HandlePost";
import InfiniteScroll from "react-infinite-scroll-component";
import { getManyPosts, isPostListChanged } from "~/store/slices/vacationSlice";
import { useOutletContext } from "react-router-dom";
const cx = classNames.bind(styles);

const Posts = () => {
  const { vacationId } = useOutletContext();
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const { info } = useSelector((state) => state.auth);
  const {
    posts: { list, page, pages, totalPost, isUpdatePost },
    detail,
  } = useSelector((state) => state.vacation);
  const [handlePost, setHandlePost] = useState("create");

  useEffect(() => {
    dispatch(
      getManyPosts({
        type: "vacation",
        id: vacationId,
        page: 1,
      })
    );
    return () => dispatch(isPostListChanged(false));
  }, [dispatch, vacationId, isUpdatePost]);

  const loadMoreData = () => {
    dispatch(
      getManyPosts({
        type: "vacation",
        id: vacationId,
        page: page + 1,
      })
    );
  };

  return (
    <>
      <div className={cx("wrapper")}>
        <div className={cx("container")}>
          {detail?.isMember && (
            <div className={cx("create-post")}>
              <Avatar src={info.avatar?.path} className={cx("avatar")} size={60} />
              <div
                onClick={() => {
                  setShowModal(true);
                  setHandlePost("create");
                }}
              >
                Every step is a milestone...
              </div>
            </div>
          )}

          {handlePost === "create" && (
            <HandlePost setShowModal={setShowModal} showModal={showModal} type={handlePost} />
          )}

          <InfiniteScroll
            dataLength={totalPost}
            next={loadMoreData}
            hasMore={page < pages}
            loader={<Loading3QuartersOutlined spin={true} />}
            className={cx("list")}
          >
            <List
              dataSource={list}
              renderItem={(item) => (
                <PostItem postDetail={item} setHandlePost={setHandlePost} handlePost={handlePost} />
              )}
            />
          </InfiniteScroll>
        </div>
      </div>
    </>
  );
};

export default Posts;

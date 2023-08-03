import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import styles from "./PostResult.module.scss";
import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getManyPosts } from "~/store/slices/vacationSlice";
import { List, Skeleton } from "antd";
import InfiniteScroll from "react-infinite-scroll-component";
import PostItem from "~/modules/post/PostItem/PostItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faUser } from "@fortawesome/free-solid-svg-icons";
const cx = classNames.bind(styles);

const PostResult = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const title = useParams()?.type;
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const timeline = searchParams.get("tl");
  const { list, page, pages } = useSelector((state) => state.vacation.posts);
  const [handlePost, setHandlePost] = useState("update");
  const location = list[0]?.location;
  const chosenLocation = `${location?.city} - ${location.district} - ${location.detail}`;

  useEffect(() => {
    dispatch(
      getManyPosts({
        type: title,
        id: id,
        timeline: timeline,
        page: 1,
      })
    );
  }, [dispatch, timeline, title, id, navigate]);

  const loadMoreData = () =>
    dispatch(
      getManyPosts({
        type: title,
        id: id,
        timeline: timeline,
        page: page + 1,
      })
    );

  return (
    <div className={cx("wrapper")}>
      <header className={cx("header")}>
        <h1>{title}</h1>
        <h3>{`#${timeline || chosenLocation}`}</h3>
      </header>
      <main className={cx("main")}>
        <div className={cx("container")}>
          {list?.length === 0 ? (
            <div className={cx("empty")}>
              <div>
                <FontAwesomeIcon icon={faUser} className={cx("user-icon")} />
                <FontAwesomeIcon icon={faMagnifyingGlass} className={cx("glass-icon")} />
              </div>
              <div className={cx("fail-msg")}>We didn't find any posts</div>
            </div>
          ) : (
            <InfiniteScroll
              scrollThreshold="50%"
              dataLength={list?.length}
              next={loadMoreData}
              hasMore={page < pages}
              loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
            >
              <List
                itemLayout="horizontal"
                dataSource={list}
                renderItem={(item) => (
                  <PostItem
                    postDetail={item}
                    vacationId={id}
                    handlePost={handlePost}
                    setHandlePost={setHandlePost}
                  />
                )}
              />
            </InfiniteScroll>
          )}
        </div>
      </main>
    </div>
  );
};

export default PostResult;

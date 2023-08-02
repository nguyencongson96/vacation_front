import { Link, useSearchParams } from "react-router-dom";
import styles from "./SearchUser.module.scss";
import classNames from "classnames/bind";
import { searchOneModel } from "~/store/slices/searchSlice";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, List } from "antd";
import { Loading3QuartersOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import EmptyRes from "../Empty/EmptyRes";
import { addFriend } from "~/store/slices/friendSlice";
import InfiniteScroll from "react-infinite-scroll-component";
const cx = classNames.bind(styles);

const SearchUser = () => {
  const [searchParams] = useSearchParams();
  const searchVal = searchParams.get("f");
  const dispatch = useDispatch();
  const { isLoading, data, page, pages } = useSelector((state) => state.search.result.users);

  useEffect(() => {
    dispatch(
      searchOneModel({
        body: { model: "user", value: searchVal, page: 1 },
        type: "users",
      })
    );
  }, [dispatch, searchVal]);

  const loadMoreData = () =>
    dispatch(searchOneModel({ body: { model: "user", value: searchVal, page: page + 1 }, type: "users" }));

  const handleAddFr = (id) => dispatch(addFriend({ id: id }));

  console.log(page, pages);

  return (
    <>
      <div className={cx("title")}>People</div>
      <div id="result" className={cx("result")}>
        <InfiniteScroll
          dataLength={data.length}
          next={loadMoreData}
          hasMore={page < pages}
          loader={<Loading3QuartersOutlined spin={true} />}
        >
          <List
            style={{ overflowX: "hidden" }}
            grid={{ gutter: 16, xs: 1, sm: 1, md: 1, lg: 1, xl: 2, xxl: 2 }}
            dataSource={data}
            renderItem={(item) => (
              <div className={cx("result-item")}>
                <Link className={cx("item-info")} to={`/profile/${item._id}/vacation`}>
                  <Avatar size={64} src={item.avatar} />
                  <div className={cx("user-info")}>
                    <div className={cx("username")} style={{ color: "white" }}>
                      {item.username}
                    </div>
                    <div className={cx("fullname")} style={{ color: "white" }}>
                      {`${item.firstname} ${item.lastname}`}
                    </div>
                  </div>
                </Link>
                {!item.isFriend ? (
                  <button className={cx("btn-add-fr")} onClick={() => handleAddFr(item._id)}>
                    Add Friend
                  </button>
                ) : (
                  <button className={cx("btn-fr")}>Friend</button>
                )}
              </div>
            )}
          />
        </InfiniteScroll>
      </div>

      {!isLoading && data?.length === 0 && <EmptyRes />}
    </>
  );
};

export default SearchUser;

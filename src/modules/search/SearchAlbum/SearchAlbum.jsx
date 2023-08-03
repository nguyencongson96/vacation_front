import { useEffect } from "react";
import styles from "./SearchAlbum.module.scss";
import classNames from "classnames/bind";
import { searchOneModel } from "~/store/slices/searchSlice";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useSearchParams } from "react-router-dom";
import { Avatar, Card, List } from "antd";
import EmptyRes from "../Empty/EmptyRes";
import { Loading3QuartersOutlined } from "@ant-design/icons";
import ImageField from "~/components/ImageField/ImageField";
import InfiniteScroll from "react-infinite-scroll-component";

const cx = classNames.bind(styles);

const SearchAlbum = () => {
  const [searchParams] = useSearchParams();
  const searchVal = searchParams.get("f");
  const dispatch = useDispatch();
  const { isLoading, page, pages, data } = useSelector((state) => state.search.result.albums);

  useEffect(() => {
    dispatch(
      searchOneModel({
        body: { model: "album", value: searchVal, page: 1 },
        type: "albums",
      })
    );
  }, [dispatch, searchVal]);

  const loadMoreData = () =>
    dispatch(
      searchOneModel({
        body: {
          model: "user",
          value: searchVal,
          page: page + 1,
        },
        type: "albums",
      })
    );

  return (
    <>
      <div id="result" className={cx("result")}>
        <InfiniteScroll
          dataLength={data.length}
          next={loadMoreData}
          hasMore={page < pages}
          loader={<Loading3QuartersOutlined spin={true} />}
        >
          <List
            style={{ overflowX: "hidden" }}
            grid={{ gutter: 30, xs: 1, sm: 2, md: 2, lg: 2, xl: 2, xxl: 3 }}
            dataSource={data}
            renderItem={(item) => (
              <NavLink to={`/album/${item._id}`}>
                <List.Item>
                  <Card className={cx("item")}>
                    <div className={cx("user-info")}>
                      <Avatar src={item.authorInfo?.avatar.path} />
                      <div>{item.authorInfo?.username}</div>
                    </div>
                    <ImageField src={item.cover} rootClassName={cx("cover")} preview={false} />
                    <div className={cx("item-name")}>
                      <span>{item.title}</span>
                    </div>
                  </Card>
                </List.Item>
              </NavLink>
            )}
          />
        </InfiniteScroll>
      </div>
      {data?.length === 0 && !isLoading && <EmptyRes />}
    </>
  );
};

export default SearchAlbum;

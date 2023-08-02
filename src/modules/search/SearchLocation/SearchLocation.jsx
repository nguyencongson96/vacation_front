import { useEffect } from "react";
import styles from "./SearchLocation.module.scss";
import classNames from "classnames/bind";
import { useDispatch, useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import { searchOneModel } from "~/store/slices/searchSlice";
import { Loading3QuartersOutlined } from "@ant-design/icons";
import InfiniteScroll from "react-infinite-scroll-component";
import { List, Typography } from "antd";
import EmptyRes from "../Empty/EmptyRes";
const cx = classNames.bind(styles);

const SearchLocation = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const searchVal = searchParams.get("f");
  const { isLoading, data, page, pages } = useSelector((state) => state.search.result.locations);

  useEffect(() => {
    dispatch(
      searchOneModel({
        body: { model: "location", value: searchVal, page: 1 },
        type: "locations",
      })
    );
  }, [dispatch, searchVal]);

  const loadMoreData = () =>
    dispatch(
      searchOneModel({
        body: { model: "location", value: searchVal, page: page + 1 },
        type: "locations",
      })
    );

  return (
    <>
      <div className={cx("title")}>Location</div>
      <div id="result" className={cx("result")}>
        <InfiniteScroll
          dataLength={data.length}
          next={loadMoreData}
          hasMore={page < pages}
          loader={<Loading3QuartersOutlined spin={true} />}
        >
          <List
            style={{ overflowX: "hidden" }}
            grid={{ gutter: 0, xs: 1, sm: 1, md: 1, lg: 2, xl: 2, xxl: 2 }}
            dataSource={data}
            renderItem={(item) => (
              <Link
                className={cx("item")}
                key={item._id}
                to={`/post/location?k=${item.title}&id=${item._id}`}
              >
                <Typography.Paragraph ellipsis={{ rows: 1, expandable: false }} className={cx("detail")}>
                  {item.title}
                </Typography.Paragraph>
                <Typography.Paragraph
                  ellipsis={{ rows: 1, expandable: false }}
                  className={cx("des")}
                >{`${item.district} - ${item.city}`}</Typography.Paragraph>
              </Link>
            )}
          />
        </InfiniteScroll>
      </div>

      {data?.length === 0 && !isLoading && <EmptyRes />}
    </>
  );
};

export default SearchLocation;

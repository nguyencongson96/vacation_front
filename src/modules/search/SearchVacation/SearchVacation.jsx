import styles from "./SearchVacation.module.scss";
import classNames from "classnames/bind";
import { searchOneModel } from "~/store/slices/searchSlice";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { Avatar, Card, List } from "antd";
import { Loading3QuartersOutlined } from "@ant-design/icons";
import EmptyRes from "../Empty/EmptyRes";
import ImageField from "~/components/ImageField/ImageField";
import InfiniteScroll from "react-infinite-scroll-component";

const cx = classNames.bind(styles);
const SearchVacation = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const searchVal = searchParams.get("f");
  const { vacations } = useSelector((state) => state.search.result);
  const { isLoading, data, page, pages } = vacations;

  useEffect(() => {
    dispatch(
      searchOneModel({
        body: { model: "vacation", value: searchVal, page: 1 },
        type: "vacations",
      })
    );
  }, [dispatch, searchVal]);

  const loadMoreData = () => {
    dispatch(
      searchOneModel({
        body: {
          model: "vacation",
          value: searchVal,
          page: page + 1,
        },
        type: "vacations",
      })
    );
  };

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
              <NavLink to={`/vacation/${item._id}/post`}>
                <List.Item>
                  <Card className={cx("item")}>
                    <div className={cx("user-info")}>
                      <Avatar src={item.authorInfo?.avatar.path} />
                      <div>{item.authorInfo?.username}</div>
                    </div>
                    <ImageField rootClassName={cx("cover")} src={item.cover?.path} preview={false} />
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
      {vacations.data?.length === 0 && !isLoading && <EmptyRes />}
    </>
  );
};

export default SearchVacation;

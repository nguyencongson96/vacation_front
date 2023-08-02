import NotFound from "~/components/NotFound/NotFound";
import AuthenLayout from "~/layouts/Auth/AuthenLayout";
import DefaultLayout from "~/layouts/DefaultLayout/DefaultLayout";
import Login from "~/modules/auth/Login/Login";
import Register from "~/modules/auth/Register/Register";
import Vacation from "~/modules/vacation/Vacation";
import UpdateUser from "~/modules/setting/UpdateUser";
import Personal from "~/modules/setting/Personal/Personal";
import Overview from "~/modules/setting/Overview/Overview";
import Profile from "~/modules/profile/Profile";
import NewFeed from "~/modules/newfeed/NewFeed";
import VacationProfile from "~/modules/profile/vacation/Vacations";
import AlbumProfile from "~/modules/profile/album/Albums";
import FriendProfile from "~/modules/profile/friend/Friends";
import NewAlbum from "~/modules/album/NewAlbum/NewAlbum";
import Forgot from "~/modules/auth/Forgot/Forgot";
import Reset from "~/modules/auth/Reset/Reset";
import Posts from "~/modules/post/Posts";
import AlbumVacation from "~/modules/vacation/Album/Album";
import {
  LOGIN_ROUTE,
  OVERVIEW_ROUTE,
  PERSONAL_ROUTE,
  REGISTER_ROUTE,
  SEARCH_ALBUM_ROUTE,
  SEARCH_LOCATION_ROUTE,
  SEARCH_USER_ROUTE,
  SEARCH_VACATION_ROUTE,
  SETTING_ROUTE,
  VACATION_ROUTE,
  FORGOT_ROUTE,
  RESET_ROUTE,
} from "~/utils/constants";
import Search from "~/modules/search/Search";
import SearchUser from "~/modules/search/SearchUser/SearchUser";
import SearchLocation from "~/modules/search/SearchLocation/SearchLocation";
import SearchVacation from "~/modules/search/SearchVacation/SearchVacation";
import SearchAlbum from "~/modules/search/SearchAlbum/SearchAlbum";
import Preloader from "~/components/Preloader/Preloader";
import PostResult from "~/modules/search/PostResult/PostResult";

export const publicRoutes = [
  { path: "/", component: NewFeed, layout: DefaultLayout },
  {
    path: LOGIN_ROUTE,
    component: Login,
    layout: AuthenLayout,
  },
  { path: REGISTER_ROUTE, component: Register, layout: AuthenLayout },
  { path: FORGOT_ROUTE, component: Forgot, layout: AuthenLayout },
  { path: RESET_ROUTE, component: Reset, layout: AuthenLayout },
  {
    path: SETTING_ROUTE,
    component: UpdateUser,
    layout: DefaultLayout,
    child: [
      {
        path: "",
        component: Overview,
      },
      {
        path: OVERVIEW_ROUTE,
        component: Overview,
      },
      {
        path: PERSONAL_ROUTE,
        component: Personal,
      },
    ],
  },

  {
    path: "/profile/:id?",
    component: Profile,
    layout: DefaultLayout,
    child: [
      { path: "vacation", component: VacationProfile },
      { path: "album", component: AlbumProfile },
      { path: "friends", component: FriendProfile },
      { path: "", component: VacationProfile },
    ],
  },
  { path: "/newAlbum", component: NewAlbum, layout: DefaultLayout },
  { path: "/album/:id", component: NewAlbum, layout: DefaultLayout },
  { path: "/pre", component: Preloader, layout: DefaultLayout },

  {
    path: VACATION_ROUTE,
    component: Vacation,
    layout: DefaultLayout,
    child: [
      { path: "post", component: Posts },
      { path: "album", component: AlbumVacation },
    ],
  },

  { path: SEARCH_USER_ROUTE, component: SearchUser, layout: Search },
  {
    path: SEARCH_LOCATION_ROUTE,
    component: SearchLocation,
    layout: Search,
  },
  { path: SEARCH_VACATION_ROUTE, component: SearchVacation, layout: Search },
  { path: SEARCH_ALBUM_ROUTE, component: SearchAlbum, layout: Search },
  { path: "post/:type", component: PostResult, layout: DefaultLayout },

  { path: "*", component: NotFound },
];

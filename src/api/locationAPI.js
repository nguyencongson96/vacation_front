import { axiosClient } from "./axiosClient";
import * as URL from "../utils/constants";

const locationAPI = {
  getTrendingPlace: (data) => {
    let url = `${URL.LOCATION_URL}?`;
    for (let key in data) {
      url += `${key}=${data[key]}&`;
    }
    return axiosClient.get(url);
  },

  getNationList: () => axiosClient.get(`${URL.LOCATION_URL}?type=level&number=4`),

  getManyLocations: (data) => {
    const url = `${URL.LOCATION_URL}?type=${data.type}&number=${data.number}&parentId=${data.parentId}`;
    return axiosClient.get(url);
  },

  addLocation: (data) => {
    return axiosClient.post(URL.LOCATION_URL, data);
  },
};

export default locationAPI;

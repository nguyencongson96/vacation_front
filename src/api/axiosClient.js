// api/axiosClient.js
import axios from "axios";

// Set up default config for http requests here
const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "content-type": "application/json",
  },
  timeout: 20000,
});
axiosClient.interceptors.request.use(async (config) => {
  const token = await localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 403 &&
      !originalRequest._retry &&
      (error.response?.data.message === "invalid token" || error.response?.data.message === "outdated token")
    ) {
      originalRequest._retry = true;
      const rfToken = localStorage.getItem("rfToken");
      try {
        const res = await axios.post(
          " https://vacation-social-network.onrender.com/auth/refresh",
          {},
          {
            headers: {
              "content-type": "application/json",
              Authorization: rfToken,
            },
          }
        );
        axios.defaults.headers.common["Authorization"] = "Bearer " + res.data.data.accessToken;
        localStorage.setItem("token", "Bearer " + res.data.data.accessToken);
        return axiosClient(originalRequest);
      } catch (error) {
        localStorage.removeItem("rfToken");
        localStorage.removeItem("token");
        window.location.reload();
      }
    } else {
      return Promise.reject(error);
    }
  }
);

const axiosUpload = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "multipart/form-data",
  },
  timeout: 20000,
});
axiosUpload.interceptors.request.use(async (config) => {
  const token = await localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

axiosUpload.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 403 &&
      !originalRequest._retry &&
      (error.response?.data.message === "invalid token" || error.response?.data.message === "outdated token")
    ) {
      originalRequest._retry = true;
      const rfToken = localStorage.getItem("rfToken");
      try {
        const res = await axios.post(
          " https://vacation-social-network.onrender.com/auth/refresh",
          {},
          {
            headers: {
              "content-type": "application/json",
              Authorization: rfToken,
            },
          }
        );
        axios.defaults.headers.common["Authorization"] = "Bearer " + res.data.data.accessToken;
        localStorage.setItem("token", "Bearer " + res.data.data.accessToken);
        return axiosUpload(originalRequest);
      } catch (error) {
        localStorage.removeItem("rfToken");
        localStorage.removeItem("token");
        window.location.reload();
      }
    } else {
      return Promise.reject(error);
    }
  }
);
export { axiosClient, axiosUpload };

// // /lib/api.ts

// import axios, { AxiosError, type AxiosInstance } from 'axios';
// import { useAuthStore } from '../store/authStore';

// // const BASE_URL = import.meta.env.VITE_API_URL;
// const BASE_URL = "https://api.srijanivfcentre.com"

// export const api: AxiosInstance = axios.create({
//   baseURL: `${BASE_URL}/api/v1/`,
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   timeout: 40000,
// });


// export const authApi: AxiosInstance = axios.create({
//   baseURL: `${BASE_URL}/api/v1/`,
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   timeout: 40000,
// });

// authApi.interceptors.request.use((config) => {
//   const { accessToken } = useAuthStore.getState();
//   if (accessToken) {
//     config.headers = config.headers ?? {};
//     config.headers.Authorization = `Bearer ${accessToken}`;
//   }
//   return config;
// });

// //  RESPONSE INTERCEPTOR (REFRESH) 
// let isRefreshing = false;
// let failedQueue: {
//   resolve: (token: string) => void;
//   reject: (err: unknown) => void;
// }[] = [];

// const processQueue = (error: AxiosError | null, token: string | null = null) => {
//   failedQueue.forEach((prom) => {
//     if (error) prom.reject(error);
//     else if (token) prom.resolve(token);
//   });
//   failedQueue = [];
// };

// authApi.interceptors.response.use(
//   (response) => response,
//   async (error: AxiosError) => {
//     const originalRequest = error.config as any;

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           failedQueue.push({ resolve, reject });
//         })
//           .then((token) => {
//             originalRequest.headers.Authorization = `Bearer ${token}`;
//             return authApi(originalRequest);
//           })
//           .catch((err) => Promise.reject(err));
//       }

//       originalRequest._retry = true;
//       isRefreshing = true;

//       try {
//         const { refreshToken, setTokens, logout } = useAuthStore.getState();
//         if (!refreshToken) {
//           logout();
//           return Promise.reject(error);
//         }

//         const response = await api.post('auth/refresh/', {
//           refresh: refreshToken,
//         });

//         const access = response.data.access as string;
//         setTokens({ accessToken: access });

//         processQueue(null, access);
//         originalRequest.headers.Authorization = `Bearer ${access}`;
//         return authApi(originalRequest);
//       } catch (refreshError) {
//         const { logout } = useAuthStore.getState();
//         processQueue(refreshError as AxiosError);
//         logout();
//         return Promise.reject(refreshError);
//       } finally {
//         isRefreshing = false;
//       }
//     }

//     return Promise.reject(error);
//   }
// );


// src/lib/api.ts

import axios, { type AxiosInstance } from "axios";
import { useAuthStore } from "../store/authStore";

const BASE_URL = "https://api.srijanivfcentre.com";

export const api: AxiosInstance = axios.create({
  baseURL: `${BASE_URL}/api/v1/`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 40000,
});

export const authApi: AxiosInstance = axios.create({
  baseURL: `${BASE_URL}/api/v1/`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 40000,
});

// REQUEST INTERCEPTOR
authApi.interceptors.request.use(
  (config) => {

    const token =
      localStorage.getItem(
        "token"
      );

    console.log(
      "TOKEN =>",
      token
    );

    if (token) {
      config.headers.set(
        "Authorization",
        `Bearer ${token}`
      );
    }

    return config;
  },

  (error) =>
    Promise.reject(error)
);

// RESPONSE INTERCEPTOR
authApi.interceptors.response.use(
  (response) => response,

  async (error) => {
    console.log("API ERROR:", error?.response?.status);

    // sirf reject karo
    // logout / refresh mat chalao
    return Promise.reject(error);
  }
);
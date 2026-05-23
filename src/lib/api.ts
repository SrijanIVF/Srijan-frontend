import axios from "axios";

export const authApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

authApi.interceptors.request.use(
  (config) => {

    const token =
      localStorage.getItem(
        "token"
      );

    if (!token) {

      localStorage.clear();

      window.location.href =
        "/login";

      return Promise.reject(
        "Token Missing"
      );
    }

    config.headers.Authorization =
      `Bearer ${token}`;

    return config;

  },

  (error) =>
    Promise.reject(error)
);


authApi.interceptors.response.use(

  (response) =>
    response,

  (error) => {

    const status =
      error?.response?.status;

    const networkError =
      !error.response;

    if (
      status === 401 ||
      networkError
    ) {

      localStorage.clear();

      sessionStorage.clear();

      window.location.href =
        "/login";
    }

    return Promise.reject(
      error
    );
  }
);
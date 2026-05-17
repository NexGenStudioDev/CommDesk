import axios, { AxiosError, AxiosRequestConfig } from "axios";

interface RetryAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * RESPONSE INTERCEPTOR
 * Auto refresh token on 401
 */
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryAxiosRequestConfig;

    // Check if error is 401 and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Attempt to refresh token
        await api.post("/auth/refresh");
        // Retry original request
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, reject with original error
        return Promise.reject(refreshError);
      }
    }

    // For all other errors, reject as usual
    return Promise.reject(error);
  },
);

export default api;

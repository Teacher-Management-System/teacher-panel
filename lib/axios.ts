import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { toast } from "sonner";
import { cookieService } from "./cookie";

// Create axios instance
const apiClient = axios.create({
  baseURL: "/api", // Use an environment variable
  timeout: 10000, // Request timeout
  headers: {
    "ngrok-skip-browser-warning": "true",
  },
  // headers: {
  //   "Content-Type": "application/json",
  // },
});

const debug = process.env.NODE_ENV !== "production";

// Request Interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add an authorization token to every request
    const token = cookieService.getCookie("authToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request for debugging
    if (debug) {
      console.log(
        `[API Request] ${config.method?.toUpperCase()} ${config.url}`,
        {
          headers: config.headers,
          data: config.data,
        },
      );
    }

    return config;
  },
  (error: AxiosError) => {
    console.error("[API Request Error]", error);
    return Promise.reject(error);
  },
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    if (debug) {
      console.log(`[API Response] ${response.status}`, response.data);
    }
    return response.data;
  },
  (error: AxiosError) => {
    console.error("[API Response Error]", error);

    // Handle different error scenarios
    if (error.response) {
      const status = error.response.status;
      const data: any = error.response.data;

      switch (status) {
        case 401:
          handleUnauthorized();
          break;

        case 403:
          toast.error(
            "Access denied. You do not have permission to perform this action.",
          );
          break;

        case 404:
        case 422:
        case 400:
          toast.error(
            data?.message ||
              data?.error ||
              error.message ||
              "Something went wrong.",
          );
          break;

        case 429:
          toast.error("Too many requests. Please try again later.");
          break;

        case 500:
          toast.error("Internal server error. Please try again later.");
          break;

        default:
          toast.error("Something went wrong. Please try again later.");
      }
    } else if (error.request) {
      toast.error("Network error. Please check your connection and try again.");
    } else {
      toast.error("An error occurred while setting up the request.");
    }

    return Promise.reject(error);
  },
);

// Helper function to handle unauthorized access
function handleUnauthorized(): void {
  if (typeof window === "undefined") return;
  cookieService.clearAllCookies();
  window.location.href = "/auth/login";
}

export default apiClient;

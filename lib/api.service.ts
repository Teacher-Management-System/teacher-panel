import { Data } from "@/types/data";
import apiClient from "./axios";
import { AxiosRequestConfig } from "axios";
import { toast } from "sonner";
import { cookieService } from "./cookie";

export interface ApiResponse {
  data: Data | undefined;
  status: boolean;
  message?: string;
  auth_token?: string;
  meta?: any;
}

/**
 * A generic base service for making API requests.
 */
export default class BaseService {
  private readonly endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  private getUrl(path: string = ""): string {
    return [this.endpoint, path].filter(Boolean).join("/");
  }

  /**
   * Handles the API response and applies custom logic.
   */
  private async handleResponse(
    promise: Promise<ApiResponse>,
  ): Promise<Data | undefined> {
    try {
      const response = await promise;
      console.log(response, "response");
      if (!response.status) {
        return Promise.reject(new Error(response.message || "Request failed"));
      }

      if (response.status && response.message) {
        toast.success(response.message);
      }

      // Store the auth token in a cookie if it's in the response
      if (response.auth_token) {
        cookieService.setCookie("authToken", response.auth_token);
      }

      const meta = response.meta ?? null;

      const result = meta
        ? { ...response.data, meta: meta }
        : response.data || {};
      if (response.auth_token) {
        (result as any).auth_token = response.auth_token;
      }
      return result;
    } catch (error) {
      console.log(error, "error");
      return Promise.reject(error);
    }
  }

  public get(
    path: string = "",
    params?: any,
    config?: AxiosRequestConfig,
  ): Promise<Data | undefined> {
    return this.handleResponse(
      apiClient.get(this.getUrl(path), { params, ...config }),
    );
  }

  public post(
    path: string = "",
    data: Partial<any>,
    config?: AxiosRequestConfig,
  ): Promise<Data | undefined> {
    return this.handleResponse(apiClient.post(this.getUrl(path), data, config));
  }

  public put(
    path: string = "",
    data: Partial<any>,
    config?: AxiosRequestConfig,
  ): Promise<Data | undefined> {
    return this.handleResponse(apiClient.put(this.getUrl(path), data, config));
  }

  public patch(
    path: string = "",
    data: Partial<any>,
    config?: AxiosRequestConfig,
  ): Promise<Data | undefined> {
    return this.handleResponse(
      apiClient.patch(this.getUrl(path), data, config),
    );
  }

  public delete(
    path: string = "",
    config?: AxiosRequestConfig,
  ): Promise<Data | undefined> {
    return this.handleResponse(apiClient.delete(this.getUrl(path), config));
  }
}

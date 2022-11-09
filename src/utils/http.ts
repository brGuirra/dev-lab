import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

import axios from 'axios';

export type RequestConfig = AxiosRequestConfig;

export type Response<T = any> = AxiosResponse<T>;

export class Request {
  constructor(private client = axios) {}

  public async get<T>(url: string, config: RequestConfig = {}): Promise<Response<T>> {
    return this.client.get<T, Response<T>>(url, config);
  }

  public static isRequestError(error: Error): boolean {
    return !!((error as AxiosError).response && (error as AxiosError).response?.status);
  }

  public static extractErrorData(error: unknown): Pick<AxiosResponse, 'data' | 'status'> {
    const axiosError = error as AxiosError;
    if (axiosError.response && axiosError.response.status) {
      return {
        data: axiosError.response.data,
        status: axiosError.response.status,
      };
    }
    throw Error(`The error ${error} is not a Request Error`);
  }
}

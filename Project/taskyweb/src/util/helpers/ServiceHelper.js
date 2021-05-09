import Cookies from "js-cookie";
import { RootViewHelper } from ".";

export default class ServiceHelper {
  static autoLoginEnabled;
  static baseUrl = "http://192.168.1.41:5001";
  static userId;
  static username;
  static password;

  static setToken = (token) => {
    Cookies.set("token", token);
  };

  static createOptionsJson = (requestBody, method) => {
    const options = {
      method: method,
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        Authorization: "Bearer " + Cookies.get("token"),
      },
      body: requestBody,
    };

    return options;
  };

  static createOptionsForm = (requestBody, method) => {
    const options = {
      method: method,
      headers: {
        Accept: "application/x-www-form-urlencoded",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: requestBody,
    };

    return options;
  };

  static createServiceResponse = (isSuccessful, message, data) => {
    const result = {
      isSuccessful: isSuccessful,
      message: message,
      data: data,
    };
    return result;
  };

  static serviceHandler = async (url, options, message) => {
    try {
      const baseUrl = this.baseUrl;
      if (!baseUrl) {
        throw new Error("Please call setBaseUrl to initialize base url");
      }
      // RootViewHelper.startLoading();
      console.log("WebService Request!", baseUrl + url, options);
      const response = await fetch(baseUrl + url, options);
      console.log("WebService Response!", baseUrl + url, response);

      if (response.status === 401) {
        console.log("WebService Error!", response.status);
        return;
      } else if (response.status === 200) {
        const result = await response.json();
        console.log("WebService Response DATA!", baseUrl + url, result);
        return result;
      } else {
        console.log("WebService Error!", response.status);
        const result = await response.json();

        console.log("WebService Response DATA!", baseUrl + url, result);
        return result;
      }
    } catch (error) {
      console.log("WebService Error!", url, error);

      return {
        isSuccessful: false,
        message: message ? message : error.message,
      };
    }
  };
}

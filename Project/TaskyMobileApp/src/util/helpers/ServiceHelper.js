import {RootViewHelper} from '.';

export default class ServiceHelper {
  static autoLoginEnabled;
  static baseUrl = 'https://jsonplaceholder.typicode.com';
  static userId;
  static username;
  static password;

  static createOptionsJson = (requestBody, method) => {
    const options = {
      method: method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: requestBody,
    };

    return options;
  };

  static createOptionsForm = (requestBody, method) => {
    const options = {
      method: method,
      headers: {
        Accept: 'application/x-www-form-urlencoded',
        'Content-Type': 'application/x-www-form-urlencoded',
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
      RootViewHelper.startLoading();
      const baseUrl = this.baseUrl;
      if (!baseUrl) {
        throw new Error('Please call setBaseUrl to initialize base url');
      }

      console.log('WebService Request!', baseUrl + url, options);
      const response = await fetch(baseUrl + url, options);
      console.log('WebService Response!', baseUrl + url, response);

      if (response.status === 401) {
        console.log('WebService Error!', response.status);
        RootViewHelper.stopLoading();
        return;
        // if (this.autoLoginEnabled) {
        //   await this.serviceLoginInfolineFramework(
        //     this.userId,
        //     this.username,
        //     this.password,
        //     this.autoLoginEnabled,
        //   );
        //   return this.serviceHandler(url, options, message);
        // } else {
        //   throw new Error(response.status);
        // }
      } else if (response.status === 200) {
        const data = await response.json();
        console.warn('DATA', data)
        const result = {
          isSuccessful: data.result,
          message: message ? message : data.message,
          data: data.objects,
        };

        console.log('WebService Response DATA!', baseUrl + url, result);
        RootViewHelper.stopLoading();
        return result;
      } else {
        console.log('WebService Error!', response.status);
        const result = {
          isSuccessful: false,
          message: message ? message : 'Error (' + response.status + ')',
          data: null,
        };

        console.log('WebService Response DATA!', baseUrl + url, result);
        RootViewHelper.stopLoading();
        return result;
      }
    } catch (error) {
      console.log('WebService Error!', url, error);
      RootViewHelper.stopLoading();

      return {
        isSuccessful: false,
        message: message ? message : error.message,
      };
    }
  };
}

export default class ServiceHelper {
  static startLoading;
  static stopLoading;

  static setStartLoading = (loadingFunct) => {
    this.startLoading = loadingFunct;
  };
  static setStopLoading = (loadingFunct) => {
    this.stopLoading = loadingFunct;
  };
}

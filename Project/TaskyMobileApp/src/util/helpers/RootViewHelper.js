export default class RootViewHelper {
  static loading = false;
  static rootViewRef = null;

  static setRootViewRef = (rootViewRef) => {
    this.rootViewRef = rootViewRef;
  };

  static startLoading = () => {
    if (this.loading) {
      return;
    }

    console.log('start loading')

    this.loading = true;
    this.triggerLoading();
  };

  static stopLoading = () => {
    if (!this.loading) {
      return;
    }

    console.log('stop loading')

    this.loading = false;
    this.triggerLoading();
  };

  static triggerLoading = () => {
    if (this.rootViewRef) {
      this.rootViewRef.triggerLoading();
    }
  };

  static isLoading = () => {
    return this.loading;
  };

  static showError = (message, autoHide = false) => {
    if (this.rootViewRef) {
      this.rootViewRef.showMessage(message, 'error');
    }

    if (autoHide) {
      setTimeout(() => {
        if (this.rootViewRef) {
          this.rootViewRef.showMessage('', 'error');
        }
      }, 3000);
    }
  };

  static showSuccess = (message, autoHide = false) => {
    if (this.rootViewRef) {
      this.rootViewRef.showMessage(message, 'success');
    }

    if (autoHide) {
      setTimeout(() => {
        if (this.rootViewRef) {
          this.rootViewRef.showMessage('', 'success');
        }
      }, 3000);
    }
  };
}

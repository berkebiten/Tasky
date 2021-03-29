import {NavigationActions, StackActions} from 'react-navigation';
import {RootViewHelper} from '.';

export default class NavigationHelper {
  static config = {};

  static setNavigator = nav => {
    if (nav) {
      this.config.navigator = nav;
    }
  };

  static navigate = (routeName, params) => {
    if (this.config.navigator && routeName) {
      RootViewHelper.showError('');
      let action = NavigationActions.navigate({routeName, params});
      this.config.navigator.dispatch(action);
    }
  };

  static goBack = () => {
    if (this.config.navigator) {
      RootViewHelper.showError('');
      let action = NavigationActions.back({});
      this.config.navigator.dispatch(action);
    }
  };

  static dispatch = params => {
    if (this.config.navigator) {
      RootViewHelper.showError('');
      this.config.navigator.dispatch(params);
    }
  };
}

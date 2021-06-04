import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {
  GetStartedScreen,
  MainScreen,
  SignInScreen,
  SignUpScreen,
  ProfileScreen,
  TaskScreen,
  ProjectScreen,
} from '../screens';
import {SCREEN_ENUMS} from '../util/constants/Enums';
import {loadLoginObject} from '../util/storage/AsyncStorage';

const getInitialRoute = () => {
  loadLoginObject().then((loginObj) => {
    if (loginObj) {
      return SCREEN_ENUMS.SIGN_IN;
    } else {
      return SCREEN_ENUMS.GET_STARTED;
    }
  });
};

const ScreenStack = createStackNavigator(
  {
    [SCREEN_ENUMS.HOME]: {
      screen: MainScreen,
    },
    [SCREEN_ENUMS.PROFILE]: {
      screen: ProfileScreen,
    },
    [SCREEN_ENUMS.TASK]: {
      screen: TaskScreen,
    },
    [SCREEN_ENUMS.PROJECT]: {
      screen: ProjectScreen,
    },
  },
  {headerMode: null},
);

const Route = createStackNavigator(
  {
    [SCREEN_ENUMS.GET_STARTED]: {
      screen: GetStartedScreen,
    },
    [SCREEN_ENUMS.SIGN_IN]: {
      screen: SignInScreen,
    },
    [SCREEN_ENUMS.SIGN_UP]: {
      screen: SignUpScreen,
    },
    [SCREEN_ENUMS.APP]: {
      screen: ScreenStack,
    },
  },
  {
    initialRouteName: getInitialRoute(),
    headerMode: 'none',
  },
);

const prevGetStateForAction = ScreenStack.router.getStateForAction;

ScreenStack.router.getStateForAction = (action, state) => {
  if (action.type === 'ReplaceCurrentScreen' && state) {
    const routes = state.routes.slice(0, state.routes.length - 1);
    routes.push(action);
    return {
      ...state,
      routes,
      index: routes.length - 1,
    };
  }

  return prevGetStateForAction(action, state);
};

export default createAppContainer(Route);

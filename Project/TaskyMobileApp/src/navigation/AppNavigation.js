import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {
  GetStartedScreen,
  MainScreen,
  SignInScreen,
  SignUpScreen,
  ProfileScreen,
  TaskScreen,
} from '../screens';
import {SCREEN_ENUMS} from '../util/constants/Enums';

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
    initialRouteName: SCREEN_ENUMS.GET_STARTED,
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

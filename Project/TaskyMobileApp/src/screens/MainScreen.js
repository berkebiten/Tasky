import React from 'react';
import Main from '../containers/Main';
import {withNavigation} from 'react-navigation';

const MainWithNav = withNavigation(Main);
export default class MainScreen extends React.Component {
  render() {
    return <MainWithNav />;
  }
}

import React from 'react';
import GetStarted from '../containers/GetStarted';
import {withNavigation} from 'react-navigation';

const GetStartedWithNav = withNavigation(GetStarted);
export default class GetStartedScreen extends React.Component {
  render() {
    return <GetStartedWithNav />;
  }
}

import React from 'react';
import Profile from '../containers/Profile';
import {withNavigation} from 'react-navigation';

const ProfileWithNav = withNavigation(Profile);
export default class ProfileScreen extends React.Component {
  render() {
    return <ProfileWithNav />;
  }
}

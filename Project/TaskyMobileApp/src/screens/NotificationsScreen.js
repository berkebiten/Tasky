import React from 'react';
import Notifications from '../containers/Notifications';
import {withNavigation} from 'react-navigation';

const NotificationsWithNav = withNavigation(Notifications);
export default class NotificationsScreen extends React.Component {
  render() {
    return <NotificationsWithNav />;
  }
}

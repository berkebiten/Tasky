import React, {Component} from 'react';
import {FlatList, View} from 'react-native';
import {SafeAreaView} from 'react-navigation';
import NotificationItem from '../../components/items/NotificationItem';
import {Metrics} from '../../res/styles';
import HeaderView from '../../components/views/HeaderView';
import styles from './styles';
import {NavigationHelper, ServiceHelper} from '../../util/helpers';
import {
  GET_NOTIFICATIONS,
  SET_READ_NOTIFICATION,
} from '../../util/constants/Services';
import {SCREEN_ENUMS} from '../../util/constants/Enums';

export default class Notifications extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = () => {
    this.getNotifications();
  };

  getNotifications = async () => {
    const responseData = await ServiceHelper.serviceHandler(
      GET_NOTIFICATIONS,
      ServiceHelper.createOptionsJson(null, 'GET'),
    );
    if (responseData.data) {
      this.setState({
        notifications: responseData.data,
      });
    }
  };

  onPressNotification = async (screen, params, id) => {
    const responseData = await ServiceHelper.serviceHandler(
      SET_READ_NOTIFICATION + id,
      ServiceHelper.createOptionsJson(null, 'PUT'),
    );
    if (responseData && screen) {
      NavigationHelper.navigate(screen, params);
    }
  };

  renderItem = (item) => {
    return (
      <View style={styles.item}>
        <NotificationItem
          item={item.item}
          itemWidth={Metrics.WIDTH * 0.95}
          onPress={() =>
            this.onPressNotification(
              item.item.mobileScreen
                ? SCREEN_ENUMS[item.item.mobileScreen]
                : null,
              {
                task: {id: item.item.dataId},
              },
              item.item.id,
            )
          }
        />
      </View>
    );
  };

  createContent = () => {
    return (
      <View style={{flexDirection: 'row', marginTop: 10}}>
        <View style={styles.line} />
        <FlatList
          ref={(ref) => {
            this.flatListRef = ref;
          }}
          data={this.state.notifications ? this.state.notifications : []}
          extraData={this.state}
          style={styles.listMainView}
          contentContainerStyle={{paddingVertical: Metrics.WIDTH * 0.01}}
          keyExtractor={(item, index) => index.toString()}
          renderItem={(item) => this.renderItem(item)}
        />
      </View>
    );
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <HeaderView title="Notifications" />
        <SafeAreaView style={{flex: 1}}>{this.createContent()}</SafeAreaView>
      </View>
    );
  }
}

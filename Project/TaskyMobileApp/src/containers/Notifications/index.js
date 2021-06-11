import React, {Component} from 'react';
import {FlatList, View} from 'react-native';
import {SafeAreaView} from 'react-navigation';
import NotificationItem from '../../components/items/NotificationItem';
import {Metrics} from '../../res/styles';
import HeaderView from '../../components/views/HeaderView';
import styles from './styles';

export default class Notifications extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderItem = (item) => {
    return (
      <View style={styles.item}>
        <NotificationItem item={item.item} itemWidth={Metrics.WIDTH * 0.95} />
      </View>
    );
  };

  createContent = (data) => {
    return (
      <View style={{flexDirection: 'row', marginTop: 10}}>
        <View style={styles.line} />
        <FlatList
          ref={(ref) => {
            this.flatListRef = ref;
          }}
          data={data}
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
        <HeaderView title="Bildirimler" />
        <SafeAreaView style={{flex: 1}}>
          {this.createContent(['x', 'x', 'x', 'y', 'x', 'y', 'y', 'y', 'y'])}
        </SafeAreaView>
      </View>
    );
  }
}

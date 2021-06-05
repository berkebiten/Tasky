import React from 'react';
import {View, Text, StyleSheet, I18nManager} from 'react-native';
import {Metrics, Fonts} from '../../res/styles';
import TextTicker from 'react-native-text-ticker';

export default class UserDetailItem extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  createItem = (value, description) => {
    return (
      <View style={styles.followSec}>
        <TextTicker
          style={styles.followCount}
          duration={10000}
          loop
          bounce
          repeatSpacer={20}
          marqueeDelay={2000}>
          {value}
        </TextTicker>
        <Text style={styles.followText}>{description}</Text>
      </View>
    );
  };

  render() {
    return this.props.userData ? (
      <View style={styles.main}>
        <View style={styles.followContainer}>
          {this.props.userData.totalProjects &&
            this.createItem(this.props.userData.totalProjects, 'Projects')}
          <View style={styles.verticalSeparator} />
          {this.props.userData.openTasks &&
            this.createItem(this.props.userData.openTasks, 'Active Tasks')}
          <View style={styles.verticalSeparator} />
          {this.props.userData.resolvedTasks &&
            this.createItem(this.props.userData.resolvedTasks, 'Closed Tasks')}
        </View>

        <View style={styles.dividerHorizontal} />
      </View>
    ) : null;
  }
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: '#FFFFFF',
    marginBottom: Metrics.HEIGHT * 0.015,
  },

  dividerHorizontal: {
    backgroundColor: '#d6d6d6',
    height: 1,
    width: Metrics.FILL,
    alignSelf: 'center',
  },

  followContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Metrics.HEIGHT * 0.06,
    borderWidth: 1,
    borderColor: '#e1e1e1',
    margin: Metrics.HEIGHT * 0.015,
    marginTop: Metrics.HEIGHT * 0.025,
  },

  followSec: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Metrics.HEIGHT * 0.008,
  },

  followCount: {
    fontFamily: Fonts.type.sfuiDisplaySemibold,
    fontSize: Fonts.moderateScale(17),
    color: '#363636',
  },

  followText: {
    fontFamily: Fonts.type.sfuiDisplayRegular,
    fontSize: Fonts.moderateScale(12),
    color: '#959595',
  },

  verticalSeparator: {
    width: Metrics.HEIGHT * 0.001,
    backgroundColor: '#e1e1e1',
    height: Metrics.HEIGHT * 0.07,
  },
});

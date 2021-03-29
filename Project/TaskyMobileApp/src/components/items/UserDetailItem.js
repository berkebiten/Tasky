import React from 'react';
import {View, Text, StyleSheet, I18nManager} from 'react-native';
import {Metrics, Fonts} from '../../res/styles';
import TextTicker from 'react-native-text-ticker';
import Strings from '../../res/strings/Strings';

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
            this.createItem(
              this.props.userData.openTasks,

              'Open Tasks',
            )}
          <View style={styles.verticalSeparator} />
          {this.props.userData.resolvedTasks &&
            this.createItem(
              this.props.userData.resolvedTasks,
              'Resolved Tasks',
            )}
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

  header: {
    backgroundColor: '#2d324f',
    height: 65,
    width: Metrics.FILL,
    flexDirection: 'row',
    borderBottomColor: 'transparent',
    paddingTop: 15,
  },
  left: {
    flex: 1,
  },
  backArrow: {
    width: 30,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  body: {
    flex: 2,
    alignItems: 'center',
  },
  title: {
    marginTop: 2,
    color: 'white',
    fontSize: Fonts.moderateScale(18),
    fontFamily: Fonts.type.SFUIDisplaySemibold,
  },
  profileImg: {
    width: Metrics.WIDTH * 0.24,
    height: Metrics.WIDTH * 0.24,
    borderRadius: Metrics.WIDTH * 0.12,
    alignSelf: 'center',
    marginTop: Metrics.HEIGHT * 0.03,
  },

  nameTxt: {
    color: '#6f6f6f',
    fontFamily: Fonts.type.SFUIDisplayMedium,
    fontSize: Fonts.moderateScale(18),
    alignSelf: 'center',
    marginTop: Metrics.HEIGHT * 0.01,
  },

  designationTxt: {
    color: '#b7b7b7',
    fontSize: Fonts.moderateScale(12),
    fontFamily: Fonts.type.SFUIDisplayRegular,
    marginTop: 3,
    alignSelf: 'center',
  },

  descTxt: {
    width: Metrics.WIDTH * 0.75,
    alignSelf: 'center',
    color: '#6f6f6f',
    fontSize: Fonts.moderateScale(14),
    fontFamily: Fonts.type.SFUIDisplayLight,
    textAlign: 'center',
    marginTop: Metrics.WIDTH * 0.045,
  },

  dividerHorizontal: {
    backgroundColor: '#d6d6d6',
    height: 1,
    width: Metrics.FILL,
    alignSelf: 'center',
  },

  accountInfoBg: {
    backgroundColor: '#f1f1f1',
    height: Metrics.HEIGHT * 0.072,
    width: Metrics.FILL,
  },

  accountInfoTxt: {
    color: '#adadad',
    fontSize: Fonts.moderateScale(12),
    width: Metrics.WIDTH * 0.82,
    paddingTop: Metrics.HEIGHT * 0.035,
    paddingLeft: I18nManager.isRTL ? 0 : Metrics.WIDTH * 0.09,
    paddingRight: I18nManager.isRTL ? Metrics.WIDTH * 0.09 : 0,
    fontFamily: Fonts.type.SFUIDisplayRegular,
    textAlign: 'left',
  },

  infoFieldBg: {
    width: Metrics.WIDTH * 0.82,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'column',
  },

  fieldDivider: {
    backgroundColor: '#f2f2f2',
    width: Metrics.WIDTH * 0.91,
    alignSelf: 'flex-end',
    height: 1,
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

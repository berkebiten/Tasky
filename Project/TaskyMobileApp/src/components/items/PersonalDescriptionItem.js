import React from 'react';
import {View, Text, StyleSheet, Image, I18nManager} from 'react-native';
import {Metrics, Fonts} from '../../res/styles';

export default class PersonalDescriptionItem extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return this.props.user ? (
      <View style={styles.main}>
        <Image
          source={{uri: this.props.user.profileImage}}
          style={styles.profileImg}
        />

        {this.props.user.firstName && this.props.user.lastName && (
          <Text style={styles.nameTxt}>
            {this.props.user.firstName + ' ' + this.props.user.lastName}
          </Text>
        )}
      </View>
    ) : null;
  }
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: '#FFFFFF',
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
    marginBottom: Metrics.HEIGHT * 0.01,
  },

  designationTxt: {
    color: '#b7b7b7',
    fontSize: Fonts.moderateScale(12),
    fontFamily: Fonts.type.SFUIDisplayRegular,
    marginBottom: Metrics.HEIGHT * 0.01,
    alignSelf: 'center',
  },

  descTxt: {
    width: Metrics.WIDTH * 0.75,
    alignSelf: 'center',
    color: '#6f6f6f',
    fontSize: Fonts.moderateScale(14),
    fontFamily: Fonts.type.SFUIDisplayLight,
    textAlign: 'center',
    marginBottom: Metrics.HEIGHT * 0.01,
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

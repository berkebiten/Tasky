import {Platform, StyleSheet, I18nManager} from 'react-native';
import {Fonts, Metrics} from '../../res/styles';

const styles = StyleSheet.create({
  infoFieldTitleTxt: {
    color: '#b7b7b7',
    fontSize: Fonts.moderateScale(13),
    fontFamily: Fonts.type.SFUIDisplayLight,
    textAlign: 'left',
  },

  infoFieldDetailTxt: {
    color: '#6f6f6f',
    textAlign: 'left',
    ...Platform.select({
      android: {
        fontSize: Fonts.moderateScale(18),
      },
      ios: {
        fontSize: Fonts.moderateScale(16),
      },
    }),
    fontFamily: Fonts.type.SFUIDisplayLight,
  },

  fieldDivider: {
    backgroundColor: '#f2f2f2',
    width: Metrics.WIDTH * 0.91,
    alignSelf: 'flex-end',
    height: 1,
  },
});

export default styles;

import {Platform, StyleSheet, I18nManager} from 'react-native';
import {Fonts, Metrics, Colors} from '../../res/styles';

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

  fab: {
    position: 'absolute',
    margin: Metrics.HEIGHT * 0.03,
    right: 0,
    bottom: 0,
    backgroundColor:'#2d324f'
  },

  modelTopBar: {
    width: Metrics.WIDTH * 0.97,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.silver,
    paddingHorizontal: 10,
    backgroundColor: Colors.lightgrey,
    borderRadius: 15,
    marginHorizontal: Metrics.WIDTH * 0.015,
    marginTop: 10,
  },

  modelTitle: {
    fontSize: Fonts.moderateScale(12),
    flex: 1,
  },
});

export default styles;

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

  profileImg: {
    width: Metrics.WIDTH * 0.15,
    height: Metrics.WIDTH * 0.15,
    borderRadius: Metrics.WIDTH * 0.075,
    borderWidth: 2,
    borderColor: Colors.snow,
    alignSelf: 'center',
    marginTop: 10,
  },

  mainRow: {
    flexDirection: 'row',
    margin: Metrics.HEIGHT * 0.015,

    alignItems: 'center',
  },

  profileImgList: {
    width: Metrics.WIDTH * 0.1,
    height: Metrics.WIDTH * 0.1,
    borderRadius: Metrics.WIDTH * 0.05,
  },

  nameDesignationMainView: {
    marginLeft: Metrics.WIDTH * 0.045,
    flexDirection: 'column',
  },

  nameDesignationView: {
    flexDirection: 'column',
    justifyContent: 'center',
  },

  nameTxt: {
    color: '#363636',
    fontSize: Fonts.moderateScale(14),
    fontFamily: Fonts.type.sfuiDisplayMedium,
    textAlign: 'left',
  },

  designationTxt: {
    color: '#b7b7b7',
    fontSize: Fonts.moderateScale(12),
    marginTop: Metrics.HEIGHT * 0.002,
    textAlign: 'left',
  },
});

export default styles;

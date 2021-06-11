import {StyleSheet} from 'react-native';
import {Metrics, Fonts, Colors} from '../../res/styles';

const styles = StyleSheet.create({
  backArrow: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  drawercontainer: {
    flex: 1,
    backgroundColor: '#f1f1f1',
  },

  menuListItem: {
    marginLeft: Metrics.WIDTH * 0.03,
    color: '#2d324f',
    fontSize: Fonts.moderateScale(18),
    fontFamily: Fonts.type.sfuiDisplayRegular,
  },

  container: {
    height: Metrics.FILL,
    width: Metrics.FILL,
  },

  imgContainer: {
    height: Metrics.FILL,
    backgroundColor: Colors.snow,
  },

  listProfileContainer: {
    height: Metrics.HEIGHT * 0.96,
    backgroundColor: Colors.snow,
  },

  profileDataBg: {
    flexDirection: 'row',
    marginTop: Metrics.HEIGHT * 0.1,
    alignItems: 'center',
    marginLeft: Metrics.WIDTH * 0.1,
    backgroundColor: Colors.transparent,
  },

  profileImg: {
    width: Metrics.WIDTH * 0.16,
    height: Metrics.WIDTH * 0.16,
    borderRadius: Metrics.WIDTH * 0.08,
    borderColor: Colors.snow,
    borderWidth: 2,
    resizeMode: 'cover',
  },

  nameTxt: {
    fontSize: Fonts.moderateScale(15),
    fontFamily: Fonts.type.sfuiDisplayMedium,
    color: '#2d324f',
  },

  addressTxt: {
    fontSize: Fonts.moderateScale(12),
    fontFamily: Fonts.type.sfuiDisplayRegular,
    color: '#919cae',
    textAlign: 'left',
  },

  nameAddressTxt: {
    flexDirection: 'column',
    marginLeft: Metrics.WIDTH * 0.03,
  },

  menuListBg: {
    marginTop: Metrics.HEIGHT * 0.015,
    marginLeft: Metrics.WIDTH * 0.12,
    backgroundColor: Colors.transparent,
  },

  menuListItemBg: {
    flexDirection: 'row',
    marginTop: Metrics.HEIGHT * 0.04,
    alignItems: 'center',
  },

  scrollBg: {
    flex: 1,
    backgroundColor: Colors.transparent,
  },

  versionText: {
    fontSize: Fonts.moderateScale(15),
    fontFamily: Fonts.type.sfuiDisplayLight,
    color: Colors.lightGray,
    alignSelf: 'flex-end',
    marginEnd: Metrics.WIDTH * 0.1,
  },

  viewPagerView: {
    backgroundColor: 'white',
    alignItems: 'center',
  },

  viewPagerText: {
    textAlign: 'center',
    marginTop: 50,
    fontWeight: 'bold',
    fontSize: 20,
  },

  footerTab: {
    justifyContent: 'flex-end',
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

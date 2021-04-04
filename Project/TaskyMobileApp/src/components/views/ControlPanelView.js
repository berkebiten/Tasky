import React, {Component} from 'react';
import {
  Image,
  View,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {Text} from 'native-base';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import TextTicker from 'react-native-text-ticker';
import {Metrics, Fonts, Colors} from '../../res/styles';

export default class ControlPanelView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profileImage: {
        uri:
          'https://d338t8kmirgyke.cloudfront.net/icons/icon_pngs/000/004/088/original/user.png',
      },
    };
  }

  render() {
    return (
      <View style={styles.imgContainer}>
        <View style={styles.listProfileContainer}>
          <View style={styles.profileDataBg}>
            <Image source={this.state.profileImage} style={styles.profileImg} />
            <View style={styles.nameAddressTxt}>
              <TextTicker
                style={styles.nameTxt}
                duration={10000}
                loop
                bounce
                repeatSpacer={20}
                marqueeDelay={2000}>
                {this.props.userData &&
                  this.props.userData.firstName +
                    ' ' +
                    this.props.userData.lastName}
              </TextTicker>
              <TextTicker
                style={styles.addressTxt}
                duration={10000}
                loop
                bounce
                repeatSpacer={20}
                marqueeDelay={2000}>
                {this.props.userData && this.props.userData.email}
              </TextTicker>
            </View>
          </View>
          <View style={styles.scrollBg}>
            <ScrollView style={styles.menuListBg}>
              <TouchableOpacity
                style={styles.menuListItemBg}
                onPress={() => {
                  this.props.onClose();
                }}>
                <SimpleLineIcons name="home" size={20} color="#919cae" />
                <Text style={styles.menuListItem}>Home</Text>
              </TouchableOpacity>
              {this.props.modules
                ? this.props.modules.map((item, key) => {
                    return (
                      <TouchableOpacity
                        style={styles.menuListItemBg}
                        key={key}
                        onPress={() => {
                          item.onPress();
                        }}>
                        <SimpleLineIcons
                          name={item.iconName}
                          size={20}
                          color="#919cae"
                        />
                        <Text style={styles.menuListItem}>
                          {item.menuTitle}
                        </Text>
                      </TouchableOpacity>
                    );
                  })
                : null}
            </ScrollView>
          </View>
        </View>
      </View>
    );
  }
}

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
});

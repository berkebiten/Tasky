import React, {Component} from 'react';
import {Text, Image, StyleSheet, View, TouchableOpacity} from 'react-native';
import { Colors, Fonts, Metrics} from '../../res/styles';
import images from '../../res/styles/images';

const profileImageTwo =
  'https://media-exp1.licdn.com/dms/image/C4E03AQHEEtmS2CQOzg/profile-displayphoto-shrink_200_200/0/1535834186551?e=1626912000&v=beta&t=SlCE8S_OxdcTxr-0T0947Pb6QRL8l6UzBicVwciO-No';

const item = {
  id: 1,
  name: 'Bilal Dursun',
  postImage: '',
  profileImage: {uri: profileImageTwo},
  time: 'dsa',
  description:
    'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
};
export default class NotificationItem extends Component {
  constructor(props) {
    super(props);
  }

  createHeader = () => {
    return (
      <View style={styles.rowHeaderView}>
        <Image style={styles.profileImg} source={images.notification} />
        <View
          style={{
            ...styles.rowDescriptionView,
          }}>
          <Text style={styles.rowDescTxt}>{item.description}</Text>
        </View>
      </View>
    );
  };

  getContainerStyle = () => {
    let containerStyle = styles.rowBg;
    if (this.props.item === 'x') {
      containerStyle = {...containerStyle, ...styles.shadow};
    }
    return containerStyle;
  };

  createContent = () => {
    return (
      <TouchableOpacity style={this.getContainerStyle()}>
        {this.createHeader()}
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        {this.props.item === 'x' && <View style={styles.line} />}
        {this.createContent()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: Metrics.WIDTH * 0.95,
    marginLeft: Metrics.WIDTH * 0.11,
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor:'green'
  },

  line: {
    position: 'absolute',
    width: Metrics.WIDTH * 0.03,
    height: '50%',
    backgroundColor: '#2596be',
    left: -Metrics.WIDTH * 0.065,
    //   borderWidth: 1,
    borderRadius: 10,
    // marginLeft: Metrics.WIDTH * 0.04,
  },

  shadow: {
    elevation: 5,
    borderRadius: 7,
    shadowColor: '#2596be',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 1,
    shadowRadius: 2,
  },

  rowBg: {
    alignSelf: 'center',
    backgroundColor: Colors.snow,
    marginVertical: Metrics.HEIGHT * 0.0075,
    justifyContent: 'center',
    borderRadius: 7,
    width: Metrics.WIDTH * 0.84,
    marginLeft: Metrics.WIDTH * 0.015,
  },

  rowHeaderView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  rowDescriptionView: {
    width: Metrics.WIDTH * 0.665,
    alignSelf: 'center',
    marginVertical: Metrics.HEIGHT * 0.01,
    marginRight: Metrics.WIDTH * 0.025,
  },

  profileImg: {
    width: Metrics.WIDTH * 0.1,
    height: Metrics.WIDTH * 0.1,
    borderRadius: Metrics.WIDTH * 0.075,
    marginHorizontal: Metrics.WIDTH * 0.025,
  },

  rowDescTxt: {
    color: '#6f6f6f',
    fontSize: Fonts.moderateScale(15),
    textAlign: 'left',
  },
});

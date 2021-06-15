import moment from 'moment';
import {Right} from 'native-base';
import React, {Component} from 'react';
import {Text, Image, StyleSheet, View, TouchableOpacity} from 'react-native';
import {Colors, Fonts, Metrics} from '../../res/styles';
import images from '../../res/styles/images';

export default class NotificationItem extends Component {
  constructor(props) {
    super(props);
  }

  createHeader = () => {
    return (
      <View style={styles.rowHeaderView}>
        <Image style={styles.profileImg} source={images.notification} />
        <View>
          <View style={styles.ratingDateView}>
            <View style={styles.ratingStar}>
              <Text style={styles.user}>{this.props.item.title}</Text>
            </View>
            <Right>
              <Text style={styles.rowDateTxt}>
                {moment(this.props.item.regDate).format('DD/MM/YYYY')}
              </Text>
            </Right>
          </View>
          <View
            style={{
              ...styles.rowDescriptionView,
            }}>
            <Text style={styles.rowDescTxt}>{this.props.item.body}</Text>
          </View>
        </View>
      </View>
    );
  };

  getContainerStyle = () => {
    let containerStyle = styles.rowBg;
    if (this.props.item && !this.props.item.isRead) {
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
        {this.props.item && !this.props.item.isRead && (
          <View style={styles.line} />
        )}
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

  ratingDateView: {
    flexDirection: 'row',
    marginRight: Metrics.WIDTH * 0.045,
    justifyContent: 'flex-start',
    width: Metrics.WIDTH * 0.665,
  },

  ratingStar: {
    alignItems: 'center',
    marginLeft: Metrics.WIDTH * 0.02,
  },

  user: {
    fontSize: Fonts.moderateScale(15),
    fontFamily: Fonts.type.sfuiDisplayRegular,
    color: Colors.darktext,
    fontWeight: 'bold',
    width: Metrics.WIDTH * 0.45,
    marginTop: 5,
  },

  rowDateTxt: {
    color: '#adadad',
    fontSize: Fonts.moderateScale(13.5),
    fontFamily: Fonts.type.sfuiDisplayRegular,
  },
});

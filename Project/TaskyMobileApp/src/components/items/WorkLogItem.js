import React, {Component} from 'react';
import {Text, View, StyleSheet, Image} from 'react-native';
import {Right} from 'native-base';
import {Metrics, Fonts, Colors} from '../../res/styles';
import moment from 'moment';
import images from '../../res/styles/images';

export default class WorkLogItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.ratingBarView}>
          <View style={styles.ratingTextBg}>
            <Image
              source={
                this.props.item.profileImage
                  ? {uri: this.props.item.profileImage}
                  : images.user
              }
              style={styles.profileImg}
            />
          </View>
          <View style={styles.ratingView}>
            <View style={styles.ratingDateView}>
              <View style={styles.ratingStar}>
                <Text style={styles.user}>
                  {this.props.item.firstName} {this.props.item.lastName}
                </Text>
              </View>
              <Right>
                <Text style={styles.rowDateTxt}>
                  {moment(this.props.item.createdDate).format('DD/MM/YYYY')}
                </Text>
              </Right>
            </View>
            <View style={styles.reviewerNameView}>
              <Text style={styles.by}>{this.props.item.duration}</Text>
            </View>
          </View>
        </View>
        <View style={styles.dividerHorizontal} />
        <Text style={styles.rowDescTxt}>{this.props.item.description}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.snow,
    marginVertical: 10,
    marginHorizontal: 10,
    borderRadius: 10,
  },

  rowBg: {
    width: Metrics.WIDTH,
    backgroundColor: Colors.snow,
    marginBottom: Metrics.HEIGHT * 0.018,
    flexDirection: 'column',
  },

  ratingTextBg: {
    width: Metrics.WIDTH * 0.14,
    height: Metrics.WIDTH * 0.14,
    backgroundColor: '#0691ce',
    justifyContent: 'center',
  },

  profileImg: {
    width: Metrics.WIDTH * 0.14,
    height: Metrics.WIDTH * 0.14,
    resizeMode: 'cover',
  },

  rowNameTxt: {
    color: '#363636',
    fontFamily: Fonts.type.sfuiDisplayRegular,
    fontSize: Fonts.moderateScale(18),
    marginLeft: Metrics.WIDTH * 0.015,
  },

  rowDateTxt: {
    color: '#adadad',
    fontSize: Fonts.moderateScale(14),
    fontFamily: Fonts.type.sfuiDisplayRegular,
  },

  user: {
    fontSize: Fonts.moderateScale(16),
    fontFamily: Fonts.type.sfuiDisplayRegular,
  },

  dividerHorizontal: {
    width: Metrics.WIDTH * 0.95,
    height: Metrics.HEIGHT * 0.001,
    backgroundColor: '#e6e6e6',
    marginTop: Metrics.HEIGHT * 0.022,
    marginBottom: Metrics.HEIGHT * 0.022,
    alignSelf: 'center',
  },

  rowDescTxt: {
    color: '#6f6f6f',
    marginLeft: Metrics.WIDTH * 0.03,
    marginRight: Metrics.WIDTH * 0.03,
    marginBottom: Metrics.HEIGHT * 0.022,
    fontSize: Fonts.moderateScale(16.5),
    fontFamily: Fonts.type.sfuiDisplayRegular,
    textAlign: 'left',
  },

  ratingBarView: {
    flexDirection: 'row',
    marginLeft: Metrics.WIDTH * 0.03,
    marginRight: Metrics.WIDTH * 0.03,
    marginTop: Metrics.HEIGHT * 0.022,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },

  ratingView: {
    flexDirection: 'column',
  },

  ratingDateView: {
    flexDirection: 'row',
    marginRight: Metrics.WIDTH * 0.045,
    justifyContent: 'flex-start',
    width: Metrics.WIDTH * 0.75,
  },

  ratingStar: {
    alignItems: 'center',
    marginLeft: Metrics.WIDTH * 0.02,
  },

  reviewerNameView: {
    flexDirection: 'row',
    marginLeft: Metrics.WIDTH * 0.02,
    justifyContent: 'flex-start',
    marginTop: Metrics.HEIGHT * 0.007,
  },

  by: {
    color: '#adadad',
    fontSize: Fonts.moderateScale(16),
    fontFamily: Fonts.type.sfuiDisplayRegular,
  },
});

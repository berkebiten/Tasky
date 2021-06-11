import React from 'react';
import {View, Text, StyleSheet, Image, I18nManager} from 'react-native';
import {Metrics, Fonts} from '../../res/styles';
import images from '../../res/styles/images';

export default class PersonalDescriptionItem extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return this.props.user ? (
      <View style={styles.main}>
        <Image
          source={
            this.props.user.profileImage
              ? {uri: this.props.user.profileImage}
              : images.user
          }
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

  profileImg: {
    width: Metrics.WIDTH * 0.24,
    height: Metrics.WIDTH * 0.24,
    borderRadius: Metrics.WIDTH * 0.12,
    alignSelf: 'center',
    marginTop: Metrics.HEIGHT * 0.03,
    borderWidth:1,
  },

  nameTxt: {
    color: '#6f6f6f',
    fontFamily: Fonts.type.SFUIDisplayMedium,
    fontSize: Fonts.moderateScale(18),
    alignSelf: 'center',
    marginTop: 10,
  },
});

import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  Platform,
} from 'react-native';
import {Header, Left, Right, Body, View} from 'native-base';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {Metrics, Fonts} from '../../res/styles';
import TextTicker from 'react-native-text-ticker';
import {NavigationHelper} from '../../util/helpers';

export default class HeaderView extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  render() {
    if (this.props.noContent) {
      return (
        <StatusBar
          barStyle="light-content"
          hidden={false}
          backgroundColor={'transparent'}
          translucent={true}
        />
      );
    }

    let color = 'white';
    if (this.props.color) {
      color = this.props.color;
    }

    let leftItem = (
      <SimpleLineIcons name="arrow-left" size={22} color={color} />
    );
    if (this.props.leftItem) {
      leftItem = this.props.leftItem;
    }

    let backgroundColor = '#2d324f';
    if (this.props.backgroundColor) {
      backgroundColor = this.props.backgroundColor;
    }

    let bodyContent;
    if (this.props.image) {
      bodyContent = (
        <Image
          source={{uri: this.props.image}}
          style={styles.imageTitle}
          resizeMode="contain"
        />
      );
    } else if (this.props.title) {
      bodyContent = (
        <TextTicker
          style={[styles.textTitle, {color: color}]}
          duration={10000}
          loop
          bounce
          repeatSpacer={20}
          marqueeDelay={2000}>
          {this.props.title}
        </TextTicker>
      );
    }

    return (
      <View>
        <StatusBar
          barStyle="light-content"
          hidden={false}
          backgroundColor={backgroundColor}
          translucent={true}
        />
        <Header style={[styles.header, {backgroundColor: backgroundColor}]}>
          <Left style={styles.left}>
            <TouchableOpacity
              style={styles.touchableOpacity}
              onPress={() => {
                if (this.props.leftItemOnPress) {
                  this.props.leftItemOnPress();
                } else {
                  NavigationHelper.goBack();
                }
              }}>
              {this.props.leftItem ? this.props.leftItem : leftItem}
            </TouchableOpacity>
          </Left>
          <Body style={styles.body}>{bodyContent}</Body>
          <Right style={styles.right}>
            <TouchableOpacity
              style={[styles.touchableOpacity, {alignItems: 'flex-end'}]}
              onPress={() => {
                if (this.props.rightItemOnPress) {
                  this.props.rightItemOnPress();
                }
              }}>
              {this.props.rightItem}
            </TouchableOpacity>
          </Right>
        </Header>
      </View>
    );
  }
}

let topBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight : 0;

const styles = StyleSheet.create({
  topBar: {
    height: topBarHeight,
  },
  header: {
    height: 50 + topBarHeight,
    borderBottomWidth: 0,
    elevation: 0,
    paddingTop: topBarHeight,
    paddingHorizontal: Metrics.WIDTH * 0.05,
  },

  left: {
    flex: 0.5,
    height: Metrics.FILL,
    paddingHorizontal: 5,
  },

  body: {
    flex: 2,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },

  right: {
    flex: 0.5,
    height: Metrics.FILL,
    paddingHorizontal: 5,
  },
  textTitle: {
    color: '#363636',
    fontSize: Fonts.moderateScale(17),
    alignSelf: 'center',
    marginTop: -1,
    textAlign: 'center',
  },
  touchableOpacity: {
    width: Metrics.FILL,
    height: Metrics.FILL,
    justifyContent: 'center',
  },
  imageTitle: {
    height: '70%',
    width: '70%',
  },
});

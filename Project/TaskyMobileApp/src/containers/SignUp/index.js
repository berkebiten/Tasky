import React, {Component} from 'react';
import {
  TouchableHighlight,
  Dimensions,
  ImageBackground,
  Image,
  View,
  StatusBar,
  Platform,
  TouchableOpacity,
  BackHandler,
  I18nManager,
} from 'react-native';
import {Text, Form, Item, Input, Body, Header, Left, Right} from 'native-base';
// Screen Styles
import styles from './styles';
const {width, height} = Dimensions.get('window');
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Colors} from '../../res/styles';
import {NavigationHelper, ServiceHelper} from '../../util/helpers';
import images from '../../res/styles/images';
import {SCREEN_ENUMS} from '../../util/constants/Enums';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  signUp = () => {
    let insertObj = {
      firstname: this.state.fullName,
      lastname: 'LASTNAME',
      email: this.state.email,
      password: this.state.password
    }
    ServiceHelper.serviceHandler(
      '/User',
      ServiceHelper.createOptionsJson(JSON.stringify(insertObj), 'POST'),
    );
  };

  render() {
    StatusBar.setBarStyle('light-content', true);

    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor('transparent', true);
      StatusBar.setTranslucent(true);
    }
    let pic = {
      uri:
        'https://images.unsplash.com/photo-1579389083046-e3df9c2b3325?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=668&q=80',
    };

    let logo13 = {
      uri:
        'http://antiqueruby.aliansoftware.net/Images/signin/ic_logo_mountifysthirteen.png',
    };
    return (
      <ImageBackground source={pic} style={styles.screenBg}>
        <Header style={styles.header}>
          <Left style={styles.left}>
            <TouchableOpacity
              style={styles.backArrow}
              onPress={() => NavigationHelper.goBack()}>
              <FontAwesome
                name={I18nManager.isRTL ? 'angle-right' : 'angle-left'}
                size={40}
                color="#fff"
              />
            </TouchableOpacity>
          </Left>
          <Body style={styles.body} />
          <Right style={styles.right} />
        </Header>
        <View style={styles.container}>
          <Image source={images.taskyLogo} style={styles.logostyle} />
          <View style={styles.view2}>
            <Item underline style={styles.itememail}>
              <Input
                placeholderTextColor={Colors.lighttxt}
                textAlign={I18nManager.isRTL ? 'right' : 'left'}
                placeholder="Full Name"
                style={styles.inputemail}
                onChangeText={(text) => this.setState({fullName: text})}
              />
            </Item>
            <Item underline style={styles.itememail}>
              <Input
                placeholderTextColor={Colors.lighttxt}
                textAlign={I18nManager.isRTL ? 'right' : 'left'}
                placeholder="Email"
                style={styles.inputemail}
                onChangeText={(text) => this.setState({email: text})}
              />
            </Item>
            <Item underline style={styles.itememail}>
              <Input
                placeholderTextColor={Colors.lighttxt}
                textAlign={I18nManager.isRTL ? 'right' : 'left'}
                secureTextEntry={true}
                placeholder="Password"
                style={styles.inputpassword}
                onChangeText={(text) => this.setState({password: text})}
              />
            </Item>
            <Item underline style={styles.itememail}>
              <Input
                placeholderTextColor={Colors.lighttxt}
                textAlign={I18nManager.isRTL ? 'right' : 'left'}
                secureTextEntry={true}
                placeholder="Confirm Password"
                style={styles.inputpassword}
                onChangeText={(text) => this.setState({confirmPassword: text})}
              />
            </Item>
          </View>
          <TouchableHighlight
            info
            style={styles.buttondialogsignup}
            onPress={() => this.signUp()}>
            <Text autoCapitalize="words" style={styles.buttonsignin}>
              Sign Up
            </Text>
          </TouchableHighlight>

          <View style={styles.bottomTxtBg}>
            <Text autoCapitalize="words" style={styles.buttontext}>
              Already have an account?
            </Text>
            <TouchableOpacity
              style={styles.signInTxtBg}
              onPress={() => NavigationHelper.navigate(SCREEN_ENUMS.SIGN_IN)}>
              <Text style={styles.buttontext}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    );
  }
}

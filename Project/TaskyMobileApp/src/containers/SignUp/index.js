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
  I18nManager,
} from 'react-native';
import {
  Text,
  Item,
  Input,
  Body,
  Header,
  Left,
  Right,
  Toast,
} from 'native-base';
import styles from './styles';
const {width, height} = Dimensions.get('window');
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Colors} from '../../res/styles';
import {NavigationHelper, ServiceHelper} from '../../util/helpers';
import images from '../../res/styles/images';
import {SCREEN_ENUMS} from '../../util/constants/Enums';
import {REGISTER_SERVICE} from '../../util/constants/Services';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillUnmount(){
    this.setState({})
  }

  signUp = async () => {
    if (this.state.password !== this.state.confirmPassword) {
      Toast.show({
        text: 'Passwords does not match.',
        type: 'danger',
        duration: 7000,
      });
      return;
    }
    let insertObj = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email,
      password: this.state.password,
      profileImage: null,
      activationStatus: true,
      status: true,
      registrationDate: new Date(),
      firebaseToken: null,
    };
    const responseData = await ServiceHelper.serviceHandler(
      REGISTER_SERVICE,
      ServiceHelper.createOptionsJson(JSON.stringify(insertObj), 'POST'),
    );
    if (responseData && responseData.isSuccessful) {
      Toast.show({
        text:
          responseData && responseData.message
            ? responseData.message
            : 'Registration is Successful.',
        type: 'success',
        duration: 7000,
      });
      NavigationHelper.navigate(SCREEN_ENUMS.SIGN_IN)
    } else {
      Toast.show({
        text:
          responseData && responseData.message ? responseData.message : 'Error',
        type: 'danger',
        duration: 7000,
      });
    }
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
          <View style={styles.formContainer}>
            <Item underline style={styles.itememail}>
              <Input
                placeholderTextColor={Colors.lighttxt}
                textAlign={I18nManager.isRTL ? 'right' : 'left'}
                placeholder="First Name"
                style={styles.input}
                onChangeText={(text) => this.setState({firstName: text})}
                autoCapitalize="none"
              />
            </Item>
            <Item underline style={styles.itememail}>
              <Input
                placeholderTextColor={Colors.lighttxt}
                textAlign={I18nManager.isRTL ? 'right' : 'left'}
                placeholder="Last Name"
                style={styles.input}
                onChangeText={(text) => this.setState({lastName: text})}
                autoCapitalize="none"
              />
            </Item>
            <Item underline style={styles.itememail}>
              <Input
                placeholderTextColor={Colors.lighttxt}
                textAlign={I18nManager.isRTL ? 'right' : 'left'}
                placeholder="Email"
                style={styles.input}
                onChangeText={(text) => this.setState({email: text})}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </Item>
            <Item underline style={styles.itememail}>
              <Input
                placeholderTextColor={Colors.lighttxt}
                textAlign={I18nManager.isRTL ? 'right' : 'left'}
                secureTextEntry={true}
                placeholder="Password"
                style={styles.input}
                onChangeText={(text) => this.setState({password: text})}
                autoCapitalize="none"
              />
            </Item>
            <Item underline style={styles.itememail}>
              <Input
                placeholderTextColor={Colors.lighttxt}
                textAlign={I18nManager.isRTL ? 'right' : 'left'}
                secureTextEntry={true}
                placeholder="Confirm Password"
                style={styles.input}
                onChangeText={(text) => this.setState({confirmPassword: text})}
                autoCapitalize="none"
              />
            </Item>
          </View>
          <TouchableHighlight
            info
            style={styles.buttondialogsignup}
            onPress={() => this.signUp()}>
            <Text autoCapitalize="words" style={styles.buttonSignUp}>
              Register
            </Text>
          </TouchableHighlight>

          <View style={styles.bottomTxtBg}>
            <Text autoCapitalize="words" style={styles.buttontext}>
              Already have an account?
            </Text>
            <TouchableOpacity
              style={styles.signUpTxt}
              onPress={() => NavigationHelper.navigate(SCREEN_ENUMS.SIGN_IN)}>
              <Text style={styles.buttontext}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    );
  }
}

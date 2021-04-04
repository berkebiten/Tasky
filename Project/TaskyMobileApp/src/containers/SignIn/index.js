import React, {Component} from 'react';
import {
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Platform,
  StatusBar,
  BackHandler,
  I18nManager,
} from 'react-native';
import {Container, Right, Header, Left, Body, Toast} from 'native-base';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CheckBox from 'react-native-check-box';
import styles from './styles';
import images from '../../res/styles/images';
import NavigationHelper from '../../util/helpers/NavigationHelper';
import {SCREEN_ENUMS} from '../../util/constants/Enums';
import {ServiceHelper} from '../../util/helpers';
import {LOGIN_SERVICE} from '../../util/constants/Services';
import {saveLoginObject, saveUser} from '../../util/storage/AsyncStorage';

export default class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rememberMe: false,
    };
  }

  signIn = async () => {
    let loginObject = {
      email: this.state.email,
      password: this.state.password,
    };

    const responseData = await ServiceHelper.serviceHandler(
      LOGIN_SERVICE,
      ServiceHelper.createOptionsJson(JSON.stringify(loginObject), 'POST'),
    );

    if (responseData && responseData.isSuccessful) {
      if (this.state.rememberMe) {
        saveLoginObject(
          JSON.stringify({
            email: this.state.email,
            password: this.state.password,
          }),
        );
      }
      if (responseData.data && responseData.data.user) {
        saveUser(JSON.stringify(responseData.data.user));
      }
      NavigationHelper.navigate(SCREEN_ENUMS.HOME);
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

    const imageUri =
      'https://images.unsplash.com/photo-1557683304-673a23048d34?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=486&q=80';

    return (
      <Container>
        <ImageBackground style={styles.imgContainer} source={{uri: imageUri}}>
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

            <Right style={styles.right} />
          </Header>
          <View>
            <Image source={images.taskyLogo} style={styles.logostyle} />
            <View style={styles.inputFieldSec}>
              <TextInput
                style={styles.textInput}
                placeholder="Email"
                placeholderTextColor="#b7b7b7"
                underlineColorAndroid="transparent"
                autoCapitalize="none"
                textAlign={I18nManager.isRTL ? 'right' : 'left'}
                keyboardType="email-address"
                onChangeText={(text) => this.setState({email: text})}
              />

              <TextInput
                style={styles.textInput}
                secureTextEntry={true}
                placeholder="Password"
                placeholderTextColor="#b7b7b7"
                underlineColorAndroid="transparent"
                autoCapitalize="none"
                textAlign={I18nManager.isRTL ? 'right' : 'left'}
                keyboardType="default"
                onChangeText={(text) => this.setState({password: text})}
              />
            </View>
            <View style={styles.chboxConatiner}>
              <CheckBox
                style={styles.chboxRemember}
                onClick={() => {
                  this.setState({
                    rememberMe: !this.state.rememberMe,
                  });
                }}
                isChecked={this.state.rememberMe}
                checkedImage={
                  <Image
                    source={images.checkboxSelected}
                    style={{height: 22, width: 22}}
                  />
                }
                unCheckedImage={
                  <MaterialIcons
                    name="check-box-outline-blank"
                    size={25}
                    color="#FFF"
                  />
                }
              />
              <Text style={styles.textRememberMe}>Remember me</Text>
              <Right>
                <TouchableOpacity onPress={() => alert('Forgot password')}>
                  <Text style={styles.textForgotPwd}>Forgot password?</Text>
                </TouchableOpacity>
              </Right>
            </View>
            <View style={styles.signInSec}>
              <TouchableOpacity
                style={styles.buttonSignIn}
                onPress={() => this.signIn()}>
                <Text style={styles.textWhite}>Sign In</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.createAccount}>
              <Text style={styles.textWhite}>Don&apos;t have an account? </Text>
              <TouchableOpacity
                onPress={() => NavigationHelper.navigate(SCREEN_ENUMS.SIGN_UP)}>
                <Text style={styles.textSignUp}>Sign up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </Container>
    );
  }
}

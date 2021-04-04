import React, {Component} from 'react';
import {
  Platform,
  StatusBar,
  Image,
  ImageBackground,
  TouchableOpacity,
  BackHandler,
  I18nManager,
  TouchableHighlight,
} from 'react-native';
import {
  Container,
  Form,
  Text,
  Button,
  Header,
  Left,
  Right,
  Body,
} from 'native-base';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import styles from './styles';
import images from '../../res/styles/images';
import {NavigationHelper} from '../../util/helpers';
import {SCREEN_ENUMS} from '../../util/constants/Enums';

export default class GetStarted extends Component {
  render() {
    StatusBar.setBarStyle('light-content', true);

    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor('transparent', true);
      StatusBar.setTranslucent(true);
    }

    // Set image
    const pic =
'https://images.unsplash.com/photo-1531584838419-d5d24b120bf6?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=668&q=80'
    return (
      <Container>
        <ImageBackground style={styles.backgroundImage} source={{uri: pic}}>
          <Header style={styles.header}>
            <Body style={styles.body}>
              <Text style={styles.textTitle} />
            </Body>
            <Right style={styles.right} />
          </Header>
          <Image
            resizeMode="cover"
            source={images.taskyLogo}
            style={styles.logo10}
          />
          <Text style={styles.headertext}>
            Manage Your Projects and Tasks Effectively
          </Text>

          <Form style={styles.form}>
            <TouchableHighlight
              info
              style={styles.buttonlogin}
              onPress={() => NavigationHelper.navigate(SCREEN_ENUMS.SIGN_IN)}>
              <Text autoCapitalize="words" style={styles.loginbutton}>
                Login
              </Text>
            </TouchableHighlight>
            <TouchableHighlight
              info
              style={styles.buttonsignup}
              onPress={() => NavigationHelper.navigate(SCREEN_ENUMS.SIGN_UP)}>
              <Text autoCapitalize="words" style={styles.signupbutton}>
                Register
              </Text>
            </TouchableHighlight>
          </Form>
        </ImageBackground>
      </Container>
    );
  }
}

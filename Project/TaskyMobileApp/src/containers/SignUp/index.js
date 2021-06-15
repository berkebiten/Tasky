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
  TextInput,
} from 'react-native';
import {Text, Item, Input, Body, Header, Left, Right, Toast} from 'native-base';
import styles from './styles';
const {width, height} = Dimensions.get('window');
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Colors} from '../../res/styles';
import {NavigationHelper, ServiceHelper} from '../../util/helpers';
import images from '../../res/styles/images';
import {SCREEN_ENUMS} from '../../util/constants/Enums';
import {REGISTER_SERVICE} from '../../util/constants/Services';
import {Formik} from 'formik';
import * as yup from 'yup';

let elements = {
  firstName: yup.string().required('Required Field!'),
  lastName: yup.string().required('Required Field!'),
  email: yup.string().email('Please Write a Valid Email!'),
  password: yup
    .string()
    .required('Required Field!')
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      'Password Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character',
    ),
  confirmPassword: yup.string().required('Required Field!'),
};
let schema = yup.object().shape(elements);

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillUnmount() {
    this.setState({});
  }

  validate = (text, pattern) => {
    console.warn(text);
    let regex = /^(?=.*[A-Za-z])(?=.*d)(?=.*[@$!%*#?&])[A-Za-zd@$!%*#?&]{8,}$/;
    let bool = regex.test(text);
    console.warn(bool);
    return bool;
  };

  signUp = async (data) => {
    if (data.password !== data.confirmPassword) {
      Toast.show({
        text: 'Passwords does not match.',
        type: 'danger',
        duration: 7000,
      });
      return;
    }
    let insertObj = data;
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
      NavigationHelper.navigate(SCREEN_ENUMS.SIGN_IN);
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
      'https://images.unsplash.com/photo-1557683304-673a23048d34?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=486&q=80'
    };

    return (
      <Formik
        initialValues={{}}
        onSubmit={(values) => this.signUp(values)}
        validationSchema={schema}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          submitCount,
        }) => (
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
              <View style={styles.inputFieldSec}>
                <TextInput
                  style={styles.textInput}
                  placeholder="First Name"
                  placeholderTextColor="#b7b7b7"
                  underlineColorAndroid="transparent"
                  autoCapitalize="none"
                  textAlign={I18nManager.isRTL ? 'right' : 'left'}
                  onChangeText={handleChange('firstName')}
                  value={values.firstName}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Last Name"
                  placeholderTextColor="#b7b7b7"
                  underlineColorAndroid="transparent"
                  autoCapitalize="none"
                  textAlign={I18nManager.isRTL ? 'right' : 'left'}
                  keyboardType="default"
                  onChangeText={handleChange('lastName')}
                  value={values.lastName}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Email"
                  placeholderTextColor="#b7b7b7"
                  underlineColorAndroid="transparent"
                  textAlign={I18nManager.isRTL ? 'right' : 'left'}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  onChangeText={handleChange('email')}
                  value={values.email}
                />
                {errors.email && (touched.email || submitCount > 0) && (
                  <Text style={styles.errorTxt}>{errors.email}</Text>
                )}
                <TextInput
                  style={styles.textInput}
                  secureTextEntry={true}
                  placeholder="Password"
                  placeholderTextColor="#b7b7b7"
                  underlineColorAndroid="transparent"
                  autoCapitalize="none"
                  textAlign={I18nManager.isRTL ? 'right' : 'left'}
                  keyboardType="default"
                  autoCapitalize="none"
                  onChangeText={handleChange('password')}
                  value={values.password}
                />
                {errors.password && (touched.password || submitCount > 0) && (
                  <Text style={styles.errorTxt}>{errors.password}</Text>
                )}
                <TextInput
                  style={styles.textInput}
                  secureTextEntry={true}
                  placeholder="Confirm Password"
                  placeholderTextColor="#b7b7b7"
                  underlineColorAndroid="transparent"
                  autoCapitalize="none"
                  textAlign={I18nManager.isRTL ? 'right' : 'left'}
                  keyboardType="default"
                  onChangeText={(text) =>
                    this.setState({confirmPassword: text})
                  }
                  autoCapitalize="none"
                  onChangeText={handleChange('confirmPassword')}
                  value={values.confirmPassword}
                />
              </View>
              <TouchableHighlight
                info
                style={styles.buttondialogsignup}
                onPress={handleSubmit}>
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
                  onPress={() =>
                    NavigationHelper.navigate(SCREEN_ENUMS.SIGN_IN)
                  }>
                  <Text style={styles.buttontext}>Login</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        )}
      </Formik>
    );
  }
}

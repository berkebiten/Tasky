import React from 'react';
import SignIn from '../containers/SignIn/';
import {withNavigation} from 'react-navigation';

const SignInWithNav = withNavigation(SignIn);

class SignInScreen extends React.Component {
  constructor() {
    super();
  }

  render() {
    return <SignInWithNav />;
  }
}

export default SignInScreen;

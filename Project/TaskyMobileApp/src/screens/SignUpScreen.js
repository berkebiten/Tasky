import React from 'react';
import SignUp from '../containers/SignUp/';
import {withNavigation} from 'react-navigation';

const SignUpWithNav = withNavigation(SignUp);

class SignUpScreen extends React.Component {
  constructor() {
    super();
  }

  render() {
    return <SignUpWithNav />;
  }
}

export default SignUpScreen;

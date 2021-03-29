import React from 'react';
import {StyleSheet, StatusBar, Platform, View} from 'react-native';
import {Colors} from '../../res/styles';
import MessageView from './MessageView';

import {SafeAreaView} from 'react-navigation';
import Spinner from 'react-native-spinkit';
import {RootViewHelper} from '../../util/helpers';

export default class InfRootView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      triggerLoading: false,
      message: '',
      messageType: 'error',
    };
  }

  componentDidMount() {
    RootViewHelper.setRootViewRef(this);
  }

  componentWillUnmount() {
    RootViewHelper.setRootViewRef(null);
  }

  triggerLoading = () => {
    this.setState({
      triggerLoading: !this.state.triggerLoading,
    });
  };

  showMessage = (message, messageType) => {
    this.setState({
      message: message,
      messageType: messageType,
    });
  };

  render() {
    StatusBar.setBarStyle('light-content', true);
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor('transparent', true);
      StatusBar.setTranslucent(true);
    }

    if (RootViewHelper.isLoading()) {
      return (
        <View style={styles.imageOverlay}>
          <Spinner color="white" type="FadingCircleAlt" size={50} />
        </View>
      );
    }

    if (this.state.message !== '') {
      return (
        <View>
          <MessageView
            message={this.state.message}
            type={this.state.messageType}
          />
          <SafeAreaView style={[{flex: 0}]} />
        </View>
      );
    }

    return null;
  }
}

const styles = StyleSheet.create({
  imageOverlay: {
    position: 'absolute',
    zIndex: 11,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.windowTint,
  },
});

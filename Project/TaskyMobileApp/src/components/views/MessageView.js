import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Fonts, Colors, Metrics} from '../../res/styles'

export default class MessageView extends React.Component {
  render() {
    if (!this.props.message || this.props.message === '') {
      return <View style={{height: 0}} />;
    }

    let typeStyle = styles.containerError;
    switch (this.props.type) {
      case 'error':
        typeStyle = styles.containerError;
        break;
      case 'warning':
        typeStyle = styles.containerWarning;
        break;
      case 'success':
        typeStyle = styles.containerSuccess;
        break;
      case 'info':
        typeStyle = styles.containerInfo;
        break;
    }

    return (
      <View style={[this.props.style, typeStyle]}>
        <Text style={styles.text}>{this.props.message}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerError: {
    backgroundColor: Colors.error,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerWarning: {
    backgroundColor: Colors.yellow,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerSuccess: {
    backgroundColor: Colors.loginGreen,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerInfo: {
    backgroundColor: Colors.skyblue,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#FFF',
    width: Metrics.FILL,
    textAlign: 'center',
    fontSize: Fonts.moderateScale(15),
  },
});

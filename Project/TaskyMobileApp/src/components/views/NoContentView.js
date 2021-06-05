import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Metrics} from '../../res/styles';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Colors } from 'react-native/Libraries/NewAppScreen';

export default class NoContentView extends Component {
  constructor(props) {
    super(props);
  }

  render = () => {
    return (
      <View style={styles.noContentView}>
        <AntDesign name="rest" size={25} color={Colors.charcoal} />
        <Text
          style={{
            color: Colors.charcoal,
            textAlign: 'center',
            marginTop: 5,
          }}>
          {this.props.text}
        </Text>
      </View>
    );
  };
}

const styles = StyleSheet.create({
  noContentView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Metrics.WIDTH * 0.2,
  },
});

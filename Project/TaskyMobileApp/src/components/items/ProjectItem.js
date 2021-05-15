import React from 'react';
import {Text, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Fonts, Colors} from '../../res/styles';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default class ProjectItem extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() => this.props.onPress()}>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <FontAwesome
            name="briefcase"
            size={20}
            color={Colors.lightBlack}
            style={styles.icon}
          />
          <Text style={styles.title}>{this.props.item.name}</Text>
        </View>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <FontAwesome
            name="file-text-o"
            size={20}
            color={Colors.lightBlack}
            style={styles.icon2}
          />
          <Text style={styles.text}>{this.props.item.description}</Text>
        </View>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <FontAwesome5
            name="user-tie"
            size={20}
            color={Colors.lightBlack}
            style={styles.icon2}
          />
          <Text style={{...styles.text, marginBottom: 10}}>
            {this.props.item.projectManagerFirstName +
              ' ' +
              this.props.item.projectManagerLastName}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.snow,
    marginVertical: 10,
    marginHorizontal: 10,
    borderRadius: 10,
  },

  title: {
    flex: 1,
    fontSize: Fonts.moderateScale(15),
    fontFamily: Fonts.type.SFProTextMedium,
    marginLeft: 10,
    paddingTop: 10,
    paddingBottom: 5,
  },

  text: {
    flex: 1,
    fontSize: Fonts.moderateScale(14),
    fontFamily: Fonts.type.SFProTextRegular,
    marginLeft: 10,
    paddingVertical: 5,
  },

  icon: {
    marginLeft: 10,
    paddingTop: 10,
    paddingBottom: 5,
  },

  icon2: {
    marginLeft: 10,
    paddingVertical: 5,
  },
});

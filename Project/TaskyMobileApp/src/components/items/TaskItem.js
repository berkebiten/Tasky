import React from 'react';
import {Text, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Metrics, Fonts, Colors} from '../../res/styles';
import moment from 'moment';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default class TaskItem extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  renderStatusTitle = (statusTitle) => {
    let color;
    switch (statusTitle) {
      case 'Active':
        color = '#0275d8';
        break;
      case 'ToDo':
        color = '#464a50';
        break;
      case 'Resolved':
        color = '#9c64b3';
        break;
      case 'Closed':
        color = '#5cb85c';
        break;
    }

    return (
      <View
        style={{...styles.status, backgroundColor: color, borderColor: color}}>
        <Text style={styles.statusText}>{statusTitle}</Text>
      </View>
    );
  };

  render() {
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() => this.props.onPress()}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignContent: 'center',
            justifyContent: 'center',
          }}>
          <FontAwesome
            name="briefcase"
            size={20}
            color={Colors.lightBlack}
            style={styles.icon}
          />
          <Text style={styles.title}>{this.props.item.project_Title}</Text>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignContent: 'center',
            justifyContent: 'center',
          }}>
          <FontAwesome
            name="check"
            size={20}
            color={Colors.lightBlack}
            style={styles.icon2}
          />
          <Text style={styles.text}>{this.props.item.title}</Text>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignContent: 'center',
            justifyContent: 'center',
          }}>
          <FontAwesome
            name="calendar-check-o"
            size={20}
            color={Colors.lightBlack}
            style={styles.icon2}
          />
          <Text style={styles.text}>
            {moment(this.props.item.dueDate).format('DD/MM/YYYY')}
          </Text>
        </View>
        {this.renderStatusTitle(this.props.item.statusTitle)}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.snow,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 10,
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

  statusText: {
    fontSize: Fonts.moderateScale(14),
    fontFamily: Fonts.type.SFProTextRegular,
    color: 'white',
    textAlign: 'center',
    textAlignVertical: 'center',
    paddingVertical: 2.5,
  },

  status: {
    borderWidth: 1,
    borderRadius: 50,
    width: Metrics.WIDTH * 0.2,
    marginLeft: 10,
    marginVertical: 5,
  },
});

import React, {Component} from 'react';
import {Text, Image, StatusBar, Platform, View} from 'react-native';
import {Container, Content} from 'native-base';
import styles from './styles';
import {HeaderView} from '../../components/views';
import {loadUser} from '../../util/storage/AsyncStorage';
import {RootViewHelper} from '../../util/helpers';
import moment from 'moment';

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = () => {
    this.initialize();
  };

  initialize = async () => {
    const user = await loadUser();
    if (user) {
      this.setState({userData: JSON.parse(user)});
    }
  };

  render() {
    if (!this.state.userData) {
      RootViewHelper.startLoading();
      return null;
    } else {
      RootViewHelper.stopLoading();
    }
    StatusBar.setBarStyle('light-content', true);
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor('#2d324f', true);
      StatusBar.setTranslucent(true);
    }

    return (
      <View style={styles.main}>
        <View style={{flexDirection: 'column'}}>
          <View style={styles.infoFieldBg}>
            <Text style={styles.infoFieldTitleTxt}>First Name</Text>
            <Text style={styles.infoFieldDetailTxt}>
              {this.state.userData && this.state.userData.firstName}
            </Text>
          </View>
          <View style={styles.fieldDivider} />
        </View>
        <View style={{flexDirection: 'column'}}>
          <View style={styles.infoFieldBg}>
            <Text style={styles.infoFieldTitleTxt}>Last Name</Text>
            <Text style={styles.infoFieldDetailTxt}>
              {this.state.userData && this.state.userData.lastName}
            </Text>
          </View>
          <View style={styles.fieldDivider} />
        </View>
        <View style={{flexDirection: 'column'}}>
          <View style={styles.infoFieldBg}>
            <Text style={styles.infoFieldTitleTxt}>Email</Text>
            <Text style={styles.infoFieldDetailTxt}>
              {this.state.userData && this.state.userData.email}
            </Text>
          </View>
          <View style={styles.fieldDivider} />
        </View>
        <View style={styles.infoFieldBg}>
          <Text style={styles.infoFieldTitleTxt}>Registration Date</Text>
          <Text style={styles.infoFieldDetailTxt}>
            {this.state.userData &&
              moment(this.state.userData.registrationDate).format('DD/MM/YYYY')}
          </Text>
        </View>
      </View>
    );
  }
}

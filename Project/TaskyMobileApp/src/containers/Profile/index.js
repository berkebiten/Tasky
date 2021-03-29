import React, {Component} from 'react';
import {
  Text,
  Image,
  StatusBar,
  Platform,
  TouchableOpacity,
  View,
  BackHandler,
  I18nManager,
} from 'react-native';
import {
  Container,
  Right,
  Left,
  Content,
  Body,
  Header,
  Title,
} from 'native-base';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './styles';
import {HeaderView} from '../../components/views';

const profileImg =
  'https://d338t8kmirgyke.cloudfront.net/icons/icon_pngs/000/004/088/original/user.png';

export default class ProfileAccountInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    StatusBar.setBarStyle('light-content', true);
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor('#2d324f', true);
      StatusBar.setTranslucent(true);
    }

    return (
      <Container style={styles.main}>
        <HeaderView title="Profile" />
        <Content>
          <Image source={{uri: profileImg}} style={styles.profileImg} />
          <Text style={styles.nameTxt}>Oğuz Kaan Yazan</Text>
          <View style={styles.dividerHorizontal} />
          <View style={styles.accountInfoBg}>
            <Text style={styles.accountInfoTxt}>USER INFORMATION</Text>
          </View>
          <View style={styles.dividerHorizontal} />
          <View style={{flexDirection: 'column'}}>
            <View style={styles.infoFieldBg}>
              <Text style={styles.infoFieldTitleTxt}>Name</Text>
              <Text style={styles.infoFieldDetailTxt}>Oğuz Kaan Yazan</Text>
            </View>
            <View style={styles.fieldDivider} />
          </View>
          <View style={{flexDirection: 'column'}}>
            <View style={styles.infoFieldBg}>
              <Text style={styles.infoFieldTitleTxt}>Email</Text>
              <Text style={styles.infoFieldDetailTxt}>
                oguz.yazan@isik.edu.tr
              </Text>
            </View>
            <View style={styles.fieldDivider} />
          </View>
          <View style={{flexDirection: 'column'}}>
            <View style={styles.infoFieldBg}>
              <Text style={styles.infoFieldTitleTxt}>Phone</Text>
              <Text style={styles.infoFieldDetailTxt}>537 923 5986</Text>
            </View>
            <View style={styles.fieldDivider} />
          </View>
          <View style={styles.infoFieldBg}>
            <Text style={styles.infoFieldTitleTxt}>Address</Text>
            <Text style={styles.infoFieldDetailTxt}>İstanbul</Text>
          </View>
          <View style={styles.fieldDivider} />
          <View style={styles.infoFieldBg}>
            <Text style={styles.infoFieldTitleTxt}>Registration Date</Text>
            <Text style={styles.infoFieldDetailTxt}>21/03/2021</Text>
          </View>
        </Content>
      </Container>
    );
  }
  _renderTruncatedFooter = (handlePress) => {
    return (
      <Text style={styles.viewMoreLessTxt} onPress={handlePress}>
        View more
      </Text>
    );
  };

  _renderRevealedFooter = (handlePress) => {
    return (
      <Text style={styles.viewMoreLessTxt} onPress={handlePress}>
        View less
      </Text>
    );
  };
}

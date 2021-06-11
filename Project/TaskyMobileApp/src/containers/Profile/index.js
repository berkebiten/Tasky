import React, {Component} from 'react';
import {Text, StatusBar, Platform, View, TouchableOpacity} from 'react-native';
import {Body, Button, CheckBox, Content, ListItem} from 'native-base';
import styles from './styles';
import {loadUser} from '../../util/storage/AsyncStorage';
import {RootViewHelper, ServiceHelper} from '../../util/helpers';
import moment from 'moment';
import {Metrics} from '../../res/styles';
import CustomModal from '../../components/modals/CustomModal';
import EditProfileForm from '../../components/forms/EditProfileForm';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {EDIT_PROFILE, MANAGE_PREFERENCES} from '../../util/constants/Services';

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      preferencesModal: false,
      editProfileModal: false,
    };
  }

  componentDidMount = () => {
    this.initialize();
  };

  initialize = async () => {
    this.setState({userData: this.props.user});
  };

  static getDerivedStateFromProps = (nextProps, prevState) => {
    if (
      prevState.userData &&
      nextProps.user &&
      (prevState.userData.firstName !== nextProps.user.firstName ||
        prevState.userData.lastName !== nextProps.user.lastName ||
        prevState.userData.profileImage !== nextProps.user.profileImage)
    ) {
      update = {};
      update.userData = nextProps.user;
      return update;
    }
    return null;
  };

  submitPreferences = async () => {
    let body = {
      sendEmail: this.state.userData.sendEmail,
      sendNotification: this.state.userData.sendNotification,
    };
    const responseData = await ServiceHelper.serviceHandler(
      MANAGE_PREFERENCES,
      ServiceHelper.createOptionsJson(JSON.stringify(body), 'POST'),
    );
    if (responseData.isSuccessfull) {
      this.setState({preferencesModal: false}, () => this.props.getUserInfo());
    }
  };

  createPreferencesModal = () => {
    return (
      <CustomModal
        isVisible={this.state.preferencesModal}
        toggleModal={() => this.setState({preferencesModal: false})}
        title="User Preferences"
        onShow={() => {
          this.setState({userData: this.props.user});
        }}
        content={
          <View style={{height: '100%'}}>
            <ListItem>
              <CheckBox
                checked={
                  this.state.userData && this.state.userData.sendNotification
                }
                onPress={() =>
                  this.setState({
                    userData: {
                      ...this.state.userData,
                      sendNotification: !this.state.userData.sendNotification,
                    },
                  })
                }
              />
              <Body>
                <Text style={{marginLeft: 10}}>Allow Notifications</Text>
              </Body>
            </ListItem>
            <ListItem>
              <CheckBox
                checked={this.state.userData && this.state.userData.sendEmail}
                onPress={() =>
                  this.setState({
                    userData: {
                      ...this.state.userData,
                      sendEmail: !this.state.userData.sendEmail,
                    },
                  })
                }
              />
              <Body>
                <Text style={{marginLeft: 10}}>Allow E-mails</Text>
              </Body>
            </ListItem>
            <TouchableOpacity
              style={styles.submitBtn}
              onPress={() => this.submitPreferences()}>
              <Text style={styles.submitTxt}>Save</Text>
            </TouchableOpacity>
          </View>
        }
      />
    );
  };

  editProfile = async (data) => {
    let body = {
      ...this.state.userData,
      ...data,
    };
    const responseData = await ServiceHelper.serviceHandler(
      EDIT_PROFILE + this.state.userData.id,
      ServiceHelper.createOptionsJson(JSON.stringify(body), 'PUT'),
    );
    if (responseData.isSuccessful) {
      this.setState({editProfileModal: false}, () => this.props.getUserInfo());
    }
  };

  createEditProfileModal = () => {
    return (
      <CustomModal
        title="Edit Profile"
        isVisible={this.state.editProfileModal}
        toggleModal={() => this.setState({editProfileModal: false})}
        content={
          <View style={{height: '100%'}}>
            <EditProfileForm
              initialValues={this.state.userData}
              onSubmit={(data) => this.editProfile(data)}
            />
          </View>
        }
      />
    );
  };

  createButtons = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
          marginTop: Metrics.HEIGHT * 0.05,
        }}>
        <TouchableOpacity
          warning
          onPress={() => this.setState({preferencesModal: true})}
          style={{...styles.button, backgroundColor: '#eeac57'}}>
          <Text style={styles.buttonTxt}>User Preferences</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{...styles.button, backgroundColor: '#157efb'}}
          onPress={() => this.setState({editProfileModal: true})}>
          <Text style={styles.buttonTxt}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
    );
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
          {this.createButtons()}
          {this.createPreferencesModal()}
          {this.createEditProfileModal()}
        </View>
      </View>
    );
  }
}

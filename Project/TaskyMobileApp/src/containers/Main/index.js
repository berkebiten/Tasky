import React from 'react';
import {View, Button} from 'react-native';
import {ControlPanelView, HeaderView} from '../../components/views';
import {SafeAreaView} from 'react-navigation';
import {NavigationHelper, RootViewHelper, ServiceHelper} from '../../util/helpers';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Drawer from 'react-native-drawer';
import tweens from './tweens';
import styles from './styles';
import PersonalDescriptionItem from '../../components/items/PersonalDescriptionItem';
import UserDetailItem from '../../components/items/UserDetailItem';
import FooterTabView from '../../components/views/FooterTabView';
import {SCREEN_ENUMS} from '../../util/constants/Enums'

const drawerStyles = {
  drawer: {
    shadowColor: '#000000',
    shadowOpacity: 0.8,
    shadowRadius: 0,
  },
};
export default class Main extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      drawerType: 'static',
      openDrawerOffset: 50,
      closedDrawerOffset: 0,
      panOpenMask: 0.1,
      relativeDrag: false,
      panThreshold: 0.25,
      tweenHandlerOn: false,
      tweenDuration: 350,
      tweenEasing: 'linear',
      disabled: false,
      tweenHandlerPreset: null,
      acceptDoubleTap: false,
      acceptTap: false,
      acceptPan: true,
      tapToClose: true,
      negotiatePan: false,
      side: 'left',
      activeTab: 'Home',
    };
  }

  tweenHandler(ratio) {
    if (!this.state.tweenHandlerPreset) {
      return {};
    }
    return tweens[this.state.tweenHandlerPreset](ratio);
  }

  openDrawer() {
    this.drawer.open();
  }

  render() {
    const modules = [
      {
        iconName: 'user',
        onPress: () =>  NavigationHelper.navigate(SCREEN_ENUMS.PROFILE),
        menuTitle: 'Profile',
      },
      {
        iconName: 'settings',
        onPress: () => console.warn('user preferences'),
        menuTitle: 'User Preferences',
      },
      {
        iconName: 'logout',
        onPress: () => console.warn('logout'),
        menuTitle: 'Logout',
      },
    ];
    return (
      <View style={{flex: 1}}>
        <Drawer
          ref={(c) => (this.drawer = c)}
          type={this.state.drawerType}
          animation={this.state.animation}
          openDrawerOffset={this.state.openDrawerOffset}
          closedDrawerOffset={this.state.closedDrawerOffset}
          panOpenMask={this.state.panOpenMask}
          panCloseMask={this.state.panCloseMask}
          relativeDrag={this.state.relativeDrag}
          panThreshold={this.state.panThreshold}
          content={
            <ControlPanelView
              onClose={() => {
                this.drawer.close();
              }}
              modules={modules}
            />
          }
          styles={drawerStyles}
          disabled={this.state.disabled}
          tweenHandler={this.tweenHandler.bind(this)}
          tweenDuration={this.state.tweenDuration}
          tweenEasing={this.state.tweenEasing}
          acceptDoubleTap={this.state.acceptDoubleTap}
          acceptTap={this.state.acceptTap}
          acceptPan={this.state.acceptPan}
          tapToClose={this.state.tapToClose}
          negotiatePan={this.state.negotiatePan}
          changeVal={this.state.changeVal}
          side={this.state.side}>
          <View style={styles.drawercontainer}>
            <HeaderView
              title="Tasky"
              leftItem={
                <MaterialCommunityIcons name="menu" size={28} color="#fff" />
              }
              leftItemOnPress={() => {
                this.openDrawer();
              }}
              rightItem={
                <Ionicons name="notifications" size={28} color="#fff" />
              }
              rightItemOnPress={() => {
                console.warn('Notifications');
              }}
            />
            <SafeAreaView style={{flex: 1}}>
              <PersonalDescriptionItem
                user={{
                  fullName: 'Oğuz Kaan Yazan',
                  profileImage: {
                    uri:
                      'https://d338t8kmirgyke.cloudfront.net/icons/icon_pngs/000/004/088/original/user.png',
                  },
                }}
              />
              <UserDetailItem
                userData={{resolvedTasks: 76, openTasks: 14, totalProjects: 25}}
              />
              <Button
                title="startLoading"
                onPress={() => {
                  RootViewHelper.startLoading();
                  setTimeout(() => {
                    RootViewHelper.stopLoading();
                  }, 5000);
                }}
              />
              <Button
                title="Service Helper"
                onPress={() => {
                  console.warn('service helper');
                  ServiceHelper.serviceHandler(
                    '/posts',
                    ServiceHelper.createOptionsForm(null, 'GET'),
                  );
                }}
              />
              <View style={styles.footerTab}>
                <FooterTabView
                  tabs={[
                    {
                      title: 'Home',
                      onPress: () => this.setState({activeTab: 'Home'}),
                      iconName: 'home',
                    },
                    {
                      title: 'Projects',
                      onPress: () => this.setState({activeTab: 'Projects'}),
                      iconName: 'briefcase',
                    },
                    {
                      title: 'My Tasks',
                      onPress: () => this.setState({activeTab: 'My Tasks'}),
                      iconName: 'checkmark',
                    },
                    {
                      title: 'Activities',
                      onPress: () => this.setState({activeTab: 'Activities'}),
                      iconName: 'list',
                    },
                  ]}
                  activeTab={this.state.activeTab}
                />
              </View>
            </SafeAreaView>
          </View>
        </Drawer>
      </View>
    );
  }
}

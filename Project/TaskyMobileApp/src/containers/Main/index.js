import React from 'react';
import {
  View,
  Button,
  FlatList,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {ControlPanelView, HeaderView} from '../../components/views';
import {NavigationActions, SafeAreaView, StackActions} from 'react-navigation';
import {
  NavigationHelper,
  RootViewHelper,
  ServiceHelper,
} from '../../util/helpers';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Drawer from 'react-native-drawer';
import tweens from './tweens';
import styles from './styles';
import PersonalDescriptionItem from '../../components/items/PersonalDescriptionItem';
import UserDetailItem from '../../components/items/UserDetailItem';
import FooterTabView from '../../components/views/FooterTabView';
import {SCREEN_ENUMS} from '../../util/constants/Enums';
import {loadUser} from '../../util/storage/AsyncStorage';
import {
  GET_MY_TASKS_SERVICE,
  GET_PROJECTS_SERVICE,
} from '../../util/constants/Services';
import ProjectItem from '../../components/items/ProjectItem';
import {Colors} from '../../res/styles';
import debounce from 'lodash.debounce';
import AntDesign from 'react-native-vector-icons/AntDesign';
import TaskItem from '../../components/items/TaskItem';

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
    this.onChangeTextDelayed = debounce(this._onChangeKeyword, 1000);
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

  componentDidMount() {
    this.initialize();
    this.refresh();
  }

  initialize = async () => {
    const user = await loadUser();
    this.getProjects();
    this.setState({userData: JSON.parse(user)});
  };

  tweenHandler(ratio) {
    if (!this.state.tweenHandlerPreset) {
      return {};
    }
    return tweens[this.state.tweenHandlerPreset](ratio);
  }

  openDrawer() {
    this.drawer.open();
  }

  getProjects = async () => {
    const responseData = await ServiceHelper.serviceHandler(
      GET_PROJECTS_SERVICE,
      ServiceHelper.createOptionsJson(
        JSON.stringify({count: 100, startIndex: 0}),
        'POST',
      ),
    );
    if (responseData.data && responseData.data.projects) {
      this.getMyTasks();
      this.setState({projects: responseData.data.projects});
    }
  };

  getMyTasks = async () => {
    const responseData = await ServiceHelper.serviceHandler(
      GET_MY_TASKS_SERVICE,
      ServiceHelper.createOptionsJson(null, 'POST'),
    );
    if (responseData.data && responseData.data.tasks) {
      this.setState({tasks: responseData.data.tasks});
    }
  };

  refresh = async () => {
    switch (this.state.activeTab) {
      case 'Projects':
        this.getProjects();
        break;
      case 'My Tasks':
        this.getMyTasks();
    }
  };

  _renderItem = (item) => {
    switch (this.state.activeTab) {
      case 'Projects':
        return (
          <ProjectItem
            item={item.item}
            onPress={() => {
              NavigationHelper.navigate(SCREEN_ENUMS.PROJECT, {
                project: item.item,
              });
            }}
          />
        );
      case 'My Tasks':
        return (
          <TaskItem
            item={item.item}
            onPress={() =>
              NavigationHelper.navigate(SCREEN_ENUMS.TASK, {task: item.item})
            }
          />
        );
    }
  };

  _onRefresh = async (keyword) => {
    this.refresh();
  };

  createContent = () => {
    return (
      <View style={{flex: 1}}>
        {this.state.activeTab === 'Home' && this.createHome()}
        {this.state.activeTab !== 'Home' && this.createSearchBar()}
        <FlatList
          data={
            this.state.activeTab === 'Projects'
              ? this.state.projects
              : this.state.activeTab === 'My Tasks'
              ? this.state.tasks
              : []
          }
          ref={(ref) => {
            this.flatListRef = ref;
          }}
          refreshing={false}
          extraData={this.state}
          keyExtractor={(item, index) => index.toString()}
          renderItem={(item) => this._renderItem(item)}
          onRefresh={() => this._onRefresh(this.state.keyword)}
          refreshing={false}
          windowSize={10}
          // onEndReachedThreshold={LOAD_MORE_CONTANTS.REACHED_THRESHOLD}
          // onEndReached={() => {
          //   this._loadMoreData();
          // }}
        />
      </View>
    );
  };

  createHome = () => {
    return (
      <View style={{flex: 1}}>
        <PersonalDescriptionItem
          user={this.state.userData ? this.state.userData : null}
        />
        <UserDetailItem
          userData={{resolvedTasks: 76, openTasks: 14, totalProjects: 25}}
        />
      </View>
    );
  };

  _onChangeKeyword = (keyword) => {
    if (keyword.length >= 3 || keyword.length == 0) {
      // this.refresh(this.state.keyword);
    }
  };

  handleDebounce = (keyword) => {
    this.setState({
      keyword: keyword,
    });
    this.onChangeTextDelayed(keyword.trim());
  };

  createSearchBar = () => {
    return (
      <View style={styles.modelTopBar}>
        <TextInput
          style={styles.modelTitle}
          placeholder="Search..."
          placeholderTextColor={Colors.blacktxt}
          underlineColorAndroid="transparent"
          value={this.state.keyword}
          onChangeText={this.handleDebounce}
          autoCapitalize="none"
          returnKeyType="search"
          numberOfLines={1}
          cle
        />
        <TouchableOpacity
          onPress={() => {
            this.setState({keyword: ''});
            // this.refresh('');
          }}>
          <AntDesign name="close" size={20} color="black" />
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    const modules = [
      {
        iconName: 'user',
        onPress: () => NavigationHelper.navigate(SCREEN_ENUMS.PROFILE),
        menuTitle: 'Profile',
      },
      {
        iconName: 'settings',
        onPress: () => console.warn('user preferences'),
        menuTitle: 'User Preferences',
      },
      {
        iconName: 'logout',
        onPress: () => {
          NavigationHelper.dispatch(
            StackActions.reset({
              index: 0,
              actions: [
                NavigationActions.navigate({
                  routeName: SCREEN_ENUMS.SIGN_IN,
                }),
              ],
            }),
          );
        },
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
              userData={this.state.userData ? this.state.userData : null}
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
              {this.createContent()}
              <View style={styles.footerTab}>
                <FooterTabView
                  tabs={[
                    {
                      title: 'Home',
                      onPress: () => {
                        this.setState({activeTab: 'Home'});
                      },
                      iconName: 'home',
                    },
                    {
                      title: 'Projects',
                      onPress: () => {
                        this.setState({activeTab: 'Projects'});
                      },
                      iconName: 'briefcase',
                    },
                    {
                      title: 'My Tasks',
                      onPress: () => {
                        this.setState({activeTab: 'My Tasks'});
                      },
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

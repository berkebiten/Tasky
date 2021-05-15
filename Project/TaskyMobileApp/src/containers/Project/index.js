import React, {Component} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import {HeaderView} from '../../components/views';
import FooterTabView from '../../components/views/FooterTabView';
import styles from './styles';
import {Item, Label} from 'native-base';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Colors, Fonts, Metrics} from '../../res/styles';
import debounce from 'lodash.debounce';
import {NavigationHelper, ServiceHelper} from '../../util/helpers';
import {
  GET_PROJECT_PARTICIPANTS_SERVICE,
  GET_TASKS_SERVICE,
} from '../../util/constants/Services';
import TaskItem from '../../components/items/TaskItem';
import {SCREEN_ENUMS} from '../../util/constants/Enums';
import images from '../../res/styles/images';
import CustomModal from '../../components/modals/CustomModal';

export default class Project extends Component {
  constructor(props) {
    super(props);
    this.onChangeTextDelayed = debounce(this._onChangeKeyword, 1000);
    this.state = {
      project: props.navigation.state.params.project,
      activeTab: 'Overview',
      keyword: '',
      modal: false,
    };
    // console.warn(this.state.project);
  }

  componentDidMount() {
    this.initialize();
  }

  initialize = () => {
    this.fetchTaskList();
  };

  fetchTaskList = async () => {
    let reqBody = {
      projectId: this.state.project.id,
    };
    const responseData = await ServiceHelper.serviceHandler(
      GET_TASKS_SERVICE,
      ServiceHelper.createOptionsJson(JSON.stringify(reqBody), 'POST'),
    );
    if (responseData.data && responseData.data.tasks) {
      this.setState({tasks: responseData.data.tasks});
    }
    this.fetchParticipants();
  };

  fetchParticipants = async () => {
    const responseData = await ServiceHelper.serviceHandler(
      GET_PROJECT_PARTICIPANTS_SERVICE + '/' + this.state.project.id,
      ServiceHelper.createOptionsJson(null, 'GET'),
    );
    if (responseData && responseData.isSuccessful) {
      this.setState({participants: responseData.data});
    }
  };

  createParticipants = () => {
    return (
      <Item
        stackedLabel
        style={{
          width: Metrics.WIDTH * 0.9,
          marginHorizontal: Metrics.WIDTH * 0.05,
          height: Metrics.HEIGHT * 0.17,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'stretch',
          }}>
          <Label style={{flex: 1}}>Project Participants</Label>
          <TouchableOpacity onPress={() => this.setState({modal: true})}>
            <Label
              style={{
                color: '#0691ce',
              }}>
              View All Participants
            </Label>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            width: '100%',
            marginVertical: 10,
          }}>
          {this.state.participants.map((item, key) => {
            return (
              <View
                style={{
                  marginHorizontal: 5,
                  width: Metrics.WIDTH * 0.2,
                }}>
                {item.profileImage ? (
                  <Image
                    source={{uri: item.profileImage}}
                    style={styles.profileImg}
                  />
                ) : (
                  <Image source={images.user} style={styles.profileImg} />
                )}
                <Text style={{textAlign: 'center'}}>
                  {item.firstName} {item.lastName}
                </Text>
              </View>
            );
          })}
        </View>
        {/* <Text
          style={{
            color: Colors.lightBlack,
            fontSize: Fonts.moderateScale(16),
            marginVertical: 10,
            alignSelf: 'flex-start',
          }}>
          {info}
        </Text> */}
      </Item>
    );
  };

  createOverview = () => {
    return (
      <View style={{flex: 1, alignItems: 'center'}}>
        {this.state.project && this.state.project.name
          ? this.createInfo('Title', this.state.project.name)
          : null}
        {this.state.project && this.state.project.description
          ? this.createInfo('Description', this.state.project.description)
          : null}
        {this.state.project &&
        this.state.project.projectManagerFirstName &&
        this.state.project.projectManagerLastName
          ? this.createInfo(
              'Project Manager',
              this.state.project.projectManagerFirstName +
                ' ' +
                this.state.project.projectManagerLastName,
            )
          : null}
        {this.state.participants &&
          this.state.participants.length > 0 &&
          this.createParticipants()}
      </View>
    );
  };

  createInfo = (title, info) => {
    return (
      <Item
        stackedLabel
        style={{
          width: Metrics.WIDTH * 0.9,
          marginHorizontal: Metrics.WIDTH * 0.05,
        }}>
        <Label>{title}</Label>
        <Text
          style={{
            color: Colors.lightBlack,
            fontSize: Fonts.moderateScale(16),
            marginVertical: 10,
            alignSelf: 'flex-start',
          }}>
          {info}
        </Text>
        <View style={styles.fieldDivider} />
      </Item>
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

  _renderItem = (item) => {
    return (
      <TaskItem
        item={item.item}
        onPress={() =>
          NavigationHelper.navigate(SCREEN_ENUMS.TASK, {task: item.item})
        }
      />
    );
  };

  createTaskList = () => {
    return (
      <FlatList
        data={this.state.tasks ? this.state.tasks : []}
        ref={(ref) => {
          this.flatListRef = ref;
        }}
        refreshing={false}
        extraData={this.state}
        keyExtractor={(item, index) => index.toString()}
        renderItem={(item) => this._renderItem(item)}
        onRefresh={() => this.fetchTaskList(this.state.keyword)}
        refreshing={false}
        windowSize={10}
        // onEndReachedThreshold={LOAD_MORE_CONTANTS.REACHED_THRESHOLD}
        // onEndReached={() => {
        //   this._loadMoreData();
        // }}
      />
    );
  };

  createContent = () => {
    if (this.state.activeTab === 'Overview') {
      return this.createOverview();
    } else {
      return (
        <View>
          {this.createSearchBar()}
          {this.createTaskList()}
        </View>
      );
    }
  };

  renderParticipant = (data) => {
    return (
      <View style={{flexDirection: 'column'}}>
        <View style={styles.mainRow}>
          <Image
            source={data.profileImage ? {uri: data.profileImage} : images.user}
            style={styles.profileImgList}
          />
          <View style={styles.nameDesignationMainView}>
            <View style={styles.nameDesignationView}>
              <Text style={styles.nameTxt}>
                {data.firstName} {data.lastName}
              </Text>
              <Text style={styles.designationTxt}>{data.roleTitle}</Text>
            </View>
          </View>
        </View>
        <View style={styles.fieldDivider} />
      </View>
    );
  };

  createParticipantList = () => {
    return (
      <View style={{height: '100%'}}>
        <FlatList
          data={this.state.participants}
          ref={(ref) => {
            this.flatListRef = ref;
          }}
          refreshing={false}
          extraData={this.state}
          keyExtractor={(item, index) => index.toString()}
          renderItem={(item) => this.renderParticipant(item.item)}
          // onRefresh={() => this._onRefresh(this.state.keyword)}
          refreshing={false}
          // windowSize={10}
        />
      </View>
    );
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <HeaderView
          title={this.state.project ? this.state.project.name : 'PROJECT'}
        />
        <SafeAreaView style={{flex: 1}}>
          <View style={{flex: 1}}>{this.createContent()}</View>
          <View
            style={{
              justifyContent: 'flex-end',
              backgroundColor: 'red',
            }}>
            <FooterTabView
              tabs={[
                {
                  title: 'Overview',
                  onPress: () => {
                    this.setState({activeTab: 'Overview'});
                  },
                  iconName: 'home',
                },
                {
                  title: 'Tasks',
                  onPress: () => {
                    this.setState({activeTab: 'Tasks'});
                  },
                  iconName: 'checkmark',
                },
              ]}
              activeTab={this.state.activeTab}
            />
            <CustomModal
              title="Project Participants"
              isVisible={this.state.modal}
              content={this.createParticipantList()}
              toggleModal={() => {
                this.setState({modal: false});
              }}
            />
          </View>
        </SafeAreaView>
      </View>
    );
  }
}

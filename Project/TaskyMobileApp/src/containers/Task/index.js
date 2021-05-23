import React, {Component} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {HeaderView} from '../../components/views';
import FooterTabView from '../../components/views/FooterTabView';
import styles from './styles';
import moment from 'moment';
import {Item, Label, Toast} from 'native-base';
import {Colors, Fonts, Metrics} from '../../res/styles';
import CustomModal from '../../components/modals/CustomModal';
import WorkLogForm from '../../components/forms/WorkLogForm';
import {FAB} from 'react-native-paper';
import {ServiceHelper} from '../../util/helpers';
import {
  GET_WORKLOGS_UNDER_TASK_SERVICE,
  INSERT_WORKLOG_SERVICE,
} from '../../util/constants/Services';
import debounce from 'lodash.debounce';
import AntDesign from 'react-native-vector-icons/AntDesign';
import WorkLogItem from '../../components/items/WorkLogItem';

export default class Task extends Component {
  constructor(props) {
    super(props);
    this.onChangeTextDelayed = debounce(this._onChangeKeyword, 1000);
    this.state = {
      task: props.navigation.state.params.task,
      activeTab: 'Overview',
      workLogFormVisibility: false,
    };
  }

  componentDidMount = () => {
    this.fetchWorkLogs();
  };

  createTaskDetail = () => {
    return (
      <View style={{flex: 1, alignItems: 'center'}}>
        {this.state.task && this.state.task.project_Title
          ? this.createInfo('Project Name', this.state.task.project_Title)
          : null}
        {this.state.task && this.state.task.title
          ? this.createInfo('Title', this.state.task && this.state.task.title)
          : null}
        {this.state.task && this.state.task.description
          ? this.createInfo(
              'Description',
              this.state.task && this.state.task.description,
            )
          : null}
        {this.state.task && this.state.task.statusTitle
          ? this.createInfo(
              'Status',
              this.state.task && this.state.task.statusTitle,
            )
          : null}
        {this.state.task && this.state.task.dueDate
          ? this.createInfo(
              'Due Date',
              moment(this.state.task.dueDate).format('DD/MM/YYYY'),
            )
          : null}
        {this.state.task &&
        this.state.task.assigneeFirstName &&
        this.state.task.assigneeLastName
          ? this.createInfo(
              'Assignee',
              this.state.task.assigneeFirstName +
                ' ' +
                this.state.task.assigneeLastName,
            )
          : null}
        {this.state.task &&
        this.state.task.reporterFirstName &&
        this.state.task.reporterLastName
          ? this.createInfo(
              'Reporter',
              this.state.task.reporterFirstName +
                ' ' +
                this.state.task.reporterLastName,
            )
          : null}
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

  createWorkLogForm = () => {
    return (
      <CustomModal
        isVisible={this.state.workLogFormVisibility}
        content={<WorkLogForm onSubmit={(values) => this.logWork(values)} />}
        title="Log Work"
        toggleModal={() => {
          this.setState({
            workLogFormVisibility: !this.state.workLogFormVisibility,
          });
        }}
      />
    );
  };

  _renderItem = (item) => {
    return <WorkLogItem item={item.item} onPress={() => console.log('x')} />;
  };

  createWorkLogList = () => {
    return (
      <FlatList
        data={this.state.filteredWorkLogs ? this.state.filteredWorkLogs : []}
        ref={(ref) => {
          this.flatListRef = ref;
        }}
        refreshing={false}
        extraData={this.state}
        keyExtractor={(item, index) => index.toString()}
        renderItem={(item) => this._renderItem(item)}
        onRefresh={() => this.fetchWorkLogs(this.state.keyword)}
        refreshing={false}
        windowSize={10}
        // onEndReachedThreshold={LOAD_MORE_CONTANTS.REACHED_THRESHOLD}
        // onEndReached={() => {
        //   this._loadMoreData();
        // }}
      />
    );
  };

  _onChangeKeyword = (keyword) => {
    if (keyword.length > 0) {
      let workLogs = this.state.workLogs;
      let filteredWorkLogs = workLogs.filter((workLog) => {
        if (workLog.description) {
          return (
            workLog.description.toLowerCase().includes(keyword.toLowerCase()) ||
            workLog.firstName.toLowerCase().includes(keyword.toLowerCase()) ||
            workLog.lastName.toLowerCase().includes(keyword.toLowerCase()) ||
            workLog.projectName.toLowerCase().includes(keyword.toLowerCase()) ||
            workLog.taskTitle.toLowerCase().includes(keyword.toLowerCase())
          );
        }
      });
      this.setState({filteredWorkLogs: filteredWorkLogs});
    } else {
      this.setState({filteredWorkLogs: this.state.workLogs});
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
            this.handleDebounce('');
          }}>
          <AntDesign name="close" size={20} color="black" />
        </TouchableOpacity>
      </View>
    );
  };

  fetchWorkLogs = async () => {
    let reqBody = {
      taskId: this.state.task.id,
    };
    const responseData = await ServiceHelper.serviceHandler(
      GET_WORKLOGS_UNDER_TASK_SERVICE,
      ServiceHelper.createOptionsJson(JSON.stringify(reqBody), 'POST'),
    );
    if (responseData.data && responseData.data) {
      let data = responseData.data;
      data.reverse();
      this.setState({
        workLogs: data,
        filteredWorkLogs: data,
      });
    }
  };

  createContent = () => {
    if (this.state.activeTab === 'Overview') {
      return this.createTaskDetail();
    } else {
      return (
        <View style={{flex: 1}}>
          {this.createSearchBar()}
          {this.createWorkLogList()}
          <FAB
            style={styles.fab}
            small
            icon="plus"
            onPress={() => this.setState({workLogFormVisibility: true})}
          />
        </View>
      );
    }
  };

  logWork = async (values) => {
    let insertObj = {...values, taskId: this.state.task.id};
    const responseData = await ServiceHelper.serviceHandler(
      INSERT_WORKLOG_SERVICE,
      ServiceHelper.createOptionsJson(JSON.stringify(insertObj), 'POST'),
    );
    if (responseData && responseData.isSuccessful) {
      this.setState({workLogFormVisibility: false});
      Toast.show({
        text:
          responseData && responseData.message
            ? responseData.message
            : 'Work Log Added Successfully.',
        type: 'success',
        duration: 7000,
      });
      this.fetchWorkLogs();
    } else {
      Toast.show({
        text:
          responseData && responseData.message ? responseData.message : 'Error',
        type: 'danger',
        duration: 7000,
      });
    }
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <HeaderView title={this.state.task ? this.state.task.title : 'TASK'} />
        <SafeAreaView style={{flex: 1}}>
          <View style={{flex: 1}}>{this.createContent()}</View>
          {this.createWorkLogForm()}
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
                  title: 'Work Logs',
                  onPress: () => {
                    this.setState({activeTab: 'Work Logs'});
                  },
                  iconName: 'list',
                },
              ]}
              activeTab={this.state.activeTab}
            />
          </View>
        </SafeAreaView>
      </View>
    );
  }
}

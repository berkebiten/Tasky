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
import {NavigationHelper, ServiceHelper} from '../../util/helpers';
import {
  GET_WORKLOGS_UNDER_TASK_SERVICE,
  INSERT_WORKLOG_SERVICE,
  GET_SUB_TASKS,
  GET_TASK_DETAIL,
  UPDATE_TASK_STATUS,
} from '../../util/constants/Services';
import debounce from 'lodash.debounce';
import AntDesign from 'react-native-vector-icons/AntDesign';
import WorkLogItem from '../../components/items/WorkLogItem';
import TaskItem from '../../components/items/TaskItem';
import {SCREEN_ENUMS} from '../../util/constants/Enums';
import NoContentView from '../../components/views/NoContentView';

export default class Task extends Component {
  constructor(props) {
    super(props);
    this.onChangeTextDelayed = debounce(this._onChangeKeyword, 1000);
    this.state = {
      taskId: props.navigation.state.params.task.id,
      activeTab: 'Overview',
      workLogFormVisibility: false,
      isFabOpen: false,
    };
  }

  componentDidMount = () => {
    this.getDetail();
  };

  getDetail = async () => {
    const responseData = await ServiceHelper.serviceHandler(
      GET_TASK_DETAIL + this.state.taskId,
      ServiceHelper.createOptionsJson(null, 'GET'),
    );
    if (responseData.data) {
      this.setState(
        {
          task: responseData.data,
        },
        () => this.fetchWorkLogs(),
      );
    }
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

  updateTaskStatus = async (status) => {
    let task = this.state.task;
    let body = {
      id: task.id,
      projectId: task.projectId,
      title: task.title,
      description: task.description,
      assigneeId: task.assigneeId,
      reporterId: task.reporterId,
      priority: task.priority,
      dueDate: task.dueDate,
      createdDate: task.createdDate,
      status: status,
    };
    const responseData = await ServiceHelper.serviceHandler(
      UPDATE_TASK_STATUS + this.state.task.id,
      ServiceHelper.createOptionsJson(JSON.stringify(body), 'PUT'),
    );
    if (responseData && responseData.isSuccessful) {
      this.setState({isFabOpen: false});
      Toast.show({
        text: 'Task is Updated',
        type: 'success',
        duration: 7000,
      });
      this.getDetail();
    } else {
      Toast.show({
        text:
          responseData && responseData.message ? responseData.message : 'Error',
        type: 'danger',
        duration: 7000,
      });
    }
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
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              color: Colors.lightBlack,
              fontSize: Fonts.moderateScale(16),
              marginVertical: 10,
              alignSelf: 'flex-start',
            }}>
            {info}
          </Text>
          {title === 'Status' && (
            <FAB.Group
              fabStyle={styles.statusFAB}
              open={this.state.isFabOpen}
              style={{marginBottom: 10}}
              icon={'circle-edit-outline'}
              actions={[
                {
                  icon: 'alarm-multiple',
                  label: 'ToDo',
                  color: '#464a50',
                  onPress: () => this.updateTaskStatus(0),
                },
                {
                  icon: 'clock-start',
                  label: 'Active',
                  color: '#0275d8',
                  onPress: () => this.updateTaskStatus(1),
                },
                {
                  icon: 'alert-circle-check',
                  label: 'Resolved',
                  color: '#9c64b3',
                  onPress: () => this.updateTaskStatus(2),
                },
                {
                  icon: 'check',
                  label: 'Closed',
                  color: '#5cb85c',
                  onPress: () => this.updateTaskStatus(3),
                },
              ]}
              onStateChange={() =>
                this.setState({isFabOpen: !this.state.isFabOpen})
              }
            />
          )}
        </View>
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
    if (this.state.activeTab === 'Sub-tasks') {
      return (
        <TaskItem
          item={item.item}
          onPress={() => {
            NavigationHelper.navigate(SCREEN_ENUMS.TASK, {task: item.item});
          }}
        />
      );
    } else {
      return <WorkLogItem item={item.item} />;
    }
  };

  createWorkLogList = () => {
    if (this.state.filteredWorkLogs && this.state.filteredWorkLogs.length > 0) {
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
        />
      );
    } else {
      return (
        <View style={{flex: 1}}>
          <NoContentView text="No Data To Display" />
        </View>
      );
    }
  };

  createSubtaskList = () => {
    if (this.state.filteredSubtasks && this.state.filteredSubtasks.length > 0) {
      return (
        <FlatList
          data={this.state.filteredSubtasks ? this.state.filteredSubtasks : []}
          ref={(ref) => {
            this.flatListRef = ref;
          }}
          refreshing={false}
          extraData={this.state}
          keyExtractor={(item, index) => index.toString()}
          renderItem={(item) => this._renderItem(item)}
          onRefresh={() => this.fetchSubTasks(this.state.keyword)}
          refreshing={false}
          windowSize={10}
        />
      );
    } else {
      return (
        <View style={{flex: 1}}>
          <NoContentView text="No Data To Display" />
        </View>
      );
    }
  };

  _onChangeKeyword = (keyword) => {
    if (this.state.activeTab === 'Sub-tasks') {
      this.searchSubtasks(keyword);
      return;
    }
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

  searchSubtasks = (keyword) => {
    if (keyword.length > 0) {
      let tasks = this.state.filteredSubtasks;
      let filteredSubtasks = tasks.filter((task) => {
        if (task.title) {
          return task.title.toLowerCase().includes(keyword.toLowerCase());
        }
      });
      this.setState({filteredSubtasks: filteredSubtasks});
    } else {
      this.setState({filteredSubtasks: this.state.subtasks});
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
      this.setState(
        {
          workLogs: data,
          filteredWorkLogs: data,
        },
        () => this.fetchSubTasks(),
      );
    }
  };

  fetchSubTasks = async () => {
    const responseData = await ServiceHelper.serviceHandler(
      GET_SUB_TASKS + this.state.task.id,
      ServiceHelper.createOptionsJson(null, 'GET'),
    );
    if (responseData.data && responseData.data) {
      let data = responseData.data;
      data.reverse();
      this.setState({
        subtasks: data,
        filteredSubtasks: data,
      });
    }
  };

  createContent = () => {
    if (this.state.activeTab === 'Overview') {
      return this.createTaskDetail();
    } else if (this.state.activeTab === 'Sub-tasks') {
      return (
        <View style={{flex: 1}}>
          {this.createSearchBar()}
          {this.createSubtaskList()}
        </View>
      );
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
    if (!this.state.task) {
      return null;
    }
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
                  title: 'Sub-tasks',
                  onPress: () => {
                    this.setState({activeTab: 'Sub-tasks'});
                  },
                  iconName: 'checkmark',
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

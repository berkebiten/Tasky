import React, {Component} from 'react';
import {SafeAreaView, Text, View} from 'react-native';
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
import {INSERT_WORKLOG_SERVICE} from '../../util/constants/Services';

export default class Task extends Component {
  constructor(props) {
    super(props);
    this.state = {
      task: props.navigation.state.params.task,
      activeTab: 'Overview',
      workLogFormVisibility: false,
    };
  }

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
        toggleModal={() =>
          this.setState({
            workLogFormVisibility: !this.state.workLogFormVisibility,
          })
        }
      />
    );
  };

  createContent = () => {
    if (this.state.activeTab === 'Overview') {
      return this.createTaskDetail();
    } else {
      return (
        <View style={{flex: 1}}>
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
    console.warn(insertObj);
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

import React, {Component} from 'react';
import {SafeAreaView, Text, View} from 'react-native';
import {HeaderView} from '../../components/views';
import FooterTabView from '../../components/views/FooterTabView';
import styles from './styles';
import moment from 'moment';
import {Item, Label} from 'native-base';
import {Colors, Fonts, Metrics} from '../../res/styles';

export default class Task extends Component {
  constructor(props) {
    super(props);
    this.state = {
      task: props.navigation.state.params.task,
      activeTab: 'Overview',
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

  render() {
    return (
      <View style={{flex: 1}}>
        <HeaderView title={this.state.task ? this.state.task.title : 'TASK'} />
        <SafeAreaView style={{flex: 1}}>
          <View style={{flex: 1}}>{this.createTaskDetail()}</View>
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

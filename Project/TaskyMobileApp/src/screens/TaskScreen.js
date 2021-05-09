import React from 'react';
import Task from '../containers/Task/';
import {withNavigation} from 'react-navigation';

const TaskWithNav = withNavigation(Task);

class TaskScreen extends React.Component {
  constructor() {
    super();
  }

  render() {
    return <TaskWithNav />;
  }
}

export default TaskScreen;

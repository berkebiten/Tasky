import React from 'react';
import Project from '../containers/Project'
import {withNavigation} from 'react-navigation';

const ProjectWithNav = withNavigation(Project);
export default class ProjectScreen extends React.Component {
  render() {
    return <ProjectWithNav />;
  }
}

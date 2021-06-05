import React, { Component } from "react";
import NavbarLogged from "../../components/NavbarLogged";
import { Container } from "react-bootstrap";
import { ServiceHelper, SessionHelper } from "../../util/helpers";
import { Helmet } from "react-helmet";
import { GET_MY_TASKS } from "../../util/constants/Services";
import { taskTableColumns } from "../../util/constants/Constants";
import TableView from "../../components/views/TableView";

export default class Tasks extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    if (!SessionHelper.checkIsSessionLive()) {
      props.history.push("/");
    }
  }

  componentDidMount = () => {
    this.initialize();
  };

  initialize = () => {
    this.getTasks();
  };

  componentDidUpdate = () => {
    if (!this.state.tasks) {
      this.getTasks();
    }
  };

  getTasks = async (page) => {
    await ServiceHelper.serviceHandler(
      GET_MY_TASKS,
      ServiceHelper.createOptionsJson(null, "POST")
    ).then((response) => {
      let update = {};
      if (response && response.data && response.isSuccessful) {
        update.tasks = response.data.tasks;
        this.setState(update);
      }
    });
  };

  onClickTask = (project) => {
    this.props.history.push({
      pathname: "/project/" + project.id,
      state: { project: project, projectName: project.name },
    });
  };

  createTasks = () => {
    return (
      <TableView columns={taskTableColumns()} tableData={this.state.tasks} />
    );
  };

  render() {
    return (
      <div>
        <Helmet>
          <title>{"My Tasks"}</title>
        </Helmet>
        <NavbarLogged />
        <div className="auth-wrapper">
          <Container>{this.createTasks()}</Container>
        </div>
      </div>
    );
  }
}

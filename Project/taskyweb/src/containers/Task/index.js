import React, { Component } from "react";
import NavbarLogged from "../../components/NavbarLogged";
import SideBar from "../../components/SideBar";
import TableView from "../../components/views/TableView";
import { Card, Col, Row, Container, Badge, Button } from "react-bootstrap";
import { RiArrowGoBackFill } from "react-icons/ri";
import { ServiceHelper, SessionHelper } from "../../util/helpers";
import {
  GET_PROJECT_PARTICIPANTS_SERVICE,
  GET_SUBTASKS_SERVICE,
  GET_TASK_DETAIL,
  GET_TASK_WORK_LOGS,
  INSERT_TASK_SERVICE,
  INSERT_WORK_LOG_SERVICE,
} from "../../util/constants/Services";
import CustomModal from "../../components/modals/CustomModal";
import { toast } from "react-toastify";
import moment from "moment";
import {
  activityTableColumns,
  taskTableColumns,
} from "../../util/constants/Constants";
import WorkLogForm from "../../components/forms/WorkLogForm";
import TaskForm from "../../components/forms/TaskForm";

const menuItems = [
  {
    title: "Detail",
    icon: "dashboard",
  },
  {
    title: "Sub Tasks",
    icon: "th",
  },
  {
    title: "Activities",
    icon: "list",
  },
];

export default class Task extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activePage: "Detail",
      taskId:
        props.match && props.match.params
          ? props.match.params.id.slice(
              props.match.params.id.indexOf("=") + 1,
              props.match.params.id.length
            )
          : null,
      projectId: "",
      workLogFormVisibility: false,
      taskFormVisibility: false,
    };
    let a = SessionHelper.checkIsSessionLive();
    if (!a) {
      props.history.push("/");
    }
  }

  componentDidMount = () => {
    this.initialize();
  };

  initialize = async () => {
    this.getTaskDetail();
  };

  getTaskDetail = async () => {
    await ServiceHelper.serviceHandler(
      GET_TASK_DETAIL + this.state.taskId,
      ServiceHelper.createOptionsJson(null, "GET")
    ).then((response) => {
      if (response && response.isSuccessful && response.data) {
        this.setState({
          task: response.data,
          projectId: response.data.projectId,
        });
        this.fetchActivities();
      }
    });
  };

  goBack = () => {
    this.props.history.push({
      pathname: "/project/" + this.state.projectId,
      state: { activePage: "Task List" },
    });
  };

  createDetail = () => {
    console.log(this.state.task);
    let title = this.state.task ? this.state.task.title : "UNDEFINED";
    let description = this.state.task
      ? this.state.task.description
      : "UNDEFINED";
    let assignee = this.state.task
      ? this.state.task.assigneeFirstName +
        " " +
        this.state.task.assigneeLastName
      : "UNDEFINED";
    let projectName = this.state.task
      ? this.state.task.project_Title
      : "UNDEFINED";
    let created = this.state.task
      ? moment(this.state.task.createdDate).format("DD/MM/YYYY")
      : "UNDEFINED";
    let due = this.state.task
      ? moment(this.state.task.dueDate).format("DD/MM/YYYY")
      : "UNDEFINED";
    let reporter = this.state.task
      ? this.state.task.reporterFirstName +
        " " +
        this.state.task.reporterLastName
      : "UNDEFINED";
    let status = this.state.task ? this.state.task.status : -1;
    let stateName = "";
    if (status === 0) {
      stateName = "todo";
    } else if (status === 1) {
      stateName = "active";
    } else if (status === 2) {
      stateName = "resolved";
    } else if (status === 3) {
      stateName = "closed";
    } else {
      stateName = "undefined";
    }
    return (
      <Container className="dark-overview-container">
        <Row className="mt-4 project-detail-row mx-auto">
          <Button onClick={() => this.goBack()} className="back-button">
            <RiArrowGoBackFill /> Go to Project Task List
          </Button>
        </Row>
        <Row className="mt-4 project-detail-row mx-auto">
          <Col md={1} className={"state-bar-" + stateName}>
            <p className="centered">{stateName.toUpperCase()}</p>
          </Col>
          <Col md={11} className="task-title">
            <h2> {title} </h2>
          </Col>
        </Row>
        <Row className="mt-3 project-detail-row mx-auto">
          <Col md={1}>
            <p className="vert-centered">Description</p>
          </Col>
          <Col md={11} className="task-title">
            <h3> {description} </h3>
          </Col>
        </Row>
        <Row className="mt-3 project-detail-row mx-auto">
          <Col md={1}>
            <p className="vert-centered">Assignee</p>
          </Col>
          <Col md={11} className="task-title">
            <h3> {assignee} </h3>
          </Col>
        </Row>
        <Row className="mt-3 project-detail-row mx-auto">
          <Col md={1}>
            <p className="vert-centered">Project</p>
          </Col>
          <Col md={11} className="task-title">
            <a href={"/project/" + this.state.projectId}>
              <h3> {projectName} </h3>
            </a>
          </Col>
        </Row>
        <Row className="mt-3 project-detail-row mx-auto">
          <Col md={1}>
            <p className="vert-centered">Created Date</p>
          </Col>
          <Col md={11} className="task-title">
            <h3> {created} </h3>
          </Col>
        </Row>
        <Row className="mt-3 project-detail-row mx-auto">
          <Col md={1}>
            <p className="vert-centered">Due Date</p>
          </Col>
          <Col md={11} className="task-title">
            <h3> {due} </h3>
          </Col>
        </Row>
        <Row className="mt-3 project-detail-row mx-auto">
          <Col md={1}>
            <p className="vert-centered">Reporter</p>
          </Col>
          <Col md={11} className="task-title">
            <h3> {reporter} </h3>
          </Col>
        </Row>
      </Container>
    );
  };

  fetchSubtasks = async () => {
    await ServiceHelper.serviceHandler(
      GET_SUBTASKS_SERVICE + "/" + this.state.taskId,
      ServiceHelper.createOptionsJson(null, "GET")
    ).then((response) => {
      if (response && response.isSuccessful) {
        // let data = response.data;
        // data.reverse();
        this.setState({ subTasks: response.data });
        this.fetchProjectParticipants()
      }
    });
  };

  fetchActivities = async () => {
    await ServiceHelper.serviceHandler(
      GET_TASK_WORK_LOGS,
      ServiceHelper.createOptionsJson(
        JSON.stringify({ taskId: this.state.taskId }),
        "POST"
      )
    ).then((response) => {
      if (response && response.isSuccessful) {
        let data = response.data;
        data.reverse();
        this.setState({ workLogs: data });
        this.fetchSubtasks();
      }
    });
  };

  fetchProjectParticipants = async () => {
    await ServiceHelper.serviceHandler(
      GET_PROJECT_PARTICIPANTS_SERVICE + "/" + this.state.projectId,
      ServiceHelper.createOptionsJson(null, "GET")
    ).then((response) => {
      if (response && response.isSuccessful) {
        this.setState({ projectParticipants: response.data });
      }
    });
  };

  createSubtaskList = () => {
    return (
      <Container className="dark-overview-container">
        <Row className="mt-2 project-detail-row mx-auto">
          <Button
            className="ml-2 new-task"
            variant="dark"
            onClick={() => this.setState({ taskFormVisibility: true })}
          >
            <Badge variant="primary">+</Badge> Create Sub-task
          </Button>
        </Row>
        <Row className="project-detail-row mx-auto">
          <TableView
            columns={taskTableColumns}
            tableData={this.state.subTasks}
          />
        </Row>
      </Container>
    );
  };

  createActivities = () => {
    return (
      <Container className="dark-overview-container">
        <Row className="mt-2 project-detail-row mx-auto">
          <Button
            className="ml-2 new-task"
            variant="dark"
            onClick={() => this.setState({ workLogFormVisibility: true })}
          >
            <Badge variant="primary">+</Badge> Log Work
          </Button>
        </Row>
        <Row className="project-detail-row mx-auto">
          <TableView
            columns={activityTableColumns}
            tableData={this.state.workLogs}
          />
        </Row>
      </Container>
    );
  };

  submitWorkLogForm = async (data) => {
    let date = moment(data.createdDate).format("YYYY-MM-DD");
    let insertObject = {
      ...data,
      taskId: this.state.taskId,
      createdDate: date,
    };
    await ServiceHelper.serviceHandler(
      INSERT_WORK_LOG_SERVICE,
      ServiceHelper.createOptionsJson(JSON.stringify(insertObject), "POST")
    ).then((response) => {
      if (response && response.isSuccessful) {
        toast("Work Log is Created Successfully.", {
          type: "success",
        });
        this.setState({ workLogFormVisibility: false });
        this.fetchActivities();
      } else {
        toast(response.message, {
          type: "error",
        });
      }
    });
  };

  createWorkLogForm = () => {
    return (
      <CustomModal
        isVisible={this.state.workLogFormVisibility}
        onClose={() => this.setState({ workLogFormVisibility: false })}
        content={
          <div>
            <WorkLogForm
              handleSubmit={(submit) => (this.submitWorkLogForm = submit)}
              handleReset={(reset) => (this.resetWorkLogForm = reset)}
              onSubmit={this.submitWorkLogForm}
              initialValues={null}
            />
          </div>
        }
        title={"LOG WORK"}
      />
    );
  };

  submitTaskForm = async (data) => {
    let date = moment(data.dueDate).format("YYYY-MM-DD");
    let insertObject = {
      projectId: this.state.projectId,
      priority: 0,
      ...data,
      dueDate: date,
      rootId: this.state.taskId
    };
    await ServiceHelper.serviceHandler(
      INSERT_TASK_SERVICE,
      ServiceHelper.createOptionsJson(JSON.stringify(insertObject), "POST")
    ).then((response) => {
      if (response && response.isSuccessful) {
        toast("Sub-task is Created Successfully.", {
          type: "success",
        });
        this.resetTaskForm();
        this.setState({ taskFormVisibility: false });
        this.fetchSubtasks();
      } else {
        toast(response.message, {
          type: "error",
        });
      }
    });
  };

  createTaskForm = () => {
    return (
      <CustomModal
        isVisible={this.state.taskFormVisibility}
        onClose={() => this.setState({ taskFormVisibility: false })}
        content={
          <div>
            <TaskForm
              handleSubmit={(submit) => (this.submitTaskForm = submit)}
              handleReset={(reset) => (this.resetTaskForm = reset)}
              onSubmit={this.submitTaskForm}
              initialValues={null}
              participants={
                this.state.projectParticipants &&
                this.state.projectParticipants.length > 0
                  ? this.state.projectParticipants
                  : []
              }
            />
          </div>
        }
        title={"LOG WORK"}
      />
    );
  };

  createContent = () => {
    switch (this.state.activePage) {
      case "Sub Tasks":
        return this.createSubtaskList();
      case "Activities":
        return this.createActivities();
      default:
        return this.createDetail();
    }
  };

  onMenuItemSelect = (item) => {
    console.log(this.state);
    this.setState({ activePage: menuItems[parseInt(item)].title });
  };

  // createTaskDetail = () => {

  // }

  render() {
    return (
      <div>
        <NavbarLogged />
        <Row>
          <Col className="project-detail-left" md={2}>
            <SideBar
              menuItems={menuItems}
              title={this.state.task ? this.state.task.title : "Task Detail"}
              activePage={this.state.activePage}
              onMenuItemSelect={this.onMenuItemSelect}
            />
          </Col>
          <Col className="project-detail-right" md={10}>
            {this.createContent()}
          </Col>
        </Row>
        {this.createWorkLogForm()}
        {this.createTaskForm()}
      </div>
    );
  }
}

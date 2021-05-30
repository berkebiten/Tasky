import React, { Component } from "react";
import NavbarLogged from "../../components/NavbarLogged";
import SideBar from "../../components/SideBar";
import TableView from "../../components/views/TableView";
import { Card, Col, Row, Container, Badge, Button } from "react-bootstrap";
import { RiArrowGoBackFill } from "react-icons/ri";
import { ServiceHelper, SessionHelper } from "../../util/helpers";
import { Divider, Grid, Image, Segment } from "semantic-ui-react";
import {
  GET_PARTICIPANT_ROLE,
  GET_PROJECT_PARTICIPANTS_SERVICE,
  GET_SUBTASKS_SERVICE,
  GET_TASK_DETAIL,
  GET_TASK_WORK_LOGS,
  INSERT_TASK_SERVICE,
  INSERT_WORK_LOG_SERVICE,
  GET_TASK_TIMELINE,
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
import { Timeline, Icon } from "rsuite";

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
      user: SessionHelper.loadUser(),
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
      selectedWorkLog: null,
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
        this.getTaskTimeline();
      }
    });
  };

  getRole = async () => {
    await ServiceHelper.serviceHandler(
      GET_PARTICIPANT_ROLE + this.state.projectId + "/" + this.state.user.id,
      ServiceHelper.createOptionsJson(null, "GET")
    ).then((response) => {
      if (response && response.data) {
        this.setState({ userRole: response.data });
        this.fetchActivities();
      } else {
        this.props.history.push("/");
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

  fetchSubtasks = async () => {
    await ServiceHelper.serviceHandler(
      GET_SUBTASKS_SERVICE + "/" + this.state.taskId,
      ServiceHelper.createOptionsJson(null, "GET")
    ).then((response) => {
      if (response && response.isSuccessful) {
        this.setState({ subTasks: response.data });
        this.fetchProjectParticipants();
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

  getTaskTimeline = async () => {
    await ServiceHelper.serviceHandler(
      GET_TASK_TIMELINE + this.state.taskId,
      ServiceHelper.createOptionsJson(null, "GET")
    ).then((response) => {
      if (response && response.data) {
        this.setState({ taskTimeline: response.data });
        this.getRole();
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
    let title = this.state.task ? this.state.task.title : "UNDEFINED";
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
        <Row className="mt-3 mb-3 ml-5">
          <Button
            onClick={() => this.goBack()}
            className="new-task"
            variant="dark"
          >
            <RiArrowGoBackFill /> Go to Project Task List
          </Button>
        </Row>
        <Card className="ml-5 task-detail-card" style={{ width: "91%" }}>
          <Card.Header>
            <Row className="mx-auto">
              <Col md={1} className={"state-bar-" + stateName}>
                <p className="centered">{stateName.toUpperCase()}</p>
              </Col>
              <Col md={3} className="task-title">
                <h2> {title} </h2>
              </Col>
              <Col md={2}></Col>

              <Col md={2}></Col>
              <Col md={3} className="task-title">
                <h2> Timeline </h2>
              </Col>
            </Row>
          </Card.Header>
          <Row>
            <Col md={6} className="task-title">
              {this.createDetailInfo()}
            </Col>
            <Divider vertical />
            <Col md={5} className="task-title">
              {this.createTimeLine()}
            </Col>
          </Row>
        </Card>
      </Container>
    );
  };

  createDetailInfo = () => {
    let description = this.state.task
      ? this.state.task.description
      : "UNDEFINED";
    let assignee = this.state.task
      ? this.state.task.assigneeFullName
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
      ? this.state.task.reporterFullName
      : "UNDEFINED";
    return (
      // <Card className="ml-5 mr-5" style={{ width: "100%" }}>
      //   <Card.Header>
      //     <Row className="mx-auto">
      //       <Col md={5} className="task-title">
      //         <h2> {title} </h2>
      //       </Col>
      //       {/* <Divider vertical>AND</Divider> */}
      //       <Col md={4}></Col>
      //       <Col md={3} className={"state-bar-" + stateName}>
      //         <p className="centered">{stateName.toUpperCase()}</p>
      //       </Col>
      //     </Row>
      //   </Card.Header>
      <Card.Body>
        {projectName
          ? this.renderDetailRow(projectName, "Project", "mt-0")
          : null}
        {description ? this.renderDetailRow(description, "Description") : null}
        {created ? this.renderDetailRow(created, "Created Date") : null}
        {due ? this.renderDetailRow(due, "Due Date") : null}
        {reporter ? this.renderDetailRow(reporter, "Reporter") : null}
        {assignee ? this.renderDetailRow(assignee, "Assignee") : null}
      </Card.Body>
      // </Card>
    );
  };

  renderProfileImage = (title, info) => {
    if (
      this.state.projectParticipants &&
      this.state.projectParticipants.length > 0
    ) {
      let participant;
      participant = this.state.projectParticipants.filter(
        (participant) => participant.fullName === info.toString()
      );
      console.log(participant);
      if (title === "Assignee" || title === "Reporter") {
        return (
          <Image
            className="task-d-pp-image"
            src={
              participant[0].profileImage
                ? participant[0].profileImage
                : "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/1024px-User-avatar.svg.png"
            }
          ></Image>
        );
      }
    }
  };

  renderDetailRow = (info, title, divClassName = "mt-4") => {
    return (
      <div className={divClassName}>
        <p className="task-detail-title">{title}</p>
        <Row className="ml-2">
          {this.renderProfileImage(title, info)}
          <p className="task-detail-info">{info}</p>
        </Row>
      </div>
    );
  };

  createTimeLine = () => {
    if (this.state.taskTimeline) {
      console.log(this.state.taskTimeline);
      return (
        <Card.Body className="ml-2">
          <Timeline className="custom-timeline">
            {this.state.taskTimeline.map((item, index) => {
              let statusTitle = " " + item.newStatusTitle.toString();
              return (
                <Timeline.Item
                  className={"timeline-text dot-" + item.newStatusTitle}
                >
                  <p>{moment(item.date).format("DD/MM/YYYY HH:mm")}</p>
                  <Row>
                    
                      <Image
                      className="task-timeline-pp-image"
                        src={
                          item.userProfileImage
                            ? item.userProfileImage
                            : "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/1024px-User-avatar.svg.png"
                        }
                      ></Image>
                      <p>{item.userFullName} changed the status to:{" "}
                    </p>
                    <p className={"timeline-status-" + item.newStatusTitle}>
                      {statusTitle}
                    </p>
                  </Row>
                </Timeline.Item>
              );
            })}
          </Timeline>
        </Card.Body>
      );
    }
  };

  onDoubleClickActivityRow = (index) => {
    this.setState({
      selectedWorkLog: this.state.workLogs[index - 1],
      workLogModal: true,
    });
  };

  createSubtaskList = () => {
    return (
      <Container className="dark-overview-container">
        <Row className="mt-2 project-detail-row mx-auto">
          {this.state.userRole !== "Watcher" && (
            <Button
              className="ml-2 new-task"
              variant="dark"
              onClick={() => this.setState({ taskFormVisibility: true })}
            >
              <Badge variant="primary">+</Badge> Create Sub-task
            </Button>
          )}
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
          {this.state.userRole !== "Watcher" && (
            <Button
              className="ml-2 new-task"
              variant="dark"
              onClick={() => this.setState({ workLogFormVisibility: true })}
            >
              <Badge variant="primary">+</Badge> Log Work
            </Button>
          )}
        </Row>
        <Row className="project-detail-row mx-auto">
          <TableView
            columns={activityTableColumns}
            tableData={this.state.workLogs}
            onDoubleClickRow={this.onDoubleClickActivityRow}
          />
        </Row>
      </Container>
    );
  };

  submitWorkLogForm = async (data) => {
    let date = moment(data.createdDate).format("YYYY-MM-DD");
    let x = moment(date).format();
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
      rootId: this.state.taskId,
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
                  ? this.state.projectParticipants.filter(
                      (participant) => participant.role !== 2
                    )
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

  createWorkLogModal = () => {
    let workLog = this.state.selectedWorkLog;
    return (
      <CustomModal
        isVisible={this.state.workLogModal}
        onClose={() =>
          this.setState({ workLogModal: false, selectedWorkLog: null })
        }
        content={
          <div>
            <WorkLogForm
              handleSubmit={(submit) => (this.submitTaskForm = submit)}
              handleReset={(reset) => (this.resetTaskForm = reset)}
              onSubmit={null}
              initialValues={{
                ...workLog,
                createdDate: moment().valueOf(workLog.createdDate),
              }}
              hideButton={true}
              participants={
                this.state.projectParticipants &&
                this.state.projectParticipants.length > 0
                  ? this.state.projectParticipants
                  : []
              }
            />
          </div>
        }
        title={"WORK LOG"}
      />
    );
  };

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
            {this.state.selectedWorkLog && this.createWorkLogModal()}
          </Col>
        </Row>
        {this.createWorkLogForm()}
        {this.createTaskForm()}
      </div>
    );
  }
}

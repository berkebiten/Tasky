import React, { Component } from "react";
import NavbarLogged from "../../components/NavbarLogged";
import SideBar from "../../components/SideBar";
import TableView from "../../components/views/TableView";
import { Card, Col, Row, Container, Badge, Button } from "react-bootstrap";
import { RiArrowGoBackFill } from "react-icons/ri";
import {
  FileHelper,
  ServiceHelper,
  SessionHelper,
  TextHelper,
} from "../../util/helpers";
import { Divider, Image } from "semantic-ui-react";
import { Helmet } from "react-helmet";
import { Icon } from "semantic-ui-react";
import {
  GET_PARTICIPANT_ROLE,
  GET_PROJECT_PARTICIPANTS_SERVICE,
  GET_SUBTASKS_SERVICE,
  GET_TASK_DETAIL,
  GET_TASK_WORK_LOGS,
  INSERT_TASK_SERVICE,
  INSERT_WORK_LOG_SERVICE,
  GET_TASK_TIMELINE,
  UPLOAD_TASK_FILE,
  UPDATE_TASK_STATUS_SERVICE,
  UPDATE_TASK_SERVICE
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
import { Loader, Timeline } from "rsuite";
import { Dropdown } from "rsuite";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import EditIcon from "@material-ui/icons/Edit";

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
      fileUpload: false,
      updateTask: false,
    };
    let a = SessionHelper.checkIsSessionLive();
    if (!a) {
      props.history.push("/logout");
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
      if (response && response.isSuccessful && response.data) {
        this.setState({ projectParticipants: response.data.participants });
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

  updateTaskStatus = async (value) => {
    if (this.state.task && this.state.projectId) {
      let t = this.state.task;
      let taskObject = {
        id: t.id,
        projectId: this.state.projectId,
        title: t.title,
        description: t.description,
        assigneeId: t.assigneeId,
        reporterId: t.reporterId,
        priority: t.priority,
        dueDate: t.dueDate,
        createdDate: t.createdDate,
        status: value,
      };
      await ServiceHelper.serviceHandler(
        UPDATE_TASK_STATUS_SERVICE + "/" + t.id,
        ServiceHelper.createOptionsJson(JSON.stringify(taskObject), "PUT")
      ).then((response) => {
        if (response && response.isSuccessful) {
          toast("Task Updated.", {
            type: "success",
          });

          this.getTaskDetail();
        } else {
          toast(response ? response.message : "", {
            type: "error",
          });
        }
      });
    }
  };

  goBack = () => {
    this.props.history.push({
      pathname: "/project/" + this.state.projectId,
      state: { activePage: "Task List" },
    });
  };

  

  createDetail = () => {
    if (!this.state.task || !this.state.taskTimeline) {
      return (
        <Loader
          size="lg"
          content="Loading..."
          speed="slow"
          className="loader"
          center
          vertical
        />
      );
    }
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
          {this.state.userRole !== "Watcher" && this.state.task.projectStatus && (
            <>
              <Button
                onClick={() => this.setState({ updateTask: true })}
                className="new-task ml-2"
                variant="dark"
              >
                <EditIcon /> Update Task
              </Button>
            </>
          )}
        </Row>
        <Card className="ml-5 task-detail-card" style={{ width: "91%" }}>
          <Card.Header>
            <Row className="mx-auto">
              <Col
                md={1}
                style={{ fontSize: 14 }}
                className={"state-bar-" + stateName}
              >
                <p className="centered">{stateName.toUpperCase()}</p>
              </Col>
              <Col className="task-d-us" md={1}>
                {this.state.userRole !== "Watcher" && (
                  <div className="dd-wrapper">
                    <Dropdown
                      className="dark-dd"
                      W
                      noCaret
                      icon={<ArrowForwardIosIcon></ArrowForwardIosIcon>}
                    >
                      <Dropdown.Item
                        disabled={stateName.toUpperCase() === "TODO"}
                        onSelect={() => this.updateTaskStatus(0)}
                        className="state-bar-todo"
                      >
                        ToDo
                      </Dropdown.Item>
                      <Dropdown.Item
                        disabled={stateName.toUpperCase() === "ACTIVE"}
                        onSelect={() => this.updateTaskStatus(1)}
                        className="state-bar-active"
                      >
                        Active
                      </Dropdown.Item>
                      <Dropdown.Item
                        disabled={stateName.toUpperCase() === "RESOLVED"}
                        onSelect={() => this.updateTaskStatus(2)}
                        className="state-bar-resolved"
                      >
                        Resolved
                      </Dropdown.Item>
                      <Dropdown.Item
                        disabled={stateName.toUpperCase() === "CLOSED"}
                        onSelect={() => this.updateTaskStatus(3)}
                        className="state-bar-closed"
                      >
                        Closed
                      </Dropdown.Item>
                    </Dropdown>
                  </div>
                )}
              </Col>
              <Col md={5} className="task-title">
                <h2> {TextHelper.getSmallText(title, 20)} </h2>
              </Col>
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
        {this.createFilesCard()}
        {this.state.updateTask && this.createUpdateTaskForm()}
        {this.state.fileUpload && this.createFileUploadModal()}
      </Container>
    );
  };

  renderFile = (file) => {
    return (
      <a style={{ display: "inline-block" }} href={file.data} download>
        <Card className="react-kanban-card stretched-link">
          <Card.Title>{TextHelper.getSmallText(file.name, 15)}</Card.Title>
          <Card.Body className="file-card row">
            <Icon name="file" size="huge" />
          </Card.Body>
          <Card.Footer className="rkc-footer text-muted">
            <Icon name="user" />
            {file.userFullName}
            <br />
            <Icon name="calendar check outline" />
            {moment(file.date).format("DD/MM/YYYY")}
          </Card.Footer>
        </Card>
      </a>
    );
  };

  createFilesCard = () => {
    return (
      <Row className="mt-3 mb-3 ml-5">
        <Card className="task-detail-card" style={{ width: "93%" }}>
          <Card.Header>
            Files
            {this.state.userRole !== "Watcher" &&
              this.state.task.projectStatus && (
                <Button
                  className="pull-right"
                  onClick={() => this.setState({ fileUpload: true })}
                >
                  Upload File
                </Button>
              )}
          </Card.Header>
          <Card.Body>
            <Row>
              {this.state.task &&
                this.state.task.files &&
                this.state.task.files.map((item, key) => {
                  return <Col md="auto">{this.renderFile(item)}</Col>;
                })}
            </Row>
          </Card.Body>
        </Card>
      </Row>
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
    let due = this.state.task ? this.state.task.dueDate : "UNDEFINED";
    let reporter = this.state.task
      ? this.state.task.reporterFullName
      : "UNDEFINED";
    return (
      <Card.Body>
        {projectName
          ? this.renderDetailRow(
              TextHelper.getSmallText(projectName, 30),
              "Project",
              "mt-0"
            )
          : null}
        {description
          ? this.renderDetailRow(
              TextHelper.getSmallText(description, 40),
              "Description"
            )
          : null}
        {created ? this.renderDetailRow(created, "Created Date") : null}
        {due ? this.renderDetailRow(due, "Due Date") : null}
        {reporter ? this.renderDetailRow(reporter, "Reporter") : null}
        {assignee ? this.renderDetailRow(assignee, "Assignee") : null}
      </Card.Body>
    );
  };

  uploadFile = async () => {
    let files = FileHelper.getFiles();
    await ServiceHelper.serviceHandler(
      UPLOAD_TASK_FILE + this.state.taskId,
      ServiceHelper.createOptionsJson(JSON.stringify(files), "POST")
    ).then((response) => {
      if (response && response.isSuccessfull) {
        toast("File Uploaded.", {
          type: "success",
        });
        FileHelper.clearFiles();
        this.getTaskDetail();
        this.setState({ fileUpload: false });
      } else {
        toast(response ? response.message : "", {
          type: "error",
        });
      }
    });
  };

  onFileChange = (event, callback) => {
    if (
      event &&
      event.target &&
      event.target.files &&
      event.target.files.length > 0
    ) {
      let files = Array.from(event.target.files);
      files.map((file, index) => {
        FileHelper.getBase64(file);
      });
    }
  };

  createFileUploadModal = () => {
    return (
      <CustomModal
        title="Upload File"
        isVisible={this.state.fileUpload}
        onClose={() => this.setState({ fileUpload: false })}
        content={
          <div>
            <input
              type="file"
              className="file-input"
              onChange={(event) => this.onFileChange(event)}
              multiple
            />
            <Button
              variant="dark"
              size="lg"
              onClick={() => {
                this.uploadFile();
              }}
              block
            >
              Upload
            </Button>
          </div>
        }
      />
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
      if (title === "Assignee" || title === "Reporter") {
        return (
          <Image
            className="task-d-pp-image"
            src={
              participant[0] && participant[0].profileImage
                ? participant[0].profileImage
                : "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/1024px-User-avatar.svg.png"
            }
          ></Image>
        );
      }
    }
  };

  renderDetailRow = (info, title, divClassName = "mt-4") => {
    let dueClass = "";

    if (title == "Due Date") {
      let dateNow = new Date().setHours(0, 0, 0, 0);
      if (new Date(info).setHours(0, 0, 0, 0) < dateNow) {
        dueClass = "-passed";
      } else if (new Date(info).setHours(0, 0, 0, 0) === dateNow) {
        dueClass = "-today";
      }
      info = moment(info).format("DD/MM/YYYY");
    }
    return (
      <div className={divClassName}>
        <p className="task-detail-title">{title}</p>
        <Row className="ml-2">
          {this.renderProfileImage(title, info)}
          <p className={"task-detail-info" + dueClass}>{info}</p>
        </Row>
      </div>
    );
  };

  createTimeLine = () => {
    if (this.state.taskTimeline) {
      return (
        <Card.Body
          className="ml-2"
          style={{ "overflow-y": "auto", "max-height": "500px" }}
        >
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
                    <span className="title-span">
                      {item.userFullName} changed the status to
                    </span>
                    <span className={"timeline-status-" + item.newStatusTitle}>
                      {statusTitle}
                    </span>
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
          {this.state.userRole !== "Watcher" && this.state.task.projectStatus && (
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
            columns={taskTableColumns(this.state.projectParticipants)}
            tableData={this.state.subTasks}
            loading={!this.state.projectParticipants || !this.state.subTasks}
          />
        </Row>
      </Container>
    );
  };

  createActivities = () => {
    return (
      <Container className="dark-overview-container">
        <Row className="mt-2 project-detail-row mx-auto">
          {this.state.userRole !== "Watcher" && this.state.task.projectStatus && (
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
            columns={activityTableColumns(this.state.projectParticipants)}
            tableData={this.state.workLogs}
            onDoubleClickRow={this.onDoubleClickActivityRow}
            loading={!this.state.projectParticipants || !this.state.workLogs}
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
        toast("Work Log Created.", {
          type: "success",
        });
        this.setState({ workLogFormVisibility: false });
        this.fetchActivities();
      } else {
        toast(response ? response.message : "", {
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
              // handleSubmit={(submit) => (this.submitWorkLogForm = submit)}
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
    let files = FileHelper.getFiles();
    let date = moment(data.dueDate).format("YYYY-MM-DD");
    let insertObject = {
      projectId: this.state.projectId,
      priority: 0,
      ...data,
      dueDate: date,
      rootId: this.state.taskId,
      files: files ? files : [],
    };
    await ServiceHelper.serviceHandler(
      INSERT_TASK_SERVICE,
      ServiceHelper.createOptionsJson(JSON.stringify(insertObject), "POST")
    ).then((response) => {
      if (response && response.isSuccessful) {
        toast("Sub-task Created.", {
          type: "success",
        });
        FileHelper.clearFiles();
        this.setState({ taskFormVisibility: false });
        this.fetchSubtasks();
      } else {
        toast(response ? response.message : "", {
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
              // handleSubmit={(submit) => (this.submitTaskForm = submit)}
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

  createUpdateTaskForm = () => {
    let task = { ...this.state.task };
    task.dueDate = new Date(moment(task.dueDate));
    return (
      <CustomModal
        isVisible={this.state.updateTask}
        onClose={() => this.setState({ updateTask: false })}
        content={
          <TaskForm
            // handleSubmit={(submit) => (this.updateTask = submit)}
            onSubmit={this.updateTask}
            initialValues={task}
            hideFilePicker={true}
            participants={
              this.state.projectParticipants &&
              this.state.projectParticipants.length > 0
                ? this.state.projectParticipants.filter(
                    (participant) => participant.role !== 2
                  )
                : []
            }
          />
        }
        title={"LOG WORK"}
      />
    );
  };

  updateTask = async (data) => {
    let date = moment(data.dueDate).format("YYYY-MM-DD");
    let insertObject = {
      ...data,
      dueDate: date,
    };
    console.log(data);
    await ServiceHelper.serviceHandler(
      UPDATE_TASK_SERVICE + this.state.taskId,
      ServiceHelper.createOptionsJson(JSON.stringify(insertObject), "PUT")
    ).then((response) => {
      if (response && response.isSuccessful) {
        toast("Task Updated.", {
          type: "success",
        });
        this.setState({ updateTask: false }, () => this.getTaskDetail());
      } else {
        toast(response ? response.message : "", {
          type: "error",
        });
      }
    });
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
              // handleSubmit={(submit) => (this.submitTaskForm = submit)}
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
        <Helmet>
          <title>
            {this.state.task && this.state.task.title
              ? this.state.task.title
              : "Görev Detayı"}
          </title>
        </Helmet>
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
        {this.state.workLogFormVisibility && this.createWorkLogForm()}
        {this.state.taskFormVisibility && this.createTaskForm()}
      </div>
    );
  }
}

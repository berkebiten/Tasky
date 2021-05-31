import React, { Component } from "react";
import NavbarLogged from "../../components/NavbarLogged";
import SideBar from "../../components/SideBar";
import KanbanBoardView from "../../components/views/KanbanBoardView";
import TableView from "../../components/views/TableView";
import ReportView from "../../components/views/ReportView";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import {
  Card,
  Col,
  Row,
  Container,
  Badge,
  Image,
  Button,
  OverlayTrigger,
  Tooltip as Ttip,
} from "react-bootstrap";
import { Helmet } from "react-helmet";
import { FileHelper, ServiceHelper, SessionHelper } from "../../util/helpers";
import {
  GET_PARTICIPANT_ROLE,
  GET_PROJECT_DETAIL,
  GET_PROJECT_PARTICIPANTS_SERVICE,
  GET_PROJECT_WORK_LOGS,
  GET_TASKS_SERVICE,
  INSERT_TASK_SERVICE,
  UPDATE_TASK_STATUS_SERVICE,
  UPLOAD_PROJECT_FILE,
} from "../../util/constants/Services";
import CustomModal from "../../components/modals/CustomModal";
import TaskForm from "../../components/forms/TaskForm";
import { toast } from "react-toastify";
import moment from "moment";
import {
  activityTableColumns,
  taskTableColumns,
} from "../../util/constants/Constants";
import { Icon, Divider } from "semantic-ui-react";

const menuItems = [
  {
    title: "Overview",
    icon: "dashboard",
  },
  {
    title: "Board",
    icon: "th",
  },
  {
    title: "Task List",
    icon: "tasks",
  },
  {
    title: "Activity List",
    icon: "list",
  },
];

export default class ProjectDetail extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      user: SessionHelper.loadUser(),
      activePage: props.location.state
        ? props.location.state.activePage
        : "Overview",
      project: props.location.state ? props.location.state.project : null,
      taskFormVisibility: false,
      projectId:
        props.match && props.match.params
          ? props.match.params.id.slice(
              props.match.params.id.indexOf("=") + 1,
              props.match.params.id.length
            )
          : null,
      fileUpload: false,
    };
    let a = SessionHelper.checkIsSessionLive();
    if (!a) {
      props.history.push("/");
    }
  }

  componentDidMount = () => {
    this.initialize();
  };

  componentWillUnmount() {
    menuItems.pop();
  }

  initialize = async () => {
    this.getRole();
  };

  getRole = async () => {
    await ServiceHelper.serviceHandler(
      GET_PARTICIPANT_ROLE + this.state.projectId + "/" + this.state.user.id,
      ServiceHelper.createOptionsJson(null, "GET")
    ).then((response) => {
      if (response && response.data) {
        if (response.data === "ProjectManager") {
          menuItems.push({
            title: "Project Report",
            icon: "line-chart",
          });
        }
        this.setState({ userRole: response.data });
        this.getProjectDetail();
      } else {
        this.props.history.push("/");
      }
    });
  };

  getProjectDetail = async () => {
    await ServiceHelper.serviceHandler(
      GET_PROJECT_DETAIL + this.state.projectId,
      ServiceHelper.createOptionsJson(null, "GET")
    ).then((response) => {
      if (response && response.isSuccessful) {
        this.setState({ project: response.data });
        this.getProjectParticipants();
        this.fetchTaskList();
      }
    });
  };

  getProjectParticipants = async () => {
    await ServiceHelper.serviceHandler(
      GET_PROJECT_PARTICIPANTS_SERVICE + "/" + this.state.projectId,
      ServiceHelper.createOptionsJson(null, "GET")
    ).then((response) => {
      if (response && response.isSuccessful) {
        this.setState({ projectParticipants: response.data });
      }
    });
  };

  fetchActivities = async () => {
    await ServiceHelper.serviceHandler(
      GET_PROJECT_WORK_LOGS,
      ServiceHelper.createOptionsJson(
        JSON.stringify({ projectId: this.state.projectId }),
        "POST"
      )
    ).then((response) => {
      if (response && response.isSuccessful) {
        let data = response.data;
        data.reverse();
        this.setState({ projectWorkLogs: data });
      }
    });
  };

  submitTaskForm = async (data) => {
    let date = moment(data.dueDate).format("YYYY-MM-DD");
    let insertObject = {
      projectId: this.state.project.id,
      priority: 0,
      ...data,
      dueDate: date,
    };
    await ServiceHelper.serviceHandler(
      INSERT_TASK_SERVICE,
      ServiceHelper.createOptionsJson(JSON.stringify(insertObject), "POST")
    ).then((response) => {
      if (response && response.isSuccessful) {
        toast("Task Created.", {
          type: "success",
        });
        this.resetTaskForm();
        this.setState({ taskFormVisibility: false });
        this.fetchTaskList();
        this.props.history.push({
          pathname: "/project/" + this.state.projectId,
          state: { activePage: "Board" },
        });
        window.location.reload();
      } else {
        toast(response.message, {
          type: "error",
        });
      }
    });
  };

  createProjectForm = () => {
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
        title={"ADD NEW TASK"}
      />
    );
  };

  onCardDragEnd = async (board, card, source, destination) => {
    let taskObject = {
      id: card.id,
      projectId: card.projectId,
      title: card.title,
      description: card.description,
      assigneeId: card.assigneeId,
      reporterId: card.reporterId,
      priority: card.priority,
      dueDate: card.dueDate,
      createdDate: card.createdDate,
      status: destination.toColumnId,
    };
    await ServiceHelper.serviceHandler(
      UPDATE_TASK_STATUS_SERVICE + "/" + card.id,
      ServiceHelper.createOptionsJson(JSON.stringify(taskObject), "PUT")
    ).then((response) => {
      if (response && response.isSuccessful) {
        toast("Task Updated.", {
          type: "success",
        });

        this.fetchTaskList();
      } else {
        toast(response.message, {
          type: "error",
        });
      }
    });
  };

  getParticipantRoleName = (participant) => {
    var roleName;
    switch (participant.role) {
      case 0:
        roleName = "member";
        break;
      case 1:
        roleName = "owner";
        break;
      case 2:
        roleName = "watcher";
        break;
      default:
        roleName = "unknown";
        break;
    }
    return roleName;
  };

  uploadFile = async () => {
    let files = FileHelper.getFiles();
    await ServiceHelper.serviceHandler(
      UPLOAD_PROJECT_FILE + this.state.projectId,
      ServiceHelper.createOptionsJson(JSON.stringify(files), "POST")
    ).then((response) => {
      if (response && response.isSuccessfull) {
        toast("File Uploaded.", {
          type: "success",
        });
        FileHelper.clearFiles();
        this.setState({ fileUpload: false });
        this.getProjectDetail();
      } else {
        toast(response.message, {
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
              onChange={(event) =>
                this.onFileChange(event, (res) =>
                  this.setState({ base64: res })
                )
              }
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

  createOverview = () => {
    var overview_participants =
      this.state.projectParticipants &&
      this.state.projectParticipants.length > 0
        ? this.state.projectParticipants
        : [];
    var overview_tasks = this.state.boardData;
    var total_tasks = 0;
    if (overview_tasks) {
      for (var i = 0; i < overview_tasks.columns.length; i++) {
        total_tasks += overview_tasks.columns[i].cards.length;
      }
    }
    var to_do_tasks = overview_tasks
      ? overview_tasks.columns[0].cards.length
      : 0;
    var active_tasks = overview_tasks
      ? overview_tasks.columns[1].cards.length
      : 0;
    var resolved_tasks = overview_tasks
      ? overview_tasks.columns[2].cards.length
      : 0;
    var closed_tasks = overview_tasks
      ? overview_tasks.columns[3].cards.length
      : 0;
    const chart_data = [
      { name: "To-Do", value: to_do_tasks },
      {
        name: "Active",
        value: active_tasks,
      },
      {
        name: "Resolved",
        value: resolved_tasks,
      },
      {
        name: "Closed",
        value: closed_tasks,
      },
    ];
    const chart_colors = ["#464a50", "#0275d8", "#9C64B3", "#5cb85c"];

    return (
      <Container className="dark-overview-container">
        <Row className="mt-4 project-detail-row mx-auto">
          <Card className="project-detail-card">
            <Card.Header>About</Card.Header>
            <Card.Body>
              <Card.Text>
                {this.state.project ? this.state.project.description : null}
              </Card.Text>
            </Card.Body>
          </Card>
        </Row>
        <Row className="mt-4 project-detail-row mx-auto">
          <Card className="project-detail-card">
            <Card.Header>Stats</Card.Header>
            <Card.Body>
              <Row>
                <Col md={3}>
                  <PieChart height={225} width={300}>
                    <Pie
                      dataKey="value"
                      nameKey="name"
                      isAnimationActive={false}
                      data={chart_data}
                      outerRadius={80}
                      cx="50%"
                      cy="50%"
                      fill="#8884d8"
                      label
                    >
                      {chart_data.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={chart_colors[index % chart_colors.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </Col>
                <Col md={8}>
                  <Row className="mt-5">
                    <Col md={3} className="text-right">
                      <Row>
                        <Col md={6} className="padding-none">
                          <Badge className="stat-badge" variant="warning">
                            {" "}
                          </Badge>
                        </Col>
                        <Col md={5} className="padding-none ml-1">
                          <div className="stat-number text-left">
                            {total_tasks}
                          </div>
                        </Col>
                        <div className="stat-footer text-center padding-none">
                          Tasks Created
                        </div>
                      </Row>

                      <Row>
                        <Col md={6} className="padding-none">
                          <Badge className="stat-badge" variant="danger">
                            {" "}
                          </Badge>
                        </Col>
                        <Col md={5} className="padding-none ml-1">
                          <div className="stat-number text-left">0</div>
                        </Col>
                        <div className="stat-footer text-center padding-none">
                          Work Logs
                        </div>
                      </Row>
                    </Col>
                    <Col md={3} className="text-left">
                      <Row>
                        <Col md={5} className="padding-none mr-2">
                          <Badge className="stat-badge" variant="success">
                            {" "}
                          </Badge>
                        </Col>
                        <Col md={6} className="padding-none">
                          <div className="stat-number text-left">
                            {overview_tasks
                              ? overview_tasks.columns[3].cards.length
                              : ""}
                          </div>
                        </Col>
                        <div className="stat-footer text-center padding-none mr-2">
                          Tasks Completed
                        </div>
                      </Row>
                      <Row>
                        <Col md={5} className="padding-none mr-2">
                          <Badge className="stat-badge" variant="primary">
                            {" "}
                          </Badge>
                        </Col>
                        <Col md={6} className="padding-none">
                          <div className="stat-number text-left">
                            {overview_tasks
                              ? overview_tasks.columns[1].cards.length
                              : ""}
                          </div>
                        </Col>
                        <div className="stat-footer text-center padding-none mr-2">
                          Active Tasks
                        </div>
                      </Row>
                    </Col>
                    <Col md={6}></Col>
                  </Row>
                </Col>
                <Col md={1}>
                  {/*<Button className="rounded">Project Report</Button>*/}
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Row>
        <Row className="mt-4 project-detail-row mx-auto">
          <Card className="project-detail-card">
            <Card.Header>
              Participants
              <Button className="pull-right">Invite Participant</Button>
            </Card.Header>
            <Card.Body>
              {overview_participants.map((item, key) => {
                var roleName =
                  this.getParticipantRoleName(item).toString() + "";
                return (
                  <div className="project-participant-card ml-3">
                    <OverlayTrigger
                      key={item.id}
                      placement={"top-start"}
                      overlay={
                        <Ttip id={item.id}>
                          {item.roleTitle}
                        </Ttip>
                      }
                    >
                      <Image
                        className={
                          "project-participant-image " + roleName + "-border"
                        }
                        src={
                          item.profileImage
                            ? item.profileImage
                            : "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/1024px-User-avatar.svg.png"
                        }
                      ></Image>
                    </OverlayTrigger>
                    <div className="project-participant-name text-center">
                      {item.firstName}
                    </div>
                    <div className="project-participant-name text-center">
                      {item.lastName}
                    </div>
                  </div>
                );
              })}
            </Card.Body>
          </Card>
        </Row>
        <Row className="mt-4 project-detail-row mx-auto">
          <Card className="project-detail-card">
            <Card.Header>
              Files
              <Button
                className="pull-right"
                onClick={() => this.setState({ fileUpload: true })}
              >
                Upload File
              </Button>
            </Card.Header>
            <Card.Body>
              {this.state.project &&
                this.state.project.files &&
                this.state.project.files.map((item, key) => {
                  return this.renderFile(item);
                })}
            </Card.Body>
          </Card>
        </Row>
        {this.createFileUploadModal()}
      </Container>
    );
  };

  renderFile = (file) => {
    return (
      <div className="file-container">
        <Icon name="file" size="huge" />
        <text className="file-text">{file.name}</text>
        <a href={file.data} download className="file-download">
          <Icon name="download" size="big" />
        </a>
        <Divider />
      </div>
    );
  };

  createBoard = () => {
    return (
      <Container className="dark-overview-container">
        <Row className="mt-2 project-detail-row mx-auto">
          {this.state.userRole !== "Watcher" && (
            <Button
              className="ml-2 new-task"
              variant="dark"
              onClick={() => this.setState({ taskFormVisibility: true })}
            >
              <Badge variant="primary">+</Badge> New
            </Button>
          )}
        </Row>
        <Row className="project-detail-row mx-auto">
          <KanbanBoardView
            boardData={this.state.boardData ? this.state.boardData : []}
            onCardDragEnd={this.onCardDragEnd}
            boardExtractor={(tasks) => this.taskBoardExtractor(tasks)}
            disableCardDrag={this.state.userRole === "Watcher"}
          />
        </Row>
      </Container>
    );
  };

  createTaskList = () => {
    return (
      <Container className="dark-overview-container">
        <Row className="mt-2 project-detail-row mx-auto">
          {this.state.userRole !== "Watcher" && (
            <Button
              className="ml-2 new-task"
              variant="dark"
              onClick={() => this.setState({ taskFormVisibility: true })}
            >
              <Badge variant="primary">+</Badge> New
            </Button>
          )}
        </Row>
        <Row className="project-detail-row mx-auto">
          <TableView
            columns={taskTableColumns}
            tableData={this.state.tableData}
          />
        </Row>
      </Container>
    );
  };

  createActivities = () => {
    return (
      <Container className="dark-overview-container">
        <TableView
          columns={activityTableColumns}
          tableData={this.state.projectWorkLogs}
        />
      </Container>
    );
  };

  createProjectReport = () => {
    return <ReportView projectId={this.state.projectId} />;
  };

  createContent = () => {
    switch (this.state.activePage) {
      case "Board":
        return this.createBoard();
      case "Task List":
        return this.createTaskList();
      case "Activity List":
        return this.createActivities();
      case "Project Report":
        return this.createProjectReport();
      default:
        return this.createOverview();
    }
  };

  taskBoardExtractor = (tasks) => {
    console.log(tasks);
    return {
      columns: [
        {
          id: 0,
          title: "TO-DO",
          cards: tasks.filter((item) => item.status === 0),
        },
        {
          id: 1,
          title: "ACTIVE",
          cards: tasks.filter((item) => item.status === 1),
        },
        {
          id: 2,
          title: "RESOLVED",
          cards: tasks.filter((item) => item.status === 2),
        },
        {
          id: 3,
          title: "CLOSED",
          cards: tasks.filter((item) => item.status === 3),
        },
      ],
    };
  };

  fetchTaskList = async () => {
    let reqBody = {
      projectId: this.state.project
        ? this.state.project.id
        : this.state.projectId,
    };
    await ServiceHelper.serviceHandler(
      GET_TASKS_SERVICE,
      ServiceHelper.createOptionsJson(JSON.stringify(reqBody), "POST")
    ).then((response) => {
      if (response && response.data && response.isSuccessful) {
        let boardData = this.taskBoardExtractor(response.data.tasks);
        this.setState({
          boardData: boardData,
          tableData: response.data.tasks ? response.data.tasks : [],
        });
        this.fetchActivities();
      }
    });
  };

  onMenuItemSelect = (item) => {
    this.setState({ activePage: menuItems[parseInt(item)].title });
  };

  render() {
    return (
      <div>
        <Helmet>
          <title>
            {this.state.project && this.state.project.name
              ? this.state.project.name
              : "Proje Detayı"}
          </title>
        </Helmet>
        <NavbarLogged />
        <Row>
          <Col className="project-detail-left" md={2}>
            <SideBar
              menuItems={menuItems}
              title={
                this.state.project ? this.state.project.name : "Project Detail"
              }
              activePage={this.state.activePage}
              onMenuItemSelect={this.onMenuItemSelect}
            />
          </Col>
          <Col className="project-detail-right" md={10}>
            {this.createContent()}
            {this.createProjectForm()}
          </Col>
        </Row>
      </div>
    );
  }
}

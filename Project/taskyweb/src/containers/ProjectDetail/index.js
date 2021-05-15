import React, { Component } from "react";
import NavbarLogged from "../../components/NavbarLogged";
import SideBar from "../../components/SideBar";
import KanbanBoardView from "../../components/views/KanbanBoardView";
import TableView from "../../components/views/TableView";
import {
  Card,
  Col,
  Row,
  Container,
  Badge,
  Image,
  Button,
} from "react-bootstrap";
import { Tag } from "antd";
import { ServiceHelper, SessionHelper } from "../../util/helpers";
import {
  GET_PROJECT_DETAIL,
  GET_PROJECT_PARTICIPANTS_SERVICE,
  GET_TASKS_SERVICE,
  INSERT_TASK_SERVICE,
  UPDATE_TASK_SERVICE,
} from "../../util/constants/Services";
import CustomModal from "../../components/modals/CustomModal";
import TaskForm from "../../components/forms/TaskForm";
import { toast } from "react-toastify";

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

const columns = [
  {
    title: "Task Title",
    dataIndex: "title",
    key: "title",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Assignee",
    dataIndex: "assigneeFirstName",
    key: "assigneeFirstName",
  },
  {
    title: "Status",
    key: "statusTitle",
    dataIndex: "statusTitle",
    render: (status) => {
      let color;
      if (status === "ToDo") {
        color = "#7ea4b3";
      } else if (status === "Resolved") {
        color = "#fdca96";
      } else if (status === "Closed") {
        color = "#00b300";
      } else {
        color = "#aadd77";
      }
      return (
        <>
          <Tag color={color} key={status}>
            {status.toUpperCase()}
          </Tag>
        </>
      );
    },
  },
];

const data = [
  {
    key: "1",
    title: "John Brown",
    status: "Active",
    assignee: "Oğuz Kaan Yazan",
  },
  {
    key: "2",
    title: "John Brown",
    status: "Active",
    assignee: "Oğuz Kaan Yazan",
  },
  {
    key: "3",
    title: "John Brown",
    status: "Active",
    assignee: "Oğuz Kaan Yazan",
  },
];

const board = {
  columns: [
    {
      id: 1,
      title: "To-Do",
      cards: [
        {
          id: 1,
          title: "Add card",
          description: "Add capability to add a card in a column",
        },
      ],
    },
    {
      id: 2,
      title: "Active",
      cards: [
        {
          id: 2,
          title: "Add card",
          description: "Add capability to add a card in a column",
        },
      ],
    },
    {
      id: 3,
      title: "Resolved",
      cards: [
        {
          id: 3,
          title: "Drag-n-drop support",
          description: "Move a card between the columns",
        },
      ],
    },
    {
      id: 4,
      title: "Done",
      cards: [
        {
          id: 4,
          title: "Drag-n-drop support",
          description: "Move a card between the columns",
        },
      ],
    },
  ],
};

export default class ProjectDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activePage: "Overview",
      taskFormVisibility: false,
      projectId:
        props.match && props.match.params
          ? props.match.params.id.slice(
              props.match.params.id.indexOf("=") + 1,
              props.match.params.id.length
            )
          : null,
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
    this.getProjectDetail();
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
      GET_PROJECT_PARTICIPANTS_SERVICE + "/" + this.state.project.id,
      ServiceHelper.createOptionsJson(null, "GET")
    ).then((response) => {
      if (response && response.isSuccessful) {
        this.setState({ projectParticipants: response.data });
      }
    });
  };

  submitTaskForm = async (data) => {
    let insertObject = {
      projectId: this.state.project.id,
      priority: 0,
      dueDate: this.state.dueDate,
      ...data,
    };
    await ServiceHelper.serviceHandler(
      INSERT_TASK_SERVICE,
      ServiceHelper.createOptionsJson(JSON.stringify(insertObject), "POST")
    ).then((response) => {
      if (response && response.isSuccessful) {
        toast("Task is Created Successfully.", {
          type: "success",
        });
        this.setState({ taskFormVisibility: false });
        this.fetchTaskList();
      } else {
        toast(response.message, {
          type: "error",
        });
      }
    });
  };

  onChangeDueDate = (date) => {
    this.setState({ dueDate: date });
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
              onSubmit={this.submitTaskForm}
              initialValues={null}
              onChangeDueDate={(date) => this.onChangeDueDate(date)}
              dateValue={this.state.dueDate}
              participants={
                this.state.projectParticipants &&
                this.state.projectParticipants.length > 0
                  ? this.state.projectParticipants
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
      UPDATE_TASK_SERVICE + "/" + card.id,
      ServiceHelper.createOptionsJson(JSON.stringify(taskObject), "PUT")
    ).then((response) => {
      if (response && response.isSuccessful) {
        toast("Task is Updated Successfully.", {
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
                <Col md={3}></Col>
                <Col md={8}>
                  <Row>
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
                  <Button
                    className="rounded centered"
                    variant="dark"
                    onClick={() => this.setState({ taskFormVisibility: true })}
                  >
                    Add Task
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Row>
        <Row className="mt-4 project-detail-row mx-auto">
          <Card className="project-detail-card">
            <Card.Header>Participants</Card.Header>
            <Card.Body>
              {overview_participants.map((item, key) => {
                console.log(item);
                return (
                  <div className="project-participant-card ml-3">
                    <Image
                      className="project-participant-image"
                      src={
                        item.profileImage
                          ? item.profileImage
                          : "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/1024px-User-avatar.svg.png"
                      }
                    ></Image>
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
      </Container>
    );
  };

  createBoard = () => {
    return (
      <KanbanBoardView
        boardData={this.state.boardData ? this.state.boardData : []}
        refresh={(refresh) => (this.onKanbanRefresh = refresh)}
        onCardDragEnd={this.onCardDragEnd}
        boardExtractor={(tasks) => this.taskBoardExtractor(tasks)}
      />
    );
  };
  createTaskList = () => {
    return (
      <TableView
        columns={columns}
        dataSource={data}
        tableData={this.state.tableData}
      />
    );
  };
  createActivities = () => {};

  createContent = () => {
    console.log(this.state.activePage);
    switch (this.state.activePage) {
      case "Board":
        return this.createBoard();
      case "Task List":
        return this.createTaskList();
      case "Activity List":
        return this.createActivities();
      default:
        return this.createOverview();
    }
  };

  taskBoardExtractor = (tasks) => {
    return {
      columns: [
        {
          id: 0,
          title: "To-Do",
          cards: tasks.filter((item) => item.status === 0),
        },
        {
          id: 1,
          title: "Active",
          cards: tasks.filter((item) => item.status === 1),
        },
        {
          id: 2,
          title: "Resolved",
          cards: tasks.filter((item) => item.status === 2),
        },
        {
          id: 3,
          title: "Closed",
          cards: tasks.filter((item) => item.status === 3),
        },
      ],
    };
  };

  fetchTaskList = async () => {
    let reqBody = {
      projectId: this.state.project ? this.state.project.id : null,
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
      }
    });
  };

  onMenuItemSelect = (item) => {
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

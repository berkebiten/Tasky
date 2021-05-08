import React, { Component } from "react";
import { Row, Col, Button } from "react-bootstrap";
import NavbarLogged from "../../components/NavbarLogged";
import SideBar from "../../components/SideBar";
import KanbanBoardView from "../../components/views/KanbanBoardView";
import TableView from "../../components/views/TableView";
import { Tag } from "antd";
import { ServiceHelper, SessionHelper } from "../../util/helpers";
import {
  GET_PROJECTS_SERVICE,
  GET_PROJECT_PARTICIPANTS_SERVICE,
  GET_TASKS_SERVICE,
  INSERT_TASK_SERVICE,
  UPDATE_TASK_SERVICE,
} from "../../util/constants/Services";
import { BsSearch, BsPlus } from "react-icons/bs";
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
      if (status === "to-do") {
        color = "volcano";
      } else {
        color = "green";
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
      project:
        this.props.location &&
        this.props.location.state &&
        this.props.location.state.project
          ? this.props.location.state.project
          : null,
    };
    let a = SessionHelper.checkIsSessionLive();
    console.log(a);
    if (!a) {
      props.history.push("/");
    }
  }

  componentDidMount = () => {
    this.initialize();
  };

  initialize = async () => {
    this.getProjectParticipants();
    this.fetchTaskList();
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
        toast("Task is Created Successfuly.", {
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
              onChangeDueDate={(date) => this.setState({ dueDate: date })}
              participants={
                this.state.projectParticipants &&
                this.state.projectParticipants.length > 0
                  ? this.state.projectParticipants
                  : []
              }
            />
          </div>
        }
        title={"CREATE NEW PROJECT"}
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
    }

    await ServiceHelper.serviceHandler(
      UPDATE_TASK_SERVICE + '/' + card.id,
      ServiceHelper.createOptionsJson(JSON.stringify(taskObject), "PUT")
    ).then((response) => {
      if (response && response.isSuccessful) {
        toast("Task is Updated Successfuly.", {
          type: "success",
        });
        this.fetchTaskList()
      } else {
        toast(response.message, {
          type: "error",
        });
      }
    });

  };

  createOverview = () => {
    return (
      <Button
        variant="primary"
        className="mr-sm-2"
        onClick={() => this.setState({ taskFormVisibility: true })}
      >
        <BsPlus />
      </Button>
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
    let reqBody = { projectId: "e1160e77-c729-4907-3fcb-08d90701c3f7" };
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
          <Col md={2}>
            <SideBar
              menuItems={menuItems}
              title={
                this.state.project ? this.state.project.name : "Project Detail"
              }
              activePage={this.state.activePage}
              onMenuItemSelect={this.onMenuItemSelect}
            />
          </Col>
          <Col md={10}>
            {this.createContent()}
            {this.createProjectForm()}
          </Col>
        </Row>
      </div>
    );
  }
}

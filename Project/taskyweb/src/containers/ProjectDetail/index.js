import React, { Component } from "react";
import { Row, Col } from "react-bootstrap";
import NavbarLogged from "../../components/NavbarLogged";
import SideBar from "../../components/SideBar";
import KanbanBoardView from "../../components/views/KanbanBoardView";
import TableView from "../../components/views/TableView";
import { Tag } from "antd";
import { ServiceHelper, SessionHelper } from "../../util/helpers";
import {
  GET_PROJECTS_SERVICE,
  GET_TASKS_SERVICE,
} from "../../util/constants/Services";

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

  onCardDragEnd = (board, card, source, destination) => {
    console.log(board);
  };

  createOverview = () => {};
  createBoard = () => {
    return (
      <KanbanBoardView
        fetchBoardData={() => this.fetchTaskList()}
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
        fetchTableData={() => this.fetchTaskList()}
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
    let data = [];
    let reqBody = { projectId: "e1160e77-c729-4907-3fcb-08d90701c3f7" };
    await ServiceHelper.serviceHandler(
      GET_TASKS_SERVICE,
      ServiceHelper.createOptionsJson(JSON.stringify(reqBody), "POST")
    ).then((response) => {
      if (response && response.data && response.isSuccessful) {
        data = response.data.tasks;
      }
    });
    return data;
  };

  onMenuItemSelect = (item) => {
    this.setState({ activePage: menuItems[parseInt(item)].title });
  };

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
          <Col md={10}>{this.createContent()}</Col>
        </Row>
      </div>
    );
  }
}

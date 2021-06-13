import moment from "moment";
import { Tag, Space } from "antd";
import { Button } from "react-bootstrap";
import { TextHelper } from "../../util/helpers";
export const activityTableColumns = (participants) => {
  if (participants) {
    participants.map((item, key) => {
      item.text = item.fullName;
      item.value = item.fullName;
    });
  }
  return [
    {
      title: "Task Title",
      dataIndex: "taskTitle",
      key: "taskTitle",
      render: (text, record) => {
        let id = record.taskId.toString();
        return <a href={"/task/" + id}>{TextHelper.getSmallText(text, 35)}</a>;
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      render: (text, record) => {
        return TextHelper.getSmallText(text, 35);
      },
    },
    {
      title: "Team Member",
      dataIndex: "memberFullName",
      key: "memberFullName",
      filters: participants,
      onFilter: (value, record) => {
        return record.memberFullName.toLowerCase() === value.toLowerCase();
      },
    },
    {
      title: "Date",
      dataIndex: "createdDate",
      key: "createdDate",
      defaultSortOrder: "descend",
      sorter: (a, b) => a.createdDate > b.createdDate,
      render: (date) => <p>{moment(date).format("DD/MM/YYYY")}</p>,
    },
  ];
};

export const taskTableColumns = (participants) => {
  if (participants) {
    participants.map((item, key) => {
      item.text = item.fullName;
      item.value = item.fullName;
    });
  }
  return [
    {
      title: "Task Title",
      dataIndex: "title",
      key: "title",
      render: (text, record) => {
        let id = record.id.toString();
        return <a href={"/task/" + id}>{TextHelper.getSmallText(text, 35)}</a>;
      },
    },
    {
      title: "Assignee",
      dataIndex: "assigneeFullName",
      key: "assigneeFullName",
      filters: participants,
      onFilter: (value, record) => {
        return record.assigneeFullName.toLowerCase() === value.toLowerCase();
      },
    },
    {
      title: "State",
      key: "statusTitle",
      filters: [
        {
          text: "To-Do",
          value: "todo",
        },
        {
          text: "Active",
          value: "active",
        },
        {
          text: "Resolved",
          value: "resolved",
        },
        {
          text: "Closed",
          value: "closed",
        },
      ],
      onFilter: (value, record) => {
        return record.statusTitle.toLowerCase() === value;
      },
      dataIndex: "statusTitle",
      render: (status) => {
        let color;
        if (status === "ToDo") {
          color = "#464a50";
        } else if (status === "Resolved") {
          color = "#9C64B3";
        } else if (status === "Closed") {
          color = "#5cb85c";
        } else {
          color = "#0275d8";
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
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
      defaultSortOrder: "descend",
      sorter: (a, b) => moment(a.dueDate) > moment(b.dueDate),
      render: (text) => {
        let dateNow = new Date().setHours(0, 0, 0, 0);
        let color;
        if (new Date(text).setHours(0, 0, 0, 0) < dateNow) {
          color = "#ec6f75";
        } else if (new Date(text).setHours(0, 0, 0, 0) === dateNow) {
          color = "#0275d8";
        }
        return (
          <p style={{ color: color }}>{moment(text).format("DD/MM/YYYY")}</p>
        );
      },
    },
  ];
};

export const invitationTableColumns = (accept, decline) => [
  {
    title: "Project Name",
    dataIndex: "projectName",
    key: "projectName",
  },
  {
    title: "Action",
    key: "action",
    render: (text, record) => (
      <Space size="middle">
        <Button
          onClick={() => accept(record.id)}
          style={{ backgroundColor: "green" }}
        >
          Accept
        </Button>
        <Button
          onClick={() => decline(record.id)}
          style={{ backgroundColor: "red" }}
        >
          Decline
        </Button>
      </Space>
    ),
  },
];

export const menuItems = [
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

export const taskBoardExtractor = (tasks) => {
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
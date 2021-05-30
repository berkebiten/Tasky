import moment from "moment";
import { Tag } from "antd";
export const activityTableColumns = [
  {
    title: "Task",
    dataIndex: "taskTitle",
    key: "taskTitle",
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
    ellipsis: true,
  },
  {
    title: "Team Member",
    dataIndex: "memberFullName",
    key: "memberFullName",
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

export const taskTableColumns = [
  {
    title: "Title",
    dataIndex: "title",
    key: "title",
    render: (text, record) => {
      console.log(record.id);
      let id = record.id.toString();
      return <a href={"/task/" + id}>{text}</a>;
    },
  },
  {
    title: "Assignee",
    dataIndex: "assigneeFullName",
    key: "assigneeFullName",
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
      return record.statusTitle.toLowerCase() === value
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
    sorter: (a, b) => a.dueDate > b.dueDate,
    render: (text) => {
      let color;
      if (moment(text).format("DD/MM/YYYY") < moment().format("DD/MM/YYYY")) {
        color = "#ec6f75";
      } else if (
        moment(text).format("DD/MM/YYYY") == moment().format("DD/MM/YYYY")
      ) {
        color = "#0275d8";
      }
      return (
        <p style={{ color: color }}>{moment(text).format("DD/MM/YYYY")}</p>
      );
    },
  },
];

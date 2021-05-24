import moment from 'moment'
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
    render: (date) => <p>{moment(date).format("DD/MM/YYYY")}</p>,
  },
];

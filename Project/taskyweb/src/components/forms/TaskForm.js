import React from "react";
import { withRouter } from "react-router-dom";
import { CustomForm } from "./CustomForms/CustomForm";
function TaskForm(props) {
  const formElements = [
    {
      label: "Task Title",
      control: { type: "text", name: "title" },
    },
    {
      label: "Task Description",
      control: {
        type: "textarea",
        name: "description",
      },
    },
    {
      label: "Due Date",
      control: {
        onChange: (date) => props.onChangeDueDate(date),
        type: "date",
        name: "dueDate",
      },
    },
    {
      label: "Assignee",
      control: {
        type: "picker",
        name: "assigneeId",
        displayKey: "firstName",
        key: "userId",
        options: [
          { userId: -20, firstName: "Please Select an Assignee!" },
          ...props.participants
        ],
      },
    },
    {
      label: "Reporter",
      control: {
        type: "picker",
        name: "reporterId",
        displayKey: "firstName",
        key: "userId",
        options: [
          { userId: -20, firstName: "Please Select an Reporter!" },
          ...props.participants
        ],
      },
    },
  ];

  return (
    <div>
      <CustomForm
        formElements={formElements}
        onSubmit={props.onSubmit}
        initialValues={props.initialValues ? props.initialValues : {}}
        handleSubmit={props.handleSubmit}
        buttonTitle='Save'
      />
    </div>
  );
}
export default withRouter(TaskForm);
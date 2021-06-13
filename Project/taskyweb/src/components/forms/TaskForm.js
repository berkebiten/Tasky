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
        displayKey: "fullName",
        key: "userId",
        options: [
          { userId: -20, fullName: "Please Select an Assignee!" },
          ...props.participants,
        ],
      },
    },
    {
      label: "Reporter",
      control: {
        type: "picker",
        name: "reporterId",
        displayKey: "fullName",
        key: "userId",
        options: [
          { userId: -20, fullName: "Please Select an Reporter!" },
          ...props.participants,
        ],
      },
    },
    {
      label: "Task Files",
      control: {
        type: "file",
        name: "file",
        isHidden: props.hideFilePicker ? props.hideFilePicker : false,
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
        buttonTitle="Save"
        dateValue={props.dateValue ? props.dateValue : null}
        handleReset={props.handleReset ? props.handleReset : null}
      />
    </div>
  );
}
export default withRouter(TaskForm);

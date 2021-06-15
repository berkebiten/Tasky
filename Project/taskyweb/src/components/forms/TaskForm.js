import React from "react";
import { withRouter } from "react-router-dom";
import { CustomForm } from "./CustomForms/CustomForm";
function TaskForm(props) {
  const formElements = [
    {
      label: "Task Title",
      control: { type: "text", name: "title", required: true, maxLen: 50 },
    },
    {
      label: "Task Description",
      control: {
        type: "textarea",
        name: "description",
        required: true,
      },
    },
    {
      label: "Due Date",
      control: {
        onChange: (date) => props.onChangeDueDate(date),
        type: "date",
        name: "dueDate",
        required: true,
      },
    },
    {
      label: "Assignee",
      control: {
        required: true,
        type: "picker",
        name: "assigneeId",
        displayKey: "fullName",
        key: "userId",
        min: 0,
        minMessage: "Please select an assignee!",
        options: [
          { userId: -20, fullName: "Please Select an Assignee!" },
          ...props.participants,
        ],
      },
    },
    {
      label: "Reporter",
      control: {
        required: true,
        type: "picker",
        name: "reporterId",
        displayKey: "fullName",
        key: "userId",
        min: 0,
        minMessage: "Please select a reporter!",
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
        multiple: true,
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

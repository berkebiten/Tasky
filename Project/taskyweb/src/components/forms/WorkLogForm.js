import React from "react";
import { withRouter } from "react-router-dom";
import { CustomForm } from "./CustomForms/CustomForm";
function TaskForm(props) {
  const formElements = [
    {
      label: "Duration",
      control: {
        required:true,
        type: "text",
        name: "duration",
        validation: "\\d[hHmMdD]$",
        validationMessage: "Invalid time duration entered. (eg. 1d 2h 30m)",
      },
    },
    {
      label: "Date",
      control: {
        required:true,
        onChange: (date) => props.onChangeDueDate(date),
        type: "date",
        name: "createdDate",
      },
    },
    {
      label: "Description",
      control: {
        required:true,
        type: "textarea",
        name: "description",
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
        buttonTitle={props.hideButton ? null : "Save"}
        dateValue={props.dateValue ? props.dateValue : null}
        handleReset={props.handleReset ? props.handleReset : null}
      />
    </div>
  );
}
export default withRouter(TaskForm);

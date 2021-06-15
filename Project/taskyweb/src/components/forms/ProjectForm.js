import React from "react";
import { withRouter } from "react-router-dom";
import { CustomForm } from "./CustomForms/CustomForm";
function ProjectForm(props) {
  const formElements = [
    {
      label: "Project Name",
      control: { type: "text", name: "name", required: true },
    },
    {
      label: "Project Description",
      control: {
        type: "textarea",
        name: "description",
        required: true
      },
    },
    {
      label: "Project Files",
      control: {
        type: "file",
        name: "file",
        multiple: true
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
      />
    </div>
  );
}
export default withRouter(ProjectForm);

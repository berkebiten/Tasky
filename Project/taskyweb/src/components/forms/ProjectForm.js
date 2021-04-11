import React from "react";
import { withRouter } from "react-router-dom";
import { CustomForm } from "./CustomForms/CustomForm";
function ProjectForm(props) {
  const formElements = [
    {
      label: "Project Name",
      control: { type: "text", name: "name" },
    },
    {
      label: "Project Description",
      control: {
        type: "textarea",
        name: "description",
        // validation: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        // validationMessage:
        //   "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character",
      },
    },
    {
      label: "Project Files",
      control: { type: "file", name: "file", multiple: false },
    },
  ];

  return (
    <CustomForm
      formElements={formElements}
      onSubmit={props.onSubmit}
      initialValues={props.initialValues ? props.initialValues : {}}
    />
  );
}
export default withRouter(ProjectForm);

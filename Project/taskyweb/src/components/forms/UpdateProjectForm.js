import React from "react";
import { withRouter } from "react-router-dom";
import { CustomForm } from "./CustomForms/CustomForm";

function UpdateProjectForm(props) {
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
          },
        }
      ];

  return (
    <div>
      <CustomForm
        formElements={formElements}
        onSubmit={props.onSubmit}
        initialValues={props.initialValues ? props.initialValues : {}}
        handleSubmit={props.handleSubmit}
        buttonTitle="Save"
        handleReset={props.handleReset ? props.handleReset : null}
      />
    </div>
  );
}
export default withRouter(UpdateProjectForm);

import React from "react";
import { withRouter } from "react-router-dom";
import { CustomForm } from "./CustomForms/CustomForm";
function EditProfileForm(props) {
  const formElements = [
    {
      label: "First Name",
      control: { type: "text", name: "firstName", required:true },
    },
    {
      label: "Last Name",
      control: { type: "text", name: "lastName", required:true },
    },
    {
      label: "Profile Picture",
      control: {
        type: "file",
        name: "profileImage",
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
        handleReset={props.handleReset ? props.handleReset : null}
      />
    </div>
  );
}
export default withRouter(EditProfileForm);

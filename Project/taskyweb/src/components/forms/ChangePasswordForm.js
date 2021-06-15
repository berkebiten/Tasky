import React from "react";
import { withRouter } from "react-router-dom";
import { CustomForm } from "./CustomForms/CustomForm";

function ChangePasswordForm(props) {
  const formElements = [
    {
      label: "Current Password",
      control: { type: "password", name: "currentPassword", required:true },
    },
    {
      label: "New Password",
      control: { type: "password", name: "newPassword", required:true },
    },
    {
      label: "New Password Again",
      control: { type: "password", name: "newPasswordAgain", required:true },
    },
  ];

  return (
    <div>
      <CustomForm
        formElements={formElements}
        onSubmit={props.onSubmit}
        initialValues={props.initialValues ? props.initialValues : {}}
        handleSubmit={props.handleSubmit}
        buttonTitle="Save Password"
        handleReset={props.handleReset ? props.handleReset : null}
      />
    </div>
  );
}
export default withRouter(ChangePasswordForm);

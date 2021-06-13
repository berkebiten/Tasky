import React from "react";
import { withRouter } from "react-router-dom";
import { CustomForm } from "./CustomForms/CustomForm";
function ForgotPasswordForm(props) {
  const formElements = [
    {
      label: "Email",
      control: { type: "text", name: "email" },
    },
  ];

  return (
    <CustomForm
      formElements={formElements}
      onSubmit={props.onSubmit}
      initialValues={props.initialValues ? props.initialValues : {}}
      buttonTitle='Send Email'
    />
  );
}
export default withRouter(ForgotPasswordForm);

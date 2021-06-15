import React from "react";
import { withRouter } from "react-router-dom";
import { CustomForm } from "./CustomForms/CustomForm";
function LoginForm(props) {
  const formElements = [
    {
      label: "Email",
      control: { type: "email", name: "email", required: true },
    },
    {
      label: "Password",
      control: {
        required: true,
        type: "password",
        name: "password",
      },
    },
  ];

  return (
    <CustomForm
      formElements={formElements}
      onSubmit={props.onSubmit}
      initialValues={props.initialValues ? props.initialValues : {}}
      buttonTitle="Login"
    />
  );
}
export default withRouter(LoginForm);

import React from "react";
import { withRouter } from "react-router-dom";
import { CustomForm } from "./CustomForms/CustomForm";
function RegisterForm(props) {
  const formElements = [
    {
      label: "First Name",
      control: { type: "text", name: "firstname", required: true, maxLen: 50 },
    },
    {
      label: "Last Name",
      control: { type: "text", name: "lastname", required: true, maxLen: 50 },
    },
    {
      label: "Email",
      control: { type: "email", name: "email", required: true, maxLen: 50 },
    },
    {
      label: "Password",
      control: {
        required: true,
        type: "password",
        name: "password",
        validation:
          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        validationMessage:
          "Password Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character",
      },
    },
  ];

  return (
    <CustomForm
      formElements={formElements}
      onSubmit={props.onSubmit}
      initialValues={props.initialValues ? props.initialValues : {}}
      buttonTitle="Register"
    />
  );
}
export default withRouter(RegisterForm);

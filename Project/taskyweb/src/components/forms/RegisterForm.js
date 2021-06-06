import React from "react";
import { withRouter } from "react-router-dom";
import { CustomForm } from "./CustomForms/CustomForm";
function RegisterForm(props) {
  const formElements = [
    {
      label: "First Name",
      control: { type: "text", name: "firstname" },
    },
    {
      label: "Last Name",
      control: { type: "text", name: "lastname" },
    },
    {
      label: "Email",
      control: { type: "email", name: "email" },
    },
    {
      label: "Password",
      control: {
        type: "password",
        name: "password",
        validation: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
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

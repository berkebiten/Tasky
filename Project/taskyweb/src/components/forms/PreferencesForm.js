import React from "react";
import { withRouter } from "react-router-dom";
import { CustomForm } from "./CustomForms/CustomForm";

function PreferencesForm(props) {
  const formElements = [
    {
      label: "Notifications",
      control: { type: "checkbox", name: "allowNotification" },
    },
    {
      label: "Emails",
      control: { type: "checkbox", name: "allowEmail" },
    },
  ];

  return (
    <div className="justify-content-center">
      <CustomForm
        className="pf"
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
export default withRouter(PreferencesForm);

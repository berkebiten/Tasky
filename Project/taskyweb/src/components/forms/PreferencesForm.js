import React from "react";
import { withRouter } from "react-router-dom";
import { CustomForm } from "./CustomForms/CustomForm";

function PreferencesForm(props) {
  const formElements = [
    {
      label: "Allow Notifications",
      control: { type: "checkbox", name: "allowNotification" },
    },
    {
      label: "Allow Emails",
      control: { type: "checkbox", name: "allowEmail" },
    },
  ];

  return (
    <div>
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

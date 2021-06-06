import React, { Component } from "react";
import NavbarLogged from "../../components/NavbarLogged";
import { ServiceHelper, SessionHelper } from "../../util/helpers";
import { Helmet } from "react-helmet";
import { GET_ACTIVITY_STREAM } from "../../util/constants/Services";
import { activityTableColumns } from "../../util/constants/Constants";
import {
  CHANGE_PASSWORD_SERVICE,
  UPDATE_USER_SERVICE,
} from "../../util/constants/Services";
import { toast } from "react-toastify";
import ChangePasswordForm from "../../components/forms/ChangePasswordForm";
import PreferencesForm from "../../components/forms/PreferencesForm";
import { Col, Row } from "react-bootstrap";
import Image from "react-bootstrap/Image";
import logoDark from "../../res/images/tasky-logo-dark.png";

export default class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = { user: SessionHelper.loadUser() };
    let a = SessionHelper.checkIsSessionLive();
    if (!a) {
      props.history.push("/");
    }
  }

  savePreferences = async (data) => {
    let newUser = this.state.user;
    newUser.sendEmail = data.allowEmail;
    newUser.sendNotification = data.allowNotification;
    await ServiceHelper.serviceHandler(
      UPDATE_USER_SERVICE + this.state.user.id,
      ServiceHelper.createOptionsJson(JSON.stringify(newUser), "PUT")
    ).then((response) => {
      if (response && response.isSuccessful) {
        toast("Your preferences has been updated.", {
          type: "success",
        });
        this.setState({ user: SessionHelper.loadUser() });
      } else {
        toast(response.message, {
          type: "error",
        });
      }
    });
  };

  changePassword = async (data) => {
    let currentPassword = data.currentPassword;
    let newPassword = data.newPassword;
    let newPasswordAgain = data.newPasswordAgain;

    if (newPassword === newPasswordAgain) {
      let model = { oldPassword: currentPassword, newPassword: newPassword };
      console.log(model);
      await ServiceHelper.serviceHandler(
        CHANGE_PASSWORD_SERVICE + this.state.user.id,
        ServiceHelper.createOptionsJson(JSON.stringify(model), "PUT")
      ).then((response) => {
        if (response && response.isSuccessful) {
          toast(
            "Your password has been updated. An acknowledgment e-mail has been sent.",
            {
              type: "success",
            }
          );
          this.setState({ user: SessionHelper.loadUser() });
        } else {
          toast(response.message, {
            type: "error",
          });
        }
      });
    } else {
      toast("New Password entries does not match.", {
        type: "error",
      });
    }
  };

  render() {
    return (
      <div>
        <Helmet>
          <title>{"Settings"}</title>
        </Helmet>
        <NavbarLogged />
        <div className="auth-wrapper">
          <div className="auth-inner mt-5">
            <Row>
              <Col xs={6} md={3} />
              <Col xs={6} md={6}>
                <Image src={logoDark} width="100%" className="mb-5" />
              </Col>
              <Col xs={6} md={3} />
            </Row>
            <PreferencesForm
              onSubmit={this.savePreferences}
              initialValues={{
                allowNotification: this.state.user.sendNotification,
                allowEmail: this.state.user.sendEmail,
              }}
            />
            <ChangePasswordForm
              onSubmit={this.changePassword}
              initialValues={null}
            />
          </div>
        </div>
      </div>
    );
  }
}

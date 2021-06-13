import React, { Component } from "react";
import {
  RootViewHelper,
  ServiceHelper,
  SessionHelper,
} from "../../util/helpers";
import { LOGIN_SERVICE, RESET_PASSWORD_MAIL } from "../../util/constants/Services";
import { toast } from "react-toastify";
import Navbar from "../../components/Navbar";
import LoginForm from "../../components/forms/LoginForm";
import { Col, Row } from "react-bootstrap";
import Image from "react-bootstrap/Image";
import logoDark from "../../res/images/tasky-logo-dark.png";
import { Helmet } from "react-helmet";
import CustomModal from "../../components/modals/CustomModal";
import ForgotPasswordForm from "../../components/forms/ForgotPasswordForm";
export default class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      forgotPsw: false,
    };
    let a = SessionHelper.checkIsSessionLive();
    if (a) {
      props.history.push("/projects");
    }
  }

  forgotPassword = async (data) => {
    await ServiceHelper.serviceHandler(
      RESET_PASSWORD_MAIL + data.email,
      ServiceHelper.createOptionsJson(null, "PUT")
    ).then((response) => {
      if (response && response.isSuccessfull) {
        this.setState({ forgotPsw: false });
        toast("Reset Password Mail Sent.", {
          type: "success",
        });
      } else {
        this.setState({ forgotPsw: false });
        toast(response ? response.message : "", {
          type: "error",
        });
      }
    });
  };

  createForgotPasswordModal = () => {
    return (
      <CustomModal
        title="Forgot Password"
        isVisible={this.state.forgotPsw}
        onClose={() => this.setState({ forgotPsw: false })}
        content={
          <ForgotPasswordForm
            onSubmit={this.forgotPassword}
            initialValues={null}
          />
        }
      />
    );
  };

  signIn = async (data) => {
    let loginObject = {
      email: data.email,
      password: data.password,
    };
    await ServiceHelper.serviceHandler(
      LOGIN_SERVICE,
      ServiceHelper.createOptionsJson(JSON.stringify(loginObject), "POST")
    ).then((response) => {
      if (response && response.isSuccessful) {
        ServiceHelper.setToken(response.data.token);
        toast("Login is Successful", {
          type: "success",
        });
        SessionHelper.saveUser(response.data.user);
        this.props.history.push("/projects");
      } else {
        toast(response.message, {
          type: "error",
        });
      }
    });
    RootViewHelper.stopLoading();
  };

  render() {
    return (
      <div>
        <Helmet>
          <title>{"Login"}</title>
        </Helmet>
        <Navbar />
        <div className="auth-wrapper">
          <div className="auth-inner mt-5">
            <Row>
              <Col xs={6} md={3} />
              <Col xs={6} md={6}>
                <Image src={logoDark} width="100%" className="mb-5" />
              </Col>
              <Col xs={6} md={3} />
            </Row>
            <LoginForm onSubmit={this.signIn} initialValues={null} />
            {this.state.forgotPsw && this.createForgotPasswordModal()}
            <Row>
              <Col md={5}>
                <p className="forgot-password text-left">
                  <a onClick={() => this.setState({ forgotPsw: true })}>
                    Forgot Password
                  </a>
                </p>
              </Col>
              <Col md={7}>
                <p className="forgot-password text-left">
                  Don't have an account? <a href="sign-up">Register</a>
                </p>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    );
  }
}

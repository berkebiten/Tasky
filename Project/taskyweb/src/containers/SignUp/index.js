import React, { Component } from "react";
import {
  RootViewHelper,
  ServiceHelper,
  SessionHelper,
} from "../../util/helpers";
import { REGISTER_SERVICE } from "../../util/constants/Services";
import Navbar from "../../components/Navbar";
import RegisterForm from "../../components/forms/RegisterForm";
import { toast } from "react-toastify";
import { Col, Row } from "react-bootstrap";
import Image from "react-bootstrap/Image";
import logo from "../../res/images/tasky-logo-1920.png";
import logoDark from "../../res/images/tasky-logo-dark.png";
import { Helmet } from "react-helmet";

export default class SignUp extends Component {
  constructor(props) {
    super(props);
    let a = SessionHelper.checkIsSessionLive();
    if (a) {
      props.history.push("/projects");
    }
  }
  signUp = async (data) => {
    let registerObject = {
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email,
      password: data.password,
    };
    await ServiceHelper.serviceHandler(
      REGISTER_SERVICE,
      ServiceHelper.createOptionsJson(JSON.stringify(registerObject), "POST")
    ).then((response) => {
      if (response && response.isSuccessful) {
        toast("Registration is Successful", { type: "success" });
        this.props.history.push("/sign-in");
      } else {
        toast(response.message, { type: "error" });
      }
    });
    // RootViewHelper.stopLoading()
  };
  render() {
    return (
      <div>
        <Helmet>
          <title>{"Register"}</title>
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
            <RegisterForm onSubmit={this.signUp} initialValues={null} />
            <p className="forgot-password text-right">
              Already registered? <a href="sign-in">Login</a>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

import React, { Component } from "react";
import {
  RootViewHelper,
  ServiceHelper,
  SessionHelper,
} from "../../util/helpers";
import { LOGIN_SERVICE } from "../../util/constants/Services";
import { toast } from "react-toastify";
import Navbar from "../../components/Navbar";
import LoginForm from "../../components/forms/LoginForm";
import { Col, Row } from "react-bootstrap";
import Image from "react-bootstrap/Image";
import logo from "../../res/images/tasky-logo.png";
import {Helmet} from 'react-helmet'
export default class SignIn extends Component {
  constructor(props) {
    super(props);
    let a = SessionHelper.checkIsSessionLive();
    if (a) {
      props.history.push("/projects");
    }
  }
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
              <Col xs={6} md={2} />
              <Col xs={6} md={8}>
                <Image src={logo} width="100%" className="mb-5" />
              </Col>
              <Col xs={6} md={2} />
            </Row>
            <LoginForm onSubmit={this.signIn} initialValues={null} />
          </div>
        </div>
      </div>
    );
  }
}

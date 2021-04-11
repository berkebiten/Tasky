import React, { Component } from "react";
import { ServiceHelper } from "../../util/helpers";
import { LOGIN_SERVICE } from "../../util/constants/Services";
import { toast } from "react-toastify";
import Navbar from "../../components/Navbar";
import LoginForm from "../../components/forms/LoginForm";
import { Col, Row } from "react-bootstrap";
import Image from "react-bootstrap/Image";
import logo from "../../res/images/tasky-logo.png";
export default class SignIn extends Component {
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
        toast("Login is Successful", { type: "success", position: toast.POSITION.BOTTOM_RIGHT });
        this.props.history.push("/projects");
      } else {
        toast(response.message, { type: "error" , position: toast.POSITION.BOTTOM_RIGHT});
      }
    });
  };

  render() {
    return (
      <div>
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

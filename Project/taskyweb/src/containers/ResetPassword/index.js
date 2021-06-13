import React, { Component } from "react";
import { Helmet } from "react-helmet";
import { RESET_PASSWORD } from "../../util/constants/Services";
import { ServiceHelper } from "../../util/helpers";
import Navbar from "../../components/Navbar";
import {Row, Col, Image} from 'react-bootstrap'
import { toast } from "react-toastify";
import ResetPasswordForm from '../../components/forms/ResetPasswordForm'
import logoDark from "../../res/images/tasky-logo-dark.png";
export default class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email:
        props.match && props.match.params
          ? props.match.params.email.slice(
              props.match.params.email.indexOf("=") + 1,
              props.match.params.email.length
            )
          : null,
    };
  }

  resetPassword = async (data) => {
    let body = {
      ...data,
      email: this.state.email,
    };
    await ServiceHelper.serviceHandler(
      RESET_PASSWORD,
      ServiceHelper.createOptionsJson(JSON.stringify(body), "PUT")
    ).then((response) => {
      if (response && response.isSuccessful) {
        toast("Your password has reset.", {
          type: "success",
        });
        this.props.history.push('/sign-in')
      } else {
        toast(response ? response.message : "", {
          type: "error",
        });
      }
    });
  };

  render() {
    return (
      <div>
        <Helmet>
          <title>{"Reset Password"}</title>
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
            <ResetPasswordForm
              onSubmit={this.resetPassword}
              initialValues={null}
            />
          </div>
        </div>
      </div>
    );
  }
}

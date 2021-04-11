import React, { Component } from "react";
import { ServiceHelper } from "../../util/helpers";
import { LOGIN_SERVICE } from "../../util/constants/Services";
import { toast } from "react-toastify";
import Navbar from "../../components/Navbar";
import LoginForm from "../../components/forms/LoginForm";
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
        toast("Login is Successful", { type: "success" });
        this.props.history.push("/projects");
      } else {
        toast(response.message, { type: "error" });
      }
    });
  };

  render() {
    return (
      <div>
        <Navbar />
        <div className="auth-wrapper">
          <div className="auth-inner">
            <h3>Login</h3>
            <LoginForm onSubmit={this.signIn} initialValues={null} />
            <div className="form-group">
              <div className="custom-control custom-checkbox">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id="customCheck1"
                />
                {/* <label className="custom-control-label" htmlFor="customCheck1">
                  Remember me
                </label> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

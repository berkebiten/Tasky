import React, { Component } from "react";
import { ServiceHelper } from "../../util/helpers";
import { REGISTER_SERVICE } from "../../util/constants/Services";
import Navbar from "../../components/Navbar";
import RegisterForm from "../../components/forms/RegisterForm";
import { toast } from "react-toastify";

export default class SignUp extends Component {
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
  };
  render() {
    return (
      <div>
        <Navbar />
        <div className="auth-wrapper">
          <div className="auth-inner">
            <h3>Register</h3>
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

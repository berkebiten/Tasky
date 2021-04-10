import React, { Component } from "react";
import { ServiceHelper } from "../../util/helpers";
import { REGISTER_SERVICE } from "../../util/constants/Services";
import Navbar from "../../components/Navbar";

export default class SignUp extends Component {
  signUp = async () => {
    let registerObject = {
      firstname: this.state.firstname,
      lastname: this.state.lastname,
      email: this.state.email,
      password: this.state.password,
    };
    await ServiceHelper.serviceHandler(
      REGISTER_SERVICE,
      ServiceHelper.createOptionsJson(JSON.stringify(registerObject), "POST")
    ).then((response) => {
      if (response && response.isSuccessful) {
        this.props.history.push("/sign-in");
      } else {
        console.log("başarısız");
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

            <div className="form-group">
              <label className="form-label">First Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="First name"
                onChange={(event) =>
                  this.setState({
                    firstname: event.target.value,
                  })
                }
              />
            </div>

            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Last name"
                onChange={(event) =>
                  this.setState({
                    lastname: event.target.value,
                  })
                }
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email address</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter email"
                onChange={(event) =>
                  this.setState({
                    email: event.target.value,
                  })
                }
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter password"
                onChange={(event) =>
                  this.setState({
                    password: event.target.value,
                  })
                }
              />
            </div>

            <button
              type="submit"
              onClick={this.signUp}
              className="btn btn-dark btn-block"
            >
              Register
            </button>
            <p className="forgot-password text-right">
              Already registered? <a href="sign-in">Login</a>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

import React, { Component } from "react";
import { ServiceHelper } from "../../util/helpers";
import { LOGIN_SERVICE } from "../../util/constants/Services";
import { Navbar as NB, Nav, Form, FormControl, Button } from "react-bootstrap";
import Navbar from "../../components/Navbar";
export default class SignIn extends Component {
  signIn = async () => {
    let loginObject = {
      email: this.state.email,
      password: this.state.password,
    };
    await ServiceHelper.serviceHandler(
      LOGIN_SERVICE,
      ServiceHelper.createOptionsJson(JSON.stringify(loginObject), "POST")
    ).then((response) => {
      if (response && response.isSuccessful) {
        this.props.history.push("/projects");
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
            
            
            <h3>Login</h3>

             <div className="form-group">
              <label className="form-label">Email address</label>
              <input
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

            <div className="form-group">
              <div className="custom-control custom-checkbox">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id="customCheck1"
                />
                <label className="custom-control-label" htmlFor="customCheck1">
                  Remember me
                </label>
              </div>
            </div>

            <button
              type="submit"
              onClick={this.signIn}
              className="btn btn-dark btn-block"
            >
              Login
            </button> 
          </div>
        </div>
      </div>
    );
  }
}

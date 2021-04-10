import React, { Component } from "react";
import { ServiceHelper } from "../../util/helpers";
import { LOGIN_SERVICE } from "../../util/constants/Services";
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
        this.props.history.push("/sign-up");
      } else {
        console.log("başarısız");
      }
    });
  };

  render() {
    return (
      <div>
        <h3>Sign In</h3>

        <div className="form-group">
          <label>Email address</label>
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
          <label>Password</label>
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
          className="btn btn-primary btn-block"
        >
          Submit
        </button>
      </div>
    );
  }
}

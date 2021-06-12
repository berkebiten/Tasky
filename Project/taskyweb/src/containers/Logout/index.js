import React, { Component } from "react";
import { Helmet } from "react-helmet";
import { SessionHelper } from "../../util/helpers";

export default class Logout extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.logout();
  }

  logout = () => {
    SessionHelper.removeUser();
    this.props.history.push("/sign-in");
  };

  render() {
    return (
      <div>
        <Helmet>
          <title>{"Logout"}</title>
        </Helmet>
      </div>
    );
  }
}

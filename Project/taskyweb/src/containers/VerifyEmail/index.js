import React, { Component } from "react";
import { Helmet } from "react-helmet";
import { VERIFY_EMAIL } from "../../util/constants/Services";
import { ServiceHelper } from "../../util/helpers";
export default class VerifyEmail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId:
        props.match && props.match.params
          ? props.match.params.userId.slice(
              props.match.params.userId.indexOf("=") + 1,
              props.match.params.userId.length
            )
          : null,
    };
  }

  componentDidMount() {
    this.verifyEmail();
  }

  verifyEmail = async () => {
    await ServiceHelper.serviceHandler(
      VERIFY_EMAIL + this.state.userId,
      ServiceHelper.createOptionsJson(null, "POST")
    ).then((response) => {
      this.props.history.push("/sign-in");
    });
  };

  render() {
    return (
      <div>
        <Helmet>
          <title>{"Verify Email"}</title>
        </Helmet>
      </div>
    );
  }
}

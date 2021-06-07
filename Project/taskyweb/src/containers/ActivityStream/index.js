import React, { Component } from "react";
import NavbarLogged from "../../components/NavbarLogged";
import { Container } from "react-bootstrap";
import { ServiceHelper, SessionHelper } from "../../util/helpers";
import { Helmet } from "react-helmet";
import { GET_ACTIVITY_STREAM } from "../../util/constants/Services";
import { activityTableColumns } from "../../util/constants/Constants";
import TableView from "../../components/views/TableView";

export default class ActivityStream extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    if (!SessionHelper.checkIsSessionLive()) {
      props.history.push("/");
    }
  }

  componentDidMount = () => {
    this.initialize();
  };

  initialize = () => {
    this.getActivities();
  };

  getActivities = async () => {
    await ServiceHelper.serviceHandler(
      GET_ACTIVITY_STREAM,
      ServiceHelper.createOptionsJson(null, "GET")
    ).then((response) => {
      let update = {};
      if (response && response.data && response.isSuccessful) {
        update.activities = response.data;
        this.setState(update);
      }
    });
  };

  createActivityStream = () => {
    return (
      <TableView
        columns={activityTableColumns()}
        tableData={this.state.activities}
        loading={!this.state.activities}
      />
    );
  };

  render() {
    return (
      <div>
        <Helmet>
          <title>{"Activity Stream"}</title>
        </Helmet>
        <NavbarLogged />
        <div className="auth-wrapper">
          <Container>{this.createActivityStream()}</Container>
        </div>
      </div>
    );
  }
}

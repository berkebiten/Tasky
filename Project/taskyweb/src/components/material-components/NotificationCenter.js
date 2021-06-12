import React, { Component } from "react";
import { Avatar, Dropdown } from "rsuite";
import { withRouter } from "react-router-dom";
import {
  GET_NEW_NOTIFICATIONS,
  SET_READ_NOTIFICATION,
} from "../../util/constants/Services";
import { RootViewHelper, ServiceHelper } from "../../util/helpers";
import { Card, Col, Row, Container, Badge, Button } from "react-bootstrap";
import NotificationsIcon from "@material-ui/icons/Notifications";
import SyncIcon from "@material-ui/icons/Sync";
import moment from "moment";
import { toast } from "react-toastify";

class NotificationCenter extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = () => {
    this.initialize();
  };

  initialize = () => {
    this.fetchNewNotifications();
  };

  fetchNewNotifications = async () => {
    await ServiceHelper.serviceHandler(
      GET_NEW_NOTIFICATIONS,
      ServiceHelper.createOptionsJson(null, "GET")
    ).then((response) => {
      if (response && response.data) {
        this.setState({ notifications: response.data });
      }
    });
    RootViewHelper.stopLoading();
  };

  onItemClick = (item) => {
    this.setRead(item);
    if (item.webUrl) this.props.history.push(item.webUrl);
  };

  setRead = async (item) => {
    await ServiceHelper.serviceHandler(
      SET_READ_NOTIFICATION + item.id,
      ServiceHelper.createOptionsJson(null, "PUT")
    ).then((response) => {
      if (response) {
        this.fetchNewNotifications();
      } else {
        toast(response.message, {
          type: "error",
        });
      }
    });
  };

  render() {
    return (
      <Dropdown
        placement="bottomEnd"
        className="mr-sm-2 "
        trigger="hover"
        W
        noCaret
        icon={
          <div className="notifications-wrapper">
            <NotificationsIcon />
            {this.state.notifications && this.state.notifications.length > 0 ? (
              <Badge className="not-count" variant="primary">
                {this.state.notifications.length}
              </Badge>
            ) : null}
          </div>
        }
      >
        <div className="not-container justify-content-center">
          <Row className="justify-content-center mb-1">
              <Button size="sm" variant="dark" onClick={() => this.fetchNewNotifications()}><SyncIcon /></Button>
          </Row>
          <Row className="mb-2">
            <Col md={12}>
              <h4>Notifications</h4>
            </Col>
          </Row>

          {this.state.notifications && this.state.notifications.length > 0 ? (
            this.state.notifications.map((item) => {
              return (
                <Card
                  bg="dark"
                  text="light"
                  onClick={() => this.onItemClick(item)}
                  className="notification-card mb-2 clickable"
                >
                  <Card.Body>
                    <Card.Title>{item.title}</Card.Title>
                    <Card.Text>{item.body}</Card.Text>
                    <Card.Text className="not-date">
                      {moment(item.regDate).format("DD/MM/YYYY HH:mm")}
                    </Card.Text>
                  </Card.Body>
                </Card>
              );
            })
          ) : (
            <>
              <p>No Unread Notifications</p>
              <a href="/notifications">View Past Notifications</a>
            </>
          )}
          {this.state.notifications && this.state.notifications.length > 0 ? (
            <a href="/notifications">View All Notifications</a>
          ) : null}
        </div>
      </Dropdown>
    );
  }
}
export default withRouter(NotificationCenter);

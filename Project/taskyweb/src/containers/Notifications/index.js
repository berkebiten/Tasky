import React, { Component } from "react";
import NavbarLogged from "../../components/NavbarLogged";
import { Helmet } from "react-helmet";
import { Avatar, Dropdown } from "rsuite";
import {
  GET_NOTIFICATIONS,
  SET_READ_NOTIFICATION,
} from "../../util/constants/Services";
import { RootViewHelper, ServiceHelper } from "../../util/helpers";
import { Card, Col, Row, Container, Badge, Button } from "react-bootstrap";
import NotificationsIcon from "@material-ui/icons/Notifications";
import SyncIcon from "@material-ui/icons/Sync";
import moment from "moment";
import { toast } from "react-toastify";

export default class Notifications extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = () => {
    this.initialize();
  };

  initialize = () => {
    this.fetchNotifications();
  };

  fetchNotifications = async () => {
    await ServiceHelper.serviceHandler(
      GET_NOTIFICATIONS,
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
        this.fetchNotifications();
      } else {
        toast(response.message, {
          type: "error",
        });
      }
    });
  };

  render() {
    return (
      <>
        <Helmet>
          <title>{"Notifications"}</title>
        </Helmet>
        <NavbarLogged />
        <div className="auth-wrapper-notifications">
          <Container>
            <Row className="justify-content-center mt-5">
              <Button
                size="sm"
                variant="dark"
                onClick={() => this.fetchNotifications()}
              >
                <SyncIcon />
              </Button>
            </Row>
            <Row className="mt-2">
              <h1 class="text-dark mx-auto">NOTIFICATIONS</h1>
            </Row>
            <Row className="notifications-container justify-content-center">
              <div className="scroller">
                {this.state.notifications &&
                this.state.notifications.length > 0 ? (
                  this.state.notifications.map((item) => {
                    let c = item.isRead ? "read" : "unread";
                    return (
                      <Col md={12}>
                        <Card
                          onClick={() => this.onItemClick(item)}
                          className={"mb-2 clickable notification-card-2 " + c}
                        >
                          <Card.Body>
                            <Card.Title>{item.title}</Card.Title>
                            <Card.Text>{item.body}</Card.Text>
                            <Card.Text className="not-date">
                              {moment(item.regDate).format("DD/MM/YYYY HH:mm")}
                            </Card.Text>
                          </Card.Body>
                        </Card>
                      </Col>
                    );
                  })
                ) : (
                  <>
                    <p>No Unread Notifications</p>
                  </>
                )}
              </div>
            </Row>
          </Container>
        </div>
      </>
    );
  }
}

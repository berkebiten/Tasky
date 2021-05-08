import React, { Component } from "react";
import NavbarLogged from "../../components/NavbarLogged";
import {
  Card,
  Col,
  Row,
  Container,
  Badge,
  Form,
  FormControl,
  Button,
  InputGroup,
} from "react-bootstrap";
import { FiEdit2, FiSettings } from "react-icons/fi";
import {
  RootViewHelper,
  ServiceHelper,
  SessionHelper,
} from "../../util/helpers";
import { GET_PROFILE_SERVICE } from "../../util/constants/Services";
export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user : ""
    };
    if (!SessionHelper.checkIsSessionLive()) {
      props.history.push("/");
    }
  }

  componentDidMount = () => {
    this.initialize();
  };

  initialize = () => {
    this.getProfile();
  };

  getProfile = async () => {
    await ServiceHelper.serviceHandler(
      GET_PROFILE_SERVICE,
      ServiceHelper.createOptionsJson(null, "GET")
    ).then((response) => {
      let update = {};
      if (response && response.data && response.isSuccessful) {
        update.user = response.data.user;
        this.setState({ user: update.user });
      }
    });
    RootViewHelper.stopLoading();
  };

  render() {
    return (
      <div>
        <NavbarLogged />
        <div className="auth-wrapper">
          <Container>
            <Col className="mx-auto">
              <Row className="mx-auto mt-4">
                <Card
                  className="tasky-profile-card"
                  bg="dark"
                  text="light"
                  style={{ width: "25%" }}
                >
                  <Card.Img
                    className="tasky-profile-image"
                    variant="top"
                    src="https://avatars2.githubusercontent.com/u/12592949?s=460&v=4"
                    size="small"
                  />
                  <Card.Body className="mt-2">
                    <Card.Title>
                      {this.state.user.firstName + " " + this.state.user.lastName}
                    </Card.Title>
                    <Card.Text>{this.state.user.email}</Card.Text>
                    <Card.Text>
                      {"Member since: " + this.state.user.registrationDate}
                    </Card.Text>
                  </Card.Body>
                </Card>
                <Container
                  className="dark-profile-container"
                  style={{ width: "75%" }}
                >
                  <Row className="mt-2 ml-1 mr-1">
                    <Col md={10}></Col>
                    <Col md={2}>
                      <a className="ml-5" href="/edit-profile">
                        <Badge pill variant="secondary">
                          <FiEdit2></FiEdit2>
                        </Badge>
                      </a>
                      <a className="ml-1" href="/settings">
                        <Badge pill variant="secondary">
                          <FiSettings></FiSettings>
                        </Badge>
                      </a>
                    </Col>
                  </Row>
                  <Row className="mt-2 ml-1 mr-1">
                    <Col md={2.5} className="tasky-profile-stat-col">
                      <Card text="light" className="tasky-profile-stat-card">
                        <Card.Body>
                          <Card.Header className="t-bg-primary">
                            Active
                          </Card.Header>
                          <Card.Text className="mt-2">
                            Tasks{" "}
                            <Badge pill variant="primary">
                              5
                            </Badge>
                          </Card.Text>
                          <Card.Text>
                            Projects{" "}
                            <Badge pill variant="primary">
                              7
                            </Badge>
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={2.5} className="tasky-profile-stat-col">
                      <Card text="light" className="tasky-profile-stat-card">
                        <Card.Body>
                          <Card.Header className="t-bg-success">
                            Completed
                          </Card.Header>
                          <Card.Text className="mt-2">
                            Tasks{" "}
                            <Badge pill variant="success">
                              15
                            </Badge>
                          </Card.Text>
                          <Card.Text>
                            Projects{" "}
                            <Badge pill variant="success">
                              1
                            </Badge>
                          </Card.Text>
                          <Card.Text>
                            Work Logs{" "}
                            <Badge pill variant="success">
                              19
                            </Badge>
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col className="tasky-profile-stat-col">
                      <Card text="light" className="tasky-profile-stat-card">
                        <Card.Body>
                          <Card.Header className="t-bg-orange">
                            Recent Projects
                          </Card.Header>
                          <Row className="mt-3">
                            <Col>
                              <Card
                                bg="dark"
                                text="light"
                                className="tasky-profile-stat-card"
                              >
                                <Card.Body>Project1</Card.Body>
                              </Card>
                            </Col>
                            <Col>
                              <Card
                                bg="dark"
                                text="light"
                                className="tasky-profile-stat-card"
                              >
                                <Card.Body>Project2</Card.Body>
                              </Card>
                            </Col>
                            <Col>
                              <Card
                                bg="dark"
                                text="light"
                                className="tasky-profile-stat-card"
                              >
                                <Card.Body>Project3</Card.Body>
                              </Card>
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Container>
              </Row>
            </Col>
          </Container>
        </div>
      </div>
    );
  }
}
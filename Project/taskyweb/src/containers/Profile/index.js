import React, { Component } from "react";
import NavbarLogged from "../../components/NavbarLogged";
import { Card, Col, Row, Container, Badge } from "react-bootstrap";
import { FiEdit2, FiSettings } from "react-icons/fi";
import { Helmet } from "react-helmet";
import {
  RootViewHelper,
  ServiceHelper,
  SessionHelper,
} from "../../util/helpers";
import { GET_PROFILE_SERVICE } from "../../util/constants/Services";
import moment from "moment";
export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: props.location.state ? props.location.state.user : null,
      userId:
        props.match && props.match.params
          ? props.match.params.id.slice(
              props.match.params.id.indexOf("=") + 1,
              props.match.params.id.length
            )
          : null,
    };
    let a =SessionHelper.checkIsSessionLive();
    if (!a) {
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
      GET_PROFILE_SERVICE + this.state.userId,
      ServiceHelper.createOptionsJson(null, "GET")
    ).then((response) => {
      if (response && response.isSuccessful  && response.data) {
        console.log(response.data);
        this.setState({ user: response.data.user, stats: response.data.stats, recentProjects:response.data.recentProjects });
      }
    });
  };

  render() {
    return (
      <div>
        <Helmet>
          <title>{"Profile"}</title>
        </Helmet>
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
                    src={
                      this.state.user && this.state.user.profileImage
                        ? this.state.user.profileImage
                        : "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/1024px-User-avatar.svg.png"
                    }
                    size="small"
                  />
                  <Card.Body className="mt-2">
                    <Card.Title>
                    
                      {this.state.user ?  this.state.user.firstName +
                        " " +
                        this.state.user.lastName : "undefined"}
                    </Card.Title>
                    <Card.Text>{this.state.user ? this.state.user.email : "undefined"}</Card.Text>
                    <Card.Text>
                      {this.state.user ? "Member since: " +
                        moment(this.state.user.registrationDate).format(
                          "DD/MM/YYYY" 
                        ): "undefined"}
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
                              {this.state.stats ? this.state.stats.activeTasks : 0}
                            </Badge>
                          </Card.Text>
                          <Card.Text>
                            Projects{" "}
                            <Badge pill variant="primary">
                            {this.state.stats ? this.state.stats.activeProjects : 0}
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
                            {this.state.stats ? this.state.stats.completedTasks : 0}
                            </Badge>
                          </Card.Text>
                          <Card.Text>
                            Projects{" "}
                            <Badge pill variant="success">
                            {this.state.stats ? this.state.stats.completedProjects : 0}
                            </Badge>
                          </Card.Text>
                          <Card.Text>
                            Work Logs{" "}
                            <Badge pill variant="success">
                            {this.state.stats ? this.state.stats.completedWorkLogs : 0}
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
                                <Card.Body>{this.state.recentProjects ? this.state.recentProjects.project1.projectName : "undefined"}</Card.Body>
                              </Card>
                            </Col>
                            <Col>
                              <Card
                                bg="dark"
                                text="light"
                                className="tasky-profile-stat-card"
                              >
                                <Card.Body>{this.state.recentProjects ? this.state.recentProjects.project2.projectName : "undefined"}</Card.Body>
                              </Card>
                            </Col>
                            <Col>
                              <Card
                                bg="dark"
                                text="light"
                                className="tasky-profile-stat-card"
                              >
                                <Card.Body>{this.state.recentProjects ? this.state.recentProjects.project3.projectName : "undefined"}</Card.Body>
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

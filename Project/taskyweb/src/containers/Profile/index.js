import React, { Component } from "react";
import NavbarLogged from "../../components/NavbarLogged";
import { Card, Col, Row, Container, Badge } from "react-bootstrap";
import { FiEdit2, FiSettings } from "react-icons/fi";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import CustomModal from "../../components/modals/CustomModal";
import EditProfileForm from "../../components/forms/EditProfileForm";
import {
  FileHelper,
  ServiceHelper,
  SessionHelper,
} from "../../util/helpers";
import { GET_PROFILE_SERVICE, UPDATE_USER_SERVICE } from "../../util/constants/Services";
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
      editProfileFormVisibility: false,
    };
    let a = SessionHelper.checkIsSessionLive();
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
      if (response && response.isSuccessful && response.data) {
        console.log(response.data);
        this.setState({
          user: response.data.user,
          stats: response.data.stats,
          recentProjects: response.data.recentProjects,
        });
      }
    });
  };

  onClickCard = (project) => {
    this.props.history.push({
      pathname: "/project/" + project.projectId,
      state: { project: project, projectName: project.projectName },
    });
  };

  renderRecentProjectCards = () => {
    if (this.state.recentProjects) {
      let card1 = this.state.recentProjects.project1.projectName;
      let card2 = this.state.recentProjects.project2.projectName;
      let card3 = this.state.recentProjects.project3.projectName;
      return (
        <>
          {card1 != null ? (
            <Col md={4}>
              <Card
                bg="dark"
                text="light"
                className="tasky-profile-stat-card clickable"
                onClick={() =>
                  this.onClickCard(this.state.recentProjects.project1)
                }
              >
                <Card.Body>
                  {this.state.recentProjects.project1.projectName}
                </Card.Body>
              </Card>
            </Col>
          ) : null}
          {card2 != null ? (
            <Col md={4}>
              <Card
                bg="dark"
                text="light"
                className="tasky-profile-stat-card clickable"
                onClick={() =>
                  this.onClickCard(this.state.recentProjects.project2)
                }
              >
                <Card.Body>
                  {this.state.recentProjects.project2.projectName}
                </Card.Body>
              </Card>
            </Col>
          ) : null}
          {card3 ? (
            <Col md={4}>
              <Card
                bg="dark"
                text="light"
                className="tasky-profile-stat-card clickable"
                onClick={() =>
                  this.onClickCard(this.state.recentProjects.project3)
                }
              >
                <Card.Body>
                  {this.state.recentProjects.project3.projectName}
                </Card.Body>
              </Card>
            </Col>
          ) : null}
        </>
      );
    } else {
      return (
        <Col>
          <p>You are not a member of any project.</p>
        </Col>
      );
    }
  };

  submitEditProfileForm = async (data) => {
    let newUser = this.state.user;
    newUser.FirstName = data.firstName;
    newUser.LastName = data.lastName;
    await ServiceHelper.serviceHandler(
      UPDATE_USER_SERVICE + this.state.userId,
      ServiceHelper.createOptionsJson(JSON.stringify(newUser), "PUT")
    ).then((response) => {
      if (response && response.isSuccessful) {
        toast("Profile Info Updated.", {
          type: "success",
        });
        this.resetEditProfileForm();
        this.setState({ editProfileFormVisibility: false });
        this.getProfile();
        this.createEditProfileForm();
        window.location.reload();
      } else {
        toast(response.message, {
          type: "error",
        });
      }
    });
  };

  createEditProfileForm = () => {
    return (
      <CustomModal
        isVisible={this.state.editProfileFormVisibility}
        onClose={() => this.setState({ editProfileFormVisibility: false })}
        content={
          <div>
            <EditProfileForm
              handleSubmit={(submit) => (this.submitEditProfileForm = submit)}
              handleReset={(reset) => (this.resetEditProfileForm = reset)}
              onSubmit={this.submitEditProfileForm}
              initialValues={ this.state.user ? {firstName:this.state.user.firstName, lastName:this.state.user.lastName}: null}
            />
          </div>
        }
        title={"EDIT PROFILE"}
      />
    );
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
              <Row className="mx-auto mt-4 ">
                <Card
                  className="tasky-profile-card justify-content-center"
                  bg="dark"
                  text="light"
                  style={{ width: "25%" }}
                >
                  <div className="centered-image">
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
                  </div>
                  <Card.Body className="mt-2">
                    <Card.Title>
                      {this.state.user
                        ? this.state.user.firstName +
                          " " +
                          this.state.user.lastName
                        : "undefined"}
                    </Card.Title>
                    <Card.Text>
                      {this.state.user ? this.state.user.email : "undefined"}
                    </Card.Text>
                    <Card.Text>
                      {this.state.user
                        ? "Member since: " +
                          moment(this.state.user.registrationDate).format(
                            "DD/MM/YYYY"
                          )
                        : "undefined"}
                    </Card.Text>
                  </Card.Body>
                </Card>
                <Container
                  className="dark-profile-container"
                  style={{ width: "75%" }}
                >
                  {this.state.userId === SessionHelper.loadUser().id ? (
                    <Row className="mt-2 ml-1 mr-1">
                      <Col md={10}></Col>
                      <Col md={2}>
                          <Badge className="ml-5 clickable" pill variant="secondary" onClick={() => this.setState({ editProfileFormVisibility: true })}>
                            <FiEdit2></FiEdit2>
                          </Badge>
                        <a className="ml-1" href="/settings">
                          <Badge pill variant="secondary">
                            <FiSettings></FiSettings>
                          </Badge>
                        </a>
                      </Col>
                    </Row>
                  ) : null}
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
                              {this.state.stats
                                ? this.state.stats.activeTasks
                                : 0}
                            </Badge>
                          </Card.Text>
                          <Card.Text>
                            Projects{" "}
                            <Badge pill variant="primary">
                              {this.state.stats
                                ? this.state.stats.activeProjects
                                : 0}
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
                              {this.state.stats
                                ? this.state.stats.completedTasks
                                : 0}
                            </Badge>
                          </Card.Text>
                          <Card.Text>
                            Projects{" "}
                            <Badge pill variant="success">
                              {this.state.stats
                                ? this.state.stats.completedProjects
                                : 0}
                            </Badge>
                          </Card.Text>
                          <Card.Text>
                            Work Logs{" "}
                            <Badge pill variant="success">
                              {this.state.stats
                                ? this.state.stats.completedWorkLogs
                                : 0}
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
                          <Row className="mt-3 justify-content-center">
                            {this.renderRecentProjectCards()}
                          </Row>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Container>
              </Row>
            </Col>
            {this.createEditProfileForm()}
          </Container>
        </div>
      </div>
    );
  }
}

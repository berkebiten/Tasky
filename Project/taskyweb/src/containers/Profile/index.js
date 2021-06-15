import React, { Component } from "react";
import NavbarLogged from "../../components/NavbarLogged";
import { Card, Col, Row, Container, Badge, Button } from "react-bootstrap";
import { FiEdit2, FiSettings } from "react-icons/fi";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import CustomModal from "../../components/modals/CustomModal";
import EditProfileForm from "../../components/forms/EditProfileForm";
import {
  FileHelper,
  ServiceHelper,
  SessionHelper,
  TextHelper,
} from "../../util/helpers";
import {
  ACCEPT_INVITATION,
  DECLINE_INVITATION,
  GET_PROFILE_SERVICE,
  UPDATE_USER_SERVICE,
} from "../../util/constants/Services";
import moment from "moment";
import { Loader } from "rsuite";
import { invitationTableColumns } from "../../util/constants/Constants";
import TableView from "../../components/views/TableView";
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
      showInvitations: false,
    };
    let a = SessionHelper.checkIsSessionLive();
    if (!a) {
      props.history.push("/logout");
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
        SessionHelper.saveUser(response.data.user);
        this.setState({
          user: response.data.user,
          stats: response.data.stats,
          recentProjects: response.data.recentProjects,
          invitations: response.data.invitations,
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
                className="tasky-profile-stat-card clickable-pc"
                onClick={() =>
                  this.onClickCard(this.state.recentProjects.project1)
                }
              >
                <Card.Body>
                  {TextHelper.getSmallText(
                    this.state.recentProjects.project1.projectName,
                    10
                  )}
                </Card.Body>
              </Card>
            </Col>
          ) : null}
          {card2 != null ? (
            <Col md={4}>
              <Card
                bg="dark"
                text="light"
                className="tasky-profile-stat-card clickable-pc"
                onClick={() =>
                  this.onClickCard(this.state.recentProjects.project2)
                }
              >
                <Card.Body>
                  {TextHelper.getSmallText(
                    this.state.recentProjects.project2.projectName,
                    10
                  )}
                </Card.Body>
              </Card>
            </Col>
          ) : null}
          {card3 ? (
            <Col md={4}>
              <Card
                bg="dark"
                text="light"
                className="tasky-profile-stat-card clickable-pc"
                onClick={() =>
                  this.onClickCard(this.state.recentProjects.project3)
                }
              >
                <Card.Body>
                  {TextHelper.getSmallText(
                    this.state.recentProjects.project3.projectName,
                    10
                  )}
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
    let files = FileHelper.getFiles();
    let newUser = this.state.user;
    newUser.FirstName = data.firstName;
    newUser.LastName = data.lastName;
    if (files && files.length > 0) {
      newUser.profileImage = files[0].data;
    }
    await ServiceHelper.serviceHandler(
      UPDATE_USER_SERVICE + this.state.userId,
      ServiceHelper.createOptionsJson(JSON.stringify(newUser), "PUT")
    ).then((response) => {
      if (response && response.isSuccessful) {
        toast("Profile Info Updated.", {
          type: "success",
        });
        this.setState({ editProfileFormVisibility: false }, () =>
          this.getProfile()
        );
        setTimeout(function () {
          window.location.reload();
        }, 100);
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
              // handleSubmit={(submit) => (this.submitEditProfileForm = submit)}
              onSubmit={this.submitEditProfileForm}
              initialValues={
                this.state.user
                  ? {
                      firstName: this.state.user.firstName,
                      lastName: this.state.user.lastName,
                    }
                  : null
              }
            />
          </div>
        }
        title={"EDIT PROFILE"}
      />
    );
  };

  acceptInvitation = async (id) => {
    await ServiceHelper.serviceHandler(
      ACCEPT_INVITATION + id,
      ServiceHelper.createOptionsJson(null, "POST")
    ).then((response) => {
      if (response && response.isSuccessfull) {
        toast("Invitation Accepted.", {
          type: "success",
        });
        this.setState({ showInvitations: false }, () => this.getProfile());
      } else {
        toast(response.message, {
          type: "error",
        });
      }
    });
  };

  declineInvitation = async (id) => {
    await ServiceHelper.serviceHandler(
      DECLINE_INVITATION + id,
      ServiceHelper.createOptionsJson(null, "DELETE")
    ).then((response) => {
      if (response && response.isSuccessfull) {
        toast("Invitation Declined.", {
          type: "success",
        });
        this.setState({ showInvitations: false }, () => this.getProfile());
      } else {
        toast(response.message, {
          type: "error",
        });
      }
    });
  };

  createInvitations = () => {
    return (
      <CustomModal
        isVisible={this.state.showInvitations}
        onClose={() => this.setState({ showInvitations: false })}
        title="Project Invitations"
        content={
          <TableView
            columns={invitationTableColumns(
              this.acceptInvitation,
              this.declineInvitation
            )}
            tableData={this.state.invitations}
            pagination={{ defaultPageSize: 3 }}
          />
        }
      />
    );
  };

  createContent = () => {
    if (!this.state.user || !this.state.recentProjects || !this.state.stats) {
      return (
        <div className="mt-5">
          <Loader
            size="lg"
            content="Loading..."
            speed="slow"
            className="loader"
            center
            vertical
          />
        </div>
      );
    }
    return (
      <div>
        <Row className="mx-auto mt-4 ">
          <Card
            className="tasky-profile-card justify-content-center"
            bg="dark"
            text="light"
            style={{ width: "25%" }}
          >
            <div className="centered-image ">
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
                  ? this.state.user.firstName + " " + this.state.user.lastName
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
                  <Badge
                    className="ml-5 clickable"
                    pill
                    variant="secondary"
                    onClick={() =>
                      this.setState({ editProfileFormVisibility: true })
                    }
                  >
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
                    <Card.Header className="t-bg-primary">Active</Card.Header>
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
            {this.state.invitations && this.state.invitations.length > 0 && (
              <Row className="mt-4 ml-1 mr-1">
                <Col className="tasky-profile-stat-col">
                  <Button
                    className="btn-invi clickable-pc"
                    onClick={() => this.setState({ showInvitations: true })}
                  >
                    Project Invitations{"  "}
                    <Badge variant="light">
                      {this.state.invitations.length}
                    </Badge>
                  </Button>
                </Col>
                {this.createInvitations()}
              </Row>
            )}
          </Container>
        </Row>
      </div>
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
            <Col className="mx-auto">{this.createContent()}</Col>
            {this.state.editProfileFormVisibility &&
              this.createEditProfileForm()}
          </Container>
        </div>
      </div>
    );
  }
}

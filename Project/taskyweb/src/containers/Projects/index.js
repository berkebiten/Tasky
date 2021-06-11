import React, { Component } from "react";
import NavbarLogged from "../../components/NavbarLogged";
import {
  Card,
  Col,
  Row,
  Container,
  Form,
  FormControl,
  Button,
  InputGroup,
  Badge,
} from "react-bootstrap";
import { Pagination } from "semantic-ui-react";
import { BsSearch, BsPlus } from "react-icons/bs";
import ProjectForm from "../../components/forms/ProjectForm";
import CustomModal from "../../components/modals/CustomModal";
import {
  FileHelper,
  RootViewHelper,
  ServiceHelper,
  SessionHelper,
} from "../../util/helpers";
import { Helmet } from "react-helmet";
import {
  INSERT_PROJECT_SERVICE,
  GET_PROJECTS_SERVICE,
} from "../../util/constants/Services";
import { toast } from "react-toastify";
import { InviteParticipantView } from "../../components/views/InviteParticipantView";
import { keys } from "@material-ui/core/styles/createBreakpoints";

const startIndex = 0;
const count = 9;

export default class Projects extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projectFormVisibility: false,
      base64: "x",
      activePage: 1,
    };
    if (!SessionHelper.checkIsSessionLive()) {
      props.history.push("/logout");
    }
  }

  componentDidMount = () => {
    this.initialize();
  };

  initialize = () => {
    this.getProjects(1);
  };

  componentDidUpdate = () => {
    if (!this.state.projects) {
      this.getProjects(1);
    }
  };

  getProjects = async (page) => {
    let reqBody = { startIndex: 0, count: 1000 };
    await ServiceHelper.serviceHandler(
      GET_PROJECTS_SERVICE,
      ServiceHelper.createOptionsJson(JSON.stringify(reqBody), "POST")
    ).then((response) => {
      let update = {};
      if (response && response.data && response.isSuccessful) {
        update.projects = response.data.projects;
        if (!this.state.projectCount) {
          update.projectCount = response.data.projectCount;
        }
        this.setState(update);
      }
    });
    RootViewHelper.stopLoading();
  };

  onSubmit = async (data) => {
    let participants = [];
    for (let i = 0; i < Object.keys(data).length / 2; i++) {
      let participantObj = {
        email: data["participantEmail" + i.toString()],
        role: parseInt(data["role" + i.toString()]),
      };
      participants.push(participantObj);
    }
    let projectObject = this.state.formObject;
    projectObject.participants = participants;
    await ServiceHelper.serviceHandler(
      INSERT_PROJECT_SERVICE,
      ServiceHelper.createOptionsJson(JSON.stringify(projectObject), "POST")
    ).then((response) => {
      if (response && response.isSuccessful) {
        toast("Project is Created", {
          type: "success",
        });
        this.submitParticipants = null;
        this.setState({ projectFormVisibility: false, formObject: null }, () =>
          this.getProjects()
        );
      } else {
        toast(response.message, {
          type: "error",
        });
      }
    });
    RootViewHelper.stopLoading();
  };

  submitProjectForm = (data) => {
    let files = FileHelper.getFiles();
    let projectObject = {
      name: data.name,
      description: data.description,
      files: files ? files : [],
    };
    this.setState({ formObject: projectObject });
    this.submitParticipants();
  };

  createProjectForm = () => {
    return (
      <CustomModal
        isVisible={this.state.projectFormVisibility}
        onClose={() => this.setState({ projectFormVisibility: false })}
        content={
          <div>
            <ProjectForm
              handleSubmit={(submit) => (this.submitProjectForm = submit)}
              onSubmit={this.submitProjectForm}
              initialValues={null}
            />
            <InviteParticipantView
              onSubmit={this.onSubmit}
              handleSubmit={(submit) => {
                this.submitParticipants = submit;
              }}
            />
            <Button
              variant="dark"
              size="lg"
              onClick={() => {
                this.submitProjectForm();
              }}
              block
            >
              Create
            </Button>
          </div>
        }
        title={"CREATE NEW PROJECT"}
      />
    );
  };

  handlePaginationChange = (e, { activePage }) => {
    this.setState({ activePage: activePage });
  };

  onClickCard = (project) => {
    this.props.history.push({
      pathname: "/project/" + project.id,
      state: { project: project, projectName: project.name },
    });
  };

  renderProjectCards = () => {
    return (
      <Row className="mt-5 projects-row justify-content-center">
        {this.state.projects.map((item, key) => {
          if (
            key >= (this.state.activePage - 1) * 8 &&
            key < this.state.activePage * 8
          ) {
            return (
              <Col md={3}>
                <Card
                  bg="dark"
                  text="light"
                  onClick={() => this.onClickCard(item)}
                  className="project-card mb-2 clickable"
                >
                  <Card.Body>
                    <Card.Title>{item.name}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      {item.projectManagerFirstName +
                        " " +
                        item.projectManagerLastName}
                    </Card.Subtitle>
                    <Card.Text>{item.description}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            );
          }
        })}
      </Row>
    );
  };

  render() {
    return (
      <div>
        <Helmet>
          <title>{"Projects"}</title>
        </Helmet>
        <NavbarLogged />
        <div className="auth-wrapper">
          <Container>
            <Row className="mt-4">
              <h1 class="text-dark mx-auto">MY PROJECTS</h1>
            </Row>
            <Row className="mt-4">
              <Form inline className="mx-auto">
                <InputGroup className="mr-sm-2">
                  <FormControl
                    type="text"
                    className="input-search-tasky-dark"
                    placeholder="Search Project"
                  />
                  <InputGroup.Append>
                    <Button variant="" className="search-btn-bb-dark">
                      <BsSearch />
                    </Button>
                  </InputGroup.Append>
                </InputGroup>
                <Button
                  className="ml-2 new-task"
                  variant="dark"
                  onClick={() => this.setState({ projectFormVisibility: true })}
                >
                  <Badge variant="primary">+</Badge> New
                </Button>
              </Form>
            </Row>
            {this.state.projects &&
              this.state.projects.length > 0 &&
              this.renderProjectCards()}
            {this.state.projects && this.state.projects.length > 0 && (
              <Row className="mt-5">
                <div class="mx-auto">
                  <Pagination
                    defaultActivePage={1}
                    firstItem={null}
                    lastItem={null}
                    pointing
                    secondary
                    totalPages={this.state.projects.length / 8}
                    onPageChange={this.handlePaginationChange}
                  />
                </div>
              </Row>
            )}
            {this.state.projectFormVisibility && this.createProjectForm()}
          </Container>
        </div>
      </div>
    );
  }
}

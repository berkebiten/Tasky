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
} from "react-bootstrap";
import { Pagination } from "semantic-ui-react";
import { BsSearch, BsPlus } from "react-icons/bs";
import ProjectForm from "../../components/forms/ProjectForm";
import CustomModal from "../../components/modals/CustomModal";
import {
  RootViewHelper,
  ServiceHelper,
  SessionHelper,
} from "../../util/helpers";
import {
  INSERT_PROJECT_SERVICE,
  GET_PROJECTS_SERVICE,
} from "../../util/constants/Services";
import { toast } from "react-toastify";
import { InviteParticipantView } from "../../components/views/InviteParticipantView";

const startIndex = 0;
const count = 8;

export default class Projects extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projectFormVisibility: false,
    };
    if (!SessionHelper.checkIsSessionLive()) {
      props.history.push("/");
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
    let reqBody = { startIndex: startIndex + (page - 1) * count, count: count };
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
    console.log(participants);
    await ServiceHelper.serviceHandler(
      INSERT_PROJECT_SERVICE,
      ServiceHelper.createOptionsJson(JSON.stringify(projectObject), "POST")
    ).then((response) => {
      if (response && response.isSuccessful) {
        toast("Project is Created", {
          type: "success",
        });
        this.setState({ projectFormVisibility: false });
      } else {
        toast(response.message, {
          type: "error",
        });
      }
    });
    RootViewHelper.stopLoading();
  };

  submitProjectForm = (data) => {
    let projectObject = {
      name: data.name,
      description: data.description,
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
    this.getProjects(activePage);
  };

  onClickCard = (project) => {
    this.props.history.push({
      pathname: "/project/" + project.id,
      state: { project: project },
    });
  };

  renderProjectCards = () => {
    return (
      <Row className="mt-5">
        {this.state.projects.map((item, key) => {
          return (
            <Col md={3}>
              <Card
                bg="dark"
                text="light"
                onClick={() => this.onClickCard(item)}
              >
                <Card.Body>
                  <Card.Title>{item.name}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {item.projectManagerFirstName +
                      " " +
                      item.projectManagerLastName}
                  </Card.Subtitle>
                  <Card.Text>Project Description: {item.description}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    );
  };

  render() {
    return (
      <div>
        <NavbarLogged />
        <div className="auth-wrapper">
          <Container>
            <Row className="mt-4">
              <h1 class="text-dark mx-auto">YOUR PROJECTS</h1>
            </Row>
            <Row className="mt-4">
              <Form inline className="mx-auto">
                <InputGroup className="mr-sm-2">
                  <FormControl type="text" placeholder="Search Project" />
                  <InputGroup.Append>
                    <Button variant="outline-dark">
                      <BsSearch />
                    </Button>
                  </InputGroup.Append>
                </InputGroup>

                <Button
                  variant="primary"
                  className="mr-sm-2"
                  onClick={() => this.setState({ projectFormVisibility: true })}
                >
                  <BsPlus />
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
                    totalPages={this.state.projectCount / 8}
                    onPageChange={this.handlePaginationChange}
                  />
                </div>
              </Row>
            )}
            {this.createProjectForm()}
          </Container>
        </div>
      </div>
    );
  }
}

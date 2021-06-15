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
import CreateProjectForm from "../../components/forms/CreateProjectForm";
import CustomModal from "../../components/modals/CustomModal";
import {
  FileHelper,
  RootViewHelper,
  ServiceHelper,
  SessionHelper,
  TextHelper,
} from "../../util/helpers";
import { Helmet } from "react-helmet";
import {
  INSERT_PROJECT_SERVICE,
  GET_PROJECTS_SERVICE,
} from "../../util/constants/Services";
import { toast } from "react-toastify";
import { InviteParticipantView } from "../../components/views/InviteParticipantView";
import FormCheck from "react-bootstrap/FormCheck";

export default class Projects extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projectFormVisibility: false,
      base64: "x",
      activePage: 1,
      showClosedProjects: true,
    };
    if (!SessionHelper.checkIsSessionLive()) {
      props.history.push("/logout");
    }
  }

  componentDidMount = () => {
    this.initialize();
  };

  initialize = () => {
    this.getProjects();
  };

  componentDidUpdate = () => {
    if (!this.state.projects) {
      this.getProjects();
    }
  };

  searchProjects = (event) => {
    let keyword = event.target.value;
    let projectList;
    if (keyword) {
      keyword = keyword.toLowerCase();
      projectList = this.state.projects.filter(
        (item) =>
          item.name.toLowerCase().includes(keyword) ||
          item.description.toLowerCase().includes(keyword)
      );
    } else {
      projectList = this.state.projects;
    }
    this.setState({ filteredProjects: projectList });
  };

  getProjects = async () => {
    let bool = "false";
    if (this.state.showClosedProjects) {
      bool = "true";
    }
    let reqBody = { startIndex: 0, count: 1000 };
    await ServiceHelper.serviceHandler(
      GET_PROJECTS_SERVICE + bool,
      ServiceHelper.createOptionsJson(JSON.stringify(reqBody), "POST")
    ).then((response) => {
      let update = {};
      if (response && response.data && response.isSuccessful) {
        update.projects = response.data.projects;
        update.filteredProjects = response.data.projects;
        if (!this.state.projectCount) {
          update.projectCount = response.data.projectCount;
        }
        this.setState(update);
      }
    });
    RootViewHelper.stopLoading();
  };

  onSubmit = async (projectObject) => {
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
  };

  createProjectForm = () => {
    return (
      <CustomModal
        isVisible={this.state.projectFormVisibility}
        onClose={() => this.setState({ projectFormVisibility: false })}
        content={
          <div>
            <CreateProjectForm onSubmit={(data) => this.onSubmit(data)} />
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
        {this.state.filteredProjects.map((item, key) => {
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
                    <Card.Title style={{"display":"flex"}}>
                      <Col style={{"padding":0}} md={9}>
                      {TextHelper.getSmallText(item.name, 15)}
                      </Col>
                      <Col md={3} style={{"padding":0}}>
                      {item.status === true ? (
                        <Badge className="project-st" variant="success">OPEN</Badge>
                      ) : (
                        <Badge className="project-st" variant="danger">CLOSED</Badge>
                      )}
                      </Col>
                    </Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      {item.projectManagerFirstName +
                        " " +
                        item.projectManagerLastName}
                    </Card.Subtitle>
                    <Card.Text>
                      {TextHelper.getSmallText(item.description, 50)}
                    </Card.Text>
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
                    onChange={(keyword) => this.searchProjects(keyword)}
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
            <Row className="justify-content-center">
              <FormCheck.Label className="mt-4">
                Show Closed Projects
              </FormCheck.Label>
              <Form.Check
                className="ml-2 mt-4"
                type="checkbox"
                checked={this.state.showClosedProjects}
                onChange={() =>
                  this.setState(
                    {
                      showClosedProjects: !this.state.showClosedProjects,
                    },
                    () => this.getProjects()
                  )
                }
              />
            </Row>
            {this.state.filteredProjects &&
              this.state.filteredProjects.length > 0 &&
              this.renderProjectCards()}
            {this.state.filteredProjects &&
              this.state.filteredProjects.length > 0 && (
                <Row className="mt-5">
                  <div class="mx-auto">
                    <Pagination
                      defaultActivePage={1}
                      firstItem={null}
                      lastItem={null}
                      pointing
                      secondary
                      totalPages={this.state.filteredProjects.length / 8}
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

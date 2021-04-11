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

export default class Projects extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projectFormVisibility: false,
    };
  }

  onSubmit = (data) => {
    console.log(data);
  };

  createProjectForm = () => {
    return (
      <CustomModal
        isVisible={this.state.projectFormVisibility}
        onClose={() => this.setState({ projectFormVisibility: false })}
        content={<ProjectForm onSubmit={this.onSubmit} initialValues={null} />}
        title={"CREATE NEW PROJECT"}
      />
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
                  <FormControl
                    type="text"
                    placeholder="Search Project"
                  />
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
            <Row className="mt-5">
              <Col md={3}>
                <Card bg="dark" text="light">
                  <Card.Body>
                    <Card.Title>Project Name</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      Project Owner
                    </Card.Subtitle>
                    <Card.Text>
                      Project Description: Lorem ipsum dolor sit amet.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card bg="dark" text="light">
                  <Card.Body>
                    <Card.Title>Project Name</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      Project Owner
                    </Card.Subtitle>
                    <Card.Text>
                      Project Description: Lorem ipsum dolor sit amet.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card bg="dark" text="light">
                  <Card.Body>
                    <Card.Title>Project Name</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      Project Owner
                    </Card.Subtitle>
                    <Card.Text>
                      Project Description: Lorem ipsum dolor sit amet.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card bg="dark" text="light">
                  <Card.Body>
                    <Card.Title>Project Name</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      Project Owner
                    </Card.Subtitle>
                    <Card.Text>
                      Project Description: Lorem ipsum dolor sit amet.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row className="mt-5">
              <Col md={3}>
                <Card bg="dark" text="light">
                  <Card.Body>
                    <Card.Title>Project Name</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      Project Owner
                    </Card.Subtitle>
                    <Card.Text>
                      Project Description: Lorem ipsum dolor sit amet.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card bg="dark" text="light">
                  <Card.Body>
                    <Card.Title>Project Name</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      Project Owner
                    </Card.Subtitle>
                    <Card.Text>
                      Project Description: Lorem ipsum dolor sit amet.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card bg="dark" text="light">
                  <Card.Body>
                    <Card.Title>Project Name</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      Project Owner
                    </Card.Subtitle>
                    <Card.Text>
                      Project Description: Lorem ipsum dolor sit amet.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card bg="dark" text="light">
                  <Card.Body>
                    <Card.Title>Project Name</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      Project Owner
                    </Card.Subtitle>
                    <Card.Text>
                      Project Description: Lorem ipsum dolor sit amet.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row className="mt-5">
              <div class="mx-auto">
                <Pagination
                  defaultActivePage={1}
                  firstItem={null}
                  lastItem={null}
                  pointing
                  secondary
                  totalPages={3}
                />
              </div>
            </Row>
            {this.createProjectForm()}
          </Container>
        </div>
      </div>
    );
  }
}

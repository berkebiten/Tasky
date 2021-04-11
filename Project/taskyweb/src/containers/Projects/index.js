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
} from "react-bootstrap";
import { Pagination } from "semantic-ui-react";
import { BsSearch, BsPlus } from "react-icons/bs";

export default class Projects extends Component {
  render() {
    return (
      <div>
        <NavbarLogged />
        <div className="auth-wrapper">
          <Container>
            <Row className="mt-4">
              <h1 class="mx-auto">YOUR PROJECTS</h1>
            </Row>
            <Row className="mt-4">
                <Form inline className="mx-auto">
                  <FormControl
                    type="text"
                    placeholder="Search Project"
                    className=" mr-sm-2"
                  />
                  <Button variant="outline-light" className="mr-sm-2">
                    <BsSearch />
                  </Button>
                  <Button variant="outline-light" className="mr-sm-2"><BsPlus/></Button>
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
          </Container>
        </div>
      </div>
    );
  }
}

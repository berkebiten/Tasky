import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { BsSearch } from "react-icons/bs";
import { FiSettings, FiUser, FiLogOut } from "react-icons/fi";
import { Navbar, Nav, Form, FormControl, Button } from "react-bootstrap";
import { Avatar, Dropdown } from "rsuite";
import logo from "../res/images/tasky-logo-md.png";

class NavbarLogged extends Component {
  render() {
    return (
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="/projects">
          <img
            src={logo}
            width="80"
            height="30"
            className="d-inline-block align-top"
          />
        </Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link href="/projects"><h3>Projects</h3></Nav.Link>
          <Nav.Link href="/tasks"><h3>Tasks</h3></Nav.Link>
          <Nav.Link href="/activities"><h3>Activities</h3></Nav.Link>
        </Nav>
        <Form inline>
          <FormControl type="text" placeholder="Search" className="mr-sm-2" />
          <Button variant="outline-info" className="mr-sm-2">
            <BsSearch />
          </Button>
        </Form>
        <Dropdown
          placement="bottomEnd"
          className="mr-sm-2 "
          trigger="hover"W
          noCaret
          icon={
            <Avatar
              circle
              src="https://avatars2.githubusercontent.com/u/12592949?s=460&v=4"
            />
          }
        >
          <Dropdown.Item onSelect={() => this.props.history.push("/settings")}>
            <FiSettings className="mr-sm-2" />
            Settings
          </Dropdown.Item>
          <Dropdown.Item
            onSelect={() => this.props.history.push("/preferences")}
          >
            <FiUser className="mr-sm-2" />
            Preferences
          </Dropdown.Item>
          <Dropdown.Item onSelect={() => this.props.history.push("/logout")}>
            <FiLogOut className="mr-sm-2" />
            Logout
          </Dropdown.Item>
        </Dropdown>
      </Navbar>
    );
  }
}
export default withRouter(NavbarLogged);

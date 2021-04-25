import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { BsSearch } from "react-icons/bs";
import { FiSettings, FiUser, FiLogOut } from "react-icons/fi";
import {
  Navbar,
  Nav,
  Form,
  FormControl,
  Button,
  InputGroup,
} from "react-bootstrap";
import { Avatar, Dropdown } from "rsuite";
import logo from "../res/images/tasky-logo-md.png";
import { SessionHelper } from "../util/helpers";

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
          <Nav.Link href="/projects" className="nav-link-tasky ml-5">
            Projects
          </Nav.Link>
          <Nav.Link href="/tasks" className="nav-link-tasky ml-2">
            Tasks
          </Nav.Link>
          <Nav.Link href="/activities" className="nav-link-tasky ml-2">
            Activities
          </Nav.Link>
        </Nav>
        <Form inline>
          <InputGroup className='mr-sm-5'>
            <FormControl
              className="input-search-tasky"
              type="text"
              placeholder="Search"
            />
            <InputGroup.Append>
              <Button variant="dark" className="border-b">
                <BsSearch />
              </Button>
            </InputGroup.Append>
          </InputGroup>
        </Form>
        <Dropdown
          placement="bottomEnd"
          className="mr-sm-2 "
          trigger="hover"
          W
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
          <Dropdown.Item onSelect={() => {
            SessionHelper.removeUser()
            this.props.history.push("/")
            }}>
            <FiLogOut className="mr-sm-2" />
            Logout
          </Dropdown.Item>
        </Dropdown>
      </Navbar>
    );
  }
}
export default withRouter(NavbarLogged);

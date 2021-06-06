import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { BsSearch } from "react-icons/bs";
import { FiSettings, FiUser, FiLogOut, FiSliders } from "react-icons/fi";
import {
  Navbar,
  Nav,
  Form,
  FormControl,
  Button,
  InputGroup,
} from "react-bootstrap";
import { Avatar, Dropdown } from "rsuite";
import logo from "../res/images/tasky-logo-1920.png";
import { SessionHelper } from "../util/helpers";
import { useRadioGroup } from "@material-ui/core";

class NavbarLogged extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: SessionHelper.loadUser(),
    };
  }
  render() {
    console.log(this.state.user);
    return (
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="/projects">
          <img
            src={logo}
            width="40"
            height="40"
            className="d-inline-block align-top clickable-logo"
          />
        </Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link href="/Projects" className="nav-link-tasky ml-5">
            Projects
          </Nav.Link>
          <Nav.Link href="/MyTasks" className="nav-link-tasky ml-2">
            My Tasks
          </Nav.Link>
          <Nav.Link href="/ActivityStream" className="nav-link-tasky ml-2">
            Activity Stream
          </Nav.Link>
        </Nav>
        <Form inline>
          <InputGroup className="mr-sm-5">
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
              src={
                this.state.user &&
                this.state.user.profileImage
                  ? this.state.user.profileImage
                  : "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/1024px-User-avatar.svg.png"
              }
            />
          }
        >
          <Dropdown.Item
            onSelect={() =>
              this.props.history.push({
                pathname: "/profile/" + this.state.user.id,
                state: { user: this.state.user },
              })
            }
          >
            <FiUser className="mr-sm-2" />
            Profile
          </Dropdown.Item>
          <Dropdown.Item onSelect={() => this.props.history.push("/settings")}>
            <FiSettings className="mr-sm-2" />
            Settings
          </Dropdown.Item>
          <Dropdown.Item
            onSelect={() => this.props.history.push("/preferences")}
          >
            <FiSliders className="mr-sm-2" />
            Preferences
          </Dropdown.Item>
          <Dropdown.Item
            onSelect={() => {
              SessionHelper.removeUser();
              this.props.history.push("/");
            }}
          >
            <FiLogOut className="mr-sm-2" />
            Logout
          </Dropdown.Item>
        </Dropdown>
      </Navbar>
    );
  }
}
export default withRouter(NavbarLogged);

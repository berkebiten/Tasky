import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { BsSearch } from "react-icons/bs";
import { FiSettings, FiUser, FiLogOut } from "react-icons/fi";
import { Navbar as NB, ButtonGroup, Form, Button } from "react-bootstrap";
import { Avatar, Dropdown } from "rsuite";
import logo from "../res/images/tasky-logo-1920.png";

class Navbar extends Component {
  render() {
    return (
      <NB bg="dark" variant="dark" justify-content-between>
        <NB.Brand href="/">
          <img
            src={logo}
            width="40"
            height="40"
            className="d-inline-block align-top clickable-logo"
          />
        </NB.Brand>
        <NB.Collapse className="justify-content-end">
          <Button href="/sign-in" variant="dark">
            Login
          </Button>
          <Button href="/sign-up" variant="outline-info">
            Register
          </Button>
        </NB.Collapse>
      </NB>
    );
  }
}
export default withRouter(Navbar);

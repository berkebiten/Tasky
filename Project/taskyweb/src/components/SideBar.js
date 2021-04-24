import React, { Component } from "react";
import { Sidenav, Nav, Icon } from "rsuite";
import "../../node_modules/rsuite";

const headerStyles = {
  padding: 20,
  fontSize: 16,
  background: "#343a40",
  color: "#fff",
};

export default class SideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div style={{ width: "100%" }}>
        <Sidenav style={{ height: "100vh", backgroundColor: "#343a40" }}>
          <Sidenav.Header>
            <div style={headerStyles}>{this.props.title}</div>
          </Sidenav.Header>
          <Sidenav.Body>
            <Nav>
              {this.props.menuItems.map((item, key) => {
                return (
                  <Nav.Item
                    eventKey={key.toString()}
                    icon={<Icon icon={item.icon} />}
                    active={this.props.activePage === item.title}
                    onSelect={this.props.onMenuItemSelect}
                  >
                    {item.title}
                  </Nav.Item>
                );
              })}
            </Nav>
          </Sidenav.Body>
        </Sidenav>
      </div>
    );
  }
}

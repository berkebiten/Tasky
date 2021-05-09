import React, { Component } from "react";
import { Sidenav, Nav, Icon } from "rsuite";
import "../../node_modules/rsuite";

export default class SideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div style={{ width: "100%" }}>
        <Sidenav className="tasky-project-sidenav">
          <div className="ml-2">
            <Sidenav.Header className="sidenav-header">
              <div className="sidenav-header-text">{this.props.title}</div>
            </Sidenav.Header>
            <Sidenav.Body className="sidenav-body">
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
          </div>
        </Sidenav>
      </div>
    );
  }
}

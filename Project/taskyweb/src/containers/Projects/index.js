import React, { Component } from "react";
import NavbarLogged from "../../components/NavbarLogged";
export default class Projects extends Component {
  render() {
    return (
      <div>
        <NavbarLogged />
        <div className="auth-wrapper">
          <div className="auth-inner">
            <h3>Projects</h3>
          </div>
        </div>
      </div>
    );
  }
}

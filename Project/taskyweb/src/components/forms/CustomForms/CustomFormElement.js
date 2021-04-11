import { Component } from "react";
import { Form } from "react-bootstrap";

export default class CustomFormElement extends Component {
    
  createElement = () => {
    let element = this.props.element;
    let values = this.props.values;
    switch (element.control.type) {
      case "text":
      case "email":
      case "password":
        return (
          <Form.Group>
            <Form.Label>{element.label}</Form.Label>
            <Form.Control
              type={element.control.type}
              name={element.control.name}
              value={
                values && values[element.control.name]
                  ? values[element.control.name]
                  : null
              }
              onChange={this.props.handleChange}
              isValid={
                this.props.touched[element.control.name] &&
                !this.props.errors[element.control.name]
              }
              isInvalid={!!this.props.errors[element.control.name]}
              row={3}
            />
            <Form.Control.Feedback type="invalid">
              {this.props.errors[element.control.name]}
            </Form.Control.Feedback>
          </Form.Group>
        );
      case "textarea":
        return this.createTextArea(element, values);
      case "file":
        return this.createFilePicker(element);
    }
  };

  createTextArea = (element, values) => {
    return (
      <Form.Group>
        <Form.Label>{element.label}</Form.Label>
        <Form.Control
          as={element.control.type}
          name={element.control.name}
          value={
            values && values[element.control.name]
              ? values[element.control.name]
              : null
          }
          onChange={this.props.handleChange}
          isValid={
            this.props.touched[element.control.name] &&
            !this.props.errors[element.control.name]
          }
          isInvalid={!!this.props.errors[element.control.name]}
        />
        <Form.Control.Feedback type="invalid">
          {this.props.errors[element.control.name]}
        </Form.Control.Feedback>
      </Form.Group>
    );
  };

  createFilePicker = (element) => {
    return (
      <Form.Group>
        <Form.Label>{element.label}</Form.Label>
        <Form.File
          multiple={element.control.multiple}
          name={element.control.name}
          onChange={this.props.handleChange}
          isValid={
            this.props.touched[element.control.name] &&
            !this.props.errors[element.control.name]
          }
          isInvalid={!!this.props.errors[element.control.name]}
        />
        <Form.Control.Feedback type="invalid">
          {this.props.errors[element.control.name]}
        </Form.Control.Feedback>
      </Form.Group>
    );
  };

  render() {
    return this.createElement();
  }
}

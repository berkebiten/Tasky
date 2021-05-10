import { Component } from "react";
import { Form, Button } from "react-bootstrap";
import DatePicker from "react-datepicker";

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
              className="form-input-tasky"
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
              isInvalid={
                this.props.touched[element.control.name] &&
                !!this.props.errors[element.control.name]
              }
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
      case "button":
        return this.createButton(element);
      case "picker":
        return this.createPicker(element, values);
      case "date":
        return this.createDatePicker(element, values);
    }
  };

  createTextArea = (element, values) => {
    return (
      <Form.Group>
        <Form.Label>{element.label}</Form.Label>
        <Form.Control
          className="form-input-tasky"
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

  handleFileSubmit = (data) => {
    let x = this.filePickerRef.current;
    console.log(data);
  };

  createFilePicker = (element) => {
    return (
      <Form.Group>
        <Form.Label>{element.label}</Form.Label>
        <Form.File
          ref={(ref) => (this.filePickerRef = ref)}
          className="form-file-upload-tasky"
          multiple={element.control.multiple}
          name={element.control.name}
          onChange={this.handleFileSubmit}
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

  createButton = (element) => {
    return (
      <Button
        className="centered"
        variant={element.control.variant}
        type="submit"
        onSubmit={this.props.handleSubmit}
      >
        {element.label}
      </Button>
    );
  };

  createPicker = (element, values) => {
    return (
      <Form.Group>
        <Form.Label>{element.label}</Form.Label>
        <Form.Control
          as="select"
          custom
          className="form-input-tasky"
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
          isInvalid={
            this.props.touched[element.control.name] &&
            !!this.props.errors[element.control.name]
          }
        >
          {element.control.options.map((item, key) => {
            return (
              <option value={item[element.control.key]}>
                {item[element.control.displayKey]}
              </option>
            );
          })}
        </Form.Control>
        <Form.Control.Feedback type="invalid">
          {this.props.errors[element.control.name]}
        </Form.Control.Feedback>
      </Form.Group>
    );
  };

  createDatePicker = (element, values) => {
    return (
      <Form.Group>
        <Form.Label>{element.label}</Form.Label>
        <DatePicker
          onChange={element.control.onChange}
          selected={this.props.dateValue}
          value={this.props.dateValue}
        />
      </Form.Group>
    );
  };

  render() {
    return this.createElement();
  }
}

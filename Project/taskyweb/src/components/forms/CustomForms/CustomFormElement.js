import { Component } from "react";
import { Form, Button } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { FileHelper } from "../../../util/helpers";

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
            <Form.Label>
              {element.label}
              {element.control.required ? "*" : ""}
            </Form.Label>
            <Form.Control
              className="form-input-tasky"
              type={element.control.type}
              name={element.control.name}
              value={values[element.control.name] || ""}
              onChange={this.props.handleChange}
              isValid={
                this.props.touched[element.control.name] &&
                !this.props.errors[element.control.name]
              }
              isInvalid={
                (this.props.touched[element.control.name] ||
                  this.props.submitCount > 0) &&
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
      case "checkbox":
        return this.createCheckBox(element, values);
    }
  };

  createCheckBox = (element, values) => {
    return (
      <>
        <Form.Group>
          <Form.Check
            type="checkbox"
            name={element.control.name}
            label={element.label}
            checked={
              values && values[element.control.name]
                ? values[element.control.name]
                : false
            }
            onChange={this.props.handleChange}
          />
        </Form.Group>
      </>
    );
  };

  createTextArea = (element, values) => {
    return (
      <Form.Group>
        <Form.Label>
          {element.label}
          {element.control.required ? "*" : ""}
        </Form.Label>
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
          isInvalid={
            (this.props.touched[element.control.name] ||
              this.props.submitCount > 0) &&
            !!this.props.errors[element.control.name]
          }
        />
        <Form.Control.Feedback type="invalid">
          {this.props.errors[element.control.name]}
        </Form.Control.Feedback>
      </Form.Group>
    );
  };

  handleFileSubmit = (data, item, xd, yz) => {
    let a = data.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(a);
    reader.onload = () => {
      this.props.handleChange(reader.result);
    };
  };

  onFileChange = (event) => {
    if (
      event &&
      event.target &&
      event.target.files &&
      event.target.files.length > 0
    ) {
      let files = Array.from(event.target.files);
      files.map((file, index) => {
        FileHelper.getBase64(file);
      });
    }
  };

  createFilePicker = (element) => {
    if (element.control.isHidden) {
      return null;
    }
    return (
      <Form.Group>
        <Form.Label>
          {element.label}
          {element.control.required ? "*" : ""}
        </Form.Label>
        <br />
        <input
          type="file"
          className="file-input"
          onChange={(event) => this.onFileChange(event)}
          accept={element.control.accept ? element.control.accept : null}
          multiple={element.control.multiple}
        />
      </Form.Group>
    );
  };

  createButton = (element) => {
    if (!element.control.isHidden) {
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
    }
    return null;
  };

  createPicker = (element, values) => {
    return (
      <Form.Group>
        <Form.Label>
          {element.label}
          {element.control.required ? "*" : ""}
        </Form.Label>
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
            (this.props.touched[element.control.name] ||
              this.props.submitCount > 0) &&
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
      <div>
        <Form.Group>
          <Form.Label>
            {element.label}
            {element.control.required ? "*" : ""}
          </Form.Label>
          <br />
          <DatePicker
            onChange={(value) =>
              this.props.setFieldValue(element.control.name, value)
            }
            value={
              values && values[element.control.name]
                ? values[element.control.name]
                : null
            }
            selected={
              values && values[element.control.name]
                ? values[element.control.name]
                : null
            }
            className="date-picker"
          />
        </Form.Group>
        <Form.Control.Feedback type="invalid">
          {this.props.errors[element.control.name]}
        </Form.Control.Feedback>
      </div>
    );
  };

  render() {
    return this.createElement();
  }
}

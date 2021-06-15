import { Form, Button, Col } from "react-bootstrap";
import { Formik } from "formik";
import * as yup from "yup";
import { FileHelper } from "../../util/helpers";
import { useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { IconContext } from "react-icons";

export default function CreateProjectForm(props) {
  const [items, setItems] = useState(["1"]);
  let formRef;

  const getValidation = (type) => {
    switch (type) {
      case "role":
        return yup
          .number()
          .min(0, "Please Select a Role!")
          .required("Required Field!");
      case "participantEmail":
        return yup
          .string()
          .email("Please Write a Valid Email!")
          .required("Required Field!");
    }
  };

  let elements = {
    name: yup.string().required("Required Field!").nullable().max(50),
    description: yup.string().required("Required Field"),
  };

  for (let i = 0; i < items.length; i++) {
    elements["participantEmail" + i.toString()] =
      getValidation("participantEmail");
    elements["role" + i.toString()] = getValidation("role");
  }

  const addParticipant = () => {
    let newItems = [...items];
    newItems.push("2");
    setItems(newItems);
  };

  const setParticipantsArray = (values) => {
    let participantObj = {};
    let insertObj = {};
    for (var propertyName in values) {
      if (
        propertyName.includes("role") ||
        propertyName.includes("participantEmail")
      ) {
        participantObj[propertyName] = values[propertyName];
      } else {
        insertObj[propertyName] = values[propertyName];
      }
    }
    let participants = [];
    for (let i = 0; i < Object.keys(participantObj).length / 2; i++) {
      let object = {
        email: participantObj["participantEmail" + i.toString()],
        role: parseInt(participantObj["role" + i.toString()]),
      };
      participants.push(object);
    }
    return { ...insertObj, participants: participants };
  };

  const onSubmit = (values) => {
    let object = {
      ...values,
      files: FileHelper.getFiles(),
    };
    let insert = setParticipantsArray(object);
    FileHelper.clearFiles();
    props.onSubmit(insert);
  };

  const onFileChange = (event) => {
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

  let schema = yup.object().shape(elements);
  return (
    <Formik
      innerRef={(ref) => (formRef = ref)}
      validationSchema={schema}
      onSubmit={onSubmit}
      initialValues={props.initialValues ? props.initialValues : {}}
    >
      {({
        handleSubmit,
        handleChange,
        handleBlur,
        values,
        touched,
        isValid,
        errors,
        setFieldValue,
        submitCount,
      }) => {
        return (
          <Form noValidate onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Project Name*</Form.Label>
              <Form.Control
                className="form-input-tasky"
                type="text"
                name="name"
                value={values.name || ""}
                onChange={handleChange}
                isValid={touched.name && !errors.name}
                isInvalid={(touched.name || submitCount > 0) && !!errors.name}
                row={3}
              />
              <Form.Control.Feedback type="invalid">
                {errors.name}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Form.Label>Project Description*</Form.Label>
              <Form.Control
                className="form-input-tasky"
                as="textarea"
                name="description"
                value={values && values.description ? values.description : null}
                onChange={handleChange}
                isValid={touched.description && !errors.description}
                isInvalid={
                  (touched.description || submitCount > 0) &&
                  !!errors.description
                }
              />
              <Form.Control.Feedback type="invalid">
                {errors.description}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Form.Label>Project Files</Form.Label>
              <br />
              <input
                type="file"
                className="file-input"
                onChange={(event) => onFileChange(event)}
                multiple
              />
            </Form.Group>
            {items.map((item, key) => {
              return (
                <Form.Row>
                  <Form.Group as={Col} md="6">
                    <Form.Label>Email*</Form.Label>
                    <Form.Control
                      className="form-input-tasky"
                      type="email"
                      name={"participantEmail" + key.toString()}
                      value={values["participantEmail" + key.toString()] || ""}
                      onChange={handleChange}
                      isValid={
                        touched["participantEmail" + key.toString()] &&
                        !errors["participantEmail" + key.toString()]
                      }
                      isInvalid={
                        (touched["participantEmail" + key.toString()] ||
                          submitCount > 0) &&
                        !!errors["participantEmail" + key.toString()]
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors["participantEmail" + key.toString()]}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} md="4">
                    <Form.Label>Role*</Form.Label>
                    <Form.Control
                      name={"role" + key.toString()}
                      value={values["role" + key.toString()] || ""}
                      onChange={handleChange}
                      className="form-input-tasky"
                      as="select"
                      size="m"
                      custom
                      isValid={
                        touched["role" + key.toString()] &&
                        !errors["role" + key.toString()]
                      }
                      isInvalid={
                        (touched["role" + key.toString()] || submitCount > 0) &&
                        !!errors["role" + key.toString()]
                      }
                    >
                      <option value={-1}>Select Role...</option>
                      <option value={0}>Team Member</option>
                      <option value={2}>Watcher</option>
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                      {errors["role" + key.toString()]}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="plus-icon-tasky" as={Col} md="1">
                    <Button variant="dark" onClick={addParticipant}>
                      <IconContext.Provider
                        value={{
                          color: "white",
                          size: 18,
                        }}
                      >
                        <AiOutlinePlus />
                      </IconContext.Provider>
                    </Button>
                  </Form.Group>
                </Form.Row>
              );
            })}
            <Button variant="dark" size="lg" type="submit" block>
              Save
            </Button>
          </Form>
        );
      }}
    </Formik>
  );
}

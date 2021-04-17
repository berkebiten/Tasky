import { Form, Button, Col } from "react-bootstrap";
import { Formik } from "formik";
import * as yup from "yup";
import { AiOutlinePlus } from "react-icons/ai";
import { IconContext } from "react-icons";
import { useEffect, useState } from "react";

export function InviteParticipantView(props) {
  const [items, setItems] = useState(["1"]);
  let formRef;

  useEffect(() => {
    props.handleSubmit(formRef.handleSubmit);
  }, []);

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
  let elements = {};

  for (let i = 0; i < items.length; i++) {
    elements["participantEmail" + i.toString()] = getValidation(
      "participantEmail"
    );
    elements["role" + i.toString()] = getValidation("role");
  }

  const addParticipant = () => {
    let newItems = [...items];
    newItems.push("2");
    setItems(newItems);
  };

  let schema = yup.object().shape(elements);

  return (
    <Formik
      innerRef={(ref) => (formRef = ref)}
      validationSchema={schema}
      initialValues={props.initialValues ? props.initialValues : {}}
      onSubmit={(data) => props.onSubmit(data)}
    >
      {({
        handleSubmit,
        handleChange,
        handleBlur,
        values,
        touched,
        isValid,
        errors,
      }) => {
        return (
          <Form noValidate onSubmit={handleSubmit}>
            {items.map((item, key) => {
              return (
                <Form.Row>
                  <Form.Group as={Col} md="6">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      className="form-input-tasky"
                      type="email"
                      name={"participantEmail" + key.toString()}
                      value={values["participantEmail" + key.toString()]}
                      onChange={handleChange}
                      isValid={
                        touched["participantEmail" + key.toString()] &&
                        !errors["participantEmail" + key.toString()]
                      }
                      isInvalid={!!errors["participantEmail" + key.toString()]}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors["participantEmail" + key.toString()]}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} md="4">
                    <Form.Label>Role</Form.Label>
                    <Form.Control
                      name={"role" + key.toString()}
                      value={values.role}
                      onChange={handleChange}
                      className="form-input-tasky"
                      as="select"
                      size="m"
                      custom
                      isValid={
                        touched["role" + key.toString()] &&
                        !errors["role" + key.toString()]
                      }
                      isInvalid={!!errors["role" + key.toString()]}
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
          </Form>
        );
      }}
    </Formik>
  );
}

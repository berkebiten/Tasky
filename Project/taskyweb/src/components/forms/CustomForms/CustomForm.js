import { Form, Button } from "react-bootstrap";
import { Formik } from "formik";
import * as yup from "yup";
import CustomFormElement from "./CustomFormElement";

export function CustomForm(props) {
  const getValidation = (type) => {
    switch (type) {
      case "text":
      case "textarea":
      case "password":
        return yup.string().required("Required Field!");
      case "checkbox":
        return yup.bool().required("Required Field!");
      case "email":
        return yup
          .string()
          .email("Please Write a Valid Email!")
          .required("Required Field!");
    }
  };
  let elements = {};

  props.formElements.map((item, key) => {
    elements[item.control.name] = getValidation(item.control.type);
    if (item.control.validation) {
      elements[item.control.name] = elements[item.control.name].matches(
        item.control.validation,
        item.control.validationMessage
      );
    }
  });

  let schema = yup.object().shape(elements);
  return (
    <Formik
      validationSchema={schema}
      onSubmit={props.onSubmit}
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
      }) => {
        return (
          <Form noValidate onSubmit={handleSubmit}>
            {props.formElements.map((item, key) => {
              return (
                <CustomFormElement
                  handleSubmit={handleSubmit}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  values={values}
                  touched={touched}
                  isValid={isValid}
                  errors={errors}
                  element={item}
                />
              );
            })}
            <Button className="centered" variant="primary" type="submit">
              {props.buttonTitle}
            </Button>
          </Form>
        );
      }}
    </Formik>
  );
}

import { Form, Button } from "react-bootstrap";
import { Formik } from "formik";
import * as yup from "yup";
import CustomFormElement from "./CustomFormElement";
import { useEffect, useState } from "react";

export function CustomForm(props) {
  let formRef;

  useEffect(() => {
    // if (props.handleSubmit) {
    //   props.handleSubmit(formRef.handleSubmit);
    // }
  }, []);

  const getValidation = (type) => {
    switch (type) {
      case "text":
      case "textarea":
      case "password":
      case "picker":
      case "date":
        return yup.string().required("Required Field!").nullable();
      case "checkbox":
        return yup.bool().required("Required Field!");
      case "email":
        return yup
          .string()
          .email("Please Write a Valid Email!")
          .required("Required Field!");
      case "file":
        yup.string().required("Required Field!");
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

  const onSubmit = (values, { resetForm }) => {
    props.onSubmit(values, resetForm);
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
                  setFieldValue={setFieldValue}
                  dateValue={props.dateValue ? props.dateValue : null}
                />
              );
            })}
            {props.buttonTitle ? (
              <Button variant="dark" size="lg" type="submit" block>
                {props.buttonTitle}
              </Button>
            ) : null}
          </Form>
        );
      }}
    </Formik>
  );
}

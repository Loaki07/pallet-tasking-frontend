import React, { useState, useEffect } from "react";
import {
    ErrorMessage,
    Field,
    Form as FormikForm,
    Formik,
    useField,
} from "formik";
import * as Yup from "yup";
import {
    Card,
    Form,
    FormControl,
    Button,
    Col,
    Row,
    Badge,
    Modal,
    Spinner,
} from "react-bootstrap";
import { BsFileRichtext } from "react-icons/bs";

import "./CreateTaskFormFormik.css";
import FormErrorMessage from "./FormErrorMessage";
import { Link } from "react-router-dom";

const initialValues = {
    accountId: "",
    taskDuration: "",
    taskCost: "",
    taskDescription: "",
};

const validationSchema = Yup.object({
    accountId: Yup.number().required("Required!"),
    taskDuration: Yup.number().required("Required!"),
    taskCost: Yup.number().required("Required!"),
    taskDescription: Yup.string().required("Required!"),
});

const FormLabelAndInput = ({ label, helperText, isDisabled, ...props }) => {
    const [field, meta] = useField(props);

    return (
        <Form.Group style={{ minHeight: "12vh" }}>
            <Form.Label className="publish-form-label mtl-5">
                {label}
            </Form.Label>
            {!isDisabled && (
                <ErrorMessage
                    name={field.name}
                    component={FormErrorMessage}
                ></ErrorMessage>
            )}
            <Field
                {...field}
                {...props}
                as={FormControl}
                autoComplete="off"
                disabled={isDisabled}
                className="p-4"
            ></Field>
            <span>{helperText}</span>
        </Form.Group>
    );
};

const FormLabelAndTextArea = ({
    label,
    rows,
    helperText,
    isDisabled,
    ...props
}) => {
    const [field, meta] = useField(props);
    return (
        <Form.Group>
            <Form.Label className="publish-form-label mtl-5">
                {label}
            </Form.Label>
            {!isDisabled && (
                <ErrorMessage
                    name={field.name}
                    component={FormErrorMessage}
                ></ErrorMessage>
            )}
            <Form.Control
                {...field}
                {...props}
                as="textarea"
                rows={rows}
                disabled={isDisabled}
                className="p-3"
            />
            <span>{helperText}</span>
        </Form.Group>
    );
};

const FormLabelAndDropDown = ({ label, helperText, options, ...props }) => {
    const [field, meta] = useField(props);
    return (
        <Form.Group>
            <Form.Label className="publish-form-label mtl-5">
                {label}
            </Form.Label>
            <ErrorMessage
                name={field.name}
                component={FormErrorMessage}
            ></ErrorMessage>
            <Form.Control as="select" {...field} {...props}>
                <option value="" selected disabled>
                    Select
                </option>
                {options.map((option, index) => (
                    <option key={index}>{option}</option>
                ))}
            </Form.Control>
            <span>{helperText}</span>
        </Form.Group>
    );
};

const FormCheckBoxAndText = ({ text, ...props }) => {
    const [field, meta] = useField(props);
    return (
        <Form.Group className="p-2 mtl-5">
            <Form.Check {...field} {...props} type="checkbox" label={text} />
            <ErrorMessage
                name={field.name}
                component={FormErrorMessage}
            ></ErrorMessage>
        </Form.Group>
    );
};

const CreateTaskFormFormik = () => {
    const [showConfirm, setShowConfirm] = useState(false);
    const [showResult, setResult] = useState(false);
    const [isConfirm, setIsConfirm] = useState(false);
    const [response, setResponse] = useState("");

    useEffect(() => {
        console.log(`updating ${isConfirm}`);
    }, [isConfirm]);

    const handleFormSubmit = async (data) => {};
    return (
        <>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={async (data, { setSubmitting, resetForm }) => {
                    setSubmitting(true);
                    console.log("submit: ", data);
                    setSubmitting(false);
                    resetForm();
                }}
            >
                {({
                    values,
                    errors,
                    isSubmitting,
                    resetForm,
                    handleSubmit,
                }) => (
                    <FormikForm>
                        <Card className="text-left form p-3">
                            <Card.Body className="form-body">
                                <FormLabelAndInput
                                    placeholder={`AccounId`}
                                    name="accountId"
                                    type="number"
                                    label="AccounId"
                                    helperText={""}
                                />
                                <FormLabelAndInput
                                    placeholder={`TaskDuration`}
                                    name="taskDuration"
                                    type="number"
                                    label="Task Duration"
                                    helperText={""}
                                />
                                <FormLabelAndInput
                                    placeholder={`TaskCost`}
                                    name="taskCost"
                                    type="number"
                                    label="Task Cost"
                                    helperText={""}
                                />
                                <FormLabelAndInput
                                    placeholder={`TaskDescription`}
                                    name="taskDescription"
                                    type="text"
                                    label="Task Description"
                                    helperText={""}
                                />
                            </Card.Body>
                            <Card.Footer className="d-flex justify-content-between aligin-items-center">
                                <Button variant="warning" onClick={resetForm}>
                                    <b>Reset</b>
                                </Button>
                                <Button variant="dark" type="submit">
                                    <b>Submit</b>
                                </Button>
                            </Card.Footer>
                        </Card>
                    </FormikForm>
                )}
            </Formik>
        </>
    );
};

export default CreateTaskFormFormik;

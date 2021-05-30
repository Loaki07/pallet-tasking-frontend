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

import "./TaskFormFormik.css";
import FormErrorMessage from "./FormErrorMessage";
import * as palletTaskingFunctions from "../../../palletTaskingFunctions";
import * as constants from "./constants";

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

const TaskFormFormik = ({ configForBackEnd, formTypeAndData }) => {
    const { api, keyring } = configForBackEnd;
    const { formType, data } = formTypeAndData;
    // console.log(JSON.stringify(formType));
    console.log(data);

    const [formConfig, setFormConfig] = useState({
        requestorName: "",
        accountId: "",
        taskDuration: "",
        taskCost: "",
        taskDescription: "",
        isFieldDisabled: false,
    });

    const configForForm = () => {
        console.log(`configForForm ${formType.type}`);
        switch (formType.type) {
            case constants.FORM_TYPES.CREATE_TASK.type:
                console.log(`create`);
                return setFormConfig({
                    requestorName: "Alice",
                    accountId: palletTaskingFunctions.DEFAULT_ACCOUNT_IDS.ALICE,
                    taskDuration: "",
                    taskCost: "",
                    taskDescription: "",
                    isFieldDisabled: false,
                });
            case constants.FORM_TYPES.BID_FOR_TASK.type:
            case constants.FORM_TYPES.COMPLETE_TASK.type:
                console.log(`bid and complete`);
                return setFormConfig({
                    requestorName: "Bob",
                    accountId: palletTaskingFunctions.DEFAULT_ACCOUNT_IDS.BOB,
                    taskDuration: data.task_deadline,
                    taskCost: data.cost,
                    taskDescription: data.task_description,
                    isFieldDisabled: true,
                });

            case constants.FORM_TYPES.APPROVE_TASK.type:
                console.log(`approve`);
                return setFormConfig({
                    requestorName: "Alice",
                    accountId: palletTaskingFunctions.DEFAULT_ACCOUNT_IDS.ALICE,
                    taskDuration: data.task_deadline,
                    taskCost: data.cost,
                    taskDescription: data.task_description,
                    isFieldDisabled: true,
                });
            default:
                break;
        }
    };

    const handleFormSubmit = async (data) => {
        let AliceFromKeyRing = keyring.getAccount(
            palletTaskingFunctions.DEFAULT_ACCOUNT_IDS.ALICE
        );
        let alice = keyring.getPair(AliceFromKeyRing.address);

        const unit = 1000000000000;

        console.log(`data: ${JSON.stringify(data)}`);

        // await palletTaskingFunctions.createTaskTx(
        //     api,
        //     alice,
        //     data.taskDuration,
        //     data.taskCost * unit,
        //     data.taskDescription
        // );
    };

    useEffect(() => {
        configForForm();
    }, []);

    console.log(formConfig);

    return (
        <>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={async (data, { setSubmitting, resetForm }) => {
                    setSubmitting(true);
                    handleFormSubmit(data);
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
                                    placeholder={
                                        !formConfig.isFieldDisabled
                                            ? `AccounId`
                                            : ""
                                    }
                                    name="accountId"
                                    type={
                                        !formConfig.isFieldDisabled
                                            ? "number"
                                            : "text"
                                    }
                                    label="AccountId"
                                    helperText={""}
                                    value={formConfig.accountId}
                                    isDisabled={formConfig.isFieldDisabled}
                                />
                                <FormLabelAndInput
                                    placeholder={
                                        !formConfig.isFieldDisabled
                                            ? `TaskDuration`
                                            : ""
                                    }
                                    name="taskDuration"
                                    type={
                                        !formConfig.isFieldDisabled
                                            ? "number"
                                            : "text"
                                    }
                                    label="Task Duration"
                                    helperText={""}
                                    value={formConfig.taskDuration}
                                    isDisabled={formConfig.isFieldDisabled}
                                />
                                <FormLabelAndInput
                                    placeholder={
                                        !formConfig.isFieldDisabled
                                            ? `TaskCost`
                                            : ""
                                    }
                                    name="taskCost"
                                    type={
                                        !formConfig.isFieldDisabled
                                            ? "number"
                                            : "text"
                                    }
                                    label="Task Cost"
                                    helperText={""}
                                    value={formConfig.taskCost}
                                    isDisabled={formConfig.isFieldDisabled}
                                />
                                <FormLabelAndInput
                                    placeholder={
                                        !formConfig.isFieldDisabled
                                            ? `TaskDescription`
                                            : ""
                                    }
                                    name="taskDescription"
                                    type="text"
                                    label="Task Description"
                                    helperText={""}
                                    value={formConfig.taskDescription}
                                    isDisabled={formConfig.isFieldDisabled}
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

export default TaskFormFormik;

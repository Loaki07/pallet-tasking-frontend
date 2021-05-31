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
    taskId: "",
    taskDuration: "",
    taskCost: "",
    taskDescription: "",
};

const validationSchema = Yup.object({
    accountId: Yup.number().required("Required!"),
    taskId: Yup.number(),
    taskDuration: Yup.number().required("Required!"),
    taskCost: Yup.number().required("Required!"),
    taskDescription: Yup.string().required("Required!"),
});

const TaskFormFormik = ({ configForBackEnd, formTypeAndData }) => {
    const { api, keyring } = configForBackEnd;
    const { formType, data } = formTypeAndData;

    console.log(data);
    const [formConfig, setFormConfig] = useState({
        requestorName: "",
        accountId: "",
        taskId: "",
        taskDuration: "",
        taskCost: "",
        taskDescription: "",
        isFieldDisabled: false,
        submitButtonName: "Submit",
    });

    const configForForm = () => {
        switch (formType.type) {
            case constants.FORM_TYPES.CREATE_TASK.type:
                return setFormConfig({
                    requestorName: "Alice",
                    accountId: palletTaskingFunctions.DEFAULT_ACCOUNT_IDS.ALICE,
                    taskId: "",
                    taskDuration: "",
                    taskCost: "",
                    taskDescription: "",
                    isFieldDisabled: false,
                    submitButtonName: "Create",
                });
            case constants.FORM_TYPES.BID_FOR_TASK.type:
            case constants.FORM_TYPES.COMPLETE_TASK.type:
                return setFormConfig({
                    requestorName: "Bob",
                    accountId: palletTaskingFunctions.DEFAULT_ACCOUNT_IDS.BOB,
                    taskId: data.task_id,
                    taskDuration: data.task_deadline,
                    taskCost: data.cost,
                    taskDescription: data.task_description,
                    isFieldDisabled: true,
                    submitButtonName:
                        formType.type === constants.FORM_TYPES.BID_FOR_TASK.type
                            ? "Bid"
                            : "Complete",
                });

            case constants.FORM_TYPES.APPROVE_TASK.type:
                return setFormConfig({
                    requestorName: "Alice",
                    accountId: palletTaskingFunctions.DEFAULT_ACCOUNT_IDS.ALICE,
                    taskId: data.task_id,
                    taskDuration: data.task_deadline,
                    taskCost: data.cost,
                    taskDescription: data.task_description,
                    isFieldDisabled: true,
                    submitButtonName: "Approve",
                });
            default:
                return setFormConfig({
                    requestorName: "",
                    accountId: "",
                    taskId: "",
                    taskDuration: "",
                    taskCost: "",
                    taskDescription: "",
                    isFieldDisabled: false,
                    submitButtonName: "Submit",
                });
        }
    };

    const handleFormSubmit = async (data) => {
        let BobFromKeyRing = keyring.getAccount(
            palletTaskingFunctions.DEFAULT_ACCOUNT_IDS.BOB
        );
        let AliceFromKeyRing = keyring.getAccount(
            palletTaskingFunctions.DEFAULT_ACCOUNT_IDS.ALICE
        );
        let bob = keyring.getPair(BobFromKeyRing.address);
        let alice = keyring.getPair(AliceFromKeyRing.address);

        console.log(`data: ${JSON.stringify(data)}`);

        switch (formType.type) {
            case constants.FORM_TYPES.CREATE_TASK.type:
                console.log(`create`);
                const unit = 1000000000000;
                return await palletTaskingFunctions.createTaskTx(
                    api,
                    alice,
                    data.taskDuration,
                    data.taskCost * unit,
                    data.taskDescription
                );
            case constants.FORM_TYPES.BID_FOR_TASK.type:
            // return await palletTaskingFunctions.bidForTaskTx(
            //     api,
            //     bob,
            //     data.taskId,
            // );
            case constants.FORM_TYPES.COMPLETE_TASK.type:
            // return await palletTaskingFunctions.taskCompletedTx(
            //     api,
            //     bob,
            //     data.taskId,
            // );

            case constants.FORM_TYPES.APPROVE_TASK.type:
            // return await palletTaskingFunctions.approveTaskTx(
            //     api,
            //     alice,
            //     data.taskId,
            // );
            default:
                break;
        }
    };

    useEffect(() => {
        configForForm();
    }, []);

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
                                            ? `AccountId`
                                            : ""
                                    }
                                    name="accountId"
                                    type={
                                        !formConfig.isFieldDisabled
                                            ? "text"
                                            : "text"
                                    }
                                    label="AccountId"
                                    helperText={""}
                                    defaultValue={formConfig.accountId.toString()}
                                    // isDisabled={formConfig.isFieldDisabled}
                                />
                                {formType.type !==
                                    constants.FORM_TYPES.CREATE_TASK.type && (
                                    <FormLabelAndInput
                                        placeholder={
                                            !formConfig.isFieldDisabled
                                                ? `TaskId`
                                                : ""
                                        }
                                        name="taskId"
                                        type={
                                            !formConfig.isFieldDisabled
                                                ? "number"
                                                : "text"
                                        }
                                        label="TaskId"
                                        helperText={""}
                                        defaultValue={formConfig.taskId}
                                        isDisabled={formConfig.isFieldDisabled}
                                    />
                                )}
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
                                    defaultValue={formConfig.taskDuration}
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
                                    defaultValue={formConfig.taskCost}
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
                                    defaultValue={formConfig.taskDescription}
                                    isDisabled={formConfig.isFieldDisabled}
                                />
                            </Card.Body>
                            <Card.Footer className="d-flex justify-content-between aligin-items-center">
                                <Button variant="warning" onClick={resetForm}>
                                    <b>Reset</b>
                                </Button>
                                <Button
                                    variant="dark"
                                    type="submit"
                                    name={formConfig.submitButtonName}
                                >
                                    <b>{formConfig.submitButtonName}</b>
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

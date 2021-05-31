import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Modal } from "react-bootstrap";
import { connect } from "react-redux";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import AppHeader from "../../../Components/AppHeader/AppHeader";
import { useSubstrate } from "../../../substrate-lib";
import TestingSubstrateLib from "../../../TestingSubstrateLib";
import * as palletTaskingFunctions from "../../../palletTaskingFunctions";
import * as actionCreators from "./actionCreators";
import "./Dashboard.css";
import TaskCard from "./TaskCard";
import TaskFormFormik from "./TaskFormFormik";
import * as constants from "./constants";
import staticData from "../../../assets/staticData/staticData.json";
import "react-toastify/dist/ReactToastify.min.css";

toast.configure();

const DashBoard = (props) => {
    const { api, keyring } = useSubstrate();
    const dispatch = useDispatch();

    const tasks = useSelector((state) => state.dashBoardReducer.tasks);

    const [show, setShow] = useState(false);
    const [currentFormTypeAndData, setCurrentFormTypeAndData] = useState({
        formType: constants.FORM_TYPES.CREATE_TASK,
        data: "",
    });

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        const init = async () => {
            try {
                palletTaskingFunctions.handleOnChainEvents(api, toast);
                const getTasksResult = await palletTaskingFunctions.getAllTasks(
                    api
                );
                if (getTasksResult) {
                    console.log(
                        `All Tasks From Chain: ${getTasksResult.length}`
                    );
                    dispatch(
                        actionCreators.setTasksFromBackEnd([
                            ...getTasksResult.sort(
                                (a, b) => b.task_id - a.task_id
                            ),
                        ])
                    );
                }
            } catch (error) {
                console.log(`catchError at useEffect : ${error}`);
            }
        };
        init();
    }, [api?.query.palletTasking]);

    const showFormModal = (e, data) => {
        const formTypeOnClick = e.target.name;
        const title =
            formTypeOnClick === constants.FORM_TYPES.CREATE_TASK.type
                ? constants.FORM_TYPES.CREATE_TASK.title
                : formTypeOnClick === constants.FORM_TYPES.BID_FOR_TASK.type
                ? constants.FORM_TYPES.BID_FOR_TASK.title
                : formTypeOnClick === constants.FORM_TYPES.COMPLETE_TASK.type
                ? constants.FORM_TYPES.COMPLETE_TASK.title
                : formTypeOnClick === constants.FORM_TYPES.APPROVE_TASK.type
                ? constants.FORM_TYPES.APPROVE_TASK.title
                : "Form";

        setCurrentFormTypeAndData({
            formType: { type: e.target.name, title },
            data: data,
        });
        handleShow();
    };

    return (
        <>
            <AppHeader />
            <Container className="dashboard-container">
                <Row className="p-5">
                    <div className="d-flex justify-content-between align-items-center">
                        <h2 style={{ margin: "0" }}>Marketplace</h2>
                        <Button
                            name={constants.FORM_TYPES.CREATE_TASK.type}
                            onClick={(e) => showFormModal(e, null)}
                        >
                            Create New Task
                        </Button>
                    </div>
                </Row>
                <Row>
                    {tasks.length
                        ? tasks.map((task, index) => (
                              <Col key={index} xs={1} md={4} lg={4}>
                                  <TaskCard
                                      data={task}
                                      showFormModal={showFormModal}
                                  />
                              </Col>
                          ))
                        : staticData.data.map((task, index) => (
                              <Col key={index} xs={1} md={4} lg={4}>
                                  <TaskCard
                                      data={task}
                                      showFormModal={showFormModal}
                                  />
                              </Col>
                          ))}
                </Row>
                <TaskModal
                    show={show}
                    handleClose={handleClose}
                    configForBackEnd={{ api, keyring }}
                    formTypeAndData={currentFormTypeAndData}
                />
            </Container>
        </>
    );
};

const TaskModal = ({
    show,
    handleClose,
    configForBackEnd,
    formTypeAndData,
}) => {
    const { formType } = formTypeAndData;
    const { type, title } = formType;
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <TaskFormFormik
                    configForBackEnd={configForBackEnd}
                    formTypeAndData={formTypeAndData}
                    handleClose={handleClose}
                />
            </Modal.Body>
        </Modal>
    );
};

export default DashBoard;

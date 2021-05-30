import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Modal } from "react-bootstrap";
import { connect } from "react-redux";
import { useDispatch, useSelector } from "react-redux";

import AppHeader from "../../../Components/AppHeader/AppHeader";
import { useSubstrate } from "../../../substrate-lib";
import TestingSubstrateLib from "../../../TestingSubstrateLib";
import * as palletTaskingFunctions from "../../../palletTaskingFunctions";
import * as actionCreators from "./actionCreators";
import "./Dashboard.css";
import TaskCard from "./TaskCard";
import CreateTaskFormFormik from "./CreateTaskFormFormik";

const DashBoard = (props) => {
    const { api, keyring } = useSubstrate();
    const dispatch = useDispatch();

    const tasks = useSelector((state) => state.dashBoardReducer.tasks);

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        const init = async () => {
            try {
                palletTaskingFunctions.handleOnChainEvents(api);
                const getTasksResult = await palletTaskingFunctions.getAllTasks(
                    api
                );
                if (getTasksResult) {
                    console.log(
                        `All Tasks From Chain: ${getTasksResult.length}`
                    );
                    dispatch(
                        actionCreators.setTasksFromBackEnd([...getTasksResult])
                    );
                }
            } catch (error) {
                console.log(`catchError at useEffect : ${error}`);
            }
        };
        init();
    }, [api?.query.palletTasking]);

    return (
        <>
            <AppHeader />
            <Container className="dashboard-container">
                <Row className="p-5">
                    <div className="d-flex justify-content-between align-items-center">
                        <h2 style={{ margin: "0" }}>All Tasks</h2>
                        <Button onClick={handleShow}>Create New Task</Button>
                    </div>
                </Row>
                <Row>
                    {tasks.length ? (
                        tasks.map((task, index) => (
                            <Col key={index} xs={1} md={4} lg={4}>
                                <TaskCard data={task} />
                            </Col>
                        ))
                    ) : (
                        <div>No Tasks</div>
                    )}
                </Row>
                <CreateTaskModal
                    show={show}
                    handleClose={handleClose}
                    configForBackEnd={{ api, keyring }}
                />
            </Container>
        </>
    );
};

const CreateTaskModal = ({ show, handleClose, configForBackEnd }) => {
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header>
                <Modal.Title>Create Task Form</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <CreateTaskFormFormik configForBackEnd={configForBackEnd} />
            </Modal.Body>
        </Modal>
    );
};

export default DashBoard;

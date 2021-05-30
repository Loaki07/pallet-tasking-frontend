import React, { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { connect } from "react-redux";
import { useDispatch, useSelector } from "react-redux";

import AppHeader from "../../../Components/AppHeader/AppHeader";
import { useSubstrate } from "../../../substrate-lib";
import TestingSubstrateLib from "../../../TestingSubstrateLib";
import * as palletTaskingFunctions from "../../../palletTaskingFunctions";
import * as actionCreators from "./actionCreators";
import "./Dashboard.css";
import TaskCard from "./TaskCard";

const DashBoard = (props) => {
    const { api, keyring } = useSubstrate();
    const dispatch = useDispatch();

    const tasks = useSelector((state) => state.dashBoardReducer.tasks);

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
                <Row>All Tasks</Row>
                <Row>
                    {tasks.length ? (
                        tasks.map((task) => (
                            <Col xs={1} md={4} lg={4}>
                                <TaskCard data={task} />
                            </Col>
                        ))
                    ) : (
                        <div>No Tasks</div>
                    )}
                </Row>
            </Container>
        </>
    );
};

const mapStateToProps = (state) => {
    return {
        tasks: state.dashBoardReducer.tasks,
    };
};

export default connect(mapStateToProps, {})(DashBoard);

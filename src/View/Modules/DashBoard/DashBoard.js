import React, { useEffect } from "react";
import { Container } from "react-bootstrap";
import { connect } from "react-redux";
import { useDispatch, useSelector } from "react-redux";

import AppHeader from "../../../Components/AppHeader/AppHeader";
import { useSubstrate } from "../../../substrate-lib";
import TestingSubstrateLib from "../../../TestingSubstrateLib";
import * as palletTaskingFunctions from "../../../palletTaskingFunctions";
import * as actionCreators from "./actionCreators";

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
            <Container
                style={{
                    background: "#181a1b",
                    color: "white",
                    height: "100vh",
                }}
            >
                <div>DashBoard</div>
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

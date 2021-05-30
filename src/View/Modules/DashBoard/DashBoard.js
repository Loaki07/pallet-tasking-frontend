import React from "react";
import { Container } from "react-bootstrap";
import { connect } from "react-redux";
import AppHeader from "../../../Components/AppHeader/AppHeader";
import PalletTaskingTesting from "../../../PalletTaskingTesting";
import { useSubstrate } from "../../../substrate-lib";
import TestingSubstrateLib from "../../../TestingSubstrateLib";

const DashBoard = (props) => {
    return (
        <>
            <Container
                style={{
                    background: "#181a1b",
                    color: "white",
                    height: "100vh",
                }}
            >
                <AppHeader />
                <div>DashBoard</div>
                <PalletTaskingTesting />
            </Container>
        </>
    );
};

const mapStateToProps = (state) => {
    return {
        tasks: state.dashBoardReducer.tasks,
    };
};

export default connect(mapStateToProps, {
    
})(DashBoard);
